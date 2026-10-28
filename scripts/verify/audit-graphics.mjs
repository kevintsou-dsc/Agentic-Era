// 全站圖表盤點（人工審視用，不是 gate）：每個場景的圖表類型、元素數、主文段數、at 對應，並標出可疑之處。
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const dir = fileURLToPath(new URL('../../src/data/stories/', import.meta.url));
// 會讓圖改變的步驟：元素的 at，以及 centerAt／morphAt（中心浮現、壓平、拼合）等整張圖的變化點
const ats = (o, out = []) => { if (o && typeof o === 'object') { for (const [k, v] of Object.entries(o)) { if (typeof v === 'number' && /^(at|centerAt|morphAt|leftAt|rightAt|bothAt|failAt)$/.test(k)) out.push(v); else ats(v, out); } } return out; };
for (const f of readdirSync(dir).filter((x) => /^a\d+\.ts$/.test(x)).sort()) {
  const { story } = await import(pathToFileURL(join(dir, f)).href);
  story.scenes.forEach((s, i) => {
    const flags = [];
    let desc = s.kind;
    if (s.kind === 'graphic') {
      const g = s.graphic;
      desc = g.type + (g.art ? `:${g.art}` : '') + (g.chart ? `:${g.chart.kind}` : '') + (g.layout ? `/${g.layout}` : '') + (g.flip ? '/flip' : '');
      const n = s.beats.length;
      const a = ats(g);
      const max = a.length ? Math.max(...a) : 0;
      if (max > n) flags.push(`at 最大 ${max} > 段數 ${n}（永遠不亮）`);
      const items = g.items ?? g.bars ?? g.rows ?? g.chart?.nodes ?? g.chart?.rows ?? g.cases ?? [];
      if (g.type === 'list' && !g.layout && !g.flip) flags.push(`純卡片清單 ${items.length} 張`);
      if (a.length > 1 && new Set(a).size === 1 && n > 1) flags.push(`全部元素同一段亮起（at=${a[0]}），其他 ${n - 1} 段圖不變`);
      const long = items.filter((it) => (it.desc ?? '').length > 60).length;
      if (long) flags.push(`${long} 項說明 >60 字`);
      desc += ` items=${items.length} beats=${n}`;
    }
    if (s.kind === 'hscroll') desc += ` panels=${s.panels.length}`;
    if (flags.length || s.kind === 'graphic') console.log(`${f.slice(0, 3)} #${i} ${desc}${flags.length ? '  ⚠ ' + flags.join('；') : ''}`);
  });
}
