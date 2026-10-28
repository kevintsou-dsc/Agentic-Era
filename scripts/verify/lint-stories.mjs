// 主文規則檢查（docs/story-guide.md §3）：
// 每段主文（beat、hscroll 格、圖表 detail）都是完整句子、不以冒號結尾、長度合理、有出處；
// 每篇主文合計 500–3,000 字（不追求 90 秒讀完；原文已條列的內容可以完整放入）。只檢查 src/data/stories/a*.ts。
// d3 圖表的說明框（§5.1）：每個可互動元素都要有策展補充 extra（至少 40 字）；原文內容寫進主文，不放進說明框。
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = fileURLToPath(new URL('../../src/data/stories/', import.meta.url));
// 作者中文名：主文不直呼（改用「作者」或省略主詞）；引文出處、圖說 source、引文 by 欄位不在此限
const articlesJson = JSON.parse(readFileSync(fileURLToPath(new URL('../../content/articles.json', import.meta.url)), 'utf8'));
const AUTHOR_NAMES = [...new Set((Array.isArray(articlesJson) ? articlesJson : articlesJson.articles).flatMap((x) => x.authors.map((au) => au.name)))];
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
  const budget = Number(src.match(/budget:\s*(\d+)/)?.[1] ?? 3000);
  if (total < 500 || total > budget) problems.push(`${id}：主文合計 ${total} 字，建議 500–${budget.toLocaleString()} 字`);
  // d3 說明框：Node 24 可直接載入 .ts（型別會被移除）
  const { story } = await import(pathToFileURL(join(dir, f)).href);
  let tips = 0;
  const tip = (name, o) => {
    tips++;
    const len = (o.extra ?? '').length;
    if (len < 40) problems.push(`${id}：圖表說明太薄（${len} 字）「${name}」，請補 extra（策展補充）`);
    if ('detail' in o || 'centerDetail' in o) problems.push(`${id}：圖表說明不放原文（detail）「${name}」，原文請寫進左側主文`);
  };
  // 細節卡（more）：不能只有連結，一定要有 text 說明「點開是什麼、跟這段的關係」（或原文、圖片）
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (o.more && !o.more.text && !o.more.quote && !o.more.image) problems.push(`${id}：細節卡「${o.more.title}」只有連結，請補 text 說明點開是什麼、跟這段的關係`);
    Object.values(o).forEach(walk);
  };
  walk(story.scenes);
  const scanNames = (o, key = '') => {
    if (typeof o === 'string') {
      if (['source', 'by', 'credit'].includes(key)) return;
      for (const n of AUTHOR_NAMES) if (o.includes(n)) problems.push(`${id}：主文直呼作者「${n}」（${key}）——改用「作者」或省略主詞`);
      return;
    }
    if (!o || typeof o !== 'object') return;
    if ('article' in o && 'page' in o) return; // 原文引句
    for (const [k, v] of Object.entries(o)) scanNames(v, Array.isArray(o) ? key : k);
  };
  scanNames({ oneLiner: story.oneLiner, asks: story.asks, scenes: story.scenes });
  for (const sc of story.scenes) {
    // 人形圖的實心比例必須等於大數字（例如 13／20＝65%）
    if (sc.kind === 'bignum' && sc.people && Math.abs((sc.people.filled / sc.people.total) * 100 - sc.value) > 0.5) {
      problems.push(`${id}：人形圖 ${sc.people.filled}/${sc.people.total} 與大數字 ${sc.value}${sc.unit} 不一致`);
    }
    // 案例模擬：主文段數＝情境＋方法＋每個模擬結果各一段
    if (sc.kind === 'graphic' && sc.graphic.type === 'case' && sc.beats.length !== 2 + sc.graphic.results.length) {
      problems.push(`${id}：案例「${sc.graphic.title}」有 ${sc.beats.length} 段主文，但畫面是 ${2 + sc.graphic.results.length} 個（情境＋方法＋${sc.graphic.results.length} 個模擬）`);
    }
    // 翻面卡每張都要有背面（desc）
    if (sc.kind === 'graphic' && sc.graphic.type === 'list' && sc.graphic.flip) {
      sc.graphic.items.filter((it) => !it.desc).forEach((it) => problems.push(`${id}：翻面卡「${it.title}」沒有背面（desc）`));
    }
    const c = sc.kind === 'graphic' && sc.graphic.type === 'd3' ? sc.graphic.chart : null;
    if (!c) continue;
    if (c.kind === 'flowloop') {
      // 高亮要對到主文：圓圈比段數多時，每個節點都要用 at 指定第幾段亮起
      if (c.nodes.length > sc.beats.length && c.nodes.some((nd) => nd.at == null)) problems.push(`${id}：循環圖「${c.title}」有 ${c.nodes.length} 個圓圈但只有 ${sc.beats.length} 段主文，請用 at 指定每個圓圈在第幾段亮起`);
      c.nodes.forEach((nd) => { if (nd.at != null && (nd.at < 1 || nd.at > sc.beats.length)) problems.push(`${id}：循環圖「${c.title}」的「${nd.label}」at=${nd.at} 超出主文段數`); });
      tip(c.center, { extra: c.centerExtra, ...('centerDetail' in c ? { centerDetail: c.centerDetail } : {}) });
      c.nodes.forEach((n) => tip(n.label, n));
    } else if (c.kind === 'groups') c.groups.forEach((g) => g.items.forEach((i) => tip(`${g.name} ${i.label}`, i)));
    else if (c.kind === 'logrange') c.rows.forEach((r) => tip(r.label, r));
    else if (c.kind === 'stages') c.rows.forEach((r) => { tip(r.model, r); r.steps.forEach((st) => tip(`${r.model} ${st.en}`, st)); });
    else if (c.kind === 'esov') [c.som, c.sov, c.result, ...c.fields, ...c.checks].forEach((o) => tip(o.label, o));
    else if (c.kind === 'allocate') [...c.layers, c.main, ...c.roles, c.once, c.asset].forEach((o) => tip(o.label, o));
    else if (c.kind === 'rings') c.rings.forEach((r) => tip(r.label, r));
    else if (c.kind === 'balance') [c.left, c.right, ...c.states].forEach((o) => tip(o.label, o));
    else if (c.kind === 'venn') [c.left, c.right, c.both].forEach((o) => tip(o.label, o));
    else if (c.kind === 'iceberg') [...c.above, ...c.below].forEach((o) => tip(o.label, o));
    else if (c.kind === 'spectrum') [...c.levels, ...c.markers].forEach((o) => tip(o.label, o));
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
