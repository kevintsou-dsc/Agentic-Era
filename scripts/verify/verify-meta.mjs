// 作者與職稱閘門：content/articles.json 中每位作者的姓名、英文名、職稱的每個片段，
// 都必須出現在該篇全文第一頁（內頁標題頁）。比對前做與引文相同的正規化。
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalize } from './normalize.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const { articles } = JSON.parse(readFileSync(join(root, 'content', 'articles.json'), 'utf8'));

const failures = [];
let checked = 0;
for (const a of articles) {
  const md = readFileSync(join(root, 'content', 'fulltext', `${a.id}.md`), 'utf8');
  const firstPage = normalize(md.split(/<!-- p\.\d+ -->/).slice(0, 3).join(''));
  if (a.org) {
    checked++;
    if (!firstPage.includes(normalize(a.org))) failures.push(`${a.id}（紙本 p.${a.pages[0]}）找不到機構「${a.org}」`);
  }
  for (const au of a.authors) {
    // 職稱可能被排版拆成多段（例如以「、」連接兩個頭銜），逐段檢查
    const parts = [au.name, au.en, ...au.title.split('、')].filter(Boolean);
    for (const part of parts) {
      checked++;
      if (!firstPage.includes(normalize(part))) failures.push(`${a.id}（紙本 p.${a.pages[0]}）找不到「${part}」`);
    }
  }
}

if (failures.length) {
  console.error(`✗ 作者與職稱比對失敗 ${failures.length}/${checked}`);
  failures.forEach((f) => console.error('  ' + f));
  process.exit(1);
}
console.log(`✓ 作者與職稱比對通過 ${checked}/${checked}（22 篇）`);
