"""v4 網站素材擷取（本機 dist/ 靜態伺服器，零網路）。輸出 build/assets/*.jpg 與 build/manifest.json。"""
import asyncio
import http.server
import json
import threading
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[3]
BUILD = Path(__file__).resolve().parent.parent / "build"
ASSETS = BUILD / "assets"
DIST = ROOT / "dist"
VW, VH = 1920, 1080
DPR = 1.25


def serve():
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k):
            super().__init__(*a, directory=str(DIST), **k)

        def log_message(self, *a):
            pass
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}"


def nb(b):
    if not b:
        return None
    return {"x": b["x"] / VW, "y": b["y"] / VH, "w": b["width"] / VW, "h": b["height"] / VH}


async def shot(page, name, clip=None, q=92):
    kw = {"path": str(ASSETS / f"{name}.jpg"), "type": "jpeg", "quality": q}
    if clip:
        kw["clip"] = clip
    await page.screenshot(**kw)


async def scroll(page, y, wait=0):
    await page.evaluate("y => window.scrollTo(0, y)", y)
    if wait:
        await page.wait_for_timeout(wait)


def read_init(slugs):
    return f"""try{{localStorage.setItem('dw-read', JSON.stringify({json.dumps(slugs)}));
    localStorage.setItem('dw-face-seen', JSON.stringify({json.dumps(slugs)}));}}catch(e){{}}"""


async def main():
    if not (DIST / "index.html").exists():
        raise SystemExit("找不到 dist/，請先在專案根目錄執行 npm run build")
    ASSETS.mkdir(parents=True, exist_ok=True)
    slugs = [a["slug"] for a in json.loads((ROOT / "content" / "articles.json").read_text(encoding="utf-8"))["articles"]]
    M = {"vw": VW, "vh": VH}
    srv, base = serve()
    try:
        async with async_playwright() as p:
            br = await p.chromium.launch(headless=True)
            _nc = br.new_context

            async def new_context(**kw):  # 關閉網站的 smooth scroll，讓每次捲動立即到位（決定性）
                c = await _nc(**kw)
                await c.add_init_script("document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.scrollBehavior = 'auto'; });")
                return c
            br.new_context = new_context

            # ── 首頁：粒子匯聚序列（未讀狀態）──
            ctx = await br.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=DPR)
            page = await ctx.new_page()
            await page.goto(f"{base}/", wait_until="networkidle")
            await page.wait_for_function("() => { const l = document.getElementById('loader'); return !l || getComputedStyle(l).opacity === '0' || l.hidden || !l.isConnected; }", timeout=8000)
            await page.wait_for_timeout(900)
            await page.add_style_tag(content=".hx-logo{display:none!important}")
            hx = await page.evaluate("() => document.querySelector('.hx')?.offsetHeight || 2200")
            n = 36
            for i in range(n):
                await scroll(page, int((i / (n - 1)) * hx * 0.72), 70)
                await shot(page, f"hero_{i:02d}", q=88)
            M["hero_n"] = n

            # ── 臉譜捲動序列＋四條主線 ──
            ch_y = await page.evaluate("() => document.querySelector('#chapters').getBoundingClientRect().top + scrollY - 6")
            n = 18
            for i in range(n):
                await scroll(page, ch_y + int((i / (n - 1)) * 700), 120)
                await shot(page, f"fm_{i:02d}", q=88)
            M["fm_n"] = n
            th = page.locator(".fm-threads").first
            await th.scroll_into_view_if_needed()
            ty = await th.evaluate("el => el.getBoundingClientRect().top + scrollY - 260")
            await scroll(page, ty, 700)
            judge = page.locator(".fm-thread[data-thread='judge']").first
            await judge.hover()
            await page.wait_for_timeout(600)
            await shot(page, "threads")
            M["threads"] = {"box": nb(await th.bounding_box()), "judge": nb(await judge.bounding_box())}
            await ctx.close()

            # ── 臉譜點亮進度（4→22）──
            M["light_n"] = []
            for k in (2, 5, 9, 13, 17, 22):
                c = await br.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=DPR)
                await c.add_init_script(read_init(slugs[:k]))
                pg = await c.new_page()
                await pg.goto(f"{base}/", wait_until="networkidle")
                y = await pg.evaluate("() => document.querySelector('#chapters').getBoundingClientRect().top + scrollY - 6")
                await scroll(pg, y, 1500)
                await shot(pg, f"light_{k:02d}")
                M["light_n"].append(k)
                if k == 22:
                    M["fm_stage"] = nb(await pg.locator(".fm-stage").first.bounding_box())
                await c.close()

            # ── 〈重建 SOV〉：開頭＋allocate 逐格（含轉場中的連拍）──
            ctx = await br.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=DPR)
            page = await ctx.new_page()
            await page.goto(f"{base}/story/rebuild-sov/", wait_until="networkidle")
            await page.wait_for_function("() => { const l = document.getElementById('loader'); return !l || getComputedStyle(l).opacity === '0' || l.hidden || !l.isConnected; }", timeout=8000)
            await page.wait_for_timeout(800)
            await shot(page, "sov_top")
            await page.evaluate("() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'))")
            sc = page.locator(".scrolly", has_text="同一筆預算").first
            beats = sc.locator(".beat")
            cnt = await beats.count()
            frames = 0
            for bi in range(min(cnt, 4)):
                by = await beats.nth(bi).evaluate("el => el.getBoundingClientRect().top + scrollY - 420")
                await scroll(page, by)
                for _ in range(9 if bi else 3):  # 轉場過程連拍
                    await page.wait_for_timeout(110)
                    await shot(page, f"alloc_{frames:02d}", q=90)
                    frames += 1
                await page.wait_for_timeout(700)
                await shot(page, f"alloc_{frames:02d}", q=90)
                frames += 1
            M["alloc_n"] = frames
            M["alloc_box"] = nb(await sc.locator(".d3wrap").first.bounding_box())

            # ── 頁碼 → 原刊對照視窗 ──
            rbtn = page.locator(".src-ref").filter(has_text="p.119").first
            await rbtn.evaluate("el => el.scrollIntoView({block: 'center'})")
            await page.wait_for_timeout(700)
            await shot(page, "reader_before")
            btn_box = await rbtn.bounding_box()
            await rbtn.click()
            await page.wait_for_selector("#reader[open] mark", timeout=8000)
            await page.wait_for_timeout(700)
            await shot(page, "reader_open")
            mark = await page.evaluate("""() => { const ms=[...document.querySelectorAll('#reader mark')]; if(!ms.length) return null;
              let l=1e9,t=1e9,r=-1e9,b=-1e9; for(const m of ms){const c=m.getBoundingClientRect(); if(c.width<=0) continue;
              l=Math.min(l,c.left);t=Math.min(t,c.top);r=Math.max(r,c.right);b=Math.max(b,c.bottom);} return {x:l,y:t,width:r-l,height:b-t}; }""")
            M["reader"] = {"btn": nb(btn_box), "mark": nb(mark)}
            await page.keyboard.press("Escape")
            await page.wait_for_timeout(300)

            # ── 分享卡三風格 ──
            await page.evaluate("() => document.querySelectorAll('details').forEach(d => d.open = true)")
            sh = page.locator("[data-share], .share").first
            sy = await sh.evaluate("el => el.getBoundingClientRect().top + scrollY - 85")
            await scroll(page, sy, 600)
            for idx, nm in enumerate(["bold", "paper", "night"]):
                await page.locator(".share-style").nth(idx).click()
                await page.wait_for_timeout(450)
                await shot(page, f"share_{nm}")
            M["share_card"] = nb(await page.locator(".share-card").first.bounding_box())

            # ── 知識補給包：旋轉＋開箱 ──
            await page.evaluate("""() => { localStorage.setItem('dw-read', JSON.stringify(['rebuild-sov']));
              document.dispatchEvent(new CustomEvent('dw:read', { detail: { before: [], after: ['rebuild-sov'] } })); }""")
            await page.wait_for_timeout(250)
            await page.locator('[data-snack-album="top"]').first.click()
            await page.wait_for_selector("#snack[open]", timeout=6000)
            await page.wait_for_timeout(600)
            await page.mouse.move(960, 440)
            await page.mouse.down()
            n = 14
            for i in range(n):
                await page.mouse.move(960 + int(240 * (i - (n - 1) / 2) / ((n - 1) / 2)), 440 + (12 if i % 2 else -12), steps=3)
                await page.wait_for_timeout(60)
                await shot(page, f"snack_{i:02d}", q=90)
            await page.mouse.up()
            M["snack_n"] = n
            await page.locator("#snack [data-tear]").first.click()
            await page.wait_for_selector("#snack .acard", timeout=6000)
            await page.wait_for_timeout(700)
            await shot(page, "snack_card")
            await ctx.close()

            # ── 三篇的圖表：只截圖表區、完成態 ──
            M["charts"] = []
            for slug in ("judgment", "buy-attention", "beyond-ai-slop"):
                ctx = await br.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=DPR)
                page = await ctx.new_page()
                await page.goto(f"{base}/story/{slug}/", wait_until="networkidle")
                await page.evaluate("() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'))")
                wrap = page.locator(".d3wrap").first
                sc = page.locator(".scrolly:has(.d3wrap)").first
                bs = sc.locator(".beat")
                if await sc.count() and await bs.count():
                    y = await bs.nth(await bs.count() - 1).evaluate("el => el.getBoundingClientRect().top + scrollY - 400")
                else:
                    y = await wrap.evaluate("el => el.getBoundingClientRect().top + scrollY - 120")
                await scroll(page, y, 1600)
                box = await wrap.bounding_box()
                title = await page.evaluate("() => document.querySelector('h1')?.innerText || ''")
                pad = 24
                clip = {"x": max(0, box["x"] - pad), "y": max(0, box["y"] - pad),
                        "width": min(VW - max(0, box["x"] - pad), box["width"] + pad * 2),
                        "height": min(VH - max(0, box["y"] - pad), box["height"] + pad * 2)}
                await shot(page, f"chart_{slug}", clip=clip)
                M["charts"].append({"slug": slug, "title": title.replace("\n", " ")[:40], "w": clip["width"], "h": clip["height"]})
                await ctx.close()
            await br.close()
    finally:
        srv.shutdown()
    (BUILD / "manifest.json").write_text(json.dumps(M, ensure_ascii=False, indent=1), encoding="utf-8")
    print("[capture] done", {k: v for k, v in M.items() if k.endswith("_n")})


if __name__ == "__main__":
    asyncio.run(main())
