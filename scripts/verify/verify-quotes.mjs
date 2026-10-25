// 逐字比對：src/ 下所有 .ts 檔中每一則 { article: 'aNN', page: N, text: '…' } 必須是
// content/fulltext/aNN.md 的子字串，且出現在宣告的紙本頁（允許跨到下一頁）。失敗時列出實際頁碼並以非零碼結束。
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalize } from './normalize.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const fulltextDir = join(root, 'content', 'fulltext');

// 依 <!-- p.N --> 切出每頁文字；去掉全文格式的行首記號（## 標題、> 圖說、| 側欄、[註] 註解）
function pages(md) {
  const out = new Map();
  let page = null;
  for (const raw of md.replace(/\r\n?/g, '\n').split('\n')) {
    const m = raw.match(/<!-- p\.(\d+) -->/);
    if (m) { page = Number(m[1]); continue; }
    const line = raw.replace(/^(## |> |\| |\[註\] )/, '');
    if (page !== null) out.set(page, (out.get(page) ?? '') + line);
  }
  return out;
}

// 圖表裡的文字（content/figtext）也算原文：圖中的數字與標籤可以被引用，但不放進閱讀用的全文
const figDir = join(root, 'content', 'figtext');
function merge(a, b) {
  for (const [k, v] of b) a.set(k, (a.get(k) ?? '') + v);
  return a;
}

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : [];
  });
}

const corpus = {};
for (const f of readdirSync(fulltextDir).filter((f) => /^a\d+\.md$/.test(f))) {
  const p = pages(readFileSync(join(fulltextDir, f), 'utf8'));
  const fig = join(figDir, f);
  if (statSync(fig, { throwIfNoEntry: false })) merge(p, pages(readFileSync(fig, 'utf8')));
  corpus[f.slice(0, 3)] = new Map([...p].map(([k, v]) => [k, normalize(v)]));
}

const entry = /\{\s*article:\s*'(a\d\d)',\s*page:\s*(\d+),\s*text:\s*'((?:[^'\\]|\\.)*)'\s*\}/g;
let total = 0;
const failures = [];
for (const file of walk(join(root, 'src'))) {
  const src = readFileSync(file, 'utf8');
  const name = relative(root, file);
  for (const m of src.matchAll(entry)) {
    total++;
    const [, article, pageStr, raw] = m;
    const page = Number(pageStr);
    const text = normalize(raw.replace(/\\'/g, "'"));
    const doc = corpus[article];
    if (!doc) { failures.push(`${name}: 找不到文章 ${article}`); continue; }
    // 只接受：整句在宣告頁；或句子確實跨越宣告頁與下一頁的頁界
    const thisPage = doc.get(page) ?? '';
    const nextPage = doc.get(page + 1) ?? '';
    if (thisPage.includes(text)) continue;
    if ((thisPage + nextPage).includes(text) && !nextPage.includes(text)) continue;
    const foundOn = [...doc].find(([, t]) => t.includes(text));
    failures.push(foundOn
      ? `${name}: ${article}「${raw.slice(0, 24)}…」頁碼錯誤：宣告 p.${page}，實際在 p.${foundOn[0]}`
      : `${name}: ${article} p.${page} 找不到「${raw.slice(0, 40)}…」`);
  }
}

if (failures.length) {
  console.error(`✗ 引文比對失敗 ${failures.length}/${total}`);
  failures.forEach((x) => console.error('  ' + x));
  process.exit(1);
}
console.log(`✓ 引文與數字逐字比對通過 ${total}/${total}`);
