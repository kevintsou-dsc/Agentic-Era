// 審稿文件產生器（docs/text-review-plan.md §四 步驟 4–5）。每篇產出兩份：
//   docs/review/packets/<短名>.md  給站外 AI（例如 Gemini）：審查指示＋每段「原文依據 → 站上文字 → 修改紀錄 → Jev／盲評標記」
//   docs/review/reader/<短名>.md   給讀者盲評：只有讀者在站上看到的文字，依頁面順序，不含原文與出處
// 會合併的資料（有就附上，沒有就略過）：
//   content/review/*.json                Jev 初評（jev_review.py 產生；每篇取最新一份，--jev=<label> 指定某一份）
//   content/review/notes/<短名>.json      修改紀錄 [{ path, before, after, reason }]
//   docs/review/blind/<短名>.md           讀者盲評結果
// 用法：npm run review:packet [-- 短名或 aNN ...] [--jev=<label>]
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalize } from '../verify/normalize.mjs';
import { articles, flatten, loadStory, storyIds } from './reader-text.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const args = process.argv.slice(2);
const jevArg = args.find((a) => a.startsWith('--jev='))?.slice(6);
const only = new Set(args.filter((a) => !a.startsWith('--')));
const meta = articles();
const byId = new Map(meta.map((a) => [a.id, a]));
const glossary = JSON.parse(readFileSync(join(ROOT, 'content/glossary.json'), 'utf8')).terms;

// ---------- 原文上下文（與 scripts/review/units.py 的 context() 相同做法） ----------
const pageCache = new Map();
function pages(article) {
  if (pageCache.has(article)) return pageCache.get(article);
  const out = new Map();
  let page = null;
  for (const line of readFileSync(join(ROOT, 'content/fulltext', `${article}.md`), 'utf8').replace(/\r\n/g, '\n').split('\n')) {
    const m = line.match(/^<!-- p\.(\d+) -->/);
    if (m) { page = Number(m[1]); continue; }
    if (page != null && line.trim() && !line.startsWith('##')) out.set(page, (out.get(page) ?? '') + line.trim());
  }
  pageCache.set(article, out);
  return out;
}
function mapped(raw) {
  let n = ''; const idx = [];
  for (let i = 0; i < raw.length; i++) { const c = normalize(raw[i]); for (const ch of c) { n += ch; idx.push(i); } }
  return [n, idx];
}
/** 一段主文的所有引文：同一頁的合併成一個原文視窗（前後各 pad 字），引文本身用【】標出 */
function contexts(srcs, pad = 120) {
  const spans = new Map(); // page -> { raw, marks: [[s, e]] }
  const loose = [];
  for (const src of srcs) {
    const p = pages(src.article);
    const target = normalize(src.text);
    let hit = false;
    for (const [pg, raw] of [[src.page, p.get(src.page) ?? ''], [`${src.page}–${src.page + 1}`, (p.get(src.page) ?? '') + (p.get(src.page + 1) ?? '')]]) {
      const [n, idx] = mapped(raw);
      const at = n.indexOf(target);
      if (at < 0) continue;
      const key = `${src.article}:${pg}`;
      if (!spans.has(key)) spans.set(key, { page: pg, raw, marks: [] });
      spans.get(key).marks.push([idx[at], idx[at + target.length - 1] + 1]);
      hit = true;
      break;
    }
    if (!hit) loose.push(`【原文依據 p.${src.page}｜原刊圖表上的文字】${src.text}`);
  }
  const out = [];
  for (const { page, raw, marks } of spans.values()) {
    marks.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const m of marks) { const last = merged.at(-1); if (last && m[0] <= last[1]) last[1] = Math.max(last[1], m[1]); else merged.push([...m]); }
    const from = Math.max(0, merged[0][0] - pad), to = Math.min(raw.length, merged.at(-1)[1] + pad);
    let t = from > 0 ? '…' : '', cur = from;
    for (const [a, b] of merged) {
      // 兩段引文相距很遠時，中間省略
      t += a - cur > pad * 2 ? `${raw.slice(cur, cur + pad)}……${raw.slice(a - pad, a)}` : raw.slice(cur, a);
      t += `【${raw.slice(a, b)}】`;
      cur = b;
    }
    t += raw.slice(cur, to) + (to < raw.length ? '…' : '');
    out.push(`【原文依據 p.${page}】${t}`);
  }
  return [...out, ...loose];
}

// ---------- 合併資料 ----------
// 每篇取「最新一份有評到它」的 Jev 報告（各輪常只跑部分文章）；--jev=<label> 則只用指定那份
function jevByStory() {
  const dir = join(ROOT, 'content/review');
  const files = jevArg ? [`${jevArg}.json`]
    : readdirSync(dir).filter((f) => f.endsWith('.json') && !/^(units|jev-pilot)\.json$/.test(f))
      .sort((a, b) => statSync(join(dir, b)).mtimeMs - statSync(join(dir, a)).mtimeMs);
  const out = new Map();
  for (const f of files) {
    const r = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    for (const s of r.stories ?? []) if (s.rows && !out.has(s.id)) out.set(s.id, { label: r.label, rows: s.rows });
  }
  return out;
}
const jevStories = jevByStory();
const jevRows = new Map();
for (const [id, s] of jevStories) for (const r of s.rows) jevRows.set(`${id}\u0000${r.text}`, r);
const readJson = (p, d) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : d);

const KIND = { main: '主文（改寫原文）', one: '一句話摘要', curator: '策展補充（原文沒有）', short: '圖表與卡片短文字', quote: '原文引言（逐字）', ask: '帶走的問題（原文逐字）', source: '圖說出處' };
const esc = (s) => s.replace(/\*\*/g, '');

function instructions(a) {
  const authors = a.authors.map((x) => `${x.title} ${x.name}（${x.en}）`).join('、');
  const decided = glossary.filter((t) => t.status === 'decided').map((t) => `「${t.use}」（不用：${t.avoid.join('、')}）`).join('；');
  return [
    `# 審稿文件：${a.title}${a.subtitle ? `｜${a.subtitle}` : ''}`,
    '',
    `- 原文作者：${authors}；紙本 p.${a.pages[0]}–${a.pages[1]}`,
    `- 站上頁面：/story/${a.slug}/　原文全文：/story/${a.slug}/original/`,
    `- 產生時間：${new Date().toISOString().slice(0, 10)}（scripts/review/packet.mjs）${jevStories.has(a.id) ? `；Jev 初評：${jevStories.get(a.id).label}` : '；尚無 Jev 初評'}`,
    '',
    '## 給審查者的指示',
    '',
    '你是一位資深的繁體中文編輯，熟悉行銷與 AI 產業。這是一個把紙本文章改寫成捲動式網頁故事的專案：站上的「主文」是策展者依原文改寫的濃縮版，「策展補充」是原文沒有、策展者為了幫讀者理解而寫的說明。請逐段對照下方的【原文依據】與「站上文字」，找出需要修改的地方。',
    '',
    '請檢查：',
    '1. **忠實**：主張在原文找得到；沒有加上原文沒說的「最」「一定」「所有」；數字、單位、年份、人名、品牌與原文相同。',
    '2. **完整**：沒有斷章取義的半句；原文有條件的說法，保留條件。',
    '3. **好讀**：一句一個重點，單句盡量不超過 60 字；避免連續堆疊專有名詞；前後段落有銜接。',
    '4. **策展補充**：只寫一般公認的知識，不替作者下新結論；先說「這是什麼」，再說「為什麼重要」。',
    `5. **用語**：全形標點；中文與英數之間空一格；術語統一用 ${decided}。`,
    '6. **作者稱呼**：不直呼作者中文名；作者親身經歷需要主詞時用英文名（例如 Cynthia），不用「他／她」。',
    '',
    '不用檢查：【原文依據】本身、原文引言與「帶走的問題」（逐字照錄，已自動比對），以及圖說出處格式。',
    '',
    '請只列出需要修改的段落，依下表格式回覆（沒有問題的段落不用列）：',
    '',
    '| 編號 | 問題類型 | 站上原句（節錄） | 建議改為 | 理由 |',
    '|---|---|---|---|---|',
    '| P07 | 忠實 | …… | …… | 原文說「可能」，站上寫成「一定」 |',
    '',
    '最後用三句話總評：這篇最大的問題、讀者最可能誤解的地方、最值得保留的寫法。',
    '',
  ];
}

function packet(a, units, notes, blind) {
  const md = instructions(a);
  let n = 0, scene = -1;
  const shorts = [];
  const flushShorts = () => {
    if (!shorts.length) return;
    md.push(`**圖表與卡片短文字**：${shorts.map((s) => `「${esc(s)}」`).join('、')}`, '');
    shorts.length = 0;
  };
  md.push('## 逐段對照', '');
  for (const u of units) {
    if (u.scene !== scene) { flushShorts(); scene = u.scene; md.push(`### ${scene === 99 ? '' : `第 ${scene} 幕｜`}${esc(String(u.heading))}`, ''); }
    if (u.kind === 'source') continue;
    if (u.kind === 'short') { shorts.push(u.text); continue; }
    flushShorts();
    const no = `P${String(++n).padStart(2, '0')}`;
    md.push(`**${no}｜${KIND[u.kind]}**`, '');
    if (u.kind === 'quote' || u.kind === 'ask') { md.push(`> ${esc(u.text)}`, ''); continue; }
    md.push(`站上文字：${esc(u.text)}`, '');
    if (u.src?.length) md.push(...contexts(u.src), '');
    else if (u.sceneSrc?.length) md.push(`（原文沒有這段；同一幕主文依據的原文，供參考）`, ...contexts(u.sceneSrc.slice(0, 3), 60), '');
    const note = notes.filter((x) => x.path === u.path);
    note.forEach((x) => md.push(`修改紀錄：「${x.before}」→「${x.after}」（${x.reason}）`, ''));
    const j = jevRows.get(`${a.id}\u0000${esc(u.text)}`);
    if (j) md.push(`Jev：${Object.entries(j.jev).filter(([, v]) => typeof v === 'number').map(([k, v]) => `${k} ${v.toFixed(2)}`).join('、')}${j.reasons?.length ? `　⚠ ${j.reasons.join('；')}` : ''}`, '');
  }
  flushShorts();
  if (blind) md.push('## 讀者盲評結果', '', '以下是三位模擬讀者只讀站上文字（沒看原文）後的回饋，供你判斷哪裡容易誤解：', '', blind.replace(/^# .*\n/, ''), '');
  return md.join('\n') + '\n';
}

/** 讀者版：讀者在站上依序看到的文字，不含原文、出處與編號以外的提示 */
function reader(a, units) {
  const md = [`# ${a.title}${a.subtitle ? `｜${a.subtitle}` : ''}`, ''];
  let scene = -1;
  for (const u of units) {
    if (u.kind === 'source') continue;
    if (u.scene !== scene) { scene = u.scene; if (scene > 0) md.push(`## ${esc(String(u.heading))}`, ''); }
    const t = esc(u.text);
    if (u.kind === 'short' && t === esc(String(u.heading))) continue;
    if (u.kind === 'one') md.push(`**${t}**`, '');
    else if (u.kind === 'quote' || u.kind === 'ask') md.push(`> ${t}`, '');
    else if (u.kind === 'curator') md.push(`［${u.key === 'more.text' ? '延伸' : '圖表說明'}］${t}`, '');
    else if (u.kind === 'short') md.push(`- ${t}`);
    else md.push('', t, '');
  }
  return md.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
}

mkdirSync(join(ROOT, 'docs/review/packets'), { recursive: true });
mkdirSync(join(ROOT, 'docs/review/reader'), { recursive: true });
let made = 0;
for (const id of storyIds()) {
  const a = byId.get(id);
  if (only.size && !only.has(id) && !only.has(a.slug)) continue;
  const units = flatten(await loadStory(id));
  const notes = readJson(join(ROOT, 'content/review/notes', `${a.slug}.json`), []);
  const blindPath = join(ROOT, 'docs/review/blind', `${a.slug}.md`);
  const blind = existsSync(blindPath) ? readFileSync(blindPath, 'utf8') : null;
  writeFileSync(join(ROOT, 'docs/review/packets', `${a.slug}.md`), packet(a, units, notes, blind));
  writeFileSync(join(ROOT, 'docs/review/reader', `${a.slug}.md`), reader(a, units));
  made++;
  console.log(`  ${a.title}：docs/review/packets/${a.slug}.md${blind ? '（含盲評）' : ''}${notes.length ? `（修改紀錄 ${notes.length}）` : ''}`);
}
console.log(`✓ 產生 ${made} 篇審稿文件（有 Jev 結果 ${jevStories.size} 篇）`);
