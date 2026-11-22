"""v4 舞台逐幀渲染：4 個 Chromium 平行，各自把 JPEG 幀串流給 ffmpeg，最後無損接合並轉 BT.709。"""
import asyncio
import json
import subprocess
import sys
import time
from pathlib import Path

import segno
from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent
BUILD = HERE.parent / "build"
STAGE = HERE / "stage"
FPS = 30
WORKERS = 4


def write_data(tl: dict):
    m = json.loads((BUILD / "manifest.json").read_text(encoding="utf-8"))
    qr = segno.make("https://agentic-era.kevin-tsou.workers.dev/", error="m")
    import io
    buf = io.BytesIO()
    qr.save(buf, kind="svg", scale=10, border=0, dark="#26221e", xmldecl=False, svgns=True)
    data = {"timeline": tl, "manifest": m, "facts": tl.get("facts", {}), "assetBase": (BUILD / "assets").as_uri() + "/",
            "qr": buf.getvalue().decode()}
    (STAGE / "data.js").write_text("window.__DATA__ = " + json.dumps(data, ensure_ascii=False) + ";", encoding="utf-8")


async def chunk(idx, f0, f1, qa: dict):
    out = BUILD / "chunks" / f"c{idx}.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "image2pipe", "-vcodec", "mjpeg", "-r", str(FPS), "-i", "-",
                           "-vf", "scale=in_range=full:out_range=limited:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-g", "60",
                           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv", str(out)],
                          stdin=subprocess.PIPE)
    try:
        async with async_playwright() as p:
            br = await p.chromium.launch(args=["--allow-file-access-from-files"])
            pg = await br.new_page(viewport={"width": 1920, "height": 1080})
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            await pg.goto((STAGE / "stage.html").as_uri(), wait_until="load")
            await pg.evaluate("window.stageReady")
            if errs:
                raise RuntimeError("stage error: " + "; ".join(errs))
            for i in range(f0, f1):
                await pg.evaluate("t => window.renderFrame(t)", i / FPS)
                jpg = await pg.screenshot(type="jpeg", quality=95)
                ff.stdin.write(jpg)
                if i in qa:
                    (BUILD / "qa" / f"{qa[i]}.jpg").write_bytes(jpg)
            await br.close()
    finally:
        ff.stdin.close()
        if ff.wait() != 0:
            raise RuntimeError(f"chunk {idx} ffmpeg failed")
    return out


async def main(tl: dict, only=None):
    write_data(tl)
    total = tl["total"]
    nf = int(round(total * FPS))
    (BUILD / "qa").mkdir(parents=True, exist_ok=True)
    qa = {}
    for b in tl["beats"]:
        for frac, tag in ((0.35, "a"), (0.85, "b")):
            t = b["start"] + (b["end"] - b["start"]) * frac
            qa[min(nf - 1, int(t * FPS))] = f"{b['id']}_{tag}"
    qa[nf - 5] = "zz_outro"
    if only:  # 只渲染單張預覽影格
        write_data(tl)
        return None
    step = (nf + WORKERS - 1) // WORKERS
    t0 = time.monotonic()
    parts = await asyncio.gather(*[chunk(w, w * step, min(nf, (w + 1) * step), qa) for w in range(WORKERS) if w * step < nf])
    lst = BUILD / "chunks" / "list.txt"
    lst.write_text("\n".join(f"file '{p.as_posix()}'" for p in parts), encoding="utf-8")
    silent = BUILD / "video_silent.mp4"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(silent)], check=True)
    print(f"[render] {nf} 幀 {time.monotonic() - t0:.0f}s")
    return silent


if __name__ == "__main__":
    tl = json.loads((BUILD / "timeline.json").read_text(encoding="utf-8"))
    if len(sys.argv) > 1 and sys.argv[1] == "data":
        write_data(tl)
        print("data.js written")
    else:
        asyncio.run(main(tl))
