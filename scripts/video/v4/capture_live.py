"""混合版素材：用 Playwright page.clock 接管網站的動畫時鐘，逐幀錄下「真實」動態，
存成 30fps JPEG 序列（build/assets/live/<clip>/00000.jpg），再交給舞台推鏡、標註。

  首頁粒子（hook）→ 首頁捲動（scroll）→ 臉譜捲動（facemap）
  圖表蒙太奇：AIDMA、四種競爭、天平、冰山、末日循環

片段長度一律依 build/timeline.json 的實際旁白時間計算，旁白一改就要重跑這支。
"""
import asyncio
import json
import shutil

from playwright.async_api import async_playwright

import capture as C

FPS = 30
LIVE = C.ASSETS / "live"
MARGIN = 0.4  # 片段尾端多錄一點，避免交叉淡化時取不到幀

# (片段名, 文章 slug, 第幾個含 .d3wrap 的 scrolly, 篇名)
CHARTS = [
    ("c_aidma", "buy-attention", 1, "別買曝光了，開始買注意力吧"),
    ("c_rings", "rebuild-sov", 2, "重建 SOV"),
    ("c_seesaw", "judgment", 0, "判斷力不能外包"),
    ("c_iceberg", "cultural-undercurrents", 0, "文化暗流"),
    ("c_loop", "buy-attention", 0, "別買曝光了，開始買注意力吧"),
]


def ease(p):
    p = max(0.0, min(1.0, p))
    return 4 * p ** 3 if p < .5 else 1 - (-2 * p + 2) ** 3 / 2


def chart_durations(B):
    """與 stage.js SCENES.charts 的時間分配一致。"""
    b = B["n07"]
    d = b["end"] - b["start"]
    L2 = b["lines"][1]["start"] - b["start"]
    starts = [0, L2 / 2, L2, L2 + 1.8, L2 + 3.6]
    ends = starts[1:] + [d]
    return [e - s for s, e in zip(starts, ends)]


async def main():
    tl = json.loads((C.BUILD / "timeline.json").read_text(encoding="utf-8"))
    B = {b["id"]: b for b in tl["beats"]}
    titles = {a["slug"]: a["title"] for a in json.loads((C.ROOT / "content" / "articles.json").read_text(encoding="utf-8"))["articles"]}
    LIVE.mkdir(parents=True, exist_ok=True)
    for d in LIVE.iterdir():
        shutil.rmtree(d)
    man = {}
    srv, base = C.serve()
    try:
        async with async_playwright() as p:
            br = await p.chromium.launch()

            async def open_page(path):
                ctx = await br.new_context(viewport={"width": C.VW, "height": C.VH}, device_scale_factor=C.DPR)
                await ctx.add_init_script("document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.scrollBehavior = 'auto'; });")
                pg = await ctx.new_page()
                await pg.clock.install()
                await pg.goto(f"{base}{path}", wait_until="networkidle")
                await pg.clock.run_for(4500)  # 虛擬時間快轉過 loader
                return ctx, pg

            class Rec:
                def __init__(self, pg, name, clip=None):
                    self.pg, self.name, self.clip, self.n = pg, name, clip, 0
                    (LIVE / name).mkdir()

                async def snap(self):
                    await self.pg.clock.run_for(int(round(1000 / FPS)))
                    kw = {"path": str(LIVE / self.name / f"{self.n:05d}.jpg"), "type": "jpeg", "quality": 88}
                    if self.clip:
                        kw["clip"] = self.clip
                    await self.pg.screenshot(**kw)
                    self.n += 1

                async def hold(self, dur):
                    for _ in range(int(round(dur * FPS))):
                        await self.snap()

                async def scroll(self, y0, y1, dur):
                    n = max(1, int(round(dur * FPS)))
                    for i in range(n):
                        await self.pg.evaluate("y => window.scrollTo(0, y)", y0 + (y1 - y0) * ease(i / max(1, n - 1)))
                        await self.snap()

                def done(self, **extra):
                    man[self.name] = {"n": self.n, **extra}
                    print(f"[live] {self.name}: {self.n} 幀")

            # ── 首頁 ──
            ctx, pg = await open_page("/")
            await pg.add_style_tag(content=".hx-logo{display:none!important}")
            hx = await pg.evaluate("() => document.querySelector('.hx')?.offsetHeight || 2200")
            r = Rec(pg, "hook")
            await r.hold(B["n01"]["end"] - B["n01"]["start"] + MARGIN)
            r.done()
            d3 = B["n03"]["end"] - B["n03"]["start"]
            l2 = B["n03"]["lines"][1]["start"] - B["n03"]["start"]
            r = Rec(pg, "scroll")
            await r.hold(l2 - 0.3)
            await r.scroll(0, hx * 0.72, d3 - (l2 - 0.3) + MARGIN)
            r.done()
            ch = await pg.evaluate("() => document.querySelector('#chapters').getBoundingClientRect().top + scrollY - 6")
            await pg.evaluate("y => window.scrollTo(0, y)", ch)
            await pg.clock.run_for(1200)
            l3 = B["n04"]["lines"][2]["start"] - B["n04"]["start"]
            r = Rec(pg, "facemap")
            await r.hold(0.2)
            await r.scroll(ch, ch + 700, l3 - 0.8)
            await r.hold(0.6 + MARGIN)
            r.done()
            await ctx.close()

            # ── 圖表蒙太奇 ──
            for (name, slug, si, _), dur in zip(CHARTS, chart_durations(B)):
                ctx, pg = await open_page(f"/story/{slug}/")
                sc = pg.locator(".scrolly:has(.d3wrap)").nth(si)
                bs = sc.locator(".beat")
                nb_ = await bs.count()
                ys = [await bs.nth(i).evaluate("el => el.getBoundingClientRect().top + scrollY - 420") for i in range(nb_)]
                # .d3wrap 是 sticky：從它「已經黏住」的位置開始錄，畫框才不會中途位移
                wrap = sc.locator(".d3wrap").first
                await pg.evaluate("() => window.scrollTo(0, 0)")
                nat = await wrap.evaluate("el => el.getBoundingClientRect().top + scrollY")
                await pg.evaluate("y => window.scrollTo(0, y)", ys[min(1, nb_ - 1)])
                stuck = await wrap.evaluate("el => el.getBoundingClientRect().top")
                ys[0] = max(ys[0], nat - stuck + 2)
                await pg.evaluate("y => window.scrollTo(0, y)", ys[0])
                await pg.clock.run_for(1800)  # 第一格完全就位
                bx = await sc.locator(".d3wrap").first.bounding_box()
                clip = {"x": bx["x"], "y": bx["y"], "width": bx["width"], "height": bx["height"]}
                r = Rec(pg, name, clip)
                rec = dur + MARGIN
                # 先停 15%，再均速走完所有 beat，最後一格停住
                await r.hold(rec * 0.15)
                seg = rec * 0.7 / max(1, nb_ - 1)
                for i in range(1, nb_):
                    await r.scroll(ys[i - 1], ys[i], seg)
                await r.hold(rec - r.n / FPS)
                r.done(w=round(bx["width"]), h=round(bx["height"]), title=titles.get(slug, slug))
                await ctx.close()
            await br.close()
    finally:
        srv.shutdown()
    m = json.loads((C.BUILD / "manifest.json").read_text(encoding="utf-8"))
    m["live"] = man
    m["live_charts"] = [c[0] for c in CHARTS]
    (C.BUILD / "manifest.json").write_text(json.dumps(m, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    asyncio.run(main())
