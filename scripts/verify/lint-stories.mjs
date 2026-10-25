// 主文規則檢查（docs/story-guide.md §3）：
// 每段主文（beat、hscroll 格、圖表 detail）都是完整句子、不以冒號結尾、長度合理、有出處；
// 每篇主文合計 500–3,000 字（不追求 90 秒讀完；原文已條列的內容可以完整放入）。只檢查 src/data/stories/a*.ts。
// d3 圖表的說明框（§5.1）：每個可互動元素都要有策展補充 extra（至少 40 字）；原文內容寫進主文，不放進說明框。
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = fileURLToPath(new URL('../../src/data/stories/', import.meta.url));
const END = /[。！？」）]$/;
const problems = [];
const summary = [];

for (const f of readdirSync(dir).filter((x) => /^a\d\d\.ts$/.test(x))) {
  const src = readFileSync(join(dir, f), 'utf8');
  const id = f.slice(0, 3);
  // 主文 = 後面緊接 src 的 text 欄位（beat、panel、lede、intro、caption、detail）
  const beats = [...src.matchAll(/text:\s*'((?:[^'\\]|\\.)*)',\s*\n?\s*src:\s*\[/g)].map((m) => m[1]);
  const details = [...src.matchAll(/detail:\s*\{\s*text:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]);
  const detailSet = new Set(details);
  let total = (src.match(/oneLiner:\s*'([^']*)'/)?.[1] ?? '').length;
  for (const t of beats) {
    const isDetail = detailSet.has(t);
    const plain = t.replace(/\*\*/g, '');
    if (!END.test(plain)) problems.push(`${id}：未以句末標點結束「${plain.slice(-20)}」`);
    if (/[：:]$/.test(plain)) problems.push(`${id}：以冒號結尾（半句）「${plain.slice(-20)}」`);
    const min = isDetail ? 12 : 30;
    if (plain.length < min) problems.push(`${id}：太短（${plain.length} 字）「${plain}」`);
    if (plain.length > 140) problems.push(`${id}：太長（${plain.length} 字），請拆成兩段「${plain.slice(0, 20)}…」`);
    if (!isDetail) total += plain.length;
  }
  // 沒有 src 的 beat：text 後面不是 src
  for (const m of src.matchAll(/\{\s*\n?\s*text:\s*'((?:[^'\\]|\\.)*)',\s*\n?\s*(?!src:)(\w+):/g)) {
    if (m[2] !== 'src' && !/^(at|label|value|display|highlight)$/.test(m[2])) problems.push(`${id}：主文缺少出處「${m[1].slice(0, 20)}…」`);
  }
  if (total < 500 || total > 3000) problems.push(`${id}：主文合計 ${total} 字，建議 500–3,000 字`);
  // d3 說明框：Node 24 可直接載入 .ts（型別會被移除）
  const { story } = await import(pathToFileURL(join(dir, f)).href);
  let tips = 0;
  const tip = (name, o) => {
    tips++;
    const len = (o.extra ?? '').length;
    if (len < 40) problems.push(`${id}：圖表說明太薄（${len} 字）「${name}」，請補 extra（策展補充）`);
    if ('detail' in o || 'centerDetail' in o) problems.push(`${id}：圖表說明不放原文（detail）「${name}」，原文請寫進左側主文`);
  };
  for (const sc of story.scenes) {
    const c = sc.kind === 'graphic' && sc.graphic.type === 'd3' ? sc.graphic.chart : null;
    if (!c) continue;
    if (c.kind === 'flowloop') {
      tip(c.center, { extra: c.centerExtra, ...('centerDetail' in c ? { centerDetail: c.centerDetail } : {}) });
      c.nodes.forEach((n) => tip(n.label, n));
    } else if (c.kind === 'groups') c.groups.forEach((g) => g.items.forEach((i) => tip(`${g.name} ${i.label}`, i)));
    else if (c.kind === 'logrange') c.rows.forEach((r) => tip(r.label, r));
    else if (c.kind === 'stages') c.rows.forEach((r) => { tip(r.model, r); r.steps.forEach((st) => tip(`${r.model} ${st.en}`, st)); });
  }
  summary.push(`${id} 主文 ${beats.length - details.length} 段、細節 ${details.length} 則、合計 ${total} 字${tips ? `、圖表說明 ${tips} 則` : ''}`);
}

summary.forEach((s) => console.log('  ' + s));
if (problems.length) {
  console.error(`✗ 主文規則 ${problems.length} 項未通過`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('✓ 主文規則全部通過');
