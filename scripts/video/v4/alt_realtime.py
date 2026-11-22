"""對照實驗：另一種核心做法——「虛擬時鐘逐幀擬錄」。

不再截靜態圖後在舞台上推鏡，而是直接操作真實網站：
用 Playwright page.clock 接管 requestAnimationFrame／計時器，每一幀
「捲動一點 → 時間前進 1/30 秒 → 截圖」，得到 30fps、零掉幀的真實互動畫面
（粒子、D3 轉場都是網站本身的動畫）。

範圍：與 v4 同一條旁白的 n03～n08a（首頁捲動、臉譜、〈重建 SOV〉、頁碼原文），
輸出 build/alt_segment.mp4 與左右對照 build/compare_v4_vs_alt.mp4。
"""
import asyncio
import json
import subprocess
from pathlib import Path

from playwright.async_api import async_playwright

import capture as C

BUILD = C.BUILD
FPS = 30


def ease(p):
    p = max(0.0, min(1.0, p))
    return 4 * p ** 3 if p < .5 else 1 - (-2 * p + 2) ** 3 / 2


async def main():
    tl = json.loads((BUILD / "timeline.json").read_text(encoding="utf-8"))
    B = {b["id"]: b for b in tl["beats"]}
    t0, t1 = B["n03"]["start"], B["n08a"]["end"]
    srv, base = C.serve()
    out = BUILD / "alt_segment.mp4"
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "image2pipe", "-vcodec", "mjpeg", "-r", str(FPS), "-i", "-",
                           "-vf", "scale=in_range=full:out_range=limited:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p",
                           "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-colorspace", "bt709", "-color_primaries", "bt709",
                           "-color_trc", "bt709", "-color_range", "tv", str(out)], stdin=subprocess.PIPE)
    try:
        async with async_playwright() as p:
            br = await p.chromium.launch()
            ctx = await br.new_context(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
            await ctx.add_init_script("document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.scrollBehavior = 'auto'; });")
            page = await ctx.new_page()
            await page.clock.install()
            frames = 0

            async def snap():
                nonlocal frames
                await page.clock.run_for(int(1000 / FPS))
                ff.stdin.write(await page.screenshot(type="jpeg", quality=88))
                frames += 1

            async def scroll_seg(y_from, y_to, dur):
                n = max(1, int(round(dur * FPS)))
                for i in range(n):
                    await page.evaluate("y => window.scrollTo(0, y)", y_from + (y_to - y_from) * ease(i / max(1, n - 1)))
                    await snap()

            # 首頁：等 loader 跑完（以虛擬時間快轉），再真實捲動
            await page.goto(f"{base}/", wait_until="networkidle")
            await page.clock.run_for(4000)
            await page.add_style_tag(content=".hx-logo{display:none!important}")
            hx = await page.evaluate("() => document.querySelector('.hx').offsetHeight")
            ch = await page.evaluate("() => document.querySelector('#chapters').getBoundingClientRect().top + scrollY - 6")
            d03 = B["n04"]["start"] - t0
            await scroll_seg(0, hx * 0.72, d03)
            d04 = B["n05"]["start"] - B["n04"]["start"]
            await scroll_seg(hx * 0.72, ch + 640, d04)
            ty = await page.evaluate("() => document.querySelector('.fm-threads').getBoundingClientRect().top + scrollY - 260")
            d05 = B["n06a"]["start"] - B["n05"]["start"]
            await scroll_seg(ch + 640, ty, d05)

            # 〈重建 SOV〉：開頭 → allocate 真實 D3 轉場
            await page.goto(f"{base}/story/rebuild-sov/", wait_until="networkidle")
            await page.clock.run_for(4000)
            sc = page.locator(".scrolly", has_text="同一筆預算").first
            nb = min(4, await sc.locator(".beat").count())
            bys = [await sc.locator(".beat").nth(i).evaluate("el => el.getBoundingClientRect().top + scrollY - 420") for i in range(nb)]
            while len(bys) < 4:
                bys.append(bys[-1] + 500)
            d6a = B["n06b"]["start"] - B["n06a"]["start"]
            await scroll_seg(0, 0, d6a * 0.45)
            await scroll_seg(0, bys[0], d6a * 0.55)
            d6b = B["n07"]["start"] - B["n06b"]["start"]
            for i in range(1, 4):
                await scroll_seg(bys[i - 1], bys[i], d6b / 3)
            # n07 這段改走真實捲動〈重建 SOV〉後續內容（對照實驗中不做跨篇剪接）
            d07 = B["n08a"]["start"] - B["n07"]["start"]
            await scroll_seg(bys[3], bys[3] + 1400, d07)

            # 頁碼 → 原文視窗（真實點擊）
            btn = page.locator(".src-ref").filter(has_text="p.119").first
            by = await btn.evaluate("el => el.getBoundingClientRect().top + scrollY - 540")
            d8 = t1 - B["n08a"]["start"]
            await scroll_seg(bys[3] + 1400, by, d8 * 0.4)
            await btn.click()
            n = int(round(d8 * 0.6 * FPS))
            for _ in range(n):
                await snap()
            await br.close()
    finally:
        srv.shutdown()
        ff.stdin.close()
        ff.wait()
    print("[alt] frames", frames, "->", out)

    # 左右對照：左 v4 舞台版、右 擬錄版，同一段旁白
    v4 = BUILD / "decision_wisdom_2026_3min_v4.mp4"
    cmp_ = BUILD / "compare_v4_vs_alt.mp4"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(t0), "-t", str(t1 - t0), "-i", str(v4), "-i", str(out),
                    "-filter_complex",
                    "[0:v]scale=960:540,drawtext=fontfile='C\\:/Windows/Fonts/msjhbd.ttc':text='A｜v4 舞台推鏡':x=20:y=20:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.6[a];"
                    "[1:v]scale=960:540,drawtext=fontfile='C\\:/Windows/Fonts/msjhbd.ttc':text='B｜真實網站逐幀擬錄':x=20:y=20:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.6[b];"
                    "[a][b]hstack,pad=1920:1080:0:270:color=0x1c1814[v]",
                    "-map", "[v]", "-map", "0:a", "-c:v", "libx264", "-crf", "20", "-c:a", "aac", "-b:a", "160k", "-shortest", str(cmp_)], check=True)
    print("[alt] compare ->", cmp_)


if __name__ == "__main__":
    asyncio.run(main())
