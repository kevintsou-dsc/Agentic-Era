# 外部 LLM 審稿：ext1

匯出時間：2026-11-11T06:20:22.802Z。產生方式：`node scripts/review/external_export.mjs ext1 --no-cap`

## 怎麼用

1. 把一份 `prompt-*.md` 的**完整內容**貼給外部模型（ChatGPT、Gemini 等），一篇開一個新對話。
2. 模型會回一個 ```json 區塊。把回覆存成 `returns/<aNN>.json`（例如 `returns/a07.json`）。整段回覆含說明文字也可以存成 `returns/<aNN>.md`，匯入時會自動抓第一個 json 區塊。
3. 檢查（不改檔）：`python -I -X utf8 scripts/review/external_import.py ext1`
4. 確認後套用：`python -I -X utf8 scripts/review/external_import.py ext1 --apply`，再跑 `npm run story:check`。

選文章的條件：修改後盲讀全篇平均分 < 4，或兩位讀者都卡住的泡泡 ≥ 10。本批不設全篇 25% 增幅上限（--no-cap），只限每則 140 字。選泡泡：兩位讀者都卡住，或任一讀者給 3 分以下且列入卡住。

| 文章 | 檔案 | 盲讀平均分 | 要改的泡泡 | 兩位都卡 | 25% 上限內還能增加的字數 |
|---|---|---|---|---|---|
| 〈AI for Growth〉a01 | `prompt-a01-ai-for-growth.md` | 3.65 | 10 | 9 | 14 |
| 〈超越效率〉a21 | `prompt-a21-beyond-efficiency.md` | 3.69 | 10 | 7 | 30 |
| 〈GEO 時代〉a19 | `prompt-a19-geo.md` | 3.75 | 11 | 10 | 42 |
| 〈生成式體驗來臨〉a15 | `prompt-a15-generative-experience.md` | 3.85 | 11 | 10 | 117 |
| 〈真實的力量〉a03 | `prompt-a03-power-of-real.md` | 3.87 | 12 | 10 | 9 |
| 〈別買曝光了，開始買注意力吧〉a10 | `prompt-a10-buy-attention.md` | 3.87 | 9 | 9 | 105 |
| 〈贏在 AI 時代的隱形戰場〉a16 | `prompt-a16-cultural-undercurrents.md` | 3.88 | 8 | 8 | 68 |
| 〈從金曲獎到甄嬛傳〉a11 | `prompt-a11-shared-memory.md` | 3.89 | 16 | 7 | 421 |
| 〈體驗這件事〉a18 | `prompt-a18-agent-experience.md` | 3.90 | 9 | 7 | 41 |
| 〈Agentic 時代〉a02 | `prompt-a02-agentic-era.md` | 3.92 | 7 | 6 | 126 |
| 〈Agents of Growth〉a04 | `prompt-a04-agents-of-growth.md` | 3.92 | 8 | 7 | 21 |
| 〈重建 SOV〉a13 | `prompt-a13-rebuild-sov.md` | 3.94 | 11 | 6 | 90 |
| 〈AI 可以幫人買東西〉a07 | `prompt-a07-make-them-want-to-buy.md` | 4.04 | 16 | 16 | 31 |
| 〈討好演算法，還是打動人？〉a09 | `prompt-a09-algorithm-or-people.md` | 4.20 | 13 | 13 | 128 |

沒匯出：〈AI 代理時代的增長架構師〉a05（4.37，兩位都卡 4）、〈信任〉a06（4.20，兩位都卡 2）、〈當注意力成為稀缺資源〉a08（4.09，兩位都卡 9）、〈People Model〉a12（4.07，兩位都卡 3）、〈AI 普及下的演算法世代〉a14（4.04，兩位都卡 8）、〈顧客為何停下來？〉a17（4.11，兩位都卡 9）、〈拒絕同質化 AI Slop〉a20（4.03，兩位都卡 9）、〈AI Agent 走進消費旅程〉a22（4.11，兩位都卡 4）
