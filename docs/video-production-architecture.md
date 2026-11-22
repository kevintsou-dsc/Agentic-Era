# 🎬 《決策智慧 2026》3 分鐘參賽影片「Video as Code」完整架構與演進紀錄

本文件完整記錄參賽介紹影片的**使用者核心需求**、**歷次版本試作與駁回修正紀錄（v1 → final_v3）**，以及最終定稿 **v3 確定性雙軌影音引擎** 的架構、邏輯與產出規格。

---

## 一、 使用者核心需求與驗收底線

1. **零外部剪輯／錄影軟體**：完全以 Python + Playwright + HTML5 + FFmpeg 原生程式碼自動生成 1080p 30fps MP4，方便版本控制與單段快速重算。
2. **節奏明快、抓重點**：嚴格壓在 **3 分鐘內（最終 175.98 秒）**，涵蓋競賽四大評分面向（閱讀體驗與內容策展 40%、Vibe Coding 實作力 30%、部署與資安自評 15%、創意與洞察 15%）。
3. **台灣繁體中文自然口音與一致音色**：拒絕非本土腔或句間漂移，最終指定採用 **`zh-TW-HsiaoYuNeural`（溫暖自然台灣女聲）搭配 `+19%` 俐落語速**，兼具 `HsiaoYu` 的自然咬字與 `HsiaoChen` 的明快節奏。
4. **絲滑無晃動、無卡頓、零漂移對齊**：保留順暢的 HTML5 簡報動畫（大字跳動、卡片進場、無縫轉場），畫面與游標／標註必須 1:1 數學對齊，不出現空白幀或邊緣裁字。
5. **跨多篇文章精華視覺化**：不可只拍單篇〈重建 SOV〉，必須展示全站跨篇策展亮點（選定 **A + D + E + F**：〈重建 SOV〉60 顆預算粒子 + 〈花錢買曝光〉媒體注意力 + 〈GEO〉搜尋轉換迴圈 + 〈衡斷力〉動態天平）。

---

## 二、 歷次迭代與駁回修正紀錄（Why We Evolved）

| 版本 | 核心做法 | 被駁回／發現的問題（Root Cause） | 後續架構對策 |
| :--- | :--- | :--- | :--- |
| **v1 / v2 原型** | Playwright 即時錄屏 + `edge-tts` 分句 | 錄影開頭含 4.8s 載入空白；固定像素捲動未對準 `#chapters`；開啟 `<dialog>` 時頁面字幕被 Top Layer 模糊；單句過長。 | 依首幀時間戳裁切 `0:00`；改用 FFmpeg 原生 ASS 頂層字幕；改讀真實 DOM 座標。 |
| **v3 動態版** | Gemini 2.5 Flash TTS (`Orus`) 單軌 + 瀏覽器 `body scale` / FFmpeg `zoompan` | `body transform` 破壞網站 `position: sticky`；`record_video_dir` 在無頭模式會掉幀產生變動幀率，導致 `zoompan` 與口白錯拍。 | 停止對網頁即時錄影疊用 `zoompan`；改走純數學確定性渲染。 |
| **v4 動態簡報** | HTML5 `stage.html` 30fps 逐幀渲染 + 高解析截圖切片 | **重點框與畫面嚴重錯位**：容器套用 `object-fit: cover` 先裁切比例，且只放大圖片未同步變換外層紅框；誤把靜態 `List.astro` 當成 D3 圖表；紅框疊壓原刊原生 `<mark>` 反降質感。 | 取消 `object-fit: cover` 與粗紅框；建立 `manifest.json` 真實 DOM 座標 + 鎖定 `16:9` `.world` 同空間變換。 |
| **final_v1 (114.4s)** | `manifest.json` + HTML5 30fps 確定性引擎 + Gemini `Orus` | 1. 盲評抓出 `b08` 頁碼點擊幀空白（`.reveal` 未喚醒）與分享卡左緣裁切；<br>2. 僅集中單篇且純靜態圖切換，缺乏真實滾動／粒子動態。 | 修正 `.reveal` 強制顯影與推鏡中心；嘗試補入真實互動錄影與跨篇案例。 |
| **final_v2 (160.8s)** | Playwright `record_video_dir` 錄 11 段實景 + FFmpeg `zoompan` 簡報 | **使用者駁回（體感退步）**：<br>1. `record_video_dir` 純 CPU 壓縮碰到 Canvas/D3 嚴重卡頓掉幀，粒子動畫未完整呈現；<br>2. `zoompan` 造成 1px 取捨晃動，且失去原本絲滑的 HTML5 簡報文字動畫；<br>3. `Orus` 長篇中文偶有斷詞與非台灣腔感；<br>4. 盲評亦抓出分享卡 `<details>` 未先展開。 | **全面重構為 `final_v3`**：徹底捨棄 `record_video_dir` 與 `zoompan`，回歸 HTML5 確定性 30fps 引擎＋確定性逐幀步進序列，並換用原生台灣語料 `HsiaoYu (+19%)`。 |

---

## 三、 最終定稿架構：`final_v3` 確定性雙軌引擎

核心腳本：[build_final_v3.py](file:///C:/Users/ktsou01/.gemini/antigravity/brain/e0732130-4f12-4ce8-a217-fe181dc235a1/scratch/demo_video/build_final_v3.py)（含分段熱修腳本 [patch_v3_chunk1.py](file:///C:/Users/ktsou01/.gemini/antigravity/brain/e0732130-4f12-4ce8-a217-fe181dc235a1/scratch/demo_video/patch_v3_chunk1.py)）

### 1. 音訊與雙軌字幕層（`generate_tw_audio`）
- **模型與參數**：`zh-TW-HsiaoYuNeural`、`RATE = "+19%"`。
- **前處理與一致性鎖定**：逐 Beat 合成後以 FFmpeg 切除前後過長靜音並執行 `loudnorm=I=-16:TP=-1.5:LRA=11`，再以 `adelay` 依固定 `0.28s` 氣口精準串接為單一 `44.1kHz` 音軌，寫入毫秒級 `timestamps.json`（20 句合計 **174.58s**，成片含結尾定格 **175.98s**）。
- **雙軌文本分離（`tts` vs `subs`）**：
  - `tts`：保留台灣口語斷詞與國字數字（如「一千五百三十七條」），確保念讀流暢不誤讀。
  - `subs`：螢幕顯示統一用阿拉伯數字短句（每 Beat 拆為 2 句、約 3 秒一換，如 `1,537 條引文 × 105 筆作者職稱 100% PASS`），與 UI 數據完全一致。

### 2. 確定性視覺素材與座標清單層（`capture_deterministic_assets`）
啟動本機 `dist/` 靜態 HTTP 伺服器（零網路延遲、無 CORS/CSP 干擾）後，以 `device_scale_factor=1.25` 確定性步進擷取：
- **確定性序列動畫（零掉幀取代即時錄屏）**：
  - `hero_00..19.jpg`（20 幀）：步進捲動首頁 `.hx` 捕捉數千顆粒子即時匯聚成左素描人臉 × 右像素 AI 臉。
  - `fm_00..11.jpg`（12 幀）：捲動 `#chapters` 捕捉人機智慧臉譜筆觸亮起。
  - `snack_rot_00..09.jpg`（10 幀）：以 `mouse.move` 步進拖曳純 CSS 3D 知識補給包旋轉各角度。
- **跨 4 篇實戰精華（A + D + E + F）**：
  - **F 〈衡斷力〉**（`/story/judgment/`）：`balance` 演算法 vs. 衡斷力動態天平（起始/展開 2 階）。
  - **D 〈花錢買曝光〉**（`/story/buy-attention/`）：媒體注意力與記憶曲線（2 階）。
  - **E 〈GEO〉**（`/story/geo/`）：AI 搜尋時代成長轉換迴圈（2 階）。
  - **A 〈重建 SOV〉**（`/story/rebuild-sov/`）：`allocate` 60 顆預算粒子流（11 層分散 → 1 主場域＋4 分工 → 累積品牌資產，3 階段）。
- **真實互動狀態與 `manifest.json`**：
  - 原刊彈窗 `#reader` 保留完整標題列並記錄 `#reader mark` 聯合邊界框。
  - 強制展開分享面板 `<details>` 擷取「色塊 / 紙本 / 夜色」3 風格切換與按鈕座標。
  - 真實點擊 `[data-tear]` 解鎖並擷取「No.03/13 提案成形」成就卡；預置 `dw-read` 全部 22 篇擷取 `facemap_22.jpg` 全彩結局。

### 3. Co-Transformed HTML5 電影舞台與 4 核並行渲染（`build_stage_v3` + `render_parallel_v3`）
- **0px 偏移鏡頭數學**：所有實景畫面放置於嚴格鎖定 `16:9`（`1680×945`）的 `.world` 容器內，與 `.arrow-cur` 精緻箭頭游標（尖端停於按鈕右下 `0.86w, 0.78h` 絕不遮字）及擴散光環共同執行 `translate3d(tx, ty, 0) scale(scale)`，數學上保證零漂移。
- **HTML5 原生簡報動效**：保留大字數字跳動（`143,000` / `1,537` / `105` / `2,382`）、三欄階梯卡片、終端機閘門卡、Cloudflare/CSP 資安卡、與 4 種開箱手感矩陣高亮。
- **高效分段合成與 QA 閘門**：將 5,279 幀拆為 4 個 Chunk 並行由 Playwright 逐幀串流給 FFmpeg（CRF 18 H.264 + 192k AAC），並同步輸出 12 張關鍵時刻圖至 `qa_frames/` 視覺複核通過（修淨 `b09` 頁碼前導誤拍與 `GEO` 置中）。

---

## 四、 最終交付產物位置

- **專案內正式影片**：[docs/video/decision_wisdom_2026_3min_v3.mp4](file:///c:/Users/ktsou01/Antigravity-Ecosystem/projects/決策智慧vibecoding比賽/docs/video/decision_wisdom_2026_3min_v3.mp4)（1920×1080、30fps、175.98 秒、67.15 MB，符合 ≤ 180s 競賽紅線）
- **專案內生成主程式**：[scripts/video/build_presentation_video.py](file:///c:/Users/ktsou01/Antigravity-Ecosystem/projects/決策智慧vibecoding比賽/scripts/video/build_presentation_video.py)（可直接重現生成）
- **建置暫存與工作區產物**：[decision_wisdom_2026_3min_v3.mp4](file:///C:/Users/ktsou01/.gemini/antigravity/brain/e0732130-4f12-4ce8-a217-fe181dc235a1/scratch/demo_video/final_v3/decision_wisdom_2026_3min_v3.mp4)
- **QA 抽查影格**：`C:\Users\ktsou01\.gemini\antigravity\brain\e0732130-4f12-4ce8-a217-fe181dc235a1\scratch\demo_video\final_v3\qa_frames\`
