# 部署思路與資安自評報告（Security & Deployment Self-Assessment）

- **作品名稱**：《決策智慧 2026：Agentic 時代，重塑品牌與人的真實距離》互動閱讀版
- **線上正式站**：https://agentic-era.kevin-tsou.workers.dev/
- **公開 Repository**：https://github.com/kevintsou-dsc/Agentic-Era
- **部署架構**：Astro 5 純靜態輸出（`output: 'static'`）託管於 Cloudflare 邊緣網路（推送 `main` 自動建置部署，CI 不需於 repo 內存放任何 Token）。

---

## 一、五面向資安與合規自評

### 1. 內容與圖像授權合規
- **刊物內容授權**：原刊內容由參賽者（任職於電通）取得授權於本競賽使用，網站內文嚴格維持對原刊之忠實度，並在 `/about/` 與每篇文章清楚標註出版資訊、作者職稱與「所載編輯內容之著作權為原刊所有」。
- **外部圖像與平台標誌**：人物肖像（Wikimedia Commons CC 授權）與台灣社群平台標誌（Simple Icons CC0／Wikimedia 公有領域）皆依來源標註授權並轉存站內 WebP／SVG，不熱連外部圖片網址。
- **字型授權合規**：自架 `Noto Sans TC Variable`（`@fontsource-variable/noto-sans-tc`）與建置期子集化之 `DW Serif Display`（源於 `NotoSerifTC-VF.ttf`，以 SHA-256 鎖定來源）均採 SIL Open Font License 1.1，建置腳本（`scripts/fonts/fonts.py`）強制保留完整版權與授權表，並隨附 `public/fonts/OFL.txt`。

### 2. Repository 衛生與機密防護
- **雙層白名單 `.gitignore`**：鑑於本機上層工作區存有其他專案設定與高機密原刊設計檔，專案將 Git Root 嚴格鎖定於專案資料夾內，`.gitignore` 採「`*` 預設全拒 → 僅白名單放行 `src/`、`content/`、`scripts/`、`docs/`、`public/` → 二次黑名單封鎖 `.pdf`、`.indd`、`.idml`、`.indb`、`.xlsx`、`.ai`、`.psd`、`.env*`、`.pem`、`.key`、`*.map`」。
- **推送前自動化機密掃描（`scripts/check-repo.ps1`）**：每次推送前檢查 `git ls-files` 清單（共 1,147 筆受追蹤檔案），確認 0 個原始設計／試算表檔案、0 筆私鑰／API 金鑰樣式（`private_key`、`AKIA...`、`AIza...`）與 0 筆內部聯絡信箱外洩。

### 3. 依賴管理與執行期零第三方請求
- **極簡依賴與零前端框架**：前端不載入 React、Vue、Preact 或 Three.js，D3.js 僅按需引入 `d3-selection`、`d3-scale`、`d3-array` 三個微模組；`astro.config.mjs` 關閉 production sourcemap（`sourcemap: false`）。
- **執行期對外網路請求數為 0**：不載入 Google Fonts、外部 CDN、第三方統計或廣告追蹤碼，所有字型、圖片與腳本皆由同源（`'self'`）提供。
- **建置期工具鏈 `npm audit` 說明**：`npm audit --omit=dev` 通報 `astro@5.18.2` 及其建置期相依套件（`esbuild`、`sharp`、`zod`）之已知高／重大風險通報；然而上述套件**僅於建置階段（Build-time）執行靜態 HTML 生成與離線圖片壓縮**，並未有任何 Astro SSR Server、Node Image Endpoint 或開發伺服器程式碼進入 `dist/` 靜態產物，因此線上靜態執行環境不存在對應之攻擊面。

### 4. 部署架構與 HTTP 安全標頭（`public/_headers`）
透過 `astro.config.mjs` 設定 `build: { inlineStylesheets: 'never' }` 與 `vite: { build: { assetsInlineLimit: 0 } }`，關閉樣式與腳本內嵌，確保 `public/_headers` 能執行嚴格的 CSP 控管；每次 `npm run build` 結尾由 `scripts/verify/check-links.mjs` 自動計算全站所有行內 `<script>` 的 SHA-256 雜湊並與 `_headers` 比對，不符即建置失敗。

線上正式站（`https://agentic-era.kevin-tsou.workers.dev/`）實測回應標頭如下：
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `content-security-policy: default-src 'self'; script-src 'self' 'sha256-UzJLu3OdiZpSOQ3qYtoU3FI6aj64PtKxqLbHiMgCcCM='; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'; object-src 'none'; upgrade-insecure-requests`
  - *(註：`style-src-attr 'unsafe-inline'` 僅用於圖表元件透過 `style` 屬性傳遞 CSS 變數與定位比例，且全站無任何自由文字輸入框。)*
- `x-content-type-options: nosniff`
- `x-frame-options: DENY`
- `referrer-policy: strict-origin-when-cross-origin`
- `cross-origin-opener-policy: same-origin`
- `permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`

> **已知環境限制說明**：Cloudflare `workers.dev` 預設子網域不開放單獨關閉純 HTTP 80 埠入口，站點已配置長期 `Strict-Transport-Security`（1 年含子網域）與 CSP `upgrade-insecure-requests` 強制瀏覽器使用 HTTPS 連線。

### 5. 隱私保護、輸入邊界與優雅降級
- **零伺服器資料蒐集**：全站無後端 API、無登入帳號、無任何表單或自由文字輸入欄位。
- **純前端運算與本地儲存**：閱讀進度（`dw-read`、`dw-face-seen`）與載入狀態（`dw-loaded`、`dw-nav`）僅儲存於讀者裝置的 `localStorage`／`sessionStorage`；卡片與人機智慧臉譜海報全部於本地瀏覽器 Canvas 2D 合成，不傳送至任何伺服器。
- **縱深防禦與降級**：原文彈窗抓取（`src/scripts/reader.ts`）於請求前強制驗證 `slug` 白名單格式（`/^[a-z0-9-]+$/`）；當讀者停用 `localStorage` 或使用無痕模式時，網站自動隱藏進度數字而不顯示錯誤；停用 JavaScript 或開啟 `prefers-reduced-motion` 時，所有圖表退回語意化清單並呈現完整閱讀狀態。
