// 過度濃縮試跑：彙整盲讀結果，比較修改前後（docs/review/compression-plan.md §二 步驟 7）。
// 讀 content/review/compression/blind/<短名>.<標籤>.<讀者>.json 與 <短名>.<標籤>.units.json。
// 用法：node scripts/review/compression_compare.mjs <短名> [before after]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../../content/review/compression/', import.meta.url));
const [slug, ...labels] = process.argv.slice(2);
const want = labels.length ? labels : ['before', 'after'];

function stats(label) {
  const files = readdirSync(join(DIR, 'blind')).filter((f) => f.startsWith(`${slug}.${label}.`) && f.endsWith('.json'));
  if (!files.length) return null;
  const units = JSON.parse(readFileSync(join(DIR, `${slug}.${label}.units.json`), 'utf8')).units;
  const readers = files.map((f) => JSON.parse(readFileSync(join(DIR, 'blind', f), 'utf8')));
  const ids = units.map((u) => u.id);
  const per = {};
  for (const r of readers) for (const b of r.bubbles) (per[b.id] ??= []).push(b.score);
  const stuckBy = {};
  for (const r of readers) for (const s of r.stuck) (stuckBy[s.id] ??= new Set()).add(r.persona);
  const all = readers.flatMap((r) => r.bubbles.filter((b) => ids.includes(b.id)).map((b) => b.score));
  const types = {};
  for (const r of readers) for (const s of r.stuck) for (const t of s.types) types[t] = (types[t] ?? 0) + 1;
  const missing = readers.map((r) => ids.filter((i) => !r.bubbles.some((b) => b.id === i)).length);
  return {
    label, readers: readers.length, bubbles: ids.length, missing,
    mean: +(all.reduce((a, b) => a + b, 0) / all.length).toFixed(2),
    low: Object.entries(per).filter(([id, s]) => ids.includes(id) && Math.min(...s) <= 3).length,
    stuck: readers.reduce((a, r) => a + r.stuck.length, 0),
    both: Object.values(stuckBy).filter((s) => s.size >= 2).length,
    overall: readers.map((r) => `${r.persona} ${r.overall_fluency}`).join('、'),
    types,
    chars: units.filter((u) => u.id !== 'ONE').reduce((a, u) => a + u.chars, 0),
    takeaway: Object.fromEntries(readers.map((r) => [r.persona, r.takeaway])),
  };
}

for (const l of want) {
  const s = stats(l);
  if (!s) { console.log(`${slug}.${l}：還沒有盲讀結果`); continue; }
  console.log(`== ${slug}｜${l}（讀者 ${s.readers}、主文含一句話 ${s.bubbles} 則、主文 ${s.chars} 字${s.missing.some(Boolean) ? `、漏評 ${s.missing}` : ''}）`);
  console.log(`  平均分 ${s.mean}｜任一讀者 ≤3 分的泡泡 ${s.low}｜卡住點 ${s.stuck}｜兩位都卡 ${s.both}｜整篇通順 ${s.overall}`);
  console.log(`  卡住類型 ${JSON.stringify(s.types)}`);
}
