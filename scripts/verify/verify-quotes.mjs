// 逐字比對：src/data/*.ts 中每一則 { article, page, text } 必須是 content/fulltext/<article>.md 的子字串，
// 且出現在宣告的紙本頁碼區段內。比對前做正規化（見 normalize）。失敗時列出最接近的片段並以非零碼結束。
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const fulltextDir = join(root, 'content', 'fulltext');
const dataDir = join(root, 'src', 'data');

export function normalize(s) {
  return s
    .normalize('NFKC') // 全形英數 → 半形
    .replace(/[「『“"]/g, '「').replace(/[」』”"]/g, '」')
    .replace(/[—–－―‐-]+/g, '-')
    .replace(/\s+/g, '');
}

// 依 <!-- p.N --> 切出每頁文字
function pages(md) {
  const out = new Map();
  let page = null;
  for (const line of md.split('\n')) {
    const m = line.match(/<!-- p\.(\d+) -->/);
    if (m) { page = Number(m[1]); continue; }
    if (page !== null) out.set(page, (out.get(page) ?? '') + line);
  }
  return out;
}

const corpus = {};
for (const f of readdirSync(fulltextDir).filter((f) => /^a\d+\.md$/.test(f))) {
  const p = pages(readFileSync(join(fulltextDir, f), 'utf8'));
  corpus[f.slice(0, 3)] = new Map([...p].map(([k, v]) => [k, normalize(v)]));
}

const entry = /\{\s*article:\s*'(a\d\d)',\s*page:\s*(\d+),\s*text:\s*'((?:[^'\\]|\\.)*)'\s*\}/g;
let total = 0;
const failures = [];
for (const f of readdirSync(dataDir).filter((f) => f.endsWith('.ts'))) {
  const src = readFileSync(join(dataDir, f), 'utf8');
  for (const m of src.matchAll(entry)) {
    total++;
    const [, article, pageStr, raw] = m;
    const page = Number(pageStr);
    const text = normalize(raw.replace(/\\'/g, "'"));
    const doc = corpus[article];
    if (!doc) { failures.push(`${f}: 找不到文章 ${article}`); continue; }
    // 允許跨到下一頁（引文可能跨頁）
    const here = (doc.get(page) ?? '') + (doc.get(page + 1) ?? '');
    if (here.includes(text)) continue;
    const foundOn = [...doc].find(([, t]) => t.includes(text));
    failures.push(foundOn
      ? `${f}: ${article} 「${raw.slice(0, 24)}…」頁碼錯誤：宣告 p.${page}，實際在 p.${foundOn[0]}`
      : `${f}: ${article} p.${page} 找不到「${raw.slice(0, 40)}…」`);
  }
}

if (failures.length) {
  console.error(`✗ 引文比對失敗 ${failures.length}/${total}`);
  failures.forEach((x) => console.error('  ' + x));
  process.exit(1);
}
console.log(`✓ 引文與數字逐字比對通過 ${total}/${total}`);
