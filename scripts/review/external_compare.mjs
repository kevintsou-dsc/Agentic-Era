// 外部審稿批次盲讀比較：<批次> 版本 vs after 版本（外部審稿前）。
// 用法：node scripts/review/external_compare.mjs <批次> <改過的短名…> -- <對照組短名…>
// 分組：外部直改、忠實度修正（faith/<批次>-*.json 判 overclaim）、超過 140 字、未改。
// 輸出：content/review/compression/<批次>-compare.json 與終端摘要。
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CMP = fileURLToPath(new URL('../../content/review/compression/', import.meta.url));
const [batch, ...rest] = process.argv.slice(2);
const sep = rest.indexOf('--');
const edited = sep < 0 ? rest : rest.slice(0, sep);
const control = sep < 0 ? [] : rest.slice(sep + 1);
const P = ['newbie', 'engineer'];
const j = (f) => JSON.parse(readFileSync(CMP + f, 'utf8'));
const manifest = JSON.parse(readFileSync(fileURLToPath(new URL(`../../content/review/external/${batch}/manifest.json`, import.meta.url)), 'utf8'));
const slug2aid = Object.fromEntries(Object.entries(manifest.articles).map(([k, v]) => [v.slug, k]));
const titles = Object.fromEntries(Object.values(manifest.articles).map((v) => [v.slug, v.title]));

const faith = new Set();
for (const f of readdirSync(CMP + 'faith').filter((f) => f.startsWith(batch + '-') && !f.endsWith('.input.json'))) {
  for (const it of j('faith/' + f).items) if (it.verdict === 'overclaim' && it.fix) faith.add(`${it.article} ${it.id}`);
}

function read(slug, ver) {
  const r = {};
  for (const p of P) {
    const f = `blind/${slug}.${ver}.${p}.json`;
    if (!existsSync(CMP + f)) return null;
    r[p] = j(f);
  }
  return r;
}

function stats(slug, ver, ids) {
  const r = read(slug, ver);
  const out = { mean: 0, n: 0, stuck: 0, both: 0, low: 0, fluency: P.map((p) => r[p].overall_fluency) };
  const sc = Object.fromEntries(P.map((p) => [p, Object.fromEntries(r[p].bubbles.map((b) => [b.id, b]))]));
  const st = Object.fromEntries(P.map((p) => [p, new Set(r[p].stuck.map((s) => s.id))]));
  const per = {};
  for (const id of ids) {
    const s = P.map((p) => sc[p][id]?.score ?? null);
    const k = P.map((p) => st[p].has(id));
    per[id] = { s, k };
    for (const x of s) if (x != null) { out.mean += x; out.n++; if (x <= 3) out.low++; }
    out.stuck += k.filter(Boolean).length;
    if (k.every(Boolean)) out.both++;
  }
  out.mean = out.n ? out.mean / out.n : 0;
  return { out, per };
}

const groups = { 外部直改: [], 忠實度修正: [], 超過140字: [], 未改: [], 對照組: [] };
const articles = [];
for (const slug of [...edited, ...control]) {
  const a = j(`${slug}.after.units.json`).units;
  const b = j(`${slug}.${batch}.units.json`).units;
  const ids = b.map((u) => u.id);
  const before = stats(slug, 'after', ids);
  const after = stats(slug, batch, ids);
  const isCtl = control.includes(slug);
  for (const [i, u] of b.entries()) {
    const changed = a[i]?.text !== u.text;
    const key = `${slug2aid[slug] ?? slug} ${u.id}`;
    const row = { slug, id: u.id, len: u.text.length, before: before.per[u.id], after: after.per[u.id], text: u.text, old: a[i]?.text };
    if (isCtl) groups.對照組.push(row);
    else if (!changed) groups.未改.push(row);
    else {
      (faith.has(key) ? groups.忠實度修正 : groups.外部直改).push(row);
      if (u.text.length > 140) groups.超過140字.push(row);
    }
  }
  articles.push({ slug, title: titles[slug] ?? slug, control: isCtl, before: before.out, after: after.out });
}

function sum(rows) {
  const g = { n: rows.length, b: 0, a: 0, bn: 0, an: 0, bs: 0, as: 0, bb: 0, ab: 0, bl: 0, al: 0, worse: 0, better: 0 };
  for (const r of rows) {
    const bm = r.before.s.filter((x) => x != null), am = r.after.s.filter((x) => x != null);
    g.b += bm.reduce((x, y) => x + y, 0); g.bn += bm.length;
    g.a += am.reduce((x, y) => x + y, 0); g.an += am.length;
    g.bs += r.before.k.filter(Boolean).length; g.as += r.after.k.filter(Boolean).length;
    if (r.before.k.every(Boolean)) g.bb++;
    if (r.after.k.every(Boolean)) g.ab++;
    g.bl += bm.filter((x) => x <= 3).length; g.al += am.filter((x) => x <= 3).length;
    const d = am.reduce((x, y) => x + y, 0) / am.length - bm.reduce((x, y) => x + y, 0) / bm.length;
    if (d <= -1) g.worse++;
    if (d >= 1) g.better++;
  }
  return { n: g.n, mean: [g.b / g.bn, g.a / g.an].map((x) => +x.toFixed(2)), stuck: [g.bs, g.as], both: [g.bb, g.ab], low: [g.bl, g.al], better: g.better, worse: g.worse };
}

const summary = Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, sum(v)]));
const regress = [...groups.外部直改, ...groups.忠實度修正].filter((r) => {
  const bm = r.before.s.reduce((x, y) => x + y, 0) / 2, am = r.after.s.reduce((x, y) => x + y, 0) / 2;
  return am - bm <= -1 || (r.after.k.every(Boolean) && !r.before.k.every(Boolean));
}).map((r) => ({ slug: r.slug, title: titles[r.slug], id: r.id, before: r.before, after: r.after, old: r.old, text: r.text }));
const stillBoth = [...groups.外部直改, ...groups.忠實度修正, ...groups.未改].filter((r) => r.after.k.every(Boolean))
  .map((r) => ({ slug: r.slug, title: titles[r.slug], id: r.id, changed: r.old !== r.text, after: r.after, text: r.text }));

writeFileSync(CMP + `${batch}-compare.json`, JSON.stringify({ summary, articles, regress, stillBoth }, null, 1));
console.log('分組（前→後）');
for (const [k, s] of Object.entries(summary)) console.log(`${k}\t${s.n} 則\t平均 ${s.mean[0]}→${s.mean[1]}\t卡住 ${s.stuck[0]}→${s.stuck[1]}\t兩位都卡 ${s.both[0]}→${s.both[1]}\t≤3 ${s.low[0]}→${s.low[1]}\t升≥1 ${s.better}\t降≥1 ${s.worse}`);
console.log('\n逐篇（平均、通順）');
for (const a of articles) console.log(`${a.control ? '［對照］' : ''}${a.title}\t${a.before.mean.toFixed(2)}→${a.after.mean.toFixed(2)}\t通順 ${a.before.fluency.join('/')}→${a.after.fluency.join('/')}\t兩位都卡 ${a.before.both}→${a.after.both}`);
console.log(`\n退步 ${regress.length} 則；仍兩位都卡 ${stillBoth.length} 則（改過 ${stillBoth.filter((r) => r.changed).length}）`);
