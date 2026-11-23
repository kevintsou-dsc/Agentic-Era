"""v4 影片主流程：
  python v4/build.py audio     # 稿件檢查 → 逐句合成 → 時間軸 → 配樂 → SRT
  python v4/build.py capture   # 擷取網站素材＋真實動態序列（需先 npm run build 產生 dist/）
  python v4/build.py render    # 舞台逐幀渲染 → 混音 → BT.709 封裝 → 自動驗證
  python v4/build.py all
"""
import asyncio
import json
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import audio as A  # noqa: E402
import script as S  # noqa: E402

ROOT = A.ROOT
BUILD = A.BUILD
OUT_NAME = "decision_wisdom_2026_3min_v6.mp4"  # v5 = 混合版（真實動態＋舞台推鏡）


def step_audio():
    facts = A.load_facts()
    chars, errs = A.check_script(facts)
    if errs:
        raise SystemExit("稿件檢查失敗：\n" + "\n".join(errs))
    wav, beats, total = asyncio.run(A.build_narration())
    print(f"[audio] {chars} 字，總長 {total:.2f}s")
    if total > S.MAX_TOTAL:
        raise SystemExit(f"總長 {total:.2f}s 超過上限 {S.MAX_TOTAL}s：先刪字，再縮短 hold")
    (BUILD / "timeline.json").write_text(json.dumps({"total": total, "beats": beats, "facts": facts}, ensure_ascii=False, indent=1), encoding="utf-8")
    A.make_bgm(total, BUILD / "bgm.wav")
    A.write_srt(beats, BUILD / OUT_NAME.replace(".mp4", ".srt"))
    # 多音字必聽合輯
    pl = A.polyphone_list()
    lines = {f"{b['id']}_{i}": ln["wav"] for b in beats for i, ln in enumerate(b["lines"])}
    lst = BUILD / "must_listen.txt"
    lst.write_text("\n".join(f"file '{Path(lines[x['id']]).as_posix()}'\nfile '{(BUILD / 'gap.wav').as_posix()}'" for x in pl if x["id"] in lines), encoding="utf-8")
    A.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-t", "0.6", str(BUILD / "gap.wav")])
    A.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-b:a", "128k", str(BUILD / "must_listen.mp3")])
    print(f"[audio] 必聽合輯 {len(pl)} 句 -> build/must_listen.mp3")


def mux(video_nosound: Path, total: float, out: Path):
    nar = BUILD / "narration_main.wav"
    bgm = BUILD / "bgm.wav"
    fc = (
        f"[1:a]aresample=48000,apad=whole_dur={total},asplit=2[vo][sc];"
        f"[2:a]aresample=48000,volume=-14dB[bg];"
        f"[bg][sc]sidechaincompress=threshold=0.015:ratio=4:attack=20:release=250[duck];"
        f"[vo]pan=stereo|c0=c0|c1=c0[vos];"
        f"[vos][duck]amix=inputs=2:normalize=0:duration=first[mix]"
    )
    tmp = BUILD / "mix_tmp.wav"
    A.run(["ffmpeg", "-y", "-i", str(video_nosound), "-i", str(nar), "-i", str(bgm), "-filter_complex", fc,
           "-map", "[mix]", "-t", str(total), str(tmp)])
    # 兩段式 loudnorm
    meas = subprocess.run(["ffmpeg", "-i", str(tmp), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                          capture_output=True, text=True, encoding="utf-8", errors="replace").stderr
    j = json.loads(meas[meas.rindex("{"): meas.rindex("}") + 1])
    ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
          f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    A.run(["ffmpeg", "-y", "-i", str(video_nosound), "-i", str(tmp), "-map", "0:v", "-map", "1:a",
           "-c:v", "copy", "-af", f"{ln},aresample=48000", "-c:a", "aac", "-b:a", "160k", "-ac", "2",
           "-t", str(total), "-movflags", "+faststart", str(out)])
    tmp.unlink(missing_ok=True)


def verify(out: Path, total: float):
    info = json.loads(A.run(["ffprobe", "-v", "error", "-show_entries",
                             "format=duration,size:stream=codec_type,width,height,r_frame_rate,pix_fmt,color_space,color_range,sample_rate,channels",
                             "-of", "json", str(out)]))
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next(s for s in info["streams"] if s["codec_type"] == "audio")
    eb = subprocess.run(["ffmpeg", "-nostats", "-i", str(out), "-af", "ebur128=peak=true", "-f", "null", "-"],
                        capture_output=True, text=True, encoding="utf-8", errors="replace").stderr
    import re
    I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", eb)[-1])
    P = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", eb)[-1])
    dur = float(info["format"]["duration"]); size = int(info["format"]["size"])
    checks = {
        "1920x1080": (v["width"], v["height"]) == (1920, 1080),
        "30fps": v["r_frame_rate"] == "30/1",
        "yuv420p tv bt709": v["pix_fmt"] == "yuv420p" and v.get("color_range") == "tv" and v.get("color_space") == "bt709",
        "48k stereo": a["sample_rate"] == "48000" and a["channels"] == 2,
        f"loudness {I} LUFS": abs(I + 16) <= 1,
        f"true peak {P} dBFS": P <= -1.0,
        f"duration {dur:.2f}s ≤ {S.MAX_TOTAL}": dur <= S.MAX_TOTAL + 0.1 and dur >= total - 0.2,
        f"size {size / 1e6:.1f}MB ≤ 100": size <= 100e6,
    }
    for k, ok in checks.items():
        print(("  ✓ " if ok else "  ✗ ") + k)
    if not all(checks.values()):
        raise SystemExit("交付規格檢查未通過")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "all"
    t0 = time.monotonic()
    if cmd in ("audio", "all"):
        step_audio()
    if cmd in ("capture", "all"):
        import capture
        import capture_live
        asyncio.run(capture.main())
        asyncio.run(capture_live.main())  # 依旁白時間軸錄真實動態，必須在 capture 之後
    if cmd in ("render", "all"):
        import render
        tl = json.loads((BUILD / "timeline.json").read_text(encoding="utf-8"))
        silent = asyncio.run(render.main(tl))
        out = BUILD / OUT_NAME
        mux(silent, tl["total"], out)
        verify(out, tl["total"])
        print("[done]", out)
    print(f"[time] {time.monotonic() - t0:.0f}s")
