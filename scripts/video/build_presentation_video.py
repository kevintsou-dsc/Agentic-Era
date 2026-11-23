import asyncio
import base64
import http.server
import json
import subprocess
import threading
import time
from pathlib import Path

import edge_tts
from playwright.async_api import async_playwright

VOICE = "zh-TW-HsiaoYuNeural"
RATE = "+19%"  # HsiaoYu 原生台灣溫暖自然口音 × HsiaoChen 俐落節奏

PROJECT_DIST = Path(r"c:\Users\ktsou01\Antigravity-Ecosystem\projects\決策智慧vibecoding比賽\dist")
ARTICLES_JSON = Path(r"c:\Users\ktsou01\Antigravity-Ecosystem\projects\決策智慧vibecoding比賽\content\articles.json")

OUT_DIR = Path(__file__).parent / "final_v3"
ASSETS_DIR = OUT_DIR / "assets"
AUDIO_DIR = OUT_DIR / "audio"
CHUNKS_DIR = OUT_DIR / "chunks"
QA_DIR = OUT_DIR / "qa_frames"
for d in (OUT_DIR, ASSETS_DIR, AUDIO_DIR, CHUNKS_DIR, QA_DIR):
    d.mkdir(parents=True, exist_ok=True)

FPS = 30
VW, VH = 1920, 1080

# 自然台灣口語稿（雙軌 tts / subs），聚焦 A(重建SOV) + D(花錢買曝光) + E(GEO) + F(衡斷力) 跨 4 篇視覺化！
BEATS = [
    # ACT 1｜開場破題
    {
        "id": "b01", "badge": "01｜痛點破題",
        "tts": "十四萬字的行銷年鑑，老實說，平常上班根本沒時間從頭翻完。",
        "subs": ["14.3 萬字的行銷年鑑，讀完要 5 個多小時", "平常上班，根本沒時間從頭翻完"],
    },
    {
        "id": "b02", "badge": "01｜作品亮相",
        "tts": "所以我們把電通今年的決策智慧，二十二篇深度觀點，重造成一捲就能讀懂的互動網站。",
        "subs": ["我們把電通《決策智慧 2026》22 篇觀點", "重造成一捲就能讀懂的互動閱讀網站"],
    },
    {
        "id": "b03", "badge": "01｜三層閱讀架構",
        "tts": "一分鐘先看懂全書脈絡，幾分鐘讀完單篇精華，想深究再一鍵核對紙本原文。",
        "subs": ["1 分鐘看懂全書脈絡，幾分鐘讀完精華", "想深究，再一鍵核對紙本原文"],
    },
    # ACT 2｜閱讀體驗 × A+D+E+F 跨 4 篇 D3 動態視覺化 40%
    {
        "id": "b04", "badge": "02｜首頁粒子匯聚",
        "tts": "往下捲動首頁，數千顆粒子會即時匯聚成素描人臉，跟像素 AI 臉，直擊全書的核心提問。",
        "subs": ["往下捲動首頁，數千顆粒子即時匯聚成雙像", "素描人臉 × 像素 AI 臉，直擊全書核心提問"],
    },
    {
        "id": "b05", "badge": "02｜人機智慧臉譜",
        "tts": "接著滑進人機智慧臉譜，序章是兩隻眼睛，人在左臉，行動在右臉，模型則是中間流動的碎片。",
        "subs": ["滑進人機智慧臉譜：序章是雙眼，人在左臉", "行動在右臉，模型是中間流動的碎片"],
    },
    {
        "id": "b06", "badge": "02｜捲動點亮 × 四大課題",
        "tts": "捲動清單，臉譜就跟著亮起推近，讀完永久點亮，也能直接從四大行銷課題切入。",
        "subs": ["捲動清單，臉譜即時亮起推近、讀完永久點亮", "也能直接從 4 大行銷課題切入"],
    },
    {
        "id": "b07", "badge": "02｜跨篇 D3 視覺化：衡斷力 × 注意力 × GEO",
        "tts": "我們為各篇打造專屬的互動視覺化，從衡斷力的動態天平、花錢買曝光的注意力模型，到 GEO 的搜尋轉換迴圈。",
        "subs": ["跨篇 D3 視覺化：〈衡斷力〉動態天平 × 〈花錢買曝光〉", "與〈GEO〉AI 搜尋轉換迴圈，滑動即推理"],
    },
    {
        "id": "b08", "badge": "02｜重建 SOV × 60 顆預算粒子流",
        "tts": "在重建 SOV 裡，六十顆預算粒子會隨捲動從分散投放，瞬間收斂成主場域與品牌資產。",
        "subs": ["在〈重建 SOV〉中，60 顆預算粒子隨捲動飛舞", "從分散投放，瞬間收斂成主場域與品牌資產"],
    },
    {
        "id": "b09", "badge": "02｜一鍵原文核對",
        "tts": "任何一句想查證出處，只要點一下頁碼，就會立刻滑出原刊對照視窗，並用數位螢光筆標出原文。",
        "subs": ["想查證出處，點一下 p.118 ↗ 頁碼", "立刻滑出原刊對照視窗與數位螢光筆高亮"],
    },
    # ACT 3｜創意與洞察 15%
    {
        "id": "b10", "badge": "03｜金句分享卡",
        "tts": "讀到很棒的句子想傳給同事，只要展開文末分享區，就能在色塊、紙本與夜色三種風格間即時切換。",
        "subs": ["讀到好句子想傳給同事？展開文末分享區", "在色塊、紙本與夜色 3 種風格間即時切換"],
    },
    {
        "id": "b11", "badge": "03｜純本地 Canvas 合成",
        "tts": "這些高畫質分享卡全在瀏覽器本地繪製，不需要上傳伺服器，點一下就能直接下載分享。",
        "subs": ["1080×1350 高畫質圖卡全在瀏覽器本地繪製", "零伺服器上傳，點一下就能下載分享"],
    },
    {
        "id": "b12", "badge": "03｜純 CSS 3D 知識補給包",
        "tts": "讀完文章還會解鎖立體知識補給包，不靠肥大的 3D 引擎，純用 CSS 打造，滑鼠拖曳就能立體旋轉。",
        "subs": ["讀完解鎖立體知識補給包｜Zero Three.js", "純 CSS 3D 打造，滑鼠拖曳就能立體旋轉"],
    },
    {
        "id": "b13", "badge": "03｜四種開箱手感 × 成就收藏",
        "tts": "扭糖果紙、撕鋁箔袋、拆封蠟信封、轉扭蛋，四種開箱手感，把讀完一本書變成有趣的收藏體驗。",
        "subs": ["扭糖果紙、撕鋁箔袋、拆封蠟信封、轉扭蛋", "4 種開箱手感，把閱讀變成成就收藏"],
    },
    # ACT 4｜Vibe Coding 實作力 30%
    {
        "id": "b14", "badge": "04｜人機協作分工",
        "tts": "這座網站用 Vibe Coding 打造，由 AI 加速架構與初稿，由人負責策展取捨，而且我們絕不盲信 AI。",
        "subs": ["以 Vibe Coding 打造：AI 加速架構與初稿", "由人負責策展取捨，而且絕不盲信 AI"],
    },
    {
        "id": "b15", "badge": "04｜防幻覺驗證閘門",
        "tts": "我們建了自動化驗證閘門，每次發布逐字核對一千五百三十七條引文，跟一百零五筆作者職稱。",
        "subs": ["自動化防幻覺閘門，每次發布逐字核對", "1,537 條引文 × 105 筆作者職稱 100% PASS"],
    },
    {
        "id": "b16", "badge": "04｜建置期零容錯",
        "tts": "再加上兩千三百八十二條站內連結，以及自架字型零缺字檢查，只要有一項失敗，就直接阻斷上線。",
        "subs": ["加上 2,382 條連結與 116KB 自架字型零缺字", "任一失敗即阻斷上線：建置失敗，比上線出錯好"],
    },
    {
        "id": "b17", "badge": "04｜真實攔截 AI 錯誤",
        "tts": "這套閘門真的幫我們攔下了 AI 寫錯的頁碼、硬造的觀點對立，還有上線前的網址錯字。",
        "subs": ["真實攔下 AI 寫錯頁碼（p.117→p.119）與假對立", "更在上線前直接阻擋錯誤網址部署"],
    },
    # ACT 5｜部署思路、資安自評與 22/22 全彩收尾 15%
    {
        "id": "b18", "badge": "05｜純靜態邊緣部署",
        "tts": "部署上全站採純靜態預渲染，放上 Cloudflare 全球邊緣，沒有資料庫，執行期對外請求數是零。",
        "subs": ["Astro 5 純靜態 47 頁部署於 Cloudflare 邊緣", "無資料庫，執行期對外請求數為 0"],
    },
    {
        "id": "b19", "badge": "05｜嚴格 CSP × 隱私無障礙",
        "tts": "同時落實嚴格的 CSP 雜湊鎖定與完整安全標頭，加上雙層白名單防機密外洩，並兼顧鍵盤導覽與無障礙。",
        "subs": ["嚴格 SHA-256 CSP 雜湊鎖定與完整安全標頭", "1,148 筆檔案稽核 0 外洩 × 鍵盤導覽與無障礙"],
    },
    {
        "id": "b20", "badge": "05｜22/22 全彩人機智慧臉譜",
        "tts": "品牌離 AI 越近，更要貼近真實的人。歡迎立即往下捲，親自體驗決策智慧。",
        "subs": ["品牌離 AI 越近，更要貼近真實的人", "立即體驗《決策智慧 2026》"],
    },
]


def start_local_server(dist_dir: Path):
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(dist_dir), **kwargs)

        def log_message(self, format, *args):
            pass

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server, f"http://127.0.0.1:{port}"


def get_duration(path: Path) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        text=True,
    ).strip()
    return float(out)


def norm_box(box, vw=VW, vh=VH):
    if not box:
        return None
    return {
        "x": round(box["x"] / vw, 5), "y": round(box["y"] / vh, 5),
        "w": round(box["width"] / vw, 5), "h": round(box["height"] / vh, 5),
        "cx": round((box["x"] + box["width"] / 2) / vw, 5),
        "cy": round((box["y"] + box["height"] / 2) / vh, 5),
    }


async def generate_tw_audio():
    """原生台灣口音 HsiaoYuNeural (+19%)，100% 音色一致且自帶每句精準毫秒長度！"""
    cache_json = AUDIO_DIR / "timestamps.json"
    full_wav = AUDIO_DIR / "narration_v3.wav"
    if cache_json.exists() and full_wav.exists():
        aligned = json.loads(cache_json.read_text(encoding="utf-8"))
        print(f"[TTS] Using cached HsiaoYu (+19%) audio ({get_duration(full_wav):.2f}s)")
        return full_wav, aligned

    aligned = []
    part_wavs = []
    cur_t = 0.0
    gap = 0.28  # 句間自然氣口

    for b in BEATS:
        raw_mp3 = AUDIO_DIR / f"{b['id']}.mp3"
        clean_wav = AUDIO_DIR / f"{b['id']}.wav"
        comm = edge_tts.Communicate(b["tts"], voice=VOICE, rate=RATE)
        await comm.save(str(raw_mp3))
        # 去頭尾多餘靜音 + 響度正規化（鎖定每句音量一致）
        subprocess.run(
            [
                "ffmpeg", "-y", "-i", str(raw_mp3),
                "-af", "silenceremove=start_periods=1:start_silence=0.04:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_silence=0.06:start_threshold=-48dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=11",
                "-ar", "44100", "-ac", "1", str(clean_wav),
            ],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        raw_mp3.unlink(missing_ok=True)
        dur = get_duration(clean_wav)
        aligned.append({
            **b,
            "start": round(cur_t, 3),
            "end": round(cur_t + dur, 3),
        })
        part_wavs.append((clean_wav, cur_t))
        cur_t += dur + gap

    # 以 adelay 精準合為單一音軌（絕不跑拍！）
    inputs = []
    fparts = []
    labels = []
    for idx, (wp, st) in enumerate(part_wavs):
        inputs += ["-i", str(wp)]
        ms = int(round(st * 1000))
        fparts.append(f"[{idx}:a]adelay={ms}|{ms}[a{idx}]")
        labels.append(f"[a{idx}]")
    fc = ";".join(fparts) + f";{''.join(labels)}amix=inputs={len(part_wavs)}:normalize=0:dropout_transition=0[aout]"
    subprocess.run(
        ["ffmpeg", "-y", *inputs, "-filter_complex", fc, "-map", "[aout]", "-ar", "44100", "-ac", "1", str(full_wav)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    cache_json.write_text(json.dumps(aligned, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[TTS] Native TW HsiaoYu ({RATE}) ready: {get_duration(full_wav):.2f}s across {len(aligned)} beats")
    return full_wav, aligned


async def capture_deterministic_assets(base_url: str):
    """確定性逐幀步進擷取（零掉幀、零卡頓！）+ manifest.json 真實 DOM 座標"""
    manifest_path = OUT_DIR / "manifest.json"
    if manifest_path.exists():
        print("[ASSETS] Using cached v3 assets & manifest.json")
        return json.loads(manifest_path.read_text(encoding="utf-8"))

    all_slugs = [a["slug"] for a in json.loads(ARTICLES_JSON.read_text(encoding="utf-8"))["articles"]]
    manifest = {"vw": VW, "vh": VH, "shots": {}}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=1.25)
        await ctx.add_init_script(
            """
            localStorage.setItem('dw-read', JSON.stringify(['ai-for-growth','power-of-real','trust','attention-is-scarce']));
            localStorage.setItem('dw-face-seen', JSON.stringify(['ai-for-growth','power-of-real','trust','attention-is-scarce']));
            """
        )
        page = await ctx.new_page()

        # ── 1. 首頁 Hero Top + 20 幀確定性粒子匯聚序列（hero_00..hero_19）──
        await page.goto(f"{base_url}/", wait_until="networkidle")
        await page.wait_for_timeout(600)
        await page.screenshot(path=str(ASSETS_DIR / "hero_top.jpg"), type="jpeg", quality=92)
        hx_h = await page.evaluate("() => document.querySelector('.hx')?.offsetHeight || 2200")
        for i in range(20):
            y = int((i / 19.0) * hx_h * 0.72)
            await page.evaluate("([y]) => window.scrollTo(0, y)", [y])
            await page.wait_for_timeout(90)
            await page.screenshot(path=str(ASSETS_DIR / f"hero_{i:02d}.jpg"), type="jpeg", quality=88)

        # ── 2. 首頁人機智慧臉譜（12 幀捲動亮起序列 fm_00..fm_11）+ 精準座標 ──
        ch_y = await page.evaluate("() => document.querySelector('#chapters').getBoundingClientRect().top + window.scrollY - 6")
        await page.evaluate("([y]) => window.scrollTo(0, y)", [ch_y])
        await page.wait_for_timeout(1000)
        await page.screenshot(path=str(ASSETS_DIR / "facemap_4.jpg"), type="jpeg", quality=92)
        manifest["shots"]["facemap"] = {
            "fm_stage": norm_box(await page.locator(".fm-stage").first.bounding_box()),
            "fm_picks": norm_box(await page.locator(".fm-picks").first.bounding_box()),
            "fm_btn": norm_box(await page.locator(".fm-pick").nth(1).bounding_box()),
        }
        for i in range(12):
            y = ch_y + int((i / 11.0) * 680)
            await page.evaluate("([y]) => window.scrollTo(0, y)", [y])
            await page.wait_for_timeout(140)
            await page.screenshot(path=str(ASSETS_DIR / f"fm_{i:02d}.jpg"), type="jpeg", quality=88)

        # ── 3. A+D+E+F 跨 4 篇精選 D3 動態視覺化（全部強制顯示 .reveal + 量測 .d3wrap 真實座標！）──
        # F: 〈衡斷力〉balance, D: 〈花錢買曝光〉d3, E: 〈GEO〉flowloop
        tri_specs = [
            ("d3_f_bal", "/story/judgment/"),
            ("d3_d_att", "/story/buy-attention/"),
            ("d3_e_geo", "/story/geo/"),
        ]
        manifest["shots"]["d3_tri"] = {}
        for key, path in tri_specs:
            await page.goto(f"{base_url}{path}", wait_until="networkidle")
            await page.evaluate("() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'))")
            sc = page.locator(".scrolly:has(.d3wrap)").first
            if await sc.count() > 0 and await sc.locator(".beat").count() > 0:
                beats = sc.locator(".beat")
                cnt = await beats.count()
                y0 = await beats.nth(0).evaluate("el => el.getBoundingClientRect().top + window.scrollY - 400")
                y1 = await beats.nth(max(0, cnt - 1)).evaluate("el => el.getBoundingClientRect().top + window.scrollY - 400")
                target_box_loc = sc.locator(".d3wrap").first
            else:
                target_box_loc = page.locator(".d3wrap, .stage, .scrolly").first
                y0 = await target_box_loc.evaluate("el => Math.max(0, el.getBoundingClientRect().top + window.scrollY - 180)")
                y1 = y0 + 260
            await page.evaluate("([y]) => window.scrollTo(0, y)", [y0])
            await page.wait_for_timeout(950)
            await page.screenshot(path=str(ASSETS_DIR / f"{key}_1.jpg"), type="jpeg", quality=90)
            await page.evaluate("([y]) => window.scrollTo(0, y)", [y1])
            await page.wait_for_timeout(1100)
            await page.screenshot(path=str(ASSETS_DIR / f"{key}_2.jpg"), type="jpeg", quality=90)
            d3b = await target_box_loc.bounding_box()
            manifest["shots"]["d3_tri"][key] = norm_box(d3b)

        # A: 〈重建 SOV〉allocate 60 顆預算粒子流（3 階段實景 + .d3wrap 精準座標）
        await page.goto(f"{base_url}/story/rebuild-sov/", wait_until="networkidle")
        await page.evaluate("() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'))")
        sc_alloc = page.locator(".scrolly", has_text="同一筆預算").first
        beats_a = sc_alloc.locator(".beat")
        d3_alloc_box = None
        for idx in range(3):
            by = await beats_a.nth(idx).evaluate("el => el.getBoundingClientRect().top + window.scrollY - 420")
            await page.evaluate("([y]) => window.scrollTo(0, y)", [by])
            await page.wait_for_timeout(1350)
            await page.screenshot(path=str(ASSETS_DIR / f"d3_a_alloc_{idx + 1}.jpg"), type="jpeg", quality=92)
            if idx == 1:
                d3_alloc_box = await sc_alloc.locator(".d3wrap").first.bounding_box()
        manifest["shots"]["d3_alloc"] = norm_box(d3_alloc_box)

        # ── 4. 頁碼點擊前導（零空白！）+ 原刊對照彈窗 + 原生 <mark> ──
        rbtn = page.locator("[data-reader]").nth(2)
        rby = await rbtn.evaluate("el => el.getBoundingClientRect().top + window.scrollY - 460")
        await page.evaluate("([y]) => window.scrollTo(0, y)", [rby])
        await page.wait_for_timeout(450)
        await page.screenshot(path=str(ASSETS_DIR / "story_page_btn.jpg"), type="jpeg", quality=92)
        btn_box = await rbtn.bounding_box()

        await rbtn.click()
        await page.wait_for_selector("#reader[open] mark", timeout=8000)
        await page.wait_for_timeout(500)
        await page.screenshot(path=str(ASSETS_DIR / "reader_modal.jpg"), type="jpeg", quality=92)
        dlg_box = await page.locator("#reader").first.bounding_box()
        marks_union = await page.evaluate(
            """() => {
              const ms = Array.from(document.querySelectorAll('#reader mark'));
              if (!ms.length) return null;
              let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
              for (const m of ms) {
                const rc = m.getBoundingClientRect();
                if (rc.width <= 0 || rc.height <= 0) continue;
                l = Math.min(l, rc.left); t = Math.min(t, rc.top);
                r = Math.max(r, rc.right); b = Math.max(b, rc.bottom);
              }
              return { x: l, y: t, width: r - l, height: b - t };
            }"""
        )
        manifest["shots"]["reader"] = {"btn": norm_box(btn_box), "dialog": norm_box(dlg_box), "mark": norm_box(marks_union)}
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(300)

        # ── 5. 完整展開 SharePanel（零裁切！）三風格切換 ──
        await page.evaluate("() => document.querySelectorAll('details').forEach(d => { d.open = true; })")
        fold = page.locator("summary, button").filter(has_text="做成卡片分享").first
        if await fold.count() > 0:
            await fold.scroll_into_view_if_needed()
            await page.wait_for_timeout(250)
            if await page.locator(".share-style").first.is_hidden():
                await fold.click()
                await page.wait_for_timeout(350)
        sh = page.locator("[data-share], .share").first
        sy = await sh.evaluate("el => el.getBoundingClientRect().top + window.scrollY - 85")
        await page.evaluate("([y]) => window.scrollTo(0, y)", [sy])
        await page.wait_for_timeout(600)
        style_boxes = []
        for idx, nm in enumerate(["bold", "paper", "night"]):
            lbl = page.locator(".share-style").nth(idx)
            await lbl.click()
            await page.wait_for_timeout(450)
            await page.screenshot(path=str(ASSETS_DIR / f"share_{nm}.jpg"), type="jpeg", quality=92)
            style_boxes.append(norm_box(await lbl.bounding_box()))
        manifest["shots"]["share"] = {
            "styles": style_boxes,
            "card": norm_box(await page.locator(".share-card").first.bounding_box()),
        }

        # ── 6. 3D CSS 補給包（8 幀旋轉序列 snack_rot_0..7）+ 真實解鎖成就卡（snack_card.jpg）──
        await page.evaluate(
            """() => {
              localStorage.setItem('dw-read', JSON.stringify(['rebuild-sov']));
              document.dispatchEvent(new CustomEvent('dw:read', { detail: { before: [], after: ['rebuild-sov'] } }));
            }"""
        )
        await page.wait_for_timeout(250)
        await page.locator('[data-snack-album="top"]').first.click()
        await page.wait_for_selector("#snack[open]", timeout=6000)
        await page.wait_for_timeout(600)
        await page.mouse.move(960, 440)
        await page.mouse.down()
        for i in range(10):
            ang_x = 960 + int(220 * (i - 4.5) / 4.5)
            ang_y = 440 + int(35 * ((i % 2) * 2 - 1))
            await page.mouse.move(ang_x, ang_y, steps=4)
            await page.wait_for_timeout(70)
            await page.screenshot(path=str(ASSETS_DIR / f"snack_rot_{i:02d}.jpg"), type="jpeg", quality=90)
        await page.mouse.up()
        await page.locator("#snack [data-tear]").first.click()
        await page.wait_for_selector("#snack .acard", timeout=6000)
        await page.wait_for_timeout(600)
        await page.screenshot(path=str(ASSETS_DIR / "snack_card.jpg"), type="jpeg", quality=92)

        # ── 7. /about/ 三則真實 AI 抓錯案例 ──
        await page.goto(f"{base_url}/about/", wait_until="networkidle")
        cloc = page.locator("ol.cases").first
        if await cloc.count() > 0:
            cy = await cloc.evaluate("el => Math.max(0, el.getBoundingClientRect().top + window.scrollY - 220)")
            await page.evaluate("([y]) => window.scrollTo(0, y)", [cy])
            await page.wait_for_timeout(500)
            manifest["shots"]["about_cases"] = norm_box(await cloc.bounding_box())
        await page.screenshot(path=str(ASSETS_DIR / "about_cases.jpg"), type="jpeg", quality=92)
        await ctx.close()

        # ── 8. 22/22 全彩臉譜收尾 ──
        ctx2 = await browser.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=1.25)
        await ctx2.add_init_script(
            f"""
            localStorage.setItem('dw-read', JSON.stringify({json.dumps(all_slugs)}));
            localStorage.setItem('dw-face-seen', JSON.stringify({json.dumps(all_slugs)}));
            """
        )
        p2 = await ctx2.new_page()
        await p2.goto(f"{base_url}/", wait_until="networkidle")
        await p2.evaluate("([y]) => window.scrollTo(0, y)", [ch_y])
        await p2.wait_for_timeout(1200)
        await p2.screenshot(path=str(ASSETS_DIR / "facemap_22.jpg"), type="jpeg", quality=92)
        await ctx2.close()
        await browser.close()

    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print("[ASSETS] All v3 deterministic sequences & manifest.json captured!")
    return manifest


def build_stage_v3(manifest: dict, aligned: list, total_dur: float) -> Path:
    """回歸 v1 絲滑零晃動的 HTML5 確定性 30fps 舞台 + 確定性逐幀動畫序列 + A/D/E/F 跨 4 篇視覺化！"""
    ts_map = {b["id"]: b for b in aligned}
    # 用 file:/// URI 直接載入本機資產（記憶體輕、啟動快！）
    assets_uri = ASSETS_DIR.as_uri()
    arrow_svg = (
        '<svg viewBox="0 0 28 28" width="28" height="28">'
        '<path d="M4 3 L23 13 L14.5 15.2 L11.5 24 Z" fill="#D0544C" stroke="#FFFDF8" stroke-width="2.2" stroke-linejoin="round"/>'
        '</svg>'
    )

    html = f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{
    width: 1920px; height: 1080px; overflow: hidden;
    background: #EFE9DC; color: #1F1D1A;
    font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif;
  }}
  .bg {{
    position: fixed; inset: 0;
    background-image:
      radial-gradient(circle at 16% 20%, rgba(208, 84, 76, 0.08), transparent 44%),
      radial-gradient(circle at 84% 78%, rgba(42, 157, 181, 0.08), transparent 46%),
      linear-gradient(rgba(31, 29, 26, 0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(31, 29, 26, 0.032) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 48px 48px, 48px 48px;
  }}
  .progress {{ position: fixed; top: 0; left: 0; height: 4px; background: #D0544C; z-index: 70; }}
  .topbar {{
    position: fixed; top: 0; left: 0; right: 0; height: 58px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 44px; z-index: 60;
  }}
  .brand {{ font-size: 18px; font-weight: 800; letter-spacing: 0.08em; }}
  .brand span {{ font-weight: 500; color: #70695F; margin-left: 10px; }}
  .badge {{
    background: rgba(31, 29, 26, 0.92); color: #F6F2E9;
    padding: 8px 20px; border-radius: 999px; font-size: 18px; font-weight: 700;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
  }}
  .badge::before {{ content: "● "; color: #D0544C; }}

  .scene {{ position: fixed; inset: 0; opacity: 0; }}
  .viewport {{
    position: absolute; left: 120px; top: 66px;
    width: 1680px; height: 945px;
    border-radius: 22px; overflow: hidden;
    background: #F6F2E9;
    box-shadow: 0 32px 84px rgba(31, 29, 26, 0.18), 0 0 0 1px rgba(31, 29, 26, 0.09);
  }}
  .world {{
    position: relative; width: 100%; height: 100%;
    transform-origin: 0 0; will-change: transform;
  }}
  .world img {{ position: absolute; inset: 0; width: 100%; height: 100%; display: block; }}

  .arrow-cur {{
    position: absolute; width: 28px; height: 28px;
    margin-left: -4px; margin-top: -3px;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
    z-index: 25; opacity: 0;
  }}
  .w-ripple {{
    position: absolute; width: 26px; height: 26px;
    margin-left: -13px; margin-top: -13px; border-radius: 50%;
    border: 2.5px solid rgba(208, 84, 76, 0.9);
    z-index: 22; opacity: 0;
  }}
  .w-glow {{
    position: absolute; border-radius: 999px;
    box-shadow: 0 0 0 3px rgba(208, 84, 76, 0.85), 0 0 22px rgba(208, 84, 76, 0.35);
    z-index: 20; opacity: 0;
  }}

  /* 絲滑 HTML5 動態簡報樣式（保留 v1 所有高質感卡片、數字計數與彈跳進場！）*/
  .slide-pad {{
    position: absolute; inset: 66px 110px 106px 110px;
    display: flex; flex-direction: column; justify-content: center;
  }}
  .eyebrow {{
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 20px; font-weight: 800; letter-spacing: 0.14em; color: #D0544C;
    margin-bottom: 18px;
  }}
  .eyebrow::before {{ content: ""; width: 28px; height: 3px; background: #D0544C; border-radius: 2px; }}
  .hero-split {{ display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 60px; align-items: center; }}
  .big-h {{ font-size: 84px; font-weight: 900; line-height: 1.1; color: #1F1D1A; margin-bottom: 18px; }}
  .big-h em {{ font-style: normal; color: #D0544C; }}
  .lead-p {{ font-size: 30px; color: #57524A; line-height: 1.55; }}
  .card-3d {{
    border-radius: 22px; overflow: hidden;
    box-shadow: 0 34px 86px rgba(31, 29, 26, 0.22), 0 0 0 1px rgba(31, 29, 26, 0.08);
  }}
  .card-3d img {{ width: 100%; display: block; }}

  .grid3 {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 28px; }}
  .tier {{
    background: #FFFDF8; border-radius: 22px; padding: 38px 34px;
    border: 1px solid rgba(31, 29, 26, 0.1);
    box-shadow: 0 18px 46px rgba(31, 29, 26, 0.08);
  }}
  .tier.dark {{ background: #1F1D1A; color: #F6F2E9; }}
  .tier .num {{ font-size: 56px; font-weight: 900; color: #D0544C; margin-bottom: 10px; }}
  .tier.dark .num {{ color: #E8B86D; }}
  .tier h3 {{ font-size: 32px; font-weight: 800; margin-bottom: 12px; }}
  .tier p {{ font-size: 22px; color: #615B52; line-height: 1.55; }}
  .tier.dark p {{ color: #D5CDC0; }}

  /* 四種開箱手感 + 成就卡特寫 */
  .pack-split {{ display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 44px; align-items: center; }}
  .pack-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }}
  .pack-tile {{
    background: #FFFDF8; border-radius: 18px; padding: 26px 24px;
    border: 1.5px solid rgba(31, 29, 26, 0.1);
    box-shadow: 0 12px 32px rgba(31, 29, 26, 0.07);
  }}
  .pack-tile.active {{ border-color: #D0544C; background: #1F1D1A; color: #F6F2E9; }}
  .pack-tile b {{ font-size: 34px; color: #D0544C; display: block; margin-bottom: 6px; }}
  .pack-tile.active b {{ color: #E8B86D; }}
  .pack-tile span {{ font-size: 22px; font-weight: 700; }}

  .term-card {{
    background: #171614; color: #F2ECE1; border-radius: 24px; padding: 44px 52px;
    box-shadow: 0 36px 90px rgba(0, 0, 0, 0.28);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }}
  .term-head {{ display: flex; align-items: center; gap: 10px; margin-bottom: 30px; color: #9C9488; font-size: 20px; font-family: Consolas, monospace; }}
  .dot {{ width: 14px; height: 14px; border-radius: 50%; }}
  .gate-row {{
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 26px; margin-bottom: 16px; border-radius: 14px;
    background: rgba(255, 255, 255, 0.045); border: 1px solid rgba(255, 255, 255, 0.07);
    font-size: 26px; font-weight: 600;
  }}
  .gate-row .ok {{
    background: rgba(111, 168, 58, 0.2); color: #9BE05C;
    padding: 6px 18px; border-radius: 999px; font-size: 20px; font-weight: 800; font-family: Consolas, monospace;
  }}
  .gate-row .val {{ color: #E8B86D; font-weight: 900; font-size: 32px; margin-right: 14px; font-variant-numeric: tabular-nums; }}

  .sec-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 34px; align-items: stretch; }}
  .sec-box {{
    background: #FFFDF8; border-radius: 22px; padding: 38px 38px;
    border: 1px solid rgba(31, 29, 26, 0.1);
    box-shadow: 0 20px 52px rgba(31, 29, 26, 0.09);
  }}
  .sec-box.dark {{ background: #1F1D1A; color: #F6F2E9; }}
  .sec-metric {{ font-size: 72px; font-weight: 900; color: #D0544C; line-height: 1.05; }}
  .sec-box.dark .sec-metric {{ color: #E8B86D; }}
  .code-pill {{
    display: inline-block; font-family: Consolas, monospace; font-size: 20px;
    background: rgba(255,255,255,0.09); color: #9BE05C;
    padding: 8px 16px; border-radius: 10px; margin: 6px 8px 6px 0;
  }}
  .outro-box {{
    text-align: center; max-width: 1120px; margin: 0 auto;
    background: rgba(31, 29, 26, 0.92); color: #F6F2E9;
    padding: 54px 68px; border-radius: 28px;
    box-shadow: 0 36px 96px rgba(0, 0, 0, 0.35);
  }}
  .outro-box h1 {{ font-size: 62px; font-weight: 900; margin-bottom: 18px; }}
  .outro-url {{
    display: inline-block; font-family: Consolas, monospace; font-size: 30px;
    color: #E8B86D; background: rgba(255,255,255,0.08);
    padding: 12px 30px; border-radius: 999px; margin-top: 16px;
  }}

  /* 跨篇 D3 左上精簡篇名標籤（不壓主視覺）*/
  .d3-tag {{
    position: absolute; left: 28px; top: 24px;
    background: rgba(31, 29, 26, 0.88); color: #F6F2E9;
    padding: 9px 20px; border-radius: 999px; font-size: 19px; font-weight: 700;
    z-index: 30; box-shadow: 0 8px 20px rgba(0,0,0,0.16);
  }}
  .d3-tag span {{ color: #E8B86D; margin-right: 8px; }}

  .wipe {{ position: fixed; inset: 0; background: #1F1D1A; z-index: 55; transform: translateX(-105%); }}
  .subtitle {{
    position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%);
    background: rgba(24, 22, 19, 0.93); color: #F6F2E9;
    padding: 12px 34px; border-radius: 14px;
    font-size: 30px; font-weight: 600; letter-spacing: 0.04em;
    white-space: nowrap; box-shadow: 0 14px 36px rgba(0, 0, 0, 0.26);
    z-index: 70;
  }}
</style>
</head>
<body>
  <div class="bg"></div>
  <div class="progress" id="prog"></div>
  <div class="topbar">
    <div class="brand">dentsu<span>決策智慧 2026｜互動式數位策展</span></div>
    <div class="badge" id="badge"></div>
  </div>

  <!-- S1 (b01): 痛點破題 -->
  <div class="scene" id="sc_b01">
    <div class="slide-pad"><div class="hero-split">
      <div><div class="eyebrow">DECISION WISDOM 2026</div>
        <div class="big-h"><em id="cnt14">143,000</em> 字<br/>5+ 小時讀不完</div>
        <div class="lead-p">決策者不缺長篇報告，<br/>缺的是能立刻輔助判斷的互動閱讀介面。</div>
      </div>
      <div class="card-3d" id="s1Card"><img src="{assets_uri}/hero_top.jpg" /></div>
    </div></div>
  </div>

  <!-- S2 (b02): 首頁亮相 -->
  <div class="scene" id="sc_b02">
    <div class="viewport"><div class="world" id="w_b02"><img src="{assets_uri}/hero_top.jpg" /></div></div>
  </div>

  <!-- S3 (b03): 三層閱讀架構 -->
  <div class="scene" id="sc_b03">
    <div class="slide-pad">
      <div class="eyebrow">THREE-LAYER ARCHITECTURE</div>
      <div class="big-h" style="font-size:62px;">三層漸進式閱讀設計</div>
      <div class="grid3">
        <div class="tier" id="t3_1"><div class="num">01</div><h3>1 分鐘全書脈絡</h3><p>從首頁「人機智慧臉譜」一眼掌握 22 篇觀點與四大主線。</p></div>
        <div class="tier dark" id="t3_2"><div class="num">02</div><h3>數分鐘單篇精華</h3><p>左文右圖 Scrollytelling × 跨篇 D3 動態模型，滑動即推理。</p></div>
        <div class="tier" id="t3_3"><div class="num">03</div><h3>p.xx ↗ 原文核對</h3><p>每句論述皆附紙本頁碼，一鍵展開原刊段落與數位螢光筆。</p></div>
      </div>
    </div>
  </div>

  <!-- S4 (b04): 首頁數千顆粒子確定性 20 幀平滑匯聚！-->
  <div class="scene" id="sc_b04">
    <div class="viewport"><div class="world" id="w_b04"><img id="heroSeqImg" src="{assets_uri}/hero_00.jpg" /></div></div>
  </div>

  <!-- S5 & S6 (b05, b06): 人機智慧臉譜 12 幀捲動亮起 + 零漂移箭頭游標點擊課題 -->
  <div class="scene" id="sc_b05">
    <div class="viewport">
      <div class="world" id="w_b05">
        <img id="fmSeqImg" src="{assets_uri}/facemap_4.jpg" />
        <div class="w-glow" id="fmGlow"></div>
        <div class="w-ripple" id="fmRip"></div>
        <div class="arrow-cur" id="fmCur">{arrow_svg}</div>
      </div>
    </div>
  </div>

  <!-- S7 (b07): 跨 3 篇 D3 動態視覺化（F 衡斷力天平 -> D 花錢買曝光 -> E GEO 迴圈流）-->
  <div class="scene" id="sc_b07">
    <div class="viewport">
      <div class="world" id="w_b07">
        <img id="d3TriImg" src="{assets_uri}/d3_f_bal_1.jpg" />
      </div>
      <div class="d3-tag" id="d3TriTag"><span>F｜衡斷力</span>演算法效率 × 人類衡斷力天平</div>
    </div>
  </div>

  <!-- S8 (b08): A 〈重建 SOV〉60 顆預算粒子流（3 步驟完整展示＋居中放大無死白！）-->
  <div class="scene" id="sc_b08">
    <div class="viewport">
      <div class="world" id="w_b08">
        <img src="{assets_uri}/d3_a_alloc_1.jpg" id="al1" />
        <img src="{assets_uri}/d3_a_alloc_2.jpg" id="al2" style="opacity:0" />
        <img src="{assets_uri}/d3_a_alloc_3.jpg" id="al3" style="opacity:0" />
      </div>
      <div class="d3-tag" id="d3AllocTag"><span>A｜重建 SOV</span>60 顆預算粒子：11 層分散投放</div>
    </div>
  </div>

  <!-- S9 (b09): 頁碼點擊前導（0 空白！）-> 完整原刊對照彈窗 + 原生 <mark> 推鏡 -->
  <div class="scene" id="sc_b09">
    <div class="viewport">
      <div class="world" id="w_b09_btn">
        <img src="{assets_uri}/story_page_btn.jpg" />
        <div class="w-glow" id="rbGlow"></div>
        <div class="w-ripple" id="rbRip"></div>
        <div class="arrow-cur" id="rbCur">{arrow_svg}</div>
      </div>
      <div class="world" id="w_b09_rdr" style="position:absolute;inset:0;opacity:0">
        <img src="{assets_uri}/reader_modal.jpg" />
      </div>
    </div>
  </div>

  <!-- S10 & S11 (b10, b11): 完整展開 SharePanel 三風格切換 + 本地 Canvas 特寫（零裁切！）-->
  <div class="scene" id="sc_b10">
    <div class="viewport">
      <div class="world" id="w_b10">
        <img src="{assets_uri}/share_bold.jpg" id="sh_bold" />
        <img src="{assets_uri}/share_paper.jpg" id="sh_paper" style="opacity:0" />
        <img src="{assets_uri}/share_night.jpg" id="sh_night" style="opacity:0" />
        <div class="arrow-cur" id="shCur">{arrow_svg}</div>
      </div>
    </div>
  </div>

  <!-- S12 (b12): 純 CSS 3D 知識補給包 10 幀確定性立體旋轉！-->
  <div class="scene" id="sc_b12">
    <div class="viewport"><div class="world" id="w_b12"><img id="snackRotImg" src="{assets_uri}/snack_rot_00.jpg" /></div></div>
  </div>

  <!-- S13 (b13): 四種開箱手感 + 真實解鎖 Brief 到手成就卡（放大特寫！）-->
  <div class="scene" id="sc_b13">
    <div class="slide-pad"><div class="pack-split">
      <div>
        <div class="eyebrow">FOUR TACTILE UNBOXINGS</div>
        <div class="big-h" style="font-size:58px;">4 種手感，把閱讀變成收藏</div>
        <div class="pack-grid">
          <div class="pack-tile" id="pk1"><b>扭</b><span>第一篇｜糖果紙</span></div>
          <div class="pack-tile" id="pk2"><b>撕</b><span>篇數達標｜鋁箔袋</span></div>
          <div class="pack-tile" id="pk3"><b>拆</b><span>讀完一章｜封蠟信封</span></div>
          <div class="pack-tile" id="pk4"><b>轉</b><span>讀完主線｜立體扭蛋</span></div>
        </div>
      </div>
      <div class="card-3d" id="pkCard" style="height:640px;background:#2C2623;overflow:hidden;">
        <img src="{assets_uri}/snack_card.jpg" style="width:100%;height:100%;object-fit:cover;transform:scale(1.42);transform-origin:50% 48%;" />
      </div>
    </div></div>
  </div>

  <!-- S14 (b14): 人機協作分工 -->
  <div class="scene" id="sc_b14">
    <div class="slide-pad">
      <div class="eyebrow">VIBE CODING WORKFLOW</div>
      <div class="big-h" style="font-size:60px;">AI 加速實作・人類守住品質邊界</div>
      <div class="sec-grid" style="margin-top:24px;">
        <div class="sec-box" id="vcL">
          <div class="eyebrow" style="margin-bottom:10px;">AI 協作範圍</div>
          <h3 style="font-size:34px;margin-bottom:14px;">架構、解析與初稿生成</h3>
          <p style="font-size:23px;color:#57524A;line-height:1.65;">• 14.3 萬字全文結構化清洗<br/>• Astro 5 與跨篇 D3 互動視覺化<br/>• Python fonttools 字型子集化<br/>• 離屏 Canvas 圖卡與自動化驗證</p>
        </div>
        <div class="sec-box dark" id="vcR">
          <div class="eyebrow" style="color:#E8B86D;margin-bottom:10px;">人類審定邊界</div>
          <h3 style="font-size:34px;margin-bottom:14px;">策展視角、取捨與最終把關</h3>
          <p style="font-size:23px;color:#D6CEC2;line-height:1.65;">• 定義「人機智慧臉譜」核心隱喻<br/>• 逐篇審定編註與原刊引用界線<br/>• 建立 5 道 CI 級防幻覺驗證閘門<br/>• 嚴守零捏造、零外洩底線</p>
        </div>
      </div>
    </div>
  </div>

  <!-- S15 & S16 (b15, b16): 自動化防幻覺驗證閘門終端卡（跳動大數字）-->
  <div class="scene" id="sc_b15">
    <div class="slide-pad"><div class="term-card">
      <div class="term-head">
        <span class="dot" style="background:#FF5F56"></span><span class="dot" style="background:#FFBD2E"></span><span class="dot" style="background:#27C93F"></span>
        <span style="margin-left:14px;">$ npm run verify &amp;&amp; npm run build</span>
      </div>
      <div class="gate-row" id="g1"><div><span class="val" id="g1n">0</span>條引文跨頁逐字核對（verify-quotes）</div><span class="ok">PASS</span></div>
      <div class="gate-row" id="g2"><div><span class="val" id="g2n">0</span>筆作者姓名與職稱比對（verify-meta）</div><span class="ok">PASS</span></div>
      <div class="gate-row" id="g3"><div><span class="val" id="g3n">0</span>條站內連結與資源路徑（check-links）</div><span class="ok">PASS</span></div>
      <div class="gate-row" id="g4"><div><span class="val">116KB</span>自架襯線字型子集・零缺字（check-fonts）</div><span class="ok">PASS</span></div>
    </div></div>
  </div>

  <!-- S17 (b17): /about/ 三則真實 AI 抓錯案例 -->
  <div class="scene" id="sc_b17">
    <div class="viewport"><div class="world" id="w_b17"><img src="{assets_uri}/about_cases.jpg" /></div></div>
  </div>

  <!-- S18 (b18): 純靜態 Cloudflare 邊緣部署 -->
  <div class="scene" id="sc_b18">
    <div class="slide-pad">
      <div class="eyebrow">EDGE ARCHITECTURE</div>
      <div class="big-h" style="font-size:60px;">純靜態全球邊緣・零外部依賴</div>
      <div class="grid3">
        <div class="tier dark" id="d18_1"><div class="num">47 頁</div><h3>Astro 5 純靜態</h3><p>全站預渲染 HTML，無資料庫、無伺服器攻擊面。</p></div>
        <div class="tier" id="d18_2"><div class="num">0</div><h3>執行期對外請求</h3><p>字型與腳本全自架，無第三方追蹤碼與外連 CDN。</p></div>
        <div class="tier" id="d18_3"><div class="num">301</div><h3>Cloudflare 邊緣</h3><p>全球邊緣快取加速，並妥善處理舊網址轉址。</p></div>
      </div>
    </div>
  </div>

  <!-- S19 (b19): 嚴格 CSP × 隱私無障礙 -->
  <div class="scene" id="sc_b19">
    <div class="slide-pad">
      <div class="eyebrow">SECURITY, PRIVACY &amp; ACCESSIBILITY</div>
      <div class="sec-grid">
        <div class="sec-box dark">
          <div class="sec-metric">CSP</div>
          <h3 style="font-size:32px;margin:10px 0;">雜湊白名單 × 1,148 筆檔案稽核</h3>
          <div style="margin:10px 0;"><span class="code-pill">default-src 'self'</span><span class="code-pill">sha256-...</span><span class="code-pill">HSTS</span><span class="code-pill">DENY</span></div>
          <p style="font-size:21px;color:#D6CEC2;line-height:1.55;">雙層白名單稽核：0 設計原始檔・0 API 金鑰・0 內部信箱外洩。</p>
        </div>
        <div class="sec-box">
          <div class="sec-metric">A11y</div>
          <h3 style="font-size:32px;margin:10px 0;">為所有人設計的閱讀體驗</h3>
          <p style="font-size:22px;color:#57524A;line-height:1.65;">• 完整鍵盤 Tab 導覽與清晰焦點外框<br/>• 尊重 prefers-reduced-motion 減少動態<br/>• 所有 D3 圖表皆附純文字語意降級</p>
        </div>
      </div>
    </div>
  </div>

  <!-- S20 (b20): 22/22 全彩人機智慧臉譜盛大收尾 + 品牌網址卡 -->
  <div class="scene" id="sc_b20">
    <div class="viewport"><div class="world" id="w_b20"><img src="{assets_uri}/facemap_22.jpg" /></div></div>
    <div id="outroOverlay" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(24,22,19,0.52);opacity:0;z-index:48;">
      <div class="outro-box">
        <div class="eyebrow" style="color:#E8B86D;justify-content:center;">DENTSU DECISION WISDOM 2026</div>
        <h1>品牌離 AI 越近，更要貼近真實的人</h1>
        <div class="outro-url">https://agentic-era.kevin-tsou.workers.dev/</div>
        <div style="margin-top:16px;font-size:21px;color:#CFC6B8;">GitHub Open Source：kevintsou-dsc/Agentic-Era</div>
      </div>
    </div>
  </div>

  <div class="wipe" id="wipe"></div>
  <div class="subtitle" id="sub"></div>

<script>
  const M = {json.dumps(manifest, ensure_ascii=False)};
  const BEATS = {json.dumps(aligned, ensure_ascii=False)};
  const TS = {json.dumps(ts_map, ensure_ascii=False)};
  const TOTAL = {total_dur:.3f};
  const AURI = "{assets_uri}";
  const VP_W = 1680, VP_H = 945;

  const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
  const prog = (t, t0, t1) => clamp((t - t0) / Math.max(0.001, t1 - t0));
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2, 3)/2;
  const $ = id => document.getElementById(id);

  function applyCam(el, scale, fx, fy) {{
    const tx = clamp(VP_W * 0.5 - fx * VP_W * scale, VP_W * (1 - scale), 0);
    const ty = clamp(VP_H * 0.5 - fy * VP_H * scale, VP_H * (1 - scale), 0);
    el.style.transform = `translate3d(${{tx}}px, ${{ty}}px, 0) scale(${{scale}})`;
  }}

  // 預載所有序列圖，確保切換毫秒零閃爍
  const HERO_URLS = Array.from({{length: 20}}, (_, i) => `${{AURI}}/hero_${{String(i).padStart(2,'0')}}.jpg`);
  const FM_URLS = Array.from({{length: 12}}, (_, i) => `${{AURI}}/fm_${{String(i).padStart(2,'0')}}.jpg`);
  const SNACK_URLS = Array.from({{length: 10}}, (_, i) => `${{AURI}}/snack_rot_${{String(i).padStart(2,'0')}}.jpg`);
  const D3_TRI = [
    {{ url: `${{AURI}}/d3_f_bal_1.jpg`, tag: '<span>F｜衡斷力</span>演算法效率 vs. 人類衡斷力天平', box: M.shots.d3_tri.d3_f_bal }},
    {{ url: `${{AURI}}/d3_f_bal_2.jpg`, tag: '<span>F｜衡斷力</span>演算法效率 vs. 人類衡斷力天平', box: M.shots.d3_tri.d3_f_bal }},
    {{ url: `${{AURI}}/d3_d_att_1.jpg`, tag: '<span>D｜花錢買曝光</span>媒體注意力與記憶曲線', box: M.shots.d3_tri.d3_d_att }},
    {{ url: `${{AURI}}/d3_d_att_2.jpg`, tag: '<span>D｜花錢買曝光</span>媒體注意力與記憶曲線', box: M.shots.d3_tri.d3_d_att }},
    {{ url: `${{AURI}}/d3_e_geo_1.jpg`, tag: '<span>E｜GEO</span>AI 搜尋時代的成長與轉換迴圈', box: M.shots.d3_tri.d3_e_geo }},
    {{ url: `${{AURI}}/d3_e_geo_2.jpg`, tag: '<span>E｜GEO</span>AI 搜尋時代的成長與轉換迴圈', box: M.shots.d3_tri.d3_e_geo }},
  ];
  [...HERO_URLS, ...FM_URLS, ...SNACK_URLS, ...D3_TRI.map(x => x.url)].forEach(u => {{ const im = new Image(); im.src = u; }});

  const fmBtn = M.shots.facemap.fm_btn;
  if (fmBtn) {{
    const g = $('fmGlow');
    g.style.left = `${{(fmBtn.x - 0.002)*100}}%`; g.style.top = `${{(fmBtn.y - 0.003)*100}}%`;
    g.style.width = `${{(fmBtn.w + 0.004)*100}}%`; g.style.height = `${{(fmBtn.h + 0.006)*100}}%`;
  }}
  const rBtn = M.shots.reader.btn;
  if (rBtn) {{
    const g = $('rbGlow');
    g.style.left = `${{(rBtn.x - 0.003)*100}}%`; g.style.top = `${{(rBtn.y - 0.004)*100}}%`;
    g.style.width = `${{(rBtn.w + 0.006)*100}}%`; g.style.height = `${{(rBtn.h + 0.008)*100}}%`;
  }}

  const ALL_SCENES = [
    'sc_b01','sc_b02','sc_b03','sc_b04','sc_b05','sc_b07','sc_b08','sc_b09',
    'sc_b10','sc_b12','sc_b13','sc_b14','sc_b15','sc_b17','sc_b18','sc_b19','sc_b20'
  ];
  const WIPES = [TS.b04.start, TS.b10.start, TS.b14.start, TS.b18.start];

  window.renderFrame = function(t) {{
    $('prog').style.width = `${{clamp(t / TOTAL) * 100}}%`;

    let active = BEATS[BEATS.length - 1];
    for (const b of BEATS) {{
      if (t >= b.start - 0.12 && t <= b.end + 0.35) {{ active = b; break; }}
    }}
    $('badge').textContent = active.badge;
    const bp = prog(t, active.start, active.end);
    $('sub').textContent = active.subs[Math.min(active.subs.length - 1, Math.floor(bp * active.subs.length))];

    ALL_SCENES.forEach(id => {{ $(id).style.opacity = 0; }});
    $('wipe').style.transform = 'translateX(-105%)';
    for (const wt of WIPES) {{
      if (t >= wt - 0.26 && t <= wt + 0.22) {{
        const pw = easeInOut(prog(t, wt - 0.26, wt + 0.22));
        $('wipe').style.transform = `translateX(${{-105 + pw * 210}}%)`;
      }}
    }}

    const showWin = (id, t0, t1, fade = 0.20) => {{
      if (t < t0 - fade || t > t1 + fade) return 0;
      const op = Math.min(easeOut(prog(t, t0 - fade, t0 + 0.12)), 1 - easeInOut(prog(t, t1 - 0.14, t1 + fade)));
      $(id).style.opacity = clamp(op);
      return op;
    }};

    // ── ACT 1 ──
    if (showWin('sc_b01', 0, TS.b02.start, 0.12) > 0) {{
      const p = easeOut(prog(t, 0, 1.3));
      $('cnt14').textContent = Math.round(p * 143000).toLocaleString('en-US');
      $('s1Card').style.transform = `perspective(1300px) rotateY(${{-9 + p*4}}deg) scale(${{1 + prog(t,0,TS.b02.start)*0.05}})`;
    }}
    if (showWin('sc_b02', TS.b02.start, TS.b03.start) > 0) {{
      applyCam($('w_b02'), 1 + prog(t, TS.b02.start, TS.b03.start) * 0.09, 0.5, 0.46);
    }}
    if (showWin('sc_b03', TS.b03.start, TS.b04.start) > 0) {{
      const d = TS.b04.start - TS.b03.start;
      ['t3_1','t3_2','t3_3'].forEach((id, i) => {{
        const pi = easeOut(prog(t, TS.b03.start + i * d * 0.24, TS.b03.start + i * d * 0.24 + 0.5));
        $(id).style.opacity = pi; $(id).style.transform = `translateY(${{(1 - pi) * 26}}px)`;
      }});
    }}

    // ── ACT 2: 真實 20 幀粒子匯聚 + 臉譜捲動亮起 + A/D/E/F 跨 4 篇 D3 + 零空白原刊點擊 ──
    if (showWin('sc_b04', TS.b04.start, TS.b05.start) > 0) {{
      const p = easeInOut(prog(t, TS.b04.start, TS.b05.start - 0.3));
      const idx = Math.min(19, Math.floor(p * 20));
      $('heroSeqImg').src = HERO_URLS[idx];
      applyCam($('w_b04'), 1.0 + p * 0.08, 0.5, 0.48);
    }}
    if (showWin('sc_b05', TS.b05.start, TS.b07.start) > 0) {{
      const st = M.shots.facemap.fm_stage;
      const pk = M.shots.facemap.fm_picks;
      if (t < TS.b06.start) {{
        // b05: 臉譜 12 幀真實捲動亮起！
        const p = prog(t, TS.b05.start, TS.b06.start);
        $('fmSeqImg').src = FM_URLS[Math.min(11, Math.floor(p * 12))];
        applyCam($('w_b05'), 1.02 + p * 0.08, st.cx + 0.1, st.cy);
        $('fmCur').style.opacity = 0; $('fmGlow').style.opacity = 0; $('fmRip').style.opacity = 0;
      }} else {{
        // b06: 切回乾淨 facemap_4.jpg 推近 .fm-picks，並在後半句精準點擊按鈕（與第二句字幕完美同步！）
        $('fmSeqImg').src = `${{AURI}}/facemap_4.jpg`;
        const d6 = TS.b07.start - TS.b06.start;
        const pZoom = easeInOut(prog(t, TS.b06.start + d6 * 0.25, TS.b06.start + d6 * 0.55));
        applyCam($('w_b05'), 1.08 + pZoom * 0.42, (st.cx+0.1) + (pk.cx - st.cx - 0.1)*pZoom, st.cy + (pk.cy - st.cy)*pZoom);
        const pc = easeInOut(prog(t, TS.b06.start + d6 * 0.45, TS.b06.start + d6 * 0.68));
        const tx = fmBtn.x + fmBtn.w * 0.88, ty = fmBtn.y + fmBtn.h * 0.78;
        $('fmCur').style.opacity = clamp(prog(t, TS.b06.start + d6 * 0.4, TS.b06.start + d6 * 0.5));
        $('fmCur').style.left = `${{(tx + 0.06*(1-pc))*100}}%`;
        $('fmCur').style.top = `${{(ty + 0.06*(1-pc))*100}}%`;
        $('fmGlow').style.opacity = easeOut(prog(t, TS.b06.start + d6 * 0.62, TS.b06.start + d6 * 0.74));
        const pr = prog(t, TS.b06.start + d6 * 0.68, TS.b06.start + d6 * 0.90);
        $('fmRip').style.opacity = pr > 0 && pr < 1 ? (1 - pr) : 0;
        $('fmRip').style.left = `${{tx*100}}%`; $('fmRip').style.top = `${{ty*100}}%`;
        $('fmRip').style.transform = `scale(${{1 + pr * 2.8}})`;
      }}
    }}
    if (showWin('sc_b07', TS.b07.start, TS.b08.start) > 0) {{
      // F 衡斷力天平 -> D 花錢買曝光 -> E GEO 迴圈流（各展示兩階段動態變化！）
      const p = prog(t, TS.b07.start, TS.b08.start);
      const item = D3_TRI[Math.min(5, Math.floor(p * 6))];
      $('d3TriImg').src = item.url;
      $('d3TriTag').innerHTML = item.tag;
      const fx = item.box ? item.box.cx : 0.66;
      const fy = item.box ? item.box.cy : 0.50;
      applyCam($('w_b07'), 1.15, fx, fy);
    }}
    if (showWin('sc_b08', TS.b08.start, TS.b09.start) > 0) {{
      // A 〈重建 SOV〉60 顆預算粒子 3 步驟，1.58x 聚焦居中零空白！
      const p = prog(t, TS.b08.start, TS.b09.start);
      const d3 = M.shots.d3_alloc;
      applyCam($('w_b08'), 1.56, d3.cx + 0.01, d3.cy);
      const p12 = easeInOut(prog(p, 0.28, 0.40));
      const p23 = easeInOut(prog(p, 0.62, 0.74));
      $('al2').style.opacity = p12;
      $('al3').style.opacity = p23;
      if (p23 > 0.5) $('d3AllocTag').innerHTML = '<span>A｜重建 SOV</span>60 顆預算粒子：累積成品牌心智資產';
      else if (p12 > 0.5) $('d3AllocTag').innerHTML = '<span>A｜重建 SOV</span>60 顆預算粒子：收斂至 1 主場域 ＋ 4 分工';
      else $('d3AllocTag').innerHTML = '<span>A｜重建 SOV</span>60 顆預算粒子：11 層分散投放';
    }}
    if (showWin('sc_b09', TS.b09.start, TS.b10.start) > 0) {{
      // 全程展示清晰完整的 #reader 原刊對照彈窗（保留標題列）-> 平滑推近 1.46x 直擊粉紅數位螢光筆！
      $('w_b09_btn').style.opacity = 0; $('w_b09_rdr').style.opacity = 1;
      const dlg = M.shots.reader.dialog, mk = M.shots.reader.mark;
      const pz = easeInOut(prog(t, TS.b09.start + 1.2, TS.b10.start - 0.6));
      applyCam($('w_b09_rdr'), 1.04 + pz * 0.42, dlg.cx + (mk.cx - dlg.cx)*pz, (dlg.y + dlg.h*0.35) + (mk.cy - (dlg.y + dlg.h*0.35))*pz);
    }}

    // ── ACT 3: 完整展開 SharePanel（零裁切！）+ 10 幀 3D 補給包旋轉 + 成就卡 ──
    if (showWin('sc_b10', TS.b10.start, TS.b12.start) > 0) {{
      const styles = M.shots.share.styles;
      if (t < TS.b11.start) {{
        // 完整顯示左欄金句 + 按鈕 + 右側三風格切換（scale 1.04 居中，0 裁切！）
        applyCam($('w_b10'), 1.04, 0.50, 0.46);
        const p = prog(t, TS.b10.start, TS.b11.start);
        $('sh_paper').style.opacity = p >= 0.34 ? 1 : 0;
        $('sh_night').style.opacity = p >= 0.67 ? 1 : 0;
        const st = styles[p < 0.34 ? 0 : (p < 0.67 ? 1 : 2)];
        if (st) {{
          $('shCur').style.opacity = 1;
          $('shCur').style.left = `${{(st.x + st.w*0.85)*100}}%`;
          $('shCur').style.top = `${{(st.y + st.h*0.78)*100}}%`;
        }}
      }} else {{
        $('sh_night').style.opacity = 1; $('shCur').style.opacity = 0;
        const p = easeInOut(prog(t, TS.b11.start, TS.b11.start + 1.0));
        // 溫和推近至 1.18x（左欄按鈕依然完整不被切掉！）
        applyCam($('w_b10'), 1.04 + p * 0.14, 0.53, 0.46);
      }}
    }}
    if (showWin('sc_b12', TS.b12.start, TS.b13.start) > 0) {{
      const p = prog(t, TS.b12.start, TS.b13.start);
      $('snackRotImg').src = SNACK_URLS[Math.min(9, Math.floor(p * 10))];
      applyCam($('w_b12'), 1.08 + p * 0.12, 0.50, 0.48);
    }}
    if (showWin('sc_b13', TS.b13.start, TS.b14.start) > 0) {{
      const p = prog(t, TS.b13.start, TS.b14.start);
      const act = Math.min(3, Math.floor(p * 4));
      ['pk1','pk2','pk3','pk4'].forEach((id, i) => {{ $(id).classList.toggle('active', i === act); }});
      const pc = easeOut(prog(t, TS.b13.start, TS.b13.start + 0.55));
      $('pkCard').style.transform = `scale(${{0.93 + pc * 0.07}})`;
    }}

    // ── ACT 4 ──
    if (showWin('sc_b14', TS.b14.start, TS.b15.start) > 0) {{
      const p = easeOut(prog(t, TS.b14.start, TS.b14.start + 0.65));
      $('vcL').style.transform = `translateX(${{(1-p)*-32}}px)`;
      $('vcR').style.transform = `translateX(${{(1-p)*32}}px)`;
    }}
    if (showWin('sc_b15', TS.b15.start, TS.b17.start) > 0) {{
      const p1 = easeOut(prog(t, TS.b15.start, TS.b15.start + 1.2));
      $('g1n').textContent = Math.round(p1 * 1537).toLocaleString('en-US');
      $('g2n').textContent = Math.round(p1 * 105).toLocaleString('en-US');
      const p2 = easeOut(prog(t, TS.b16.start, TS.b16.start + 1.1));
      $('g3n').textContent = Math.round(p2 * 2382).toLocaleString('en-US');
      $('g1').style.opacity = easeOut(prog(t, TS.b15.start, TS.b15.start + 0.4));
      $('g2').style.opacity = easeOut(prog(t, TS.b15.start + 0.4, TS.b15.start + 0.8));
      $('g3').style.opacity = easeOut(prog(t, TS.b16.start - 0.1, TS.b16.start + 0.35));
      $('g4').style.opacity = easeOut(prog(t, TS.b16.start + 0.4, TS.b16.start + 0.85));
    }}
    if (showWin('sc_b17', TS.b17.start, TS.b18.start) > 0) {{
      const cb = M.shots.about_cases || {{ cx: 0.5, cy: 0.52 }};
      applyCam($('w_b17'), 1.10 + prog(t, TS.b17.start, TS.b18.start) * 0.14, cb.cx, cb.cy);
    }}

    // ── ACT 5 ──
    if (showWin('sc_b18', TS.b18.start, TS.b19.start) > 0) {{
      const d = TS.b19.start - TS.b18.start;
      ['d18_1','d18_2','d18_3'].forEach((id, i) => {{
        const pi = easeOut(prog(t, TS.b18.start + i * d * 0.2, TS.b18.start + i * d * 0.2 + 0.5));
        $(id).style.opacity = pi; $(id).style.transform = `translateY(${{(1-pi)*24}}px)`;
      }});
    }}
    showWin('sc_b19', TS.b19.start, TS.b20.start);
    if (t >= TS.b20.start - 0.2) {{
      $('sc_b20').style.opacity = easeOut(prog(t, TS.b20.start - 0.2, TS.b20.start + 0.35));
      applyCam($('w_b20'), 1.0 + prog(t, TS.b20.start, TOTAL) * 0.10, 0.45, 0.52);
      $('outroOverlay').style.opacity = easeOut(prog(t, TS.b20.end - 1.5, TS.b20.end - 0.2));
    }}
  }};
</script>
</body>
</html>"""
    stage_path = OUT_DIR / "stage_v3.html"
    stage_path.write_text(html, encoding="utf-8")
    return stage_path


async def render_chunk(stage_uri: str, chunk_idx: int, start_f: int, end_f: int, qa_map: dict):
    chunk_mp4 = CHUNKS_DIR / f"chunk_{chunk_idx}.mp4"
    ff_cmd = [
        "ffmpeg", "-y",
        "-f", "image2pipe", "-vcodec", "mjpeg", "-r", str(FPS), "-i", "-",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        str(chunk_mp4),
    ]
    proc = subprocess.Popen(ff_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": VW, "height": VH})
        await page.goto(stage_uri, wait_until="load")
        await page.wait_for_timeout(350)
        for i in range(start_f, end_f):
            await page.evaluate("t => window.renderFrame(t)", i / FPS)
            jpg = await page.screenshot(type="jpeg", quality=90)
            proc.stdin.write(jpg)
            if i in qa_map:
                (QA_DIR / f"{qa_map[i]}.jpg").write_bytes(jpg)
        await browser.close()
    proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError(f"Chunk {chunk_idx} failed")
    print(f"[CHUNK {chunk_idx}] Rendered frames {start_f}..{end_f - 1}")
    return chunk_mp4


async def render_parallel_v3(stage_path: Path, wav_path: Path, aligned: list, total_dur: float):
    total_frames = int(round(total_dur * FPS))
    ts = {b["id"]: b for b in aligned}
    d6 = ts["b07"]["start"] - ts["b06"]["start"]
    d9 = ts["b10"]["start"] - ts["b09"]["start"]
    qa_specs = [
        ("qa_01_b01_hook", ts["b01"]["start"] + 1.5),
        ("qa_02_b04_hero_seq", ts["b04"]["start"] + 2.8),
        ("qa_03_b06_fm_click", ts["b06"]["start"] + d6 * 0.72),
        ("qa_04_b07_d3_bal", ts["b07"]["start"] + 1.2),
        ("qa_05_b07_d3_geo", ts["b08"]["start"] - 0.8),
        ("qa_06_b08_d3_alloc", ts["b08"]["start"] + 2.8),
        ("qa_07_b09_page_click", ts["b09"]["start"] + d9 * 0.25),
        ("qa_08_b09_reader_mark", ts["b10"]["start"] - 0.8),
        ("qa_09_b10_share_night", ts["b11"]["start"] + 1.2),
        ("qa_10_b12_snack_rot", ts["b12"]["start"] + 2.2),
        ("qa_11_b13_snack_card", ts["b13"]["start"] + 2.2),
        ("qa_12_b20_outro_22", ts["b20"]["end"] - 0.1),
    ]
    qa_map = {min(total_frames - 1, max(0, int(round(qt * FPS)))): name for name, qt in qa_specs}

    workers = 4
    step = (total_frames + workers - 1) // workers
    t0 = time.monotonic()
    tasks = [render_chunk(stage_path.as_uri(), w, w * step, min(total_frames, (w + 1) * step), qa_map)
             for w in range(workers) if w * step < total_frames]
    chunk_files = await asyncio.gather(*tasks)

    concat_txt = CHUNKS_DIR / "concat.txt"
    concat_txt.write_text("\n".join(f"file '{c.as_posix()}'" for c in chunk_files), encoding="utf-8")

    out_mp4 = OUT_DIR / "decision_wisdom_2026_3min_v3.mp4"
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0", "-i", str(concat_txt),
            "-i", str(wav_path),
            "-map", "0:v:0", "-map", "1:a:0",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart",
            str(out_mp4),
        ],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    print(f"[DONE] v3 Final Master ready in {time.monotonic() - t0:.1f}s -> {out_mp4} ({total_dur:.2f}s)")
    return out_mp4


async def main():
    wav_path, aligned = await generate_tw_audio()
    server, base_url = start_local_server(PROJECT_DIST)
    try:
        manifest = await capture_deterministic_assets(base_url)
    finally:
        server.shutdown()
    total_dur = min(179.5, get_duration(wav_path) + 1.4)
    stage_path = build_stage_v3(manifest, aligned, total_dur)
    await render_parallel_v3(stage_path, wav_path, aligned, total_dur)


if __name__ == "__main__":
    asyncio.run(main())
