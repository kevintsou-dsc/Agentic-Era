# 《決策智慧 2026》閱讀網站｜Agentic Era Digital Reader

《決策智慧》10 週年 Vibe Coding 競賽參賽作品。將電通行銷傳播集團《決策智慧 2026：Agentic 時代，重塑品牌與人的真實距離》（全書 22 篇、約 14.3 萬字、閱讀時間逾 5 小時）轉譯為零框架、高可讀、完全可查證的數位策展網站。

- **線上正式站**：https://agentic-era.kevin-tsou.workers.dev/
- **設計與自評文件**：[PRD.md](docs/PRD.md) ｜ [製作歷程](docs/process-log.md) ｜ [部署與資安自評](docs/security-self-assessment.md)
- **3 分鐘參賽影片（Video as Code）**：成片另行繳交（檔案不進 repo）｜ [影片生成架構](docs/video-production-architecture.md) ｜ [重製企劃與多代理審查](docs/video/remake-plan.md)

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
