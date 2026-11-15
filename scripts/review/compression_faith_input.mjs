// 全站過度濃縮：替忠實度覆核準備輸入（只放原文出處 → 改前 → 改後，不放讀者回報）。
// 輸出 content/review/compression/faith/<批名>.input.json
// 用法：node scripts/review/compression_faith_input.mjs <批名> <短名…>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('../../content/review/compression/', import.meta.url));
const [batch, ...slugs] = process.argv.slice(2);
const items = [];
for (const slug of slugs) {
  const e = JSON.parse(readFileSync(join(DIR, 'edits', `${slug}.json`), 'utf8'));
  const units = JSON.parse(readFileSync(join(DIR, `${slug}.before.units.json`), 'utf8')).units;
  for (const x of e.edits.filter((x) => x.verdict === 'fix')) {
    const u = units.find((u) => u.id === x.id);
    items.push({ slug, article: e.id, id: x.id, before: x.old, after: x.new, source: u?.source ?? [] });
  }
}
writeFileSync(join(DIR, 'faith', `${batch}.input.json`), JSON.stringify(items, null, 1));
console.log(`${batch}: ${items.length} 則`);
