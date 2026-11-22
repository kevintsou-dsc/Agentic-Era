# 3 分鐘參賽影片：Video as Code 生成架構（v4）

影片完全由程式產生：Playwright 擷取網站畫面 → HTML 舞台逐幀渲染 → edge-tts 台灣女聲 → 程式合成配樂 → FFmpeg 封裝。沒有使用剪輯或錄影軟體。

- 企劃與多代理審查紀錄：[docs/video/remake-plan.md](video/remake-plan.md)（懷疑者、約束守護者、用戶倡導者、仲裁者依序審查，APPROVED）
- v3 審查（創意、評審事實查核、後製技術）：[docs/video/review-2026-11-23.md](video/review-2026-11-23.md)
- 成片不進 repo（檔案過大）：本機產出位置為 `scripts/video/build/decision_wisdom_2026_3min_v5.mp4`（v4 定稿另存於 `docs/video/`），另附同名 `.srt`

## 一、敘事

評審就是讀者：沿著網站三層閱讀深度走一趟（① 全書 → ② 一篇 → ③ 原文），用「AI 會一本正經地寫錯 → 程式抓得到」當轉折，最後回到開場提問。

- 片長 151.4 秒，旁白 519 字。
- 字幕只從旁白刪減產生，不另外換詞。
- 字幕數字一律讀自實跑驗證的結果（`build/facts.json`）。

## 二、管線

```
scripts/video/
  requirements.txt     固定版本：edge-tts 7.3.1、playwright 1.58.0、pypinyin、segno
  v4/script.py         旁白與字幕唯一來源（BEATS、念法字典、時長預算）
  v4/facts.py          實跑 verify-quotes／verify-meta／check-links → build/facts.json
  v4/fail_capture.txt  真實 FAIL 輸出（暫存副本把 a13 一條引文改成 p.117 後執行 verify-quotes）
  v4/audio.py          稿件檢查、多音字必聽清單、逐句合成（雜湊快取＋重試）、PCM 精準疊放、程式合成配樂、SRT
  v4/capture.py        本機 dist/ 靜態伺服器擷取素材（關閉 smooth scroll、等待 loader 消失，確保決定性）
  v4/stage/            舞台 HTML／JS；renderFrame(t) 是純函式
  v4/render.py         4 個 Chromium 平行逐幀渲染 → x264（BT.709 limited）→ 無損接合
  v4/build.py          主流程：audio → capture → render → 混音（sidechain 閃避、兩段式 loudnorm）→ 交付規格自動驗證
```

重現步驟（專案根目錄）：

```
npm run build
cd scripts/video
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python v4\facts.py
.venv\Scripts\python v4\build.py all
```

## 三、品質閘門（build 時自動執行，不通過就停止）

| 閘門 | 規則 |
|---|---|
| 稿件 | 旁白 ≤ 520 字；每行字幕必須能由旁白原句刪減得到；facts 欄位齊全 |
| 時長 | 總長 ≤ 175 秒（競賽上限 180 秒） |
| 交付規格 | 1920×1080、30fps、yuv420p tv BT.709、48k 立體聲、−16±1 LUFS、峰值 ≤ −1 dBFS、≤ 100MB |
| 字幕覆蓋 | 每 0.5 秒取樣，偵測燒錄字幕是否出現（rc2：207/207） |

## 四、旁白：自然、不念錯、降低 AI 感

- edge-tts 不支援自訂 SSML，所以自然度靠文稿、切句與停頓：
  - 以句為單位合成，句間停頓由程式控制（同段 0.3 秒、段落 0.6–1.4 秒、留白最長 2.6 秒）。
  - 不逐句做 loudnorm，混音後整片一次兩段式 loudnorm，保留句與句的自然起伏。
- 念法字典只作用在送給 TTS 的字串（例如篇名符號、「2026」念「二零二六」），字幕不受影響。
- 多音字必聽清單：pypinyin 依上下文列出高風險字所在的句子，剪成 `build/must_listen.mp3` 供人工試聽。Whisper 會把念錯的音自動「修正」回正確的字，所以不靠它來抓多音字。
- 聲音預設 `zh-TW-HsiaoYuNeural +19%`；試聽比較檔放在 `docs/video/voice-ab/`（不進 repo）。

## 五、版本演進

| 版本 | 做法 | 問題 |
|---|---|---|
| v1–v2 | Playwright 即時錄影 | 掉幀、卡頓、字幕被 dialog 遮住 |
| v3 | HTML 舞台逐幀＋截圖 | 功能清單式敘事；有 3 個數字過時、2 個 AI 攔截案例歸因錯誤；`-shortest` 吃掉片尾網址；未標 BT.709；不能從專案內腳本單獨重現 |
| v3b | v3 剪掉錯誤段落、補回片尾、改 BT.709 | 保底版 |
| v4 | 重寫敘事、音訊與舞台；事實由程式讀取；交付規格自動驗證 | 盲評 rc1 73 分 → rc2 78 分 → 再修疊壓 |
| **v5** | 混合版：首頁、臉譜和 5 段圖表改用真實動態序列（見第七節） | 聲音與「捲」的念法待定 |

## 六、對照實驗：另一種核心做法

`v4/alt_realtime.py`：不截靜態圖，改用 Playwright `page.clock` 接管 requestAnimationFrame 和計時器，每一幀依序「捲動一點、時間前進 1/30 秒、截圖」，直接錄下真實網站的 30fps 畫面。同一段旁白（n03–n08a，58.6 秒）的左右對照輸出到 `build/compare_v4_vs_alt.mp4`。

| | A｜v4 舞台推鏡（採用） | B｜真實網站逐幀擬錄 |
|---|---|---|
| 動態真實度 | 截圖序列加交叉淡化，粒子和 D3 是逐格的 | **最高**：粒子、D3 轉場都是網站本身的連續動畫 |
| 可讀性 | **高**：推近到文字 ≥24px，重點有標註 | 低：1:1 全頁，內文約 14px，評審看不清 |
| 敘事控制 | **高**：畫面隨旁白切換，可以跨篇剪接、加 FAIL→PASS 終端機 | 受網站版面限制，部分時段停在文字段落或空白處 |
| 決定性 | 高 | 高（虛擬時鐘），但 CSS transition 不受時鐘控制 |
| 渲染時間 | 約 2.5 分鐘（4 平行，全片） | 約 4 分鐘（單執行緒，58 秒片段） |

結論：v4 採 A。B 適合放在首頁和臉譜這類「動態本身就是賣點」的段落，所以接著做了 v5 混合版。

## 七、v5 混合版：B 的真實動態當素材，套 A 的推鏡與標註

- `v4/capture_live.py`：用 `page.clock` 依旁白時間軸逐幀錄真實網站，存成 30fps JPEG 序列（`build/assets/live/<片段>/`）。
  - 首頁、首頁捲動、臉譜捲動：原本是截圖序列加交叉淡化，改成連續的真實畫面。
  - 圖表蒙太奇（n07）：從 14 篇有 D3 圖表的文章挑出 5 段轉場最明顯的，依序是〈別買曝光了〉AIDMA → AICAS、〈重建 SOV〉四種競爭、〈AI 普及下的演算法世代〉天平、〈贏在 AI 時代的隱形戰場〉冰山、〈別買曝光了〉末日循環。旁白多一句「天平會傾斜，冰山會浮現，循環會轉起來」，畫面和這句同步。
  - 選材對照表：`v4/recon_charts.py` 會輸出每篇每張圖在各 beat 的截圖，存在 `build/recon/`。
  - `.d3wrap` 是 sticky：錄製從圖表已經黏住的位置開始，畫框才不會中途位移。
- 舞台：`live()` 用單一 `<img>` 依時間換幀；`render.py` 截圖前呼叫 `window.settle()` 等解碼完成，維持決定性。
- 片長 156.5 秒，旁白 535 字（字數上限從 520 調到 540）。
