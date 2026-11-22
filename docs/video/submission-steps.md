# 交件步驟（2026-11-23 13:00 截止）

## 0. 你手上的檔案（都在 `docs/video/`，不進 git）

| 檔案 | 用途 |
|---|---|
| `decision_wisdom_2026_3min_v4.mp4` | **正式繳交影片**（151.4 秒、1080p、60.4 MB、−16 LUFS、已燒錄字幕） |
| `decision_wisdom_2026_3min_v4.srt` | 外掛字幕：上傳 YouTube 等平台時可另外附上 |
| `decision_wisdom_2026_3min_v3b.mp4` | 保底版：v3 剪掉錯誤段落、補回片尾。只在 v4 出問題時才用 |
| `must_listen.mp3` | 多音字必聽合輯（約 40 秒） |
| `voice-ab/*.mp3` | 4 種聲音與語速的試聽比較 |
| `compare_v4_vs_alt.mp4` | 對照實驗：舞台推鏡（v4）對比真實網站逐幀擬錄（同一段旁白） |

## 1. 交件前自己確認（約 10 分鐘）

1. **從頭到尾看一次 v4**，開聲音看。重點檢查：
   - 旁白有沒有念錯：先聽 `must_listen.mp3`，其中「重建 SOV」「一本正經地」「讀得懂」最要注意。
   - 片尾網址和 QR code：用手機掃描，確認會開到 https://agentic-era.kevin-tsou.workers.dev/ 。
2. **確認表單規格**：檔案大小上限、格式（mp4）、是否要求上傳到 YouTube 或雲端硬碟再給連結。
   - 如果表單限制在 50MB 以下，執行下面的壓縮指令，會產出約 30MB 的版本。

```powershell
ffmpeg -i docs\video\decision_wisdom_2026_3min_v4.mp4 -c:v libx264 -crf 24 -preset slow -c:a copy docs\video\decision_wisdom_2026_3min_v4_small.mp4
```

3. 如果發現念錯或想改字，告訴我是哪一句。改稿、重配音、重渲染大約 10 分鐘，**12:00 前都還來得及**。

## 2. 上傳影片

- **如果表單要求直接上傳檔案**：上傳 `decision_wisdom_2026_3min_v4.mp4`。
- **如果表單要求給連結**：
  1. 上傳到 YouTube，設成「不公開」（有連結的人才看得到）。
  2. 字幕可以另外上傳 `.srt`。影片已經有燒錄字幕，上傳 `.srt` 的話，平台上會出現兩層字幕，建議不要上傳。
  3. 用無痕視窗打開連結，確認沒有登入也能播放。
- **如果用 Google Drive 或 OneDrive 分享**：權限要設成「知道連結的任何人都能檢視」，再用無痕視窗測試一次。

## 3. 填表其他欄位

| 欄位 | 填什麼 |
|---|---|
| 作品網址 | https://agentic-era.kevin-tsou.workers.dev/ |
| GitHub repo | https://github.com/kevintsou-dsc/Agentic-Era |
| 製作歷程 | 網站 `/about` 頁，或 repo 的 `docs/process-log.md` |
| 資安自評 | repo 的 `docs/security-self-assessment.md` |
| 影片 | 上傳的檔案，或第 2 步的連結 |

## 4. 一個要你決定的 repo 問題

**`main` 分支的 README 目前連到兩個 repo 裡不存在的檔案**：`docs/video/decision_wisdom_2026_3min_v3.mp4` 和 `docs/video-production-architecture.md`。評審點進去會看到 404。

修正內容已經放在 `video/v4-remake` 分支（README 改連到影片架構與企劃文件），但 PRD 規定「繳交前 24 小時不推 production」，推到 `main` 會觸發 Cloudflare 重新部署。這次只改文件、不改網站內容，風險很低，但要不要推由你決定：

- **A｜修 README**：只把 README 這一行改掉推上 `main`（我可以處理）。或者把整個 `video/v4-remake` 合併進 `main`，連同影片管線一起公開，作為 Vibe Coding 證據。
- **B｜先不動 `main`**：截止後再合併。

## 5. 繳交後

- 網址至少保留到 2026-12-31（PRD 規定）。
- `video/v4-remake` 分支可以等截止後再合併進 `main`。
