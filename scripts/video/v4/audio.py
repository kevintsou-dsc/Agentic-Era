"""v4 音訊：逐句合成（雜湊快取＋重試）、稿件檢查、多音字必聽清單、時間軸、程式生成配樂、SRT。"""
import asyncio
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import edge_tts
import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
import script as S  # noqa: E402

ROOT = Path(__file__).resolve().parents[3]
BUILD = Path(__file__).resolve().parent.parent / "build"
CACHE = BUILD / "tts_cache"
SR = 48000


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        raise RuntimeError(f"command failed: {' '.join(map(str, cmd[:6]))}…\n{r.stderr[-1500:]}")
    return r.stdout


def duration(p: Path) -> float:
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).strip())


def load_facts() -> dict:
    f = BUILD / "facts.json"
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else {}


def tts_text(t: str) -> str:
    for k, v in S.PRONOUNCE.items():
        t = t.replace(k, v)
    return t


# ── 稿件檢查 ──
DIGITS = re.compile(r"[\d,\.]+|\{[a-z_]+\}")
PUNCT = re.compile(r"[\s，。：、？！；「」『』…—\-－〈〉《》（）()①②③]")


def check_script(facts: dict):
    errors, chars = [], 0
    for b in S.BEATS:
        for ln in b["lines"]:
            raw = ln["tts"]
            chars += len(PUNCT.sub("", raw))
            sub = DIGITS.sub("", ln["sub"])
            sub = PUNCT.sub("", sub)
            src = PUNCT.sub("", raw)
            i = 0
            for ch in sub:  # 字幕每個字須依序出現在原句
                j = src.find(ch, i)
                if j < 0:
                    errors.append(f"{b['id']}: 字幕「{ln['sub']}」的「{ch}」不在旁白原句中")
                    break
                i = j + 1
            for key in re.findall(r"\{([a-z_]+)\}", ln["sub"]):
                if key not in facts:
                    errors.append(f"{b['id']}: facts.json 缺 {key}")
    if chars > S.MAX_CHARS:
        errors.append(f"旁白 {chars} 字，超過上限 {S.MAX_CHARS}")
    return chars, errors


RISKY = set("重行長調率還得地著了為處更都分數量給只傳便樂覺角種差好應空少當轉發相背藏露載興朝薄削血")


def polyphone_list():
    """只列出高風險多音字，且依上下文讀音與單字常用讀音不同者（最需要人耳確認）。"""
    from pypinyin import pinyin, Style
    out = []
    for b in S.BEATS:
        for li, ln in enumerate(b["lines"]):
            t = tts_text(ln["tts"])
            ctx = pinyin(t, style=Style.TONE3, errors=lambda x: [[c] for c in x])
            flat = [c[0] for c in ctx]
            hits = []
            for ch, py in zip(t, flat if len(flat) == len(t) else [""] * len(t)):
                if ch in RISKY:
                    hits.append(f"{ch}({py})")
            if hits:
                out.append({"id": f"{b['id']}_{li}", "text": t, "chars": " ".join(hits)})
    return out


# ── 合成 ──
async def synth_line(text: str, voice: str, rate: str, pitch: str) -> Path:
    key = hashlib.sha1(f"{text}|{voice}|{rate}|{pitch}|v2".encode()).hexdigest()[:16]
    wav = CACHE / f"{key}.wav"
    if wav.exists():
        return wav
    mp3 = CACHE / f"{key}.mp3"
    for attempt in range(4):
        try:
            await asyncio.wait_for(edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch).save(str(mp3)), 60)
            break
        except Exception as e:  # noqa: BLE001
            if attempt == 3:
                raise
            print(f"  [tts] retry {attempt + 1}: {e}")
            await asyncio.sleep(2 ** (attempt + 1))
    run(["ffmpeg", "-y", "-i", str(mp3), "-af",
         "silenceremove=start_periods=1:start_silence=0.03:start_threshold=-50dB,areverse,"
         "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-50dB,areverse,"
         "afade=t=in:d=0.01,areverse,afade=t=in:d=0.03,areverse",
         "-ar", str(SR), "-ac", "1", str(wav)])
    mp3.unlink(missing_ok=True)
    return wav


async def build_narration(voice=S.VOICE, rate=S.RATE, pitch=S.PITCH, tag="main"):
    CACHE.mkdir(parents=True, exist_ok=True)
    facts = load_facts()
    sem = asyncio.Semaphore(2)

    async def one(text):
        async with sem:
            return await synth_line(text, voice, rate, pitch)

    jobs = [(b, li, ln) for b in S.BEATS for li, ln in enumerate(b["lines"])]
    wavs = await asyncio.gather(*[one(tts_text(ln["tts"])) for _, _, ln in jobs])

    t = S.LEAD_IN
    timeline, beats = [], []
    k = 0
    for b in S.BEATS:
        bstart = t
        lines = []
        for li, ln in enumerate(b["lines"]):
            w = wavs[k]; k += 1
            d = duration(w)
            sub = ln["sub"].format(**facts) if "{" in ln["sub"] else ln["sub"]
            lines.append({"start": round(t, 3), "end": round(t + d, 3), "sub": "" if ln.get("nosub") else sub, "srt": sub, "wav": str(w)})
            timeline.append((w, t))
            t += d + (S.LINE_GAP if li < len(b["lines"]) - 1 else 0)
        beats.append({"id": b["id"], "scene": b["scene"], "start": round(bstart, 3), "speech_end": round(t, 3),
                      "end": round(t + b["hold"], 3), "lines": lines})
        t += b["hold"]
    total = round(t + S.OUTRO_HOLD, 3)

    # 以 PCM 直接疊放，取樣點精準
    buf = np.zeros(int(total * SR) + SR, dtype=np.float32)
    for w, st in timeline:
        pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", str(w), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                                           capture_output=True, check=True).stdout, dtype=np.float32)
        i0 = int(round(st * SR))
        buf[i0:i0 + len(pcm)] += pcm
    buf = buf[: int(total * SR)]
    out = BUILD / f"narration_{tag}.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", str(out)],
                   input=buf.tobytes(), check=True)
    return out, beats, total


# ── 程式生成配樂：柔和電鋼琴和弦鋪底（無版權疑慮）──
def make_bgm(total: float, path: Path):
    sr = SR
    n = int((total + 1) * sr)
    out = np.zeros(n, dtype=np.float32)
    bpm = 72
    bar = 4 * 60 / bpm
    # Fmaj9 – Em7 – Dm9 – Cmaj7（溫和、無明確旋律，不搶旁白）
    prog = [[53, 57, 60, 64, 67], [52, 55, 59, 62, 64], [50, 53, 57, 60, 64], [48, 52, 55, 59, 62]]

    def note(midi, dur, amp):
        f = 440 * 2 ** ((midi - 69) / 12)
        tt = np.arange(int(dur * sr)) / sr
        env = (1 - np.exp(-tt / 0.02)) * np.exp(-tt / 1.8)
        tone = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / 0.6) + 0.08 * np.sin(6 * np.pi * f * tt) * np.exp(-tt / 0.3)
        return (amp * env * tone).astype(np.float32)

    t, ci = 0.0, 0
    rng = np.random.default_rng(7)
    while t < total + 1:
        chord = prog[ci % 4]
        for vi, m in enumerate(chord):  # 輕微琶音
            st = t + vi * 0.045 + rng.uniform(0, 0.01)
            seg = note(m, bar * 1.15, 0.05 if vi else 0.07)
            i0 = int(st * sr)
            if i0 < n:
                out[i0:i0 + len(seg)] += seg[: max(0, n - i0)]
        for half in (bar / 2,):  # 第三拍輕觸高音
            m = chord[-1] + 12
            seg = note(m, bar * 0.6, 0.025)
            i0 = int((t + half) * sr)
            if i0 < n:
                out[i0:i0 + len(seg)] += seg[: max(0, n - i0)]
        t += bar
        ci += 1
    out /= max(1e-6, np.abs(out).max()) * 1.2
    raw = path.with_suffix(".raw.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "-", str(raw)],
                   input=out.tobytes(), check=True)
    # 空間感：短殘響＋低通
    run(["ffmpeg", "-y", "-i", str(raw), "-af",
         f"aecho=0.8:0.7:60|120|240:0.35|0.25|0.15,lowpass=f=5000,afade=t=in:d=2.5,afade=t=out:st={total - 4.5}:d=4.5",
         "-ac", "2", "-ar", str(sr), str(path)])
    raw.unlink(missing_ok=True)


def write_srt(beats, path: Path):
    def ts(x):
        h, r = divmod(x, 3600); m, s = divmod(r, 60)
        return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}"
    rows, i = [], 1
    for b in beats:
        for ln in b["lines"]:
            rows.append(f"{i}\n{ts(ln['start'])} --> {ts(ln['end'] + 0.25)}\n{ln['srt']}\n")
            i += 1
    path.write_text("\n".join(rows), encoding="utf-8")


async def voice_samples(outdir: Path):
    outdir.mkdir(parents=True, exist_ok=True)
    sample = [S.BEATS[3], S.BEATS[12]]  # n04 + n12
    CACHE.mkdir(parents=True, exist_ok=True)
    for voice in ["zh-TW-HsiaoYuNeural", "zh-TW-HsiaoChenNeural"]:
        for rate in ["+19%", "+10%"]:
            parts = []
            for b in sample:
                for ln in b["lines"]:
                    parts.append(await synth_line(tts_text(ln["tts"]), voice, rate, "+0Hz"))
            lst = outdir / "list.txt"
            lst.write_text("\n".join(f"file '{p.as_posix()}'" for p in parts), encoding="utf-8")
            name = f"{voice.split('-')[2].replace('Neural', '')}_{rate.replace('+', 'p').replace('%', '')}.mp3"
            run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-af", "apad=pad_dur=0.3", "-b:a", "128k", str(outdir / name)])
            lst.unlink()
    print("samples ->", outdir)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    if cmd == "check":
        chars, errs = check_script(load_facts())
        print("chars:", chars)
        print("\n".join(errs) or "script OK")
        pl = polyphone_list()
        (BUILD).mkdir(parents=True, exist_ok=True)
        (BUILD / "polyphones.json").write_text(json.dumps(pl, ensure_ascii=False, indent=1), encoding="utf-8")
        print("polyphone lines:", len(pl))
    elif cmd == "samples":
        asyncio.run(voice_samples(ROOT / "docs" / "video" / "voice-ab"))
