"""混合版選材：逐篇把每個 .scrolly 內的 .d3wrap 依 beat 推進截圖，拼成對照表。
輸出 build/recon/<slug>.jpg（每篇一張：每列一個圖表，每欄一個 beat）。
"""
import asyncio
import subprocess
from pathlib import Path

from playwright.async_api import async_playwright

import capture as C

OUT = C.BUILD / "recon"
SLUGS = ["agent-experience", "agentic-era", "agents-of-growth", "ai-agent-journey", "algorithm-or-people",
         "attention-is-scarce", "beyond-ai-slop", "buy-attention", "cultural-undercurrents", "growth-architect",
         "judgment", "make-them-want-to-buy", "rebuild-sov", "shared-memory", "trust", "why-customers-stop"]


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    srv, base = C.serve()
    try:
        async with async_playwright() as p:
            br = await p.chromium.launch()
            ctx = await br.new_context(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
            await ctx.add_init_script("document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.scrollBehavior = 'auto'; });")
            page = await ctx.new_page()
            for slug in SLUGS:
                await page.goto(f"{base}/story/{slug}/", wait_until="networkidle")
                await page.wait_for_function("() => !document.querySelector('#loader') || getComputedStyle(document.querySelector('#loader')).opacity === '0'", timeout=15000)
                scs = page.locator(".scrolly:has(.d3wrap)")
                rows = []
                for si in range(await scs.count()):
                    sc = scs.nth(si)
                    bs = sc.locator(".beat")
                    nb = await bs.count()
                    picks = sorted({0, nb // 3, (2 * nb) // 3, nb - 1}) if nb else []
                    cells = []
                    for bi in picks:
                        y = await bs.nth(bi).evaluate("el => el.getBoundingClientRect().top + scrollY - 420")
                        await page.evaluate("y => window.scrollTo(0, y)", y)
                        await page.wait_for_timeout(1300)
                        f = OUT / f"{slug}_{si}_{bi}.jpg"
                        await sc.locator(".d3wrap").first.screenshot(path=str(f), type="jpeg", quality=80)
                        cells.append(f)
                    if cells:
                        rows.append(cells)
                if not rows:
                    print("[recon] no chart", slug)
                    continue
                # 每個 cell 縮成 480 寬，同列 hstack，列間 vstack
                args, fc, labels = [], [], []
                k = 0
                for r, cells in enumerate(rows):
                    ins = []
                    for c in cells:
                        args += ["-i", str(c)]
                        fc.append(f"[{k}:v]scale=480:400:force_original_aspect_ratio=decrease,pad=480:400:(ow-iw)/2:(oh-ih)/2:color=white[c{k}]")
                        ins.append(f"[c{k}]")
                        k += 1
                    while len(ins) < 4:
                        fc.append(f"color=white:s=480x400:d=1[e{r}_{len(ins)}]")
                        ins.append(f"[e{r}_{len(ins)}]")
                    fc.append("".join(ins) + f"hstack=4[r{r}]")
                    labels.append(f"[r{r}]")
                fc.append("".join(labels) + (f"vstack={len(labels)}[o]" if len(labels) > 1 else "null[o]"))
                subprocess.run(["ffmpeg", "-y", "-v", "error", *args, "-filter_complex", ";".join(fc), "-map", "[o]",
                                "-frames:v", "1", str(OUT / f"{slug}.jpg")], check=True)
                print("[recon]", slug, [len(c) for c in rows])
            await br.close()
    finally:
        srv.shutdown()


if __name__ == "__main__":
    asyncio.run(main())
