// 全站過度濃縮：彙整修改前後盲讀，分改寫與對照兩組（docs/review/compression-fullsite.md）。
// 用法：node scripts/review/compression_fullsite.mjs <短名…>
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('../../content/review/compression/', import.meta.url));
const load = (slug, label) => {
  const units = JSON.parse(readFileSync(join(DIR, `${slug}.${label}.units.json`), 'utf8')).units;
  const readers = readdirSync(join(DIR, 'blind')).filter((f) => f.startsWith(`${slug}.${label}.`))
    .map((f) => JSON.parse(readFileSync(join(DIR, 'blind', f), 'utf8')));
  return { units, readers };
};
const mean = (a) => a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : null;
function stats({ units, readers }, fixed) {
  const ids = units.map((u) => u.id);
  const sc = (pred) => readers.flatMap((r) => r.bubbles.filter((b) => ids.includes(b.id) && pred(b.id)).map((b) => b.score));
  const per = {};
  for (const r of readers) for (const b of r.bubbles) if (ids.includes(b.id)) (per[b.id] ??= []).push(b.score);
  const stuckBy = {};
  for (const r of readers) for (const s of r.stuck) if (ids.includes(s.id)) (stuckBy[s.id] ??= new Set()).add(r.persona);
  const types = {};
  for (const r of readers) for (const s of r.stuck) for (const t of s.types) types[t] = (types[t] ?? 0) + 1;
  return {
    all: sc(() => true), fix: sc((id) => fixed.has(id)), ctl: sc((id) => !fixed.has(id)),
    low: Object.values(per).filter((s) => Math.min(...s) <= 3).length,
    stuck: readers.reduce((a, r) => a + r.stuck.filter((s) => ids.includes(s.id)).length, 0),
    both: Object.values(stuckBy).filter((s) => s.size >= 2).length,
    overall: readers.map((r) => r.overall_fluency), types,
    chars: units.filter((u) => u.id !== 'ONE').reduce((a, u) => a + u.chars, 0), n: ids.length,
  };
}
const rows = [];
const tot = { b: { all: [], fix: [], ctl: [], low: 0, stuck: 0, both: 0, overall: [], types: {}, chars: 0 }, a: null };
tot.a = structuredClone(tot.b);
let nFix = 0, nUnits = 0;
for (const slug of process.argv.slice(2)) {
  const e = JSON.parse(readFileSync(join(DIR, 'edits', `${slug}.json`), 'utf8'));
  const fixed = new Set(e.edits.filter((x) => x.verdict === 'fix').map((x) => x.id));
  const b = stats(load(slug, 'before'), fixed);
  const hasAfter = readdirSync(join(DIR, 'blind')).some((f) => f.startsWith(`${slug}.after.`));
  const a = hasAfter ? stats(load(slug, 'after'), fixed) : null;
  nFix += fixed.size; nUnits += b.n;
  for (const [k, s] of [['b', b], ['a', a]]) {
    if (!s) continue;
    const t = tot[k];
    t.all.push(...s.all); t.fix.push(...s.fix); t.ctl.push(...s.ctl); t.overall.push(...s.overall);
    t.low += s.low; t.stuck += s.stuck; t.both += s.both; t.chars += s.chars;
    for (const [ty, c] of Object.entries(s.types)) t.types[ty] = (t.types[ty] ?? 0) + c;
  }
  rows.push(`| ${e.id} ${slug} | ${fixed.size}/${b.n} | ${mean(b.all)} → ${a ? mean(a.all) : '—'} | ${mean(b.fix)} → ${a ? mean(a.fix) : '—'} | ${mean(b.ctl)} → ${a ? mean(a.ctl) : '—'} | ${b.stuck} → ${a?.stuck ?? '—'} | ${b.both} → ${a?.both ?? '—'} | ${b.overall.join('、')} → ${a ? a.overall.join('、') : '—'} | ${b.chars} → ${a?.chars ?? '—'} |`);
}
console.log('| 文章 | 改寫／泡泡 | 平均分 | 改寫組 | 對照組 | 卡住點 | 兩位都卡 | 整篇通順 | 主文字數 |');
console.log('|---|---|---|---|---|---|---|---|---|');
console.log(rows.join('\n'));
const { b, a } = tot;
console.log(`\n合計：泡泡 ${nUnits}，改寫 ${nFix}`);
console.log(`平均分 ${mean(b.all)} → ${mean(a.all)}｜改寫組 ${mean(b.fix)} → ${mean(a.fix)}｜對照組 ${mean(b.ctl)} → ${mean(a.ctl)}`);
console.log(`任一讀者 ≤3 分 ${b.low} → ${a.low}｜卡住點 ${b.stuck} → ${a.stuck}｜兩位都卡 ${b.both} → ${a.both}｜整篇通順平均 ${mean(b.overall)} → ${mean(a.overall)}｜主文 ${b.chars} → ${a.chars}（${((a.chars / b.chars - 1) * 100).toFixed(1)}%）`);
console.log('類型', Object.keys({ ...b.types, ...a.types }).sort().map((t) => `${t} ${b.types[t] ?? 0}→${a.types[t] ?? 0}`).join('｜'));
