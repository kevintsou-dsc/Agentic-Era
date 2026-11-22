# 部署思路與資安自評報告（Security & Deployment Self-Assessment）

- **作品名稱**：《決策智慧 2026：Agentic 時代，重塑品牌與人的真實距離》互動閱讀版
- **線上正式站**：https://agentic-era.kevin-tsou.workers.dev/
- **公開 Repository**：https://github.com/kevintsou-dsc/Agentic-Era
- **部署架構**：Astro 5 純靜態輸出（`output: 'static'`），以 **Cloudflare Workers Builds（靜態資產模式）** 連接 GitHub：推送 `main` 即自動建置部署，repo 內不存放任何部署 Token。
- **建置環境**：`.node-version` 固定 Node 24，`package.json` 宣告 `engines.node >=22.18`；正式網址以建置變數 `SITE_URL` 注入（canonical、og:url、og:image 皆為絕對網址）。
- **最後更新**：2026-11-23（依線上實測與原文頁印刷對照更新）

---

## 一、五面向資安與合規自評

### 1. 內容與圖像授權合規
- **刊物內容授權**：原刊內容由參賽者（任職於電通）取得授權於本競賽使用，網站內文嚴格維持對原刊之忠實度，並在 `/about/` 與每篇文章清楚標註出版資訊、作者職稱與「所載編輯內容之著作權為原刊所有」。原文頁右側印刷對照採離線預轉之單頁 WebP（`public/pages/`，全書 184 頁共 14.13 MB，平均 78.7 KB／頁，分篇按需載入），原始完稿 `.pdf` 仍嚴格封鎖於 repo 之外。
- **外部圖像與平台標誌**：人物肖像（Wikimedia Commons CC 授權）與台灣社群平台標誌（Simple Icons CC0／Wikimedia 公有領域）皆依來源標註授權並轉存站內 WebP／SVG，不熱連外部圖片網址。
- **字型授權合規**：自架 `Noto Sans TC Variable`（`@fontsource-variable/noto-sans-tc`）與建置期子集化之 `DW Serif Display`（源於 `NotoSerifTC-VF.ttf`，以 SHA-256 鎖定來源）均採 SIL Open Font License 1.1，建置腳本（`scripts/fonts/fonts.py`）強制保留完整版權與授權表，並隨附 `public/fonts/OFL.txt`。

### 2. Repository 衛生與機密防護
- **雙層白名單 `.gitignore`**：鑑於本機上層工作區存有其他專案設定與高機密原刊設計檔，專案將 Git Root 嚴格鎖定於專案資料夾內，`.gitignore` 採「`*` 預設全拒 → 僅白名單放行 `src/`、`content/`、`scripts/`、`docs/`、`public/` → 二次黑名單封鎖 `.pdf`、`.indd`、`.idml`、`.indb`、`.xlsx`、`.ai`、`.psd`、`.env*`、`.pem`、`.key`、`*.map`」。
- **推送前機密掃描（`npm run check:repo` → `scripts/check-repo.ps1`）**：未設 git hook，於每次推送 production 前手動執行，檢查 `git ls-files` 清單（2026-11-23 實測 1,342 筆受追蹤檔案），確認 0 個原始設計／試算表檔案、0 筆私鑰／API 金鑰樣式（`private_key`、`AKIA...`、`AIza...`）與 0 筆內部聯絡信箱外洩。

### 3. 依賴管理與執行期零第三方請求
- **極簡依賴與零前端框架**：前端不載入 React、Vue、Preact 或 Three.js，D3.js 僅按需引入 `d3-selection`、`d3-scale`、`d3-array` 三個微模組；`astro.config.mjs` 關閉 production sourcemap（`sourcemap: false`）。
- **執行期對外網路請求數為 0**：不載入 Google Fonts、外部 CDN、第三方統計或廣告追蹤碼，所有字型、圖片與腳本皆由同源（`'self'`）提供。
- **`npm audit` 實測結果與處置（2026-11-22）**：共 5 筆通報（critical 1、high 3、low 1），逐筆評估如下，結論是**線上站沒有對應的攻擊面**，交件前不升級套件以免引入未驗證的建置差異，交件後再升級：

  | 套件 | 等級 | 通報內容 | 本站是否受影響 |
  |---|---|---|---|
  | `astro@5.18.2` | critical | `define:vars` 在 `<script>` 內未完整跳脫；Server Islands 參數重放 | 否。純靜態輸出，未使用 Server Islands；唯一的 `define:vars` 用在 `<style>`，值是程式內固定的角度數字，沒有任何讀者輸入 |
  | `sharp`（libvips／libheif） | high | 解析惡意圖片檔的記憶體問題 | 否。只在建置期壓縮本 repo 自有的圖片與產生分享圖，不處理外部上傳 |
  | `zod`、`zod-to-ts` | high | 驗證超大集合時耗盡記憶體 | 否。只在建置期驗證本 repo 的內容設定 |
  | `esbuild` | low | Windows 上開發伺服器可被讀取任意檔案 | 否。只影響本機 `npm run dev`；開發時只綁 localhost，正式站不跑開發伺服器 |

  上述套件都不會進入 `dist/`：線上只有 HTML／CSS／JS／圖片／字型檔，沒有 Node 執行環境。

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

> **已知限制（照實說明）**：以 `http://` 開啟時，`workers.dev` 預設子網域會直接回應 200，不會 301 轉到 HTTPS（2026-11-22 實測）。緩解方式是 HSTS：讀者第一次以 HTTPS 造訪後，瀏覽器在一年內會自動把 http 改成 https。CSP 的 `upgrade-insecure-requests` 只會把頁面內的子資源請求升級為 HTTPS，不負責轉址首次的 HTTP 造訪；本站所有子資源本來就是同源 HTTPS。若改用自訂網域，可在 Cloudflare 開啟「Always Use HTTPS」補上這一段。

### 5. 隱私保護、輸入邊界與優雅降級
- **零伺服器資料蒐集**：全站無後端 API、無登入帳號、無任何表單或自由文字輸入欄位。
- **純前端運算與本地儲存**：閱讀進度（`dw-read`、`dw-face-seen`）與載入狀態（`dw-loaded`、`dw-nav`）僅儲存於讀者裝置的 `localStorage`／`sessionStorage`；卡片與人機智慧臉譜海報全部於本地瀏覽器 Canvas 2D 合成，不傳送至任何伺服器。
- **縱深防禦與降級**：原文彈窗抓取（`src/scripts/reader.ts`）於請求前強制驗證 `slug` 白名單格式（`/^[a-z0-9-]+$/`）；當讀者停用 `localStorage` 或使用無痕模式時，網站自動隱藏進度數字而不顯示錯誤；停用 JavaScript 或開啟 `prefers-reduced-motion` 時，所有圖表退回語意化清單並呈現完整閱讀狀態。

---

## 二、部署思路：讓錯誤在建置時就被擋下

本作品的部署策略是「**建置失敗，比上線出錯好**」。每次 `npm run build` 依序執行：

1. **內容閘門 `npm run verify`**：逐字比對 1,539 條引文與數字的原文位置與頁碼、105 筆作者姓名與職稱、圖表步驟與段落數、術語表與標點規則、襯線子集字型零缺字；任一項失敗即中止建置，錯誤內容不會上線。
2. **產生舊網址轉址與檢索檔**：`scripts/gen-redirects.mjs` 依 `content/legacy-slugs.json` 與 `content/articles.json` 產生 Cloudflare `_redirects`（紙本頁碼與別名舊網址一律 301 到新網址）、`robots.txt`、`sitemap.xml` 與 `llms.txt`。
3. **Astro 靜態輸出**：關閉樣式與腳本內嵌、關閉 sourcemap。
4. **連結與 CSP 檢查 `check-links.mjs`**：2,358 條站內連結與圖檔路徑（47 頁）全部存在；每段行內 `<script>` 的 SHA-256 與所有必要安全標頭皆須通過 `_headers` 驗證。

**設定值容錯但不默默接受錯值**：正式上線時，後台 `SITE_URL` 曾因格式錯誤讓整個建置失敗，又曾因少打一個字母輸出錯誤的 canonical。現在 `astro.config.mjs` 會先整理（去空白與引號、補 https://），整理後仍不合法（例如主機名稱沒有點）就略過並在建置紀錄中警告，網站照常建置、只是不輸出絕對網址，不會帶著錯的網址上線。完整經過記錄在 `docs/process-log.md`。

**上線後驗證**：以 `curl -I` 實測正式站回應標頭（見第 4 節）、以 GitHub check-run 確認 Workers Builds 成功、抽查 canonical／og:image 為正確絕對網址、抽查舊網址轉址。
