// 襯線顯示字涵蓋檢查（docs/design-review/p1-02-ruling.md L7）：標題、陳述、引言、問題裡的字都要在 public/fonts 的子集裡。
// 預設只提示（缺的字瀏覽器會用無襯線補上，頁面不會壞）；--strict（verify:release）時擋下。補字：npm run fonts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { collect } from '../fonts/display-chars.mjs';

const strict = process.argv.includes('--strict');
const covered = JSON.parse(readFileSync(fileURLToPath(new URL('../../content/fonts/serif-covered.json', import.meta.url)), 'utf8'));
const need = await collect();
const gaps = [];
for (const [key, label] of [['display', '標題與陳述（900）'], ['text', '引言與問題（700）']]) {
  const ok = new Set([...(covered[key] ?? ''), ...(covered[`${key}_unavailable`] ?? '')]);
  const miss = [...need[key]].filter((c) => !/\s/.test(c) && !ok.has(c));
  if (miss.length) gaps.push(`${label}缺 ${miss.length} 字：${miss.join('')}`);
}
if (!gaps.length) console.log('✓ 襯線顯示字涵蓋全部顯示文字');
else {
  const mark = strict ? '✗' : '⚠';
  gaps.forEach((g) => console.log(`${mark} 襯線子集${g}（跑 npm run fonts 補字）`));
  if (strict) process.exit(1);
}
