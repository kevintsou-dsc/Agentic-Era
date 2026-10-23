# 審查回合 2：約束守護者 → 主導設計師回應與修訂（v2）

設計師查證：專案的上層工作區資料夾放有其他專案用的機密設定檔，不屬於本專案。**這是本專案最大的實際洩漏風險**，已列為使用者須知（使用者已確認上層資料夾安全；本 repo 的 git root 只在專案資料夾內）。

| # | 意見 | 處置 | 修訂（v2 規格） |
|---|---|---|---|
| C1 | repo 衛生 | **接受（REJECT→改）** | git root 固定在 `projects/決策智慧vibecoding比賽/`，**禁止**在上層工作區 init。原始素材不複製進專案，抽取腳本直接讀 OneDrive 路徑，輸出到 `content/`。`.gitignore` 採白名單式（`*` 之後 `!site/**`、`!content/**`、`!scripts/**`、`!docs/**` 等），另加 pre-push 檢查：gitleaks 為 0 筆；`git ls-files` 不得出現 `.pdf/.indd/.idml/.xlsx/.ai/.psd`，也不得出現含 `private_key` 的 `.json`；dist 不輸出 sourcemap |
| C2 | 部署平台未定 | **接受** | 建議 **Cloudflare Pages**：免費、支援 `_headers`（CSP、HSTS、frame-ancestors、nosniff）、用 Git 整合部署，**repo 內與 CI 都不需要任何 token**。備案為 GitHub Pages，但需在自評中寫明「只能用 meta CSP、無法設定 HSTS 等標頭」的限制。**10/29 前由使用者定案**（見關鍵決策） |
| C3 | 網址永久性 | **接受** | 使用平台預設網域（`*.pages.dev`），production 只從 `main` 部署；11/20 起凍結 `release` 分支，繳交前 24 小時不推 production；網址至少保留到 2026-12-31 |
| C4 | 字型 | **接受** | 內容是固定的，適合**建置時子集化**：依全站實際用字產出 Noto Sans TC woff2，兩個字重（400/700），每個 ≤ 350 KB；Montserrat 與 Pixelify Sans 只做 Latin 子集，各 ≤ 30 KB；全部自託管、`font-display: swap`、首頁字型總量 ≤ 400 KB；系統字堆疊作為 fallback |
| C5 | 效能預算 | **接受** | Lighthouse mobile：首頁與閱讀頁 LCP ≤ 2.5s、CLS ≤ 0.1、INP ≤ 200ms、Performance ≥ 85、Accessibility ≥ 90；首頁 JS ≤ 100 KB gzip；動效以 CSS ＋ View Transitions 為主，GSAP 只在必要時延遲載入 |
| C6 | 圖像 | **接受** | `scripts/images` 離線轉 AVIF＋WebP，寬度 640/1280/1920，搭配 srcset；單張 ≤ 200 KB、首屏 ≤ 150 KB、全站 ≤ 5 MB；原圖不進 repo |
| C7 | PDF 抽取 | **接受** | 使用 PyMuPDF（fitz），依文字區塊座標「先欄後列」排序，排除頁眉、頁碼、註解區後各自存檔。人工校正預估每篇 15–25 分鐘，22 篇約 6–9 小時。若超過 9 小時，內容凍結 v1 延到 11/02。抽樣 ≥ 10% 段落與 PDF 畫面人工比對，結果記入製作歷程 |
| C8 | 逐字比對規格 | **接受** | 正規化規則寫進 `scripts/verify/normalize.ts`：全形轉半形（英數）、移除空白與換行、統一引號（「」『』“”）與破折號（—－–）、移除斷行連字號。每則引文 ≤ 80 字。印刷頁碼換算表（單篇起始頁，見 facts-verified.md）寫入 `content/sources.json`。比對失敗時輸出最接近的片段與差異 |
| C9 | 建置閘門 | **接受** | `npm run verify` 包含四項：引文/數字逐字比對、22/22 直接回答涵蓋率、作者與職稱和 xlsx 一致、lychee 斷鏈掃描 0 筆。任一失敗即停止部署。**10/29（W1 結束）前完成** |
| C10 | P0 範圍 | **接受** | 硬截止 **11/09：P0 全部可用**，否則凍結 P1、P2；**11/16 起只修 bug**；P2 不完整就不上線 |
| C11 | 無障礙 | **接受** | 最小寬度 360px、可完整用鍵盤操作、表態用原生 radio、對比 ≥ 4.5:1（萊姆綠與淺粉底只放深色字，品牌色主要用在色塊與線條）、支援 `prefers-reduced-motion`、圖片皆有 alt；支援 iOS Safari 與 Android Chrome 最近兩版、桌面 Chrome/Edge |
| C12 | localStorage | **接受** | 只存 articleId、questionId、表態選項，**不提供自由輸入欄位**；寫入失敗時靜默降級 |
| C13 | 第三方依賴 | **接受** | 執行期 0 個第三方網域；CSP `default-src 'self'`，不使用 inline script（框架產生的 inline 以 hash 允許）；`npm audit` 不得有 high 以上漏洞 |
| C14 | 圖像授權 | **接受** | 白名單：封面（封面示意.png、彩色決策智慧.png）、三章主視覺、色彩系統配色值（只取色值，不用圖）、dentsu logo（待確認）。Adobe Stock 線稿**預設不用**，改自繪 SVG。官方素材能否公開使用，列為向主辦單位確認的事項 |
| C15 | llms.txt/JSON-LD | **接受** | 從 `sources.json` 與策展內容自動產生 |
| C16 | Windows 環境 | **接受** | 正式建置在 Cloudflare Pages（Linux）上跑；本機只做開發。路徑與檔名一律用 ASCII（文章 slug 例如 `p06-trust`）；建置也跑在 Linux 上，以抓出大小寫問題 |

技術棧定案（v2）：**Astro**（靜態輸出、預設零 JS、island 互動）＋ TypeScript ＋ 少量 Preact island（圓桌、表態），內容用 Content Collections（Markdown/JSON＋zod schema，schema 本身就是一道閘門）。PDF 抽取用 Python（PyMuPDF）；驗證腳本用 Node。
