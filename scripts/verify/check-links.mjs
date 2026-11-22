// 建置後的斷鏈檢查：dist/ 內每個 HTML 的站內連結（href／src，含 #錨點）都必須指到存在的檔案或 id。
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const dist = fileURLToPath(new URL('../../dist/', import.meta.url));
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(dist).filter((f) => f.endsWith('.html'));

const idsOf = new Map(pages.map((p) => [p, new Set([...readFileSync(p, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));

function resolve(from, url) {
  // 查詢字串（例如首頁 ?hero=c）不影響檔案是否存在，比對前先去掉
  const [withQuery, hash] = url.split('#');
  const path = withQuery.split('?')[0];
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
  // 分享預覽圖（og:image）也要存在；正式網域的絕對網址取路徑部分比對
  for (const m of html.matchAll(/<meta property="og:image" content="([^"]+)"/g)) {
    count++;
    const path = m[1].replace(/^https?:\/\/[^/]+/, '');
    if (!existsSync(join(dist, path))) broken.push(`${relative(dist, page)} → ${m[1]}（分享預覽圖不存在，跑 npm run og）`);
  }
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

// CSP：public/_headers 只允許 script-src 'self' 與列出的 sha256；HTML 裡每段行內 <script> 的雜湊都必須在清單裡，否則上線後會被瀏覽器擋掉
const headers = readFileSync(fileURLToPath(new URL('../../public/_headers', import.meta.url)), 'utf8');
const allowed = new Set([...headers.matchAll(/'sha256-([^']+)'/g)].map((m) => m[1]));
const blocked = new Set();
for (const page of pages) {
  for (const m of readFileSync(page, 'utf8').matchAll(/<script(?![^>]* src=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const h = createHash('sha256').update(m[1]).digest('base64');
    if (!allowed.has(h)) blocked.add(`${relative(dist, page)}：sha256-${h}`);
  }
}
if (blocked.size) {
  console.error(`✗ 行內 script 不在 CSP 允許清單（上線會被擋），請把雜湊加進 public/_headers 的 script-src：`);
  blocked.forEach((b) => console.error('  ' + b));
  process.exit(1);
}

const requiredHeaders = [
  ['CSP default-src', /default-src\s+'self'/],
  ['Strict-Transport-Security', /Strict-Transport-Security:\s*max-age=\d+/i],
  ['X-Content-Type-Options', /X-Content-Type-Options:\s*nosniff/i],
  ['X-Frame-Options', /X-Frame-Options:\s*DENY/i],
  ['Referrer-Policy', /Referrer-Policy:\s*\S+/i],
  ['Permissions-Policy', /Permissions-Policy:\s*\S+/i],
  ['Cross-Origin-Opener-Policy', /Cross-Origin-Opener-Policy:\s*same-origin/i],
];
const missingHeaders = requiredHeaders.filter(([, re]) => !re.test(headers)).map(([name]) => name);
if (missingHeaders.length) {
  console.error(`✗ public/_headers 缺少必要安全標頭：${missingHeaders.join('、')}`);
  process.exit(1);
}
console.log('✓ 安全標頭與 CSP SHA-256 驗證通過');
