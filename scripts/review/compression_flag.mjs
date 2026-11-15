// 全站過度濃縮：彙整修改前盲讀，列出要判定的泡泡（compression-plan.md §六）。
// 任一讀者 ≤4 分且列入 stuck → 要判定；兩位都 stuck → 一定要改。
// 輸出 content/review/compression/judge/<短名>.json：泡泡原文、出處段落、讀者回報。
// 用法：node scripts/review/compression_flag.mjs <短名…>
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('../../content/review/compression/', import.meta.url));
let total = 0, totalBoth = 0, totalUnits = 0;
for (const slug of process.argv.slice(2)) {
  const u = JSON.parse(readFileSync(join(DIR, `${slug}.before.units.json`), 'utf8'));
  const readers = readdirSync(join(DIR, 'blind')).filter((f) => f.startsWith(`${slug}.before.`))
    .map((f) => JSON.parse(readFileSync(join(DIR, 'blind', f), 'utf8')));
  const flagged = [];
  for (const unit of u.units) {
    const reports = [];
    for (const r of readers) {
      const b = r.bubbles.find((x) => x.id === unit.id);
      const s = r.stuck.find((x) => x.id === unit.id);
      if (s && b && b.score <= 4) reports.push({ persona: r.persona, score: b.score, ...s });
    }
    if (!reports.length) continue;
    flagged.push({ id: unit.id, path: unit.path, heading: unit.heading, text: unit.text, chars: unit.chars,
      must: reports.length >= 2, scores: readers.map((r) => r.bubbles.find((x) => x.id === unit.id)?.score),
      reports, source: unit.source });
  }
  const mainChars = u.units.filter((x) => x.id !== 'ONE').reduce((a, x) => a + x.chars, 0);
  writeFileSync(join(DIR, 'judge', `${slug}.json`), JSON.stringify({ id: u.id, slug, title: u.title, main_chars: mainChars,
    growth_cap: Math.floor(mainChars * 0.25), flagged }, null, 1));
  const both = flagged.filter((f) => f.must).length;
  total += flagged.length; totalBoth += both; totalUnits += u.units.length;
  console.log(`${slug.padEnd(24)} ${u.id} 泡泡 ${String(u.units.length).padStart(3)}  要判定 ${String(flagged.length).padStart(3)}  兩位都卡 ${both}  主文 ${mainChars} 字`);
}
console.log(`合計 泡泡 ${totalUnits}  要判定 ${total}  兩位都卡 ${totalBoth}`);
