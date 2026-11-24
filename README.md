# 《決策智慧 2026》閱讀網站｜Agentic Era Digital Reader

《決策智慧》10 週年 Vibe Coding 競賽參賽作品。將電通行銷傳播集團《決策智慧 2026：Agentic 時代，重塑品牌與人的真實距離》（全書 22 篇、約 14.3 萬字、閱讀時間逾 5 小時）轉譯為零框架、高可讀、完全可查證的數位策展網站。

- **線上正式站**：https://agentic-era.kevin-tsou.workers.dev/
- **設計與自評文件**：[PRD.md](docs/PRD.md) ｜ [製作歷程](docs/process-log.md) ｜ [部署與資安自評](docs/security-self-assessment.md)
- **3 分鐘參賽影片（Video as Code）**：成片另行繳交（檔案不進 repo）｜ [影片生成架構](docs/video-production-architecture.md) ｜ [重製企劃與多代理審查](docs/video/remake-plan.md)

> **交件截止後（2026-11-24）的唯一修正說明**：為求資訊透明，以下僅為交件截止後所做的相容性與文件補充（詳見 [製作歷程](docs/process-log.md#交件後的唯一調整2026-11-24)），全站 22 篇文章內容、策展架構與核心功能均維持交件時原樣：
> 1. 補齊舊版 Safari（16.2 以前）不支援 `color-mix()` 的 `@supports not` 備用顏色，並將圖表說明框改為不透明深色實底。
> 2. 針對 Safari（WebKit）跨 `<svg>` 參照 `#hand` 手繪濾鏡（`feDisplacementMap`）的渲染異常，於 WebKit 環境自動停用該濾鏡（Chrome／Edge／Firefox 維持手繪筆觸）。
> 3. 修復分享卡片首次展開時因等待網路字型或舊版 Safari 缺少 `ctx.roundRect` 所導致的預覽空白（改為零等待即時出圖＋字型就緒自動無縫升級）。
> 4. 於本 README 增補「評審 3 分鐘快速體驗導覽」，方便評審優先體驗代表性篇目與互動彩蛋。

---

## 評審 3 分鐘快速體驗導覽（推薦優先閱讀）

全站 22 篇均依原刊論證邏輯「一文一策」重製視覺化。若評審時間有限，推薦優先體驗以下 **6 篇代表作**與 **4 項全站巧思**：

| 推薦序 | 篇目（章節） | 直達連結 | 最具代表性的設計與互動亮點 |
|---:|---|---|---|
| **1** | **〈People Model〉**（Model｜旗艦篇） | [/story/people-model/](https://agentic-era.kevin-tsou.workers.dev/story/people-model/) | CCS 八大構面九宮格、9,221 點驗證散佈圖（編註點破 `r = 0.89` 不等於誤差率）、Lisa／Cindy 信任門檻動畫、Multi-Agent 分工圖，以及 **5 座可點擊預測的「情境—方法—模擬」互動實驗室**。 |
| **2** | **〈重建 SOV〉**（Model｜D3 密集代表） | [/story/rebuild-sov/](https://agentic-era.kevin-tsou.workers.dev/story/rebuild-sov/) | 原刊零圖表、全由策展重鑄（40 則策展補充）：磁吸手機架 5 格手繪插畫、對數範圍圖、**ESOV 減法切割動畫＋7 場域掃描光束**、四層同心圓、**60 顆預算分配粒子流點陣**。 |
| **3** | **〈生成式體驗來臨〉**（Model｜物理隱喻彩蛋） | [/story/generative-experience/](https://agentic-era.kevin-tsou.workers.dev/story/generative-experience/) | **「四塊地基」純 CSS 物理彩蛋**（滑過或點擊地基，房子即傾斜裂牆並浮現後果與原文金句）、**「五大防禦支柱」動態展寬手風琴**、CX 三階段衣架比喻。 |
| **4** | **〈AI 普及下的演算法世代〉**（Model｜彈簧彩蛋） | [/story/judgment/](https://agentic-era.kevin-tsou.workers.dev/story/judgment/) | **媒體三世代「蹺蹺板」阻尼彈簧彩蛋**（可按住方塊下拉加重，放手後彈回平衡）、AI vs. PI 循環、Media++ 六模組原圖重製與三位科技 CEO 觀點橫捲卡。 |
| **5** | **〈從金曲獎到甄嬛傳〉**（People｜台灣文化共鳴） | [/story/shared-memory/](https://agentic-era.kevin-tsou.workers.dev/story/shared-memory/) | 平成 Retro 分組長條圖、Vevo 65% 二十人形逐個填色、**五階段「曬衣繩拍立得」逐張顯影**，以及 4 張橫捲案例卡搭配卡片內平滑展開抽屜。 |
| **6** | **〈別買曝光了〉**（People）<br>**〈體驗這件事〉／〈GEO 時代〉／〈AI Agent 走進消費旅程〉**（A.I） | [/story/buy-attention/](https://agentic-era.kevin-tsou.workers.dev/story/buy-attention/)<br>[/story/agent-experience/](https://agentic-era.kevin-tsou.workers.dev/story/agent-experience/)<br>[/story/geo/](https://agentic-era.kevin-tsou.workers.dev/story/geo/)<br>[/story/ai-agent-journey/](https://agentic-era.kevin-tsou.workers.dev/story/ai-agent-journey/) | • **別買曝光了**：Doom Loop 圓心萎縮循環、AIDMA→AICAS 演進矩陣（22 則補充）及考據 WARC 原報告之紙本 p.73 `playback → payback` 勘誤。<br>• **體驗這件事**：UX→TX→AX 逐圈長出同心圓與 6 站壓縮成 2 站旅程圖。<br>• **GEO 時代**：i-Proof 五步驟波浪路徑圖與 CEPs 七個 W 放射圖。<br>• **AI Agent 走進消費旅程**：Walmart Sparky 對話圖組與四層權限光譜。 |

- **全站必體驗 4 大跨篇巧思**：① 首頁滑鼠粒子波紋與「人機智慧臉譜」運鏡點亮（可匯出個人海報）；② 任一段點 `p.xx ↗` 開啟原文高亮彈窗，再點「在新頁閱讀」體驗 **184 頁雙欄「數位校對桌」**（如 [/story/power-of-real/original/#p23](https://agentic-era.kevin-tsou.workers.dev/story/power-of-real/original/#p23)）；③ 文末點開右上角紅點 **360° 旋轉 3D 鋁箔「知識補給包」**（背面印有幽默成分表）並撕開解鎖 13 張成就卡與 Canvas 金句卡；④ 任一頁鍵盤直接輸入 **`dentsu`** 觸發隱藏手繪彩蛋。

---

## 一、核心策展理念與三層閱讀架構

> **只要往下捲，就讀得完。**  
> 優先順序：**① UI/UX → ② 資訊視覺化 → ③ 炫技**。不做捲動劫持、不把書本硬塞成 3D 樓塔，讓每一個視覺與互動元件都服務於「更快、更準地讀懂原刊洞察」。

1. **全書地圖（首頁，約 1 分鐘）**：
   - 以封面視覺「素描大衛人臉 × ASCII AI 像素臉」打造「人機智慧臉譜（FaceMap）」，K-means 分區對應四章 22 篇與四條跨章主線，並提供「從手邊課題開始」四個台灣行銷實務情境入口。
2. **單篇精華故事（每篇 3–12 分鐘，依字數實算）**：
   - 依每篇文章論證結構量身打造 Scrollytelling 分鏡、11 種 D3.js 動態圖表、16 幅自訂 SVG 插畫、5 案「情境—方法—模擬」互動實驗室、橫向案例卡，並嚴格區分「正文（源自原刊整理）」、「作者原句」與「虛線編註（策展補充）」。
   - 每段均附紙本頁碼 `p.xx ↗`，點擊即開啟書頁質感原生 `<dialog>` 原文視窗並自動螢光高亮定位。
3. **逐頁校正原文、印刷對照與遊戲化收藏**：
   - 全數 22 篇原文均自 InDesign IDML 抽取並完成人工覆核對照，原文全文頁補齊原刊配圖與點擊放大燈箱，桌機右側並提供 184 頁真實印刷紙本捲動同步對照（「數位校對桌」）；讀完文末「帶走這幾個問題」後解鎖純 CSS 3D「知識補給包」（4 種稀有度包裝），並可將當下獲得的成就卡、金句卡或個人點亮的「人機智慧臉譜」以本地 Canvas 2D 合成海報下載分享。

---

## 二、Vibe Coding 防幻覺工程與自動化建置閘門

為解決 AI 輔助內容策展最容易發生的「頁碼誤植、數字拼錯、扭曲作者原意」問題，本專案將編輯校對紀律寫入 `npm run build` 的自動化驗證管線，任何一項失敗即阻斷建置與上線：

- `scripts/verify/verify-quotes.mjs`：把 `src/` 下 **1,539 條**引文與數據來源正規化後，與 `content/fulltext/a01.md–a22.md` 及 `content/figtext/` 逐字比對並驗證頁界（只允許整句落在宣告頁或確實跨越相鄰兩頁頁界）。
- `scripts/verify/verify-meta.mjs`：逐一核對 22 篇共 **105 筆**作者姓名、英文名、所屬機構與多段職稱是否與原刊扉頁一致。
- `scripts/verify/lint-stories.mjs` & `lint-style.mjs`：檢查主文長度與標點規則、驗證 `bignum` 人形圖實心比例與數字一致、檢查所有圖表步驟 `at <= beats.length`，並執行詞彙表與中英排版檢查。
- `scripts/fonts/fonts.py` & `check-fonts.mjs`：建置期掃描全站顯示文字並以 Python `fonttools` 產出 `DW Serif Display` 子集（`serif-900.woff2` 約 116 KB、`serif-700.woff2` 約 215 KB），保留 SIL OFL 1.1 授權條款且檢查零缺字。
- `scripts/verify/check-links.mjs`：掃描靜態輸出共 **2,358 條（47 頁）**站內連結、錨點與 `og:image`，並自動計算所有行內 `<script>` 的 SHA-256 雜湊值及安全標頭完整性比對 `public/_headers`。

---

## 三、部署架構與資安自評（五大面向）

1. **內容與圖像授權**：原刊內容由參賽者（任職於電通）取得授權使用，網站清楚標註出版資訊與原刊著作權歸屬；Wikimedia 等外部肖像圖檔均依 CC 授權標示來源並轉存站內 WebP；思源宋體子集完整保留 SIL OFL 授權聲明（`public/fonts/OFL.txt`）。
2. **Repo 衛生與機密防護**：`.gitignore` 採用「`*` 預設全拒 → 白名單放行原始碼 → 二次封鎖 `.pdf/.idml/.xlsx/.env*/.pem/.key`」雙層策略，搭配 `scripts/check-repo.ps1` 檢查零原始素材、零金鑰與零內部信箱外洩。
3. **依賴瘦身與執行期零第三方請求**：採用 Astro 5 純靜態輸出，前端零 React/Vue/Preact 框架與零 Three.js 等巨型引擎，僅按需引入 D3 `selection / scale / array` 三個微模組；執行期對外網域請求數為 **0**（不串第三方字型 CDN、不加任何追蹤分析腳本），`dist/` 亦關閉 sourcemap。
4. **部署與嚴格 HTTP 安全標頭（`public/_headers`）**：
   - 透過 `astro.config.mjs` 關閉樣式與腳本內嵌，將 CSP 鎖定為 `default-src 'self'` 與無 `unsafe-inline` script（唯一首屏 Loader 腳本以建置自動核對的 SHA-256 雜湊放行）。
   - 完整配置 `Strict-Transport-Security`、`X-Content-Type-Options: nosniff`、`X-Frame-Options: DENY`、`frame-ancestors 'none'`、`Referrer-Policy: strict-origin-when-cross-origin`、`Cross-Origin-Opener-Policy: same-origin` 與全關閉 `Permissions-Policy`。
   - 原文彈窗動態抓取 `reader.ts` 亦強制驗證 `slug` 白名單格式。
5. **隱私保護與離線降級**：全站無後端、無帳號與表單、無自由文字輸入；所有分享卡與臉譜圖卡皆於本地 Canvas 2D 合成；已讀紀錄僅存於瀏覽器 `localStorage`（`dw-read`、`dw-face-seen`），無法存取時自動優雅降級不顯示錯誤。

---

## 四、本機開發與驗證指令

```bash
npm install
npm run dev      # 啟動本機開發伺服器
npm run fonts    # 重新生成襯線顯示字子集 (需 Python + fonttools)
npm run verify   # 執行引文、作者、故事規則、文字風格與字集檢查
npm run build    # 執行完整驗證、Astro 靜態建置與站內連結／CSP 雜湊檢查
```
