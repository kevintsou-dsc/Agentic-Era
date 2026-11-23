"""混合版素材：用 Playwright page.clock 接管網站的動畫時鐘，逐幀錄下「真實」動態，
存成 30fps JPEG 序列（build/assets/live/<clip>/00000.jpg），再交給舞台推鏡、標註。

  首頁粒子（hook）→ 首頁捲動（scroll）→ 臉譜捲動（facemap）
  圖表蒙太奇：AIDMA、四種競爭、天平、冰山、末日循環

片段長度一律依 build/timeline.json 的實際旁白時間計算，旁白一改就要重跑這支。
"""
import asyncio
import json
import math
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
    dur = lambda k: B[k]["end"] - B[k]["start"]  # noqa: E731
    slugs = [a["slug"] for a in json.loads((C.ROOT / "content" / "articles.json").read_text(encoding="utf-8"))["articles"]]
    titles = {a["slug"]: a["title"] for a in json.loads((C.ROOT / "content" / "articles.json").read_text(encoding="utf-8"))["articles"]}
    LIVE.mkdir(parents=True, exist_ok=True)
    for d in LIVE.iterdir():
        shutil.rmtree(d)
    man = {}
    srv, base = C.serve()
    try:
        async with async_playwright() as p:
            br = await p.chromium.launch()

            async def open_page(path, read=None, seen=None):
                ctx = await br.new_context(viewport={"width": C.VW, "height": C.VH}, device_scale_factor=C.DPR)
                await ctx.add_init_script("document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.scrollBehavior = 'auto'; });")
                if read is not None:
                    await ctx.add_init_script(f"try{{localStorage.setItem('dw-read', JSON.stringify({json.dumps(read)}));localStorage.setItem('dw-face-seen', JSON.stringify({json.dumps(seen or [])}));}}catch(e){{}}")
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

                async def run(self, dur, fn):
                    """每一幀先呼叫 fn(i, t) 做互動（滑鼠、點擊），再前進時鐘並截圖。"""
                    for i in range(int(round(dur * FPS))):
                        await fn(i, self.n / FPS)
                        await self.snap()

                def done(self, **extra):
                    man[self.name] = {"n": self.n, **extra}
                    print(f"[live] {self.name}: {self.n} 幀")

            # ── 首頁 ──
            ctx, pg = await open_page("/")
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

            # ── 四條主線（n05）：從臉譜往下捲到主線，滑鼠移到「判斷力」 ──
            th = pg.locator(".fm-threads").first
            ty = await th.evaluate("el => el.getBoundingClientRect().top + scrollY - 260")
            judge = pg.locator(".fm-thread[data-thread='judge']").first
            d5 = dur("n05")
            r = Rec(pg, "threads")
            await r.scroll(ch + 700, ty, 1.2)
            await r.hold(0.3)
            jb = await judge.bounding_box()
            jx, jy = jb["x"] + jb["width"] / 2, jb["y"] + jb["height"] / 2

            async def mv(i, t, a=1.6, b=2.7):
                p = ease((t - a) / (b - a))
                await pg.mouse.move(C.VW * 0.82 + (jx - C.VW * 0.82) * p, C.VH * 0.9 + (jy - C.VH * 0.9) * p)
            await r.run(d5 + MARGIN - r.n / FPS, mv)
            r.done(box=C.nb(await th.bounding_box()), judge=C.nb(jb), jx=jx / C.VW, jy=jy / C.VH)
            await ctx.close()

            # ── 臉譜點亮（n04 第三句）：讀過 6 篇、還沒看過 → 臉譜進入畫面時真的逐塊染開 ──
            ctx, pg = await open_page("/", read=slugs[:6], seen=[])
            await pg.evaluate("y => window.scrollTo(0, y)", ch + 700)
            l3 = B["n04"]["lines"][2]["start"] - B["n04"]["start"]
            r = Rec(pg, "facelit")
            await r.hold(dur("n04") - l3 + 0.6 + MARGIN)
            r.done()
            await ctx.close()

            # ── 〈重建 SOV〉開頭 → 捲到預算配置圖 → 逐 beat 推進（n06a、n06b）──
            ctx, pg = await open_page("/story/rebuild-sov/")
            sc = pg.locator(".scrolly", has_text="同一筆預算").first
            bs = sc.locator(".beat")
            nb_ = min(await bs.count(), 4)
            ys = [await bs.nth(i).evaluate("el => el.getBoundingClientRect().top + scrollY - 420") for i in range(nb_)]
            wrap = sc.locator(".d3wrap").first
            nat = await wrap.evaluate("el => el.getBoundingClientRect().top + scrollY")
            await pg.evaluate("y => window.scrollTo(0, y)", ys[1])
            await pg.clock.run_for(300)
            stuck = await wrap.evaluate("el => el.getBoundingClientRect().top")
            ys[0] = max(ys[0], nat - stuck + 2)
            await pg.evaluate("y => window.scrollTo(0, y)", ys[0])
            await pg.clock.run_for(1500)
            abox = C.nb(await wrap.bounding_box())
            await pg.evaluate("() => window.scrollTo(0, 0)")
            await pg.clock.run_for(1200)
            b6 = B["n06a"]
            l2 = b6["lines"][1]["start"] - b6["start"]
            l3 = b6["lines"][2]["start"] - b6["start"]
            r = Rec(pg, "sov_intro")
            await r.hold(l2 - 0.2)
            await r.scroll(0, ys[0], l3 - l2 + 0.2)
            await r.hold(dur("n06a") - r.n / FPS + MARGIN)
            r.done(box=abox, l3=l3)
            d6 = dur("n06b")
            r = Rec(pg, "sov_alloc")
            await r.hold(0.2)
            seg = (d6 - 1.4) / max(1, nb_ - 1)
            for i in range(1, nb_):
                await r.scroll(ys[i - 1], ys[i], seg)
            await r.hold(d6 + MARGIN - r.n / FPS)
            r.done(box=abox)

            # ── 頁碼 → 原刊對照視窗（n08a＋n08b 一鏡到底，點擊是真的點）──
            rbtn = pg.locator(".src-ref").filter(has_text="p.119").first
            await rbtn.evaluate("el => el.scrollIntoView({block: 'center'})")
            await pg.clock.run_for(1200)
            bb = await rbtn.bounding_box()
            b8 = B["n08a"]
            click = b8["lines"][1]["start"] - b8["start"] - 0.5
            r = Rec(pg, "reader")
            await r.hold(click)
            await rbtn.click()
            await r.hold(0.8)
            mark = await pg.evaluate("""() => { const ms=[...document.querySelectorAll('#reader mark')]; if(!ms.length) return null;
              let l=1e9,t=1e9,r=-1e9,b=-1e9; for(const m of ms){const c=m.getBoundingClientRect(); if(c.width<=0) continue;
              l=Math.min(l,c.left);t=Math.min(t,c.top);r=Math.max(r,c.right);b=Math.max(b,c.bottom);} return {x:l,y:t,width:r-l,height:b-t}; }""")
            await r.hold(dur("n08a") + dur("n08b") + MARGIN - r.n / FPS)
            r.done(btn=C.nb(bb), mark=C.nb(mark), click=click)
            await pg.keyboard.press("Escape")
            await pg.clock.run_for(400)

            # ── 分享卡三風格（n10）──
            await pg.evaluate("() => document.querySelectorAll('details').forEach(d => d.open = true)")
            sh = pg.locator("[data-share], .share").first
            sy = await sh.evaluate("el => el.getBoundingClientRect().top + scrollY - 85")
            await pg.evaluate("y => window.scrollTo(0, y)", sy)
            await pg.clock.run_for(800)
            d10 = dur("n10")
            styles = pg.locator(".share-style")
            hits = {int(round((0.5 + k * (d10 - 1.4) / 2) * FPS)): k for k in (1, 2)}

            async def sw(i, t):
                if i in hits:
                    await styles.nth(hits[i]).click()
            r = Rec(pg, "share")
            await r.run(d10 + MARGIN, sw)
            r.done(card=C.nb(await pg.locator(".share-card").first.bounding_box()))

            # ── 知識補給包與成就卡（n09）：真的拖曳旋轉、拉開 ──
            await pg.evaluate("""() => { localStorage.setItem('dw-read', JSON.stringify(['rebuild-sov']));
              document.dispatchEvent(new CustomEvent('dw:read', { detail: { before: [], after: ['rebuild-sov'] } })); }""")
            await pg.clock.run_for(250)
            await pg.locator('[data-snack-album="top"]').first.click()
            d9 = dur("n09")
            cut = d9 * 0.55
            state = {"down": False, "torn": False}

            async def pk(i, t):
                if 0.5 <= t < cut:
                    if not state["down"]:
                        await pg.mouse.move(960, 440)
                        await pg.mouse.down()
                        state["down"] = True
                    p = (t - 0.5) / (cut - 0.5)
                    await pg.mouse.move(960 + 260 * math.sin(p * 6.283), 440 + 14 * math.sin(p * 12.566))
                elif t >= cut and not state["torn"]:
                    if state["down"]:
                        await pg.mouse.up()
                    await pg.locator("#snack [data-tear]").first.click()
                    state["torn"] = True
            r = Rec(pg, "snack")
            await r.run(d9 + MARGIN, pk)
            r.done()
            await ctx.close()

            # ── 判斷力主線（n14）──
            ctx, pg = await open_page("/")
            th = pg.locator(".fm-threads").first
            ty = await th.evaluate("el => el.getBoundingClientRect().top + scrollY - 260")
            await pg.evaluate("y => window.scrollTo(0, y)", ty)
            await pg.clock.run_for(1500)
            jb = await pg.locator(".fm-thread[data-thread='judge']").first.bounding_box()
            await pg.mouse.move(jb["x"] + jb["width"] / 2, jb["y"] + jb["height"] / 2)
            r = Rec(pg, "judge")
            await r.hold(dur("n14") + MARGIN)
            r.done(judge=C.nb(jb))
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
