// 過度濃縮檢查（docs/review/compression-plan.md）：給主文泡泡編號、算濃縮比、標出機械可抓的徵兆，
// 並產出給盲讀者的編號版文字。只做解析，不呼叫任何 API。
//
// 用法：node scripts/review/compression.mjs <標籤> <短名或 aNN ...>
//   例：node scripts/review/compression.mjs before trust people-model
// 產出（content/review/compression/）：
//   <短名>.<標籤>.reader.md   讀者版（同 docs/review/reader/，但主文與一句話前加〔M01〕編號）
//   <短名>.<標籤>.units.json  每則主文：編號、原句、出處所在的原文整段、濃縮比、徵兆
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalize } from '../verify/normalize.mjs';
import { articles, flatten, loadStory, storyIds } from './reader-text.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const OUT = join(ROOT, 'content/review/compression');
const [label, ...want] = process.argv.slice(2);
if (!label || !want.length) { console.error('用法：node scripts/review/compression.mjs <標籤> <短名或 aNN ...>'); process.exit(1); }

// 原文段落（空行分段；不含頁碼標記），附頁碼
const paraCache = new Map();
function paragraphs(aid) {
  if (paraCache.has(aid)) return paraCache.get(aid);
  const out = []; let page = 0;
  for (const block of readFileSync(join(ROOT, 'content/fulltext', `${aid}.md`), 'utf8').replace(/\r\n/g, '\n').split(/\n{2,}/)) {
    const m = block.trim().match(/^<!-- p\.(\d+) -->$/);
    if (m) { page = Number(m[1]); continue; }
    const text = block.trim().replace(/^(## |> |\| |\[註\] )/, '');
    if (text) out.push({ page, text, n: normalize(text) });
  }
  paraCache.set(aid, out);
  return out;
}
/** 出處所在的原文整段（找不到就是圖表上的字，回傳出處本身） */
function sourceParas(srcs) {
  const seen = new Map();
  for (const s of srcs) {
    const t = normalize(s.text);
    const ps = paragraphs(s.article);
    let hit = ps.find((p) => p.n.includes(t));
    if (!hit) { // 跨段（出處跨過頁界）：拿頭尾各一半找
      const head = t.slice(0, Math.ceil(t.length / 2));
      hit = ps.find((p) => p.n.includes(head));
    }
    const key = hit ? hit.text : `［圖表］${s.text}`;
    if (!seen.has(key)) seen.set(key, { page: hit ? hit.page : s.page, text: key });
  }
  return [...seen.values()];
}

const len = (s) => normalize(s).replace(/[，。、；：！？「」（）《》…—\-|]/g, '').length;
const sentences = (s) => s.split(/(?<=[。！？])/).map((x) => x.trim()).filter(Boolean);
const POINTER = /^(這|此|其|該|上述|前述|它|他們|這些|那些)/;
// 句與句之間常見的轉折、因果、遞進、舉例、條件連接詞
const LINKS = /因為|所以|因此|於是|但|然而|不過|而是|反而|而且|並且|同時|此外|另外|接著|然後|最後|首先|其次|也就是|換句話說|例如|比如|像是|如果|只要|一旦|當|才|甚至|更|其實|關鍵在|原因是|結果|也因此|相反/;

const meta = articles();
mkdirSync(OUT, { recursive: true });
for (const id of storyIds()) {
  const a = meta.find((x) => x.id === id);
  if (!want.includes(id) && !want.includes(a.slug)) continue;
  const units = flatten(await loadStory(id));
  let n = 0;
  const rows = [];
  const md = [`# ${a.title}${a.subtitle ? `｜${a.subtitle}` : ''}`, ''];
  let scene = -1;
  for (const u of units) {
    if (u.kind === 'source') continue;
    if (u.scene !== scene) { scene = u.scene; if (scene > 0) md.push(`## ${u.heading}`, ''); }
    if (u.kind === 'short' && u.text === String(u.heading)) continue;
    if (u.kind === 'one' || u.kind === 'main') {
      const mid = u.kind === 'one' ? 'ONE' : `M${String(++n).padStart(2, '0')}`;
      const src = u.src ? sourceParas(u.src) : [];
      const srcLen = src.reduce((t, p) => t + len(p.text), 0);
      const ss = sentences(u.text);
      const flags = [];
      if (POINTER.test(u.text)) flags.push('指代開頭');
      if (ss.length >= 2 && ss.slice(1).every((x) => !LINKS.test(x.slice(0, 12)))) flags.push('句間無連接詞');
      const ratio = srcLen ? +(len(u.text) / srcLen).toFixed(2) : null;
      if (ratio !== null && ratio < 0.35) flags.push('濃縮比低');
      rows.push({ id: mid, path: u.path, heading: String(u.heading), text: u.text, chars: len(u.text), src_chars: srcLen, ratio, flags, source: src });
      md.push(u.kind === 'one' ? `**〔${mid}〕${u.text}**` : `\n〔${mid}〕${u.text}\n`, '');
    } else if (u.kind === 'quote' || u.kind === 'ask') md.push(`> ${u.text}`, '');
    else if (u.kind === 'curator') md.push(`［${u.key === 'more.text' ? '延伸' : u.key === 'note' ? '編註' : '圖表說明'}］${u.text}`, '');
    else if (u.kind === 'short') md.push(`- ${u.text}`);
  }
  writeFileSync(join(OUT, `${a.slug}.${label}.reader.md`), md.join('\n').replace(/\n{3,}/g, '\n\n') + '\n');
  writeFileSync(join(OUT, `${a.slug}.${label}.units.json`), JSON.stringify({ id, slug: a.slug, title: a.title, label, units: rows }, null, 1));
  const f = (k) => rows.filter((r) => r.flags.includes(k)).length;
  const rs = rows.filter((r) => r.ratio !== null).map((r) => r.ratio).sort((x, y) => x - y);
  console.log(`${a.title}（${label}）：主文 ${rows.length - 1} 則｜濃縮比中位數 ${rs[rs.length >> 1]}｜濃縮比低 ${f('濃縮比低')}｜句間無連接詞 ${f('句間無連接詞')}｜指代開頭 ${f('指代開頭')}`);
}
