// 建置後的斷鏈檢查：dist/ 內每個 HTML 的站內連結（href／src，含 #錨點）都必須指到存在的檔案或 id。
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../../dist/', import.meta.url));
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(dist).filter((f) => f.endsWith('.html'));

const idsOf = new Map(pages.map((p) => [p, new Set([...readFileSync(p, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));

function resolve(from, url) {
  const [path, hash] = url.split('#');
  let target;
  if (!path) target = from;
  else {
    const abs = path.startsWith('/') ? join(dist, path) : join(dirname(from), path);
    target = existsSync(abs) && statSync(abs).isDirectory() ? join(abs, 'index.html') : abs;
  }
  return { target, hash };
}

const broken = [];
let count = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    count++;
    const { target, hash } = resolve(page, url);
    if (!existsSync(target)) { broken.push(`${relative(dist, page)} → ${url}（檔案不存在）`); continue; }
    if (hash && target.endsWith('.html') && !idsOf.get(target)?.has(hash)) broken.push(`${relative(dist, page)} → ${url}（找不到錨點）`);
  }
}

if (broken.length) {
  console.error(`✗ 站內斷鏈 ${broken.length}/${count}`);
  broken.forEach((b) => console.error('  ' + b));
  process.exit(1);
}
console.log(`✓ 站內連結全部有效 ${count}/${count}（${pages.length} 頁）`);
