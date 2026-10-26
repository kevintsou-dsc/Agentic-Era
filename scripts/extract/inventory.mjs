// 原文盤點表（docs/story-playbook.md §1）：把一篇文章製作故事頁需要的素材整理成一張精簡清單，
// 取代反覆搜尋全文。輸出 content/inventory/aNN.md，並印出摘要。
// 用法：node scripts/extract/inventory.mjs aNN [aNN ...]　（不帶參數＝全部）
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (p) => readFileSync(root + p, 'utf8').replace(/\r\n/g, '\n');
const { articles } = JSON.parse(read('content/articles.json'));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : articles.map((a) => a.id);
mkdirSync(root + 'content/inventory', { recursive: true });

// 把全文拆成 [頁碼, 段落]
function blocks(md) {
  let page = 0;
  const out = [];
  for (const raw of md.split('\n\n')) {
    // 頁碼標記可能自成一段（全文），也可能和文字同一段（figtext：標記下一行就是文字）
    let t = raw.trim();
    const m = t.match(/^<!-- p\.(\d+) -->\s*/);
    if (m) { page = Number(m[1]); t = t.slice(m[0].length).trim(); }
    if (t) out.push([page, t]);
  }
  return out;
}
const sentences = (t) => t.split(/(?<=[。！？])/).map((s) => s.trim()).filter(Boolean);
const NUM = /\d[\d,.]*\s*(%|％|萬|億|倍|秒|人次|人|位|個|次|分鐘|小時|年|成|點|元)|[一二三四五六七八九十百千]+(成|倍|個|位|萬)/;
const STORY = /我自己|我曾|我點|我買|筆者|我們團隊|我在|曾經有一個|之前曾有/;
const LISTY = /^(第[一二三四五六七八九十]|首先|其次|再來|接著|最後|此外)|[①②③④⑤]|^\d+[.、]/;

for (const id of ids) {
  const a = articles.find((x) => x.id === id);
  if (!a || !existsSync(root + `content/fulltext/${id}.md`)) { console.error(`跳過 ${id}`); continue; }
  const bs = blocks(read(`content/fulltext/${id}.md`));
  const figs = existsSync(root + `content/figures/${id}.json`) ? JSON.parse(read(`content/figures/${id}.json`)) : { figures: [], qr: [], notes: [] };
  const figtext = existsSync(root + `content/figtext/${id}.md`)
    ? blocks(read(`content/figtext/${id}.md`)).filter(([, t]) => t.replace(/^:/, '').trim().length > 1 && !/^:(AI|Model|People)$/.test(t))
    : [];
  const L = [];
  L.push(`# ${id} 盤點表｜${a.title}${a.subtitle ? `：${a.subtitle}` : ''}`, '');
  L.push(`- 作者：${a.authors.map((p) => `${p.name}${p.en ? `（${p.en}）` : ''}`).join('、')}`);
  L.push(`- 紙本：p.${a.pages[0]}–${a.pages[1]}｜章節 ${a.chapter}｜全文 ${bs.reduce((s, [, t]) => s + t.length, 0)} 字`, '');

  L.push('## 章節小標', '');
  for (const [p, t] of bs) if (t.startsWith('## ')) L.push(`- p.${p} ${t.slice(3)}`);
  L.push('');

  L.push('## 原刊圖表與圖片（每一張都要有去處）', '');
  for (const f of figs.figures) {
    const kind = f.image ? `照片 ${f.image}（${f.w}×${f.h}）` : '向量圖表／表格（需轉成網頁圖表）';
    L.push(`- p.${f.page}｜${f.caption || '（無圖說，請開圖確認內容）'}${f.source ? `｜來源：${f.source}` : ''}｜${kind}${f.qr?.length ? `｜QR：${f.qr.join(' ')}` : ''}`);
  }
  const caps = bs.filter(([, t]) => t.startsWith('> '));
  if (caps.length) {
    L.push('', '全文中的圖說：');
    for (const [p, t] of caps) L.push(`- p.${p} ${t.slice(2)}`);
  }
  const tables = bs.filter(([, t]) => t.startsWith('| '));
  if (tables.length) {
    L.push('', '表格（原文已攤平成一行，需重建欄位）：');
    for (const [p, t] of tables) L.push(`- p.${p} ${t.slice(2, 300)}${t.length > 300 ? '…' : ''}`);
  }
  if (!figs.figures.length && !caps.length && !tables.length) L.push('- 原刊沒有圖表：故事頁的圖都要依原文文字整理製圖，並在圖說標明');
  L.push('');

  if (figtext.length) {
    L.push('## 圖中文字（figtext，逐字比對用；寫進主文的圖上數字，src 要引這裡）', '');
    const seen = new Set();
    for (const [p, t] of figtext) {
      const s = t.replace(/^:/, '').trim();
      if (seen.has(s)) continue;
      seen.add(s);
      L.push(`- p.${p} ${s.slice(0, 160)}`);
    }
    L.push('');
  }

  L.push('## 數據句（判斷：統計 → 圖表／大數字；作者經驗或舉例 → 不做成數據）', '');
  for (const [p, t] of bs) {
    if (t.startsWith('[註]') || t.startsWith('## ')) continue;
    for (const s of sentences(t)) if (NUM.test(s)) L.push(`- p.${p}${STORY.test(s) ? '［作者經驗？］' : ''} ${s.slice(0, 180)}`);
  }
  L.push('');

  const stories = bs.filter(([, t]) => STORY.test(t));
  if (stories.length) {
    L.push('## 作者小故事訊號（考慮分格插畫 art）', '');
    for (const [p, t] of stories) L.push(`- p.${p} ${t.slice(0, 120)}…`);
    L.push('');
  }

  L.push('## 條列訊號（確認主文是總覽還是逐項展開，再決定 at）', '');
  for (const [p, t] of bs) if (LISTY.test(t) || (t.match(/；/g) ?? []).length >= 2) L.push(`- p.${p} ${t.slice(0, 120)}…`);
  L.push('');

  const notes = bs.filter(([, t]) => t.startsWith('[註]'));
  if (notes.length) {
    L.push('## 註解連結（細節卡 links 的來源）', '');
    for (const [, t] of notes) L.push(`- ${t.slice(4).trim().slice(0, 220)}`);
    L.push('');
  }

  writeFileSync(root + `content/inventory/${id}.md`, L.join('\n'));
  console.log(`${id}：小標 ${bs.filter(([, t]) => t.startsWith('## ')).length}、原刊圖 ${figs.figures.length}、圖說 ${caps.length}、表格 ${tables.length}、figtext ${figtext.length}、註解 ${notes.length} → content/inventory/${id}.md`);
}
