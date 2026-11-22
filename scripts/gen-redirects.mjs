// 舊網址（紙本頁碼 /a/p96）→ 新網址：產生 Cloudflare 靜態資產的 _redirects。
// 結尾有沒有斜線都要 301（Astro 的 redirects 只產生 meta refresh 頁，線上 /a/p96/ 曾經 404）。
import { readFileSync, writeFileSync } from 'node:fs';
const legacy = JSON.parse(readFileSync(new URL('../content/legacy-slugs.json', import.meta.url), 'utf8'));
const lines = ['# 由 scripts/gen-redirects.mjs 產生，請勿手改'];
for (const [o, n] of Object.entries(legacy)) {
  for (const s of ['', '/']) {
    lines.push(`/a/${o}${s} /story/${n}/ 301`);
    lines.push(`/a/${o}/full${s} /story/${n}/original/ 301`);
  }
}
writeFileSync(new URL('../public/_redirects', import.meta.url), lines.join('\n') + '\n');
console.log(`_redirects：${lines.length - 1} 條`);
