# P1 視覺優化：設計提案 v0（主導設計師）

2026-11-02。來源：docs/art-direction-review.md §三。流程依 multi-agent-brainstorming：v0 → 懷疑者／約束守護者／用戶倡導者 → 仲裁。

## 理解鎖定

- **目標**：讓 22 篇讀起來像同一本「書」，節奏更分明、換頁有空間感、讀完知道自己在全書哪裡；不改任何主文與引文。
- **範圍**：art-direction-review §三 的六項：襯線字、節奏、首屏空白與換段重疊、動態 token、跨頁換場、結尾已讀地圖。§五 的讀者互動不在這一輪。
- **約束**（沿用 PRD 與既有決策）：純靜態 Astro；CSP `script-src 'self'`、`style-src 'self'`（只允許 style 屬性）、`font-src 'self'`；不用第三方服務、不蒐集資料（只用 localStorage）；減少動態時要有靜態版本；手機（375px）可用；`npm run story:check` 必須全過；截止 11/23，修稿從 11/5 同時進行。
- **非目標**：不改圖表元件內部、不新增幕型、不改文案。

## 設計

### D1 襯線顯示字（作者的聲音）

- 字體：Noto Serif TC（OFL；來源為 Windows 內建的 NotoSerifTC-VF.ttf，name 表確認為 OFL 1.1、無保留字名）。
- **建置期子集**：全站顯示用文字（文章標題與副標、幕標題、陳述句、原文引言、帶走的問題、首頁核心問題）只有 **646 個不重複字**。用 fontTools 把可變字重限制在 600–900，子集成一個 woff2（預估 ≤ 500 KB），全站共用、瀏覽器只下載一次。
- 檔案：`scripts/fonts.py`（`npm run fonts`）產生 `public/fonts/serif-display.woff2` 與 `content/fonts/serif-chars.txt`（涵蓋的字）。改名為 `DW Serif Display`（避免與本機安裝的 Noto Serif TC 混用）。
- **涵蓋檢查**：lint-style 收集同一批顯示文字，任何字不在 serif-chars.txt → story:check 失敗並提示 `npm run fonts`。避免新文字掉到備援字體。
- 套用：`h1`（文章標題）、`.prose-h`、`.display`／`.statement`、`.quote`、`.asks`、首頁 Hero 問句。主文、卡片、圖表標籤維持無襯線。
- `font-display: swap`；第一次進站有 2.4 秒載入動畫，換頁後走快取。

### D2 節奏

- **陳述幕（statement，12 處）改章節色滿版底**：整個區段滿寬鋪 `--accent`，字為墨色。作為每篇的換氣點。
- **結尾引言（每篇最後一幕，22 處）加重**：置中、襯線、字級加大一級，上方一條章節色短線，引言出處置中。中段引言（7 篇有 1–2 則）維持現狀，只換襯線字。
- 中段引言改邊欄 pull-quote（review 原建議）**本輪不做**：會改變幕結構與捲動節奏，風險大於收益。

### D3 首屏空白與換段重疊

- **第一步提早觸發**：scrolly.ts 目前在第 1 段卡片頂端越過視窗中線才顯示圖的第 1 步，圖先以空狀態捲進畫面。改為：第 1 步在區段頂端進入視窗 80% 高度時就觸發；第 2 步起仍以中線為準。
- **窄版（≤ 899px）未啟用卡片完全隱藏**：目前未啟用卡片 opacity .35，疊在圖上時字會透出。窄版改為 0（桌機版卡片在圖旁不重疊，維持 .35 作為「下一段」提示）。

### D4 動態 token

- `:root` 新增 `--ease-out`、`--ease-move`、`--ease-spring`、`--dur-hover`（.18s）。
- 把 CSS 裡 10 種 `cubic-bezier` 字面值收斂成這三種；hover 類 transition 統一 `--dur-hover`。
- 只改 CSS（含 .astro 的 `<style>`），d3charts.ts 內的值不動。
- 規則寫進 docs/story-guide.md：hover 一律立即回應，錯開延遲只能寫在 transform／opacity 上。

### D5 跨頁換場（View Transitions）

- global.css：`@view-transition { navigation: auto; }`，預設淡入淡出 .25s。
- 首頁文章卡片的標題 ↔ 文章頁 h1 共用 `view-transition-name: t-<短名>`，點進去時標題從卡片位置移到頁首。
- 支援 Chrome／Edge；其他瀏覽器照常換頁。減少動態時關閉（`@media (prefers-reduced-motion: reduce) { @view-transition { navigation: none; } }`）。

### D6 結尾已讀地圖

- 每篇結尾「下一篇」區塊上方，放一列 22 個小圓點（依章節分組、章節色），目前這篇加框、已讀的填色，每個點都是連到該篇的連結（`aria-label`＝標題＋已讀／未讀）。
- 「已讀」＝讀到「帶走的問題」區塊（進入視窗）時寫入 `localStorage['dw-read']`（短名陣列）。只存在讀者瀏覽器。
- 下方一行字：「已讀 n／22 篇」。localStorage 無法使用時只顯示目前這篇，不顯示數字。
- 新檔：`src/components/ReadMap.astro`＋`src/scripts/readmap.ts`。

## 決策日誌

| # | 決策 | 考慮過的替代 | 理由 |
|---|---|---|---|
| L1 | 襯線字建置期子集成單一檔 | fontsource unicode-range 分片 | 顯示字只有 646 字；分片會讓每頁打 15+ 個請求、約 1 MB，單檔子集預估一半以下且全站快取 |
| L2 | 子集檔進 repo，涵蓋檢查進 story:check | 建置時（Cloudflare）即時子集 | Cloudflare 建置環境沒有中文字體與 fontTools；進 repo 讓建置可重現 |
| L3 | 中段引言本輪不改邊欄 | 改 pull-quote | 牽動 31 幕排版與捲動節奏，留到有餘力 |
| L4 | 只改 CSS 動態值，不碰 d3charts.ts | 全面改 | d3 的值與資料動畫綁在一起，改動風險高、讀者感受低 |
| L5 | 已讀＝讀到「帶走的問題」 | 打開頁面就算已讀 | 打開不代表讀完；以讀到結尾為準才有意義 |
