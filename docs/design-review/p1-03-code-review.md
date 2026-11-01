# P1 實作程式碼審查（code-reviewer）

2026-11-02。審查範圍：P1 的全部變更（字型腳本與檢查、Scenes／global.css、Loader、ReadMap、readmap.ts、Base、文章頁）。依五個維度逐一檢查，修正後重跑 story:check 與瀏覽器驗證。

| 維度 | 問題 | 嚴重度 | 處理 |
|---|---|---|---|
| 邏輯錯誤 | display-chars 用正則抓 `CORE_QUESTION`，實際抓到的是下一段 THREAD_LINES 的字串，首頁核心命題的字沒有收進子集 | Major | 改為直接 import `src/data/home.ts` |
| 邏輯錯誤 | `npm run fonts` 在 Windows 主控台（cp950）印 ✓ 時當掉 | Major | `sys.stdout/stderr.reconfigure(encoding="utf-8")` |
| 邏輯錯誤 | 減少動態＋沒有 JS：全站 `animation: none !important` 會關掉載入頁的保底淡出，載入頁永遠蓋住內容（P0 之前就存在） | Major | 減少動態時 `.ld:not(.ld-js) { display: none }` |
| 耦合 | Hero 大標在 display-chars 裡寫死第二份 | Minor | 改為從 Hero.astro 原始檔取出，取不到就報錯 |
| 邏輯矛盾 | ReadMap 用 `indexOf(a)` 依賴物件同一性 | Minor | 改為以 id 比對 |
| 使用性 | 滑鼠移開圓點時，提示會清掉，即使鍵盤焦點還在另一個圓點上 | Minor | 離開時若焦點仍在圓點上，就顯示該篇 |

已確認沒有問題的項目：

- **readmap**：儲存值驗證、白名單過濾、try/catch、IntersectionObserver 寫入後即 disconnect、計時器在離開時清除。
- **卡片透明度**：靜態版與減少動態兩處都已設回 1。
- **CSP**：載入頁的行內 script 雜湊已更新，readmap 以外部模組載入。
- **子集檔**：保留 name 表與 OFL。
- **動態 token**：只換完全相同的值，替換後剩下的曲線清單已核對。
