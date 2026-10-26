// d3 互動圖表。每張圖：
//   1. 依所在 .graphic 的 data-step（捲動到第幾段主文）逐步揭示
//   2. 進入視窗時才跑循環動畫（requestAnimationFrame），離開就停；偏好「減少動態」時只畫靜態最終狀態
// 圖表資料由 src/components/d3/D3Chart.astro 以 data-d3 屬性傳入（JSON）。
import { select } from 'd3-selection';
import { scaleLinear, scaleLog, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import type { D3Chart, Tipped } from '../lib/story';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Instance { update(step: number): void; tick?(t: number): void }

// ---------- 圖表元素的說明框：滑鼠移上去、鍵盤聚焦或手指點一下都會出現 ----------
// 說明框只放策展補充（原文內容寫在左側主文，整張圖的出處只標一次）
interface Tip { title: string; body?: string; extra?: string }

function tipLayer(el: HTMLElement) {
  const box = document.createElement('div');
  box.className = 'd3-tip';
  box.setAttribute('role', 'tooltip');
  box.hidden = true;
  el.appendChild(box);
  let pinned: Element | null = null;
  const show = (t: Tip, target: Element, ev?: PointerEvent) => {
    box.replaceChildren();
    const h = document.createElement('b');
    h.textContent = t.title;
    box.append(h);
    const section = (cls: string, label: string | null, txt?: string) => {
      if (!txt) return;
      const p = document.createElement('p');
      p.className = cls;
      if (label) {
        const tag = document.createElement('span');
        tag.className = 'tip-tag';
        tag.textContent = label;
        p.append(tag);
      }
      p.append(txt);
      box.append(p);
    };
    section('tip-body', null, t.body);
    section('tip-extra', '策展補充（非原文）', t.extra);
    box.hidden = false;
    const host = el.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    const x = ev ? ev.clientX - host.left : r.left + r.width / 2 - host.left;
    const y = (ev ? ev.clientY : r.top) - host.top;
    const w = box.offsetWidth;
    box.style.left = `${Math.max(0, Math.min(host.width - w, x - w / 2))}px`;
    // 放在指標上方；上方空間不夠就放下方
    const above = y - box.offsetHeight - 14;
    box.style.top = `${above > 0 ? above : y + (ev ? 18 : r.height + 8)}px`;
  };
  const hide = () => { box.hidden = true; pinned = null; };
  document.addEventListener('pointerdown', (e) => { if (pinned && !(e.target as Element).closest('.d3')) hide(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  return function bind(target: Element, t: Tip) {
    target.setAttribute('tabindex', '0');
    target.setAttribute('role', 'button');
    target.setAttribute('aria-label', [t.title, t.body, t.extra && `策展補充：${t.extra}`].filter(Boolean).join('。'));
    target.classList.add('has-tip');
    target.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') show(t, target, e as PointerEvent); });
    target.addEventListener('pointermove', (e) => { if ((e as PointerEvent).pointerType === 'mouse' && !pinned) show(t, target, e as PointerEvent); });
    target.addEventListener('pointerleave', (e) => { if ((e as PointerEvent).pointerType === 'mouse' && !pinned) hide(); });
    target.addEventListener('focus', () => show(t, target));
    target.addEventListener('blur', () => { if (!pinned) hide(); });
    // 觸控：點一下固定顯示，再點一次或點別處關閉
    target.addEventListener('click', () => {
      if (pinned === target) { hide(); return; }
      show(t, target);
      pinned = target;
    });
  };
}

// ---------- flowloop：節點圍成一圈，粒子沿弧線流動 ----------
function flowloop(el: HTMLElement, c: Extract<D3Chart, { kind: 'flowloop' }>): Instance {
  const W = 520, H = 440, cx = W / 2, cy = H / 2, R = 160;
  const n = c.nodes.length;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'fl');
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pos = (a: number, r = R) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  // 弧線（節點 i → i+1），用圓弧路徑，粒子沿 getPointAtLength 移動
  const arcs = svg.append('g').attr('class', 'fl-arcs');
  const paths = c.nodes.map((_, i) => {
    const a0 = ang(i) + 0.32, a1 = ang(i + 1) - 0.32;
    const [x0, y0] = pos(a0), [x1, y1] = pos(a1);
    return arcs.append('path').attr('d', `M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1}`).attr('class', 'fl-arc').attr('pathLength', 1);
  });
  const center = svg.append('g').attr('class', 'fl-center');
  const core = center.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 62);
  center.append('text').attr('x', cx).attr('y', cy + 7).attr('text-anchor', 'middle').text(c.center);
  const nodes = svg.append('g').selectAll('g').data(c.nodes).join('g').attr('class', 'fl-node')
    .attr('transform', (_, i) => `translate(${pos(ang(i)).join(',')})`);
  nodes.append('circle').attr('r', 46);
  nodes.append('text').attr('class', 'fl-label').attr('text-anchor', 'middle').attr('y', (d) => (d.sub ? -2 : 6)).text((d) => d.label);
  nodes.filter((d) => !!d.sub).append('text').attr('class', 'fl-sub').attr('text-anchor', 'middle').attr('y', 16).text((d) => d.sub!);
  const bind = tipLayer(el);
  if (c.centerExtra) bind(center.node()!, { title: c.center, extra: c.centerExtra });
  nodes.each(function (d) {
    bind(this, { title: d.label + (d.sub ? `　${d.sub}` : ''), body: d.desc, extra: d.extra });
  });
  // 粒子：每條弧 3 顆
  const dots = svg.append('g').attr('class', 'fl-dots');
  const particles = paths.flatMap((p, i) => [0, 0.33, 0.66].map((o) => ({ el: dots.append('circle').attr('r', 4.5).node()!, path: p.node()!, i, o })));
  let shown = 0;
  return {
    update(step) {
      shown = Math.min(n, step);
      nodes.classed('on', (_, i) => i < shown);
      paths.forEach((p, i) => p.classed('on', i < shown));
      core.classed('shrink', !!c.shrink && step > n);
    },
    tick(t) {
      for (const pt of particles) {
        const visible = pt.i < shown;
        pt.el.style.opacity = visible ? '1' : '0';
        if (!visible) continue;
        const len = pt.path.getTotalLength();
        const k = ((t / 2600 + pt.o) % 1);
        const p = pt.path.getPointAtLength(k * len);
        pt.el.setAttribute('cx', String(p.x));
        pt.el.setAttribute('cy', String(p.y));
      }
    },
  };
}

// ---------- groups：多組橫條（例如不同世代），第 k 步出現第 k 組 ----------
function groups(el: HTMLElement, c: Extract<D3Chart, { kind: 'groups' }>): Instance {
  const rowH = 30, gap = 34, W = 520, left = 118, right = 64;
  const H = c.groups.reduce((s, g) => s + 28 + g.items.length * rowH, 0) + gap * (c.groups.length - 1) + 10;
  const x = scaleLinear().domain([0, max(c.groups.flatMap((g) => g.items.map((i) => i.value))) ?? 1]).range([0, W - left - right]).nice();
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'gr');
  let y = 0;
  const gs = c.groups.map((g) => {
    const top = y;
    const gg = svg.append('g').attr('class', 'gr-group').attr('transform', `translate(0,${top})`);
    gg.append('text').attr('class', 'gr-name').attr('y', 18).text(g.name + (g.sub ? `｜${g.sub}` : ''));
    const best = max(g.items, (i) => i.value);
    const rows = gg.selectAll('g.row').data(g.items).join('g').attr('class', 'row').attr('transform', (_, i) => `translate(0,${28 + i * rowH})`);
    rows.append('text').attr('class', 'gr-label').attr('x', left - 10).attr('y', rowH / 2 + 4).attr('text-anchor', 'end').text((d) => d.label);
    rows.append('rect').attr('class', 'gr-track').attr('x', left).attr('y', 5).attr('height', rowH - 10).attr('width', W - left - right).attr('rx', 5);
    const bars = rows.append('rect').attr('class', (d) => `gr-bar${d.value === best ? ' best' : ''}`).attr('x', left).attr('y', 5).attr('height', rowH - 10).attr('rx', 5).attr('width', 0);
    const vals = rows.append('text').attr('class', 'gr-val').attr('y', rowH / 2 + 4).attr('x', left + 6).text((d) => `${d.value}%`);
    y += 28 + g.items.length * rowH + gap;
    return { g, gg, bars, vals, rows };
  });
  const bind = tipLayer(el);
  for (const { g, rows } of gs) {
    rows.each(function (d) { bind(this, { title: `${d.label}　${d.value}%`, body: g.name + (g.sub ? `｜${g.sub}` : ''), extra: d.extra }); });
  }
  return {
    update(step) {
      for (const { g, gg, bars, vals } of gs) {
        const on = reduce || step >= g.at;
        gg.classed('on', on);
        bars.attr('width', (d) => (on ? x(d.value) : 0));
        vals.attr('x', (d) => left + (on ? x(d.value) : 0) + 8);
      }
    },
    tick(t) {
      // 每組最高的那一條緩慢呼吸，提示「這一組最在意的是什麼」
      const k = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t / 700));
      el.querySelectorAll<SVGRectElement>('.gr-group.on .gr-bar.best').forEach((r) => (r.style.opacity = String(k)));
    },
  };
}

// ---------- logrange：對數尺度範圍長條（例如成本倍數） ----------
function logrange(el: HTMLElement, c: Extract<D3Chart, { kind: 'logrange' }>): Instance {
  const W = 540, left = 128, right = 30, rowH = 64, top = 30;
  const H = top + c.rows.length * rowH + 30;
  const x = scaleLog().domain([1, 200]).range([left, W - right]);
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'lr');
  const ticks = [1, 5, 10, 50, 100, 200];
  svg.append('g').selectAll('g').data(ticks).join('g').attr('class', 'lr-tick').attr('transform', (d) => `translate(${x(d)},0)`)
    .call((g) => { g.append('line').attr('y1', top - 6).attr('y2', H - 26); g.append('text').attr('y', H - 8).attr('text-anchor', 'middle').text((d) => `${d}×`); });
  const defs = svg.append('defs');
  const grad = defs.append('linearGradient').attr('id', `lr-flow-${Math.random().toString(36).slice(2, 7)}`).attr('gradientUnits', 'userSpaceOnUse').attr('x1', 0).attr('x2', 120);
  grad.attr('spreadMethod', 'repeat');
  grad.append('stop').attr('offset', '0').attr('stop-color', 'var(--accent-ink)');
  grad.append('stop').attr('offset', '.5').attr('stop-color', 'var(--accent)');
  grad.append('stop').attr('offset', '1').attr('stop-color', 'var(--accent-ink)');
  const gid = grad.attr('id');
  const rows = svg.append('g').selectAll('g').data(c.rows).join('g').attr('class', 'lr-row').attr('transform', (_, i) => `translate(0,${top + i * rowH})`);
  rows.append('text').attr('class', 'lr-label').attr('x', left - 12).attr('y', 22).attr('text-anchor', 'end').text((d) => d.label);
  rows.filter((d) => !!d.sub).append('text').attr('class', 'lr-sub').attr('x', left - 12).attr('y', 40).attr('text-anchor', 'end').text((d) => d.sub!);
  const bars = rows.append('rect').attr('class', 'lr-bar').attr('y', 10).attr('height', 22).attr('rx', 11)
    .attr('x', (d) => x(d.min)).attr('width', 0).attr('fill', `url(#${gid})`);
  rows.filter((d) => !!d.open).append('text').attr('class', 'lr-open').attr('y', 26).attr('x', (d) => x(d.max) + 6).text('→');
  const bind = tipLayer(el);
  rows.each(function (d) {
    const range = d.min === d.max ? `${d.min}×` : `${d.min}–${d.max}×${d.open ? ' 以上' : ''}`;
    bind(this, { title: `${d.label}　${range}`, body: d.sub, extra: d.extra });
  });
  return {
    update(step) {
      bars.attr('width', (d) => (reduce || step >= d.at ? Math.max(22, x(d.max) - x(d.min)) : 0));
      rows.classed('on', (d) => reduce || step >= d.at);
    },
    tick(t) {
      const off = (t / 18) % 120;
      grad.attr('x1', off).attr('x2', off + 120);
    },
  };
}

// ---------- stages：消費模型演進，代表消費者的點在每一列的階段間循環移動 ----------
function stages(el: HTMLElement, c: Extract<D3Chart, { kind: 'stages' }>): Instance {
  const cols = max(c.rows, (r) => r.steps.length) ?? 5;
  const W = 560, left = 112, rowH = 84, top = 8;
  const H = top + c.rows.length * rowH;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'st');
  const rows = svg.selectAll('g.st-row').data(c.rows).join('g').attr('class', 'st-row').attr('transform', (_, i) => `translate(0,${top + i * rowH})`);
  // 列標題（模型名稱）也能 hover：說明這個模型從哪裡來、適用什麼時代
  const heads = rows.append('g').attr('class', 'st-head');
  heads.append('rect').attr('class', 'st-head-hit').attr('x', -4).attr('y', 8).attr('width', left - 12).attr('height', 52).attr('rx', 8);
  heads.append('text').attr('class', 'st-model').attr('x', 0).attr('y', 30).text((d) => d.model);
  heads.append('text').attr('class', 'st-era').attr('x', 0).attr('y', 50).text((d) => d.era);
  const band = scaleBand<number>().domain([...Array(cols).keys()]).range([left, W - 10]).paddingInner(0.12);
  const cells = rows.selectAll('g.cell').data((d) => d.steps.map((s, i) => ({ ...s, i }))).join('g').attr('class', (d) => `cell${d.i === 0 ? ' first' : ''}`)
    .attr('transform', (d) => `translate(${band(d.i)},10)`);
  cells.append('rect').attr('width', band.bandwidth()).attr('height', 52).attr('rx', 10);
  cells.append('text').attr('class', 'st-en').attr('x', band.bandwidth() / 2).attr('y', 22).attr('text-anchor', 'middle').text((d) => d.en);
  cells.append('text').attr('class', 'st-zh').attr('x', band.bandwidth() / 2).attr('y', 41).attr('text-anchor', 'middle').text((d) => d.zh);
  const dots = rows.append('circle').attr('class', 'st-dot').attr('r', 6).attr('cy', 66).attr('cx', left);
  const bind = tipLayer(el);
  rows.each(function (r) {
    const head = select(this).select<SVGGElement>('g.st-head').node();
    if (head && r.extra) bind(head, { title: `${r.model}｜${r.era}`, extra: r.extra });
    select(this).selectAll<SVGGElement, { en: string; zh: string; extra?: string; i: number }>('g.cell').each(function (s) {
      bind(this, {
        title: `${s.zh}　${s.en}`,
        body: `${r.model}（${r.era}）第 ${s.i + 1} 步${s.i === 0 ? '：旅程的起點' : ''}`,
        extra: s.extra,
      });
    });
  });
  let shown = 0;
  return {
    update(step) {
      shown = reduce ? c.rows.length : c.rows.filter((r) => step >= r.at).length;
      rows.classed('on', (_, i) => i < shown);
    },
    tick(t) {
      dots.attr('cx', (d) => {
        const k = ((t / 900) % d.steps.length);
        const i = Math.floor(k), f = k - i;
        const a = (band(i) ?? left) + band.bandwidth() / 2, b = (band(Math.min(i + 1, d.steps.length - 1)) ?? left) + band.bandwidth() / 2;
        return a + (b - a) * Math.min(1, f * 1.6);
      });
    },
  };
}

// ---------- esov：SOV 減去 SOM 的減法動畫 → 媒體場域 → 主場域分工 ----------
function esov(el: HTMLElement, c: Extract<D3Chart, { kind: 'esov' }>): Instance {
  const W = 560, H = 470, left = 112, right = 40;
  const x = scaleLinear().domain([0, Math.ceil(Math.max(c.sov.value, c.som.value) / 10) * 10 + 10]).range([left, W - right]);
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'es');
  const bind = tipLayer(el);
  const yA = 44, yB = 104, bh = 34;

  // A. 減法：SOM 疊到 SOV 上，只剩超出的部分
  const a = svg.append('g').attr('class', 'es-a');
  a.append('text').attr('class', 'es-formula').attr('x', left).attr('y', 18).text(`${c.result.label} ＝ SOV − SOM`);
  const label = (y: number, d: { label: string; sub: string }) => {
    a.append('text').attr('class', 'es-label').attr('x', left - 12).attr('y', y + 16).attr('text-anchor', 'end').text(d.label);
    a.append('text').attr('class', 'es-sub').attr('x', left - 12).attr('y', y + 32).attr('text-anchor', 'end').text(d.sub);
  };
  label(yA, c.som);
  label(yB, c.sov);
  a.append('line').attr('class', 'es-axis').attr('x1', left).attr('x2', left).attr('y1', yA - 8).attr('y2', yB + bh + 8);
  const som = a.append('rect').attr('class', 'es-som').attr('x', left).attr('y', yA).attr('height', bh).attr('rx', 6).attr('width', x(c.som.value) - left);
  a.append('text').attr('class', 'es-val').attr('x', x(c.som.value) + 8).attr('y', yA + 23).text(`${c.som.value}%`);
  const sovBase = a.append('rect').attr('class', 'es-sov').attr('x', left).attr('y', yB).attr('height', bh).attr('rx', 6).attr('width', x(c.sov.value) - left);
  const excess = a.append('rect').attr('class', 'es-excess').attr('x', x(c.som.value)).attr('y', yB).attr('height', bh).attr('rx', 6)
    .attr('width', x(c.sov.value) - x(c.som.value));
  a.append('text').attr('class', 'es-val').attr('x', x(c.sov.value) + 8).attr('y', yB + 23).text(`${c.sov.value}%`);
  const cutter = a.append('rect').attr('class', 'es-cutter').attr('x', left).attr('y', yA).attr('height', bh).attr('rx', 6).attr('width', x(c.som.value) - left);
  const ex = x(c.som.value), ex2 = x(c.sov.value), yBr = yB + bh + 10;
  const brace = a.append('g').attr('class', 'es-brace');
  brace.append('path').attr('d', `M${ex},${yBr} v8 H${ex2} v-8 M${(ex + ex2) / 2},${yBr + 8} v8`);
  brace.append('text').attr('x', (ex + ex2) / 2).attr('y', yBr + 34).attr('text-anchor', 'middle').text(`${c.result.label} +${c.sov.value - c.som.value}`);
  bind(som.node()!, { title: `${c.som.label}　${c.som.value}%`, body: c.som.sub, extra: c.som.extra });
  bind(sovBase.node()!, { title: `${c.sov.label}　${c.sov.value}%`, body: c.sov.sub, extra: c.sov.extra });
  bind(excess.node()!, { title: `${c.result.label}　+${c.sov.value - c.som.value}`, body: `${c.sov.value}% − ${c.som.value}%`, extra: c.result.extra });

  // B. 媒體場域：同樣算一次曝光，意義卻不同
  const b = svg.append('g').attr('class', 'es-b');
  b.append('text').attr('class', 'es-h').attr('x', W / 2).attr('y', 238).attr('text-anchor', 'middle').text(c.fieldsTitle);
  const n = c.fields.length, tw = Math.min(70, (W - 40 - (n - 1) * 6) / n), x0 = (W - (n * tw + (n - 1) * 6)) / 2;
  const tiles = b.selectAll('g.es-tile').data(c.fields).join('g').attr('class', 'es-tile')
    .attr('transform', (_, i) => `translate(${x0 + i * (tw + 6)},258)`);
  tiles.append('rect').attr('width', tw).attr('height', 64).attr('rx', 10);
  tiles.append('text').attr('x', tw / 2).attr('y', 30).attr('text-anchor', 'middle').text((d) => d.label);
  tiles.append('text').attr('class', 'es-one').attr('x', tw / 2).attr('y', 50).attr('text-anchor', 'middle').text('1 次曝光');
  tiles.each(function (d) { bind(this, { title: d.label, body: '同樣算一次曝光，意義卻不同', extra: d.extra }); });
  const note = b.append('text').attr('class', 'es-note').attr('x', W / 2).attr('y', 356).attr('text-anchor', 'middle').text('注意力品質、情境、競品干擾、記憶效果都不同');
  // 掃描光條：第 3 段時從左到右掃過每個場域，代表逐一用問題檢查
  const beam = b.append('rect').attr('class', 'es-beam').attr('y', 252).attr('width', tw + 12).attr('height', 76).attr('rx', 12);

  // C. 判斷場域值不值得進攻的問題
  const cc = svg.append('g').attr('class', 'es-c');
  cc.append('text').attr('class', 'es-h').attr('x', W / 2).attr('y', 360).attr('text-anchor', 'middle').text(c.checksTitle);
  const cw = 168, per = 3;
  const checks = cc.selectAll('g.es-check').data(c.checks).join('g').attr('class', 'es-check').attr('transform', (_, i) => {
    const r = Math.floor(i / per), inRow = Math.min(per, c.checks.length - r * per);
    const rowX = (W - (inRow * cw + (inRow - 1) * 8)) / 2;
    return `translate(${rowX + (i % per) * (cw + 8)},${376 + r * 42})`;
  });
  checks.append('rect').attr('width', cw).attr('height', 34).attr('rx', 17);
  checks.append('text').attr('class', 'es-check-no').attr('x', 16).attr('y', 22).text((_, i) => `Q${i + 1}`);
  checks.append('text').attr('x', 38).attr('y', 22).text((d) => d.label);
  checks.each(function (d) { bind(this, { title: d.label, extra: d.extra }); });

  let step = 0;
  // p：0–0.2 分開 → 0.2–0.45 SOM 滑下疊上 → 0.45–0.95 只剩超出的部分亮著 → 重來
  const setA = (p: number) => {
    const k = Math.min(1, Math.max(0, (p - 0.2) / 0.25));
    const ease = k * k * (3 - 2 * k);
    const lit = p > 0.45 && p < 0.95;
    cutter.attr('y', yA + (yB - yA) * ease).style('opacity', p < 0.95 ? 1 : 0);
    sovBase.classed('dim', lit);
    excess.classed('lit', lit);
    brace.style('opacity', lit ? 1 : 0);
  };
  return {
    update(s) {
      step = s;
      a.classed('on', reduce || s >= 1);
      b.classed('on', reduce || s >= 2);
      cc.classed('on', reduce || s >= 3);
      note.style('opacity', reduce || s >= 3 ? 0 : 1);
      beam.style('opacity', !reduce && s >= 3 ? 1 : 0);
      if (reduce) setA(0.7); else if (s < 1) setA(0);
    },
    tick(t) {
      if (step >= 1) setA((t % 5200) / 5200);
      if (step >= 3) {
        // 每個場域停 0.6 秒，依序掃過
        const i = Math.floor(t / 600) % n;
        beam.attr('x', x0 + i * (tw + 6) - 6);
        tiles.classed('scan', (_, j) => j === i);
      }
    },
  };
}

// ---------- allocate：同一筆預算的點陣，平均灑開 → 集中到主場域 → 一次交易 vs 累積資產 ----------
function allocate(el: HTMLElement, c: Extract<D3Chart, { kind: 'allocate' }>): Instance {
  const W = 560, H = 440, lx = 184, dx = 13;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'al');
  const bind = tipLayer(el);
  const N = c.dots, L = c.layers.length, R = c.roles.length;
  const perRole = Math.max(3, Math.round(N * 0.08)), mainN = N - perRole * R;
  const title = svg.append('text').attr('class', 'al-h').attr('x', 0).attr('y', 22);
  svg.append('text').attr('class', 'al-tag').attr('x', W).attr('y', 22).attr('text-anchor', 'end').text('示意，非實際比例');

  // 兩組列標題：第 1 段是 full funnel 各層，第 2 段是主場域＋輔助角色
  const rowY1 = (i: number) => 52 + i * 31;
  const rowY2 = (i: number) => 74 + i * 66;
  const rowsOf = (cls: string, data: (Tipped & { label: string })[], y: (i: number) => number, sub: (i: number) => string) => {
    const g = svg.append('g').attr('class', `al-rows ${cls}`);
    const rows = g.selectAll('g').data(data).join('g').attr('class', (_, i) => `al-row${cls === 'al-r2' && i === 0 ? ' main' : ''}`)
      .attr('transform', (_, i) => `translate(0,${y(i)})`);
    rows.append('rect').attr('class', 'al-hit').attr('x', 0).attr('y', -14).attr('width', W).attr('height', 28).attr('rx', 8);
    rows.append('text').attr('class', 'al-label').attr('x', lx - 12).attr('y', 5).attr('text-anchor', 'end').text((d) => d.label);
    rows.each(function (d, i) { bind(this, { title: d.label, body: sub(i), extra: d.extra }); });
    return g;
  };
  const g1 = rowsOf('al-r1', c.layers, rowY1, () => 'full funnel 的一層');
  const g2 = rowsOf('al-r2', [c.main, ...c.roles], rowY2, (i) => (i === 0 ? '主場域：承擔主要 SOV' : '輔助場域'));

  // 預算點：位置用 CSS transform，切換段落時以 transition 移動
  const pos1 = (k: number) => [lx + Math.floor(k / L) * dx, rowY1(k % L)];
  const pos2 = (k: number) => {
    if (k < mainN) { const line = k % 2, j = Math.floor(k / 2); return [lx + j * dx, rowY2(0) + (line ? 9 : -9)]; }
    const r = Math.floor((k - mainN) / perRole), j = (k - mainN) % perRole;
    return [lx + j * dx, rowY2(1 + r)];
  };
  const dotsG = svg.append('g').attr('class', 'al-dots');
  const dots = dotsG.selectAll('circle').data([...Array(N).keys()]).join('circle').attr('r', 4.5)
    .style('transition-delay', (k) => `${(k % 12) * 25}ms`);
  const place = (fn: (k: number) => number[]) => dots.style('transform', (k) => { const [x, y] = fn(k); return `translate(${x}px,${y}px)`; });

  // 第 3 段：每一次投放的去向
  const g3 = svg.append('g').attr('class', 'al-out');
  const ex = W / 2, ey = 74, floor = 372, barX = 362, barW = 92, barMax = 250;
  g3.append('text').attr('class', 'al-emit').attr('x', ex).attr('y', ey - 16).attr('text-anchor', 'middle').text('每一次投放');
  g3.append('circle').attr('class', 'al-emitter').attr('cx', ex).attr('cy', ey).attr('r', 10);
  const zone = (x0: number, x1: number, d: Tipped & { label: string }, cls: string) => {
    const z = g3.append('g').attr('class', `al-zone ${cls}`);
    z.append('rect').attr('class', 'al-zone-bg').attr('x', x0).attr('y', 110).attr('width', x1 - x0).attr('height', floor - 110 + 14).attr('rx', 14);
    z.append('line').attr('class', 'al-floor').attr('x1', x0 + 12).attr('x2', x1 - 12).attr('y1', floor).attr('y2', floor);
    z.append('text').attr('class', 'al-zone-t').attr('x', (x0 + x1) / 2).attr('y', floor + 44).attr('text-anchor', 'middle').text(d.label);
    bind(z.node()!, { title: d.label, extra: d.extra });
  };
  zone(54, 254, c.once, 'once');
  zone(306, 506, c.asset, 'asset');
  const bar = g3.append('rect').attr('class', 'al-bar').attr('x', barX).attr('width', barW).attr('rx', 6).attr('y', floor).attr('height', 0);
  const P = 18;
  const parts = g3.selectAll('circle.al-p').data([...Array(P).keys()]).join('circle').attr('class', 'al-p').attr('r', 5);
  const barH = (t: number) => ((t % 36000) / 36000) * barMax;

  let step = 0;
  return {
    update(s) {
      step = reduce ? 3 : s;
      const st = Math.max(1, step);
      title.text(st >= 3 ? c.outcomeTitle : st === 2 ? c.splitTitle : c.layersTitle);
      g1.classed('on', st === 1);
      g2.classed('on', st === 2);
      dotsG.classed('on', st <= 2);
      g3.classed('on', st >= 3);
      place(st === 2 ? pos2 : pos1);
      if (reduce) { bar.attr('y', floor - barMax * 0.6).attr('height', barMax * 0.6); parts.style('opacity', 0); }
    },
    tick(t) {
      if (step < 3) return;
      const h = barH(t), top = floor - h;
      bar.attr('y', top).attr('height', h);
      parts.each(function (i) {
        const p = ((t / 2600) + i / P) % 1;
        const left = i % 2 === 0;
        const tx = left ? 84 + ((i * 37) % 140) : barX + 14 + ((i * 29) % (barW - 28));
        const ty = left ? floor - 6 : top - 6;
        const k = Math.min(1, p / 0.55), e = k * k * (3 - 2 * k);
        const x = ex + (tx - ex) * e, y = ey + (ty - ey) * e - Math.sin(Math.PI * e) * 26;
        // 左邊：落地後慢慢消失；右邊：碰到長條就融進去
        const o = p < 0.55 ? 1 : left ? Math.max(0, 1 - (p - 0.55) / 0.4) : Math.max(0, 1 - (p - 0.55) / 0.08);
        select(this).attr('cx', x).attr('cy', y).style('opacity', o).classed('keep', !left);
      });
    },
  };
}

// ---------- balance：蹺蹺板，兩股力量的比重隨段落改變（輕微晃動） ----------
function balance(el: HTMLElement, c: Extract<D3Chart, { kind: 'balance' }>): Instance {
  const W = 560, H = 420, cx = W / 2, cy = 236, half = 200;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'bl');
  const bind = tipLayer(el);
  const eraT = svg.append('text').attr('class', 'bl-era').attr('x', cx).attr('y', 34).attr('text-anchor', 'middle');
  const eraEn = svg.append('text').attr('class', 'bl-en').attr('x', cx).attr('y', 56).attr('text-anchor', 'middle');
  const eraD = svg.append('text').attr('class', 'bl-desc').attr('x', cx).attr('y', 80).attr('text-anchor', 'middle');
  svg.append('path').attr('class', 'bl-fulcrum').attr('d', `M${cx},${cy} l-30,52 h60 z`);
  svg.append('line').attr('class', 'bl-ground').attr('x1', cx - 150).attr('x2', cx + 150).attr('y1', cy + 52).attr('y2', cy + 52);
  // 橫桿與兩端的重量方塊：整組以支點為中心旋轉
  const beam = svg.append('g').attr('class', 'bl-beam').style('transform-origin', `${cx}px ${cy}px`);
  beam.append('rect').attr('x', cx - half).attr('y', cy - 6).attr('width', half * 2).attr('height', 12).attr('rx', 6);
  const side = (sign: number, d: Tipped & { label: string }) => {
    const g = beam.append('g').attr('class', `bl-side ${sign < 0 ? 'l' : 'r'}`);
    const box = g.append('rect').attr('class', 'bl-weight').attr('rx', 8);
    const t = g.append('text').attr('class', 'bl-label').attr('text-anchor', 'middle').text(d.label);
    bind(g.node()!, { title: d.label, extra: d.extra });
    return (size: number) => {
      const x = cx + sign * (half - 46);
      box.attr('x', x - size / 2).attr('y', cy - 6 - size).attr('width', size).attr('height', size);
      t.attr('x', x).attr('y', cy - 16 - size);
    };
  };
  const setL = side(-1, c.left), setR = side(1, c.right);
  // 下方時間軸：目前所在的時代
  const tl = svg.append('g').attr('class', 'bl-timeline');
  const tx = (i: number) => 90 + (i * (W - 180)) / Math.max(1, c.states.length - 1);
  tl.append('line').attr('x1', tx(0)).attr('x2', tx(c.states.length - 1)).attr('y1', 350).attr('y2', 350);
  const nodes = tl.selectAll('g').data(c.states).join('g').attr('class', 'bl-node').attr('transform', (_, i) => `translate(${tx(i)},350)`);
  nodes.append('circle').attr('r', 9);
  nodes.append('text').attr('y', 30).attr('text-anchor', 'middle').text((d) => d.label);
  nodes.append('text').attr('class', 'bl-years').attr('y', 48).attr('text-anchor', 'middle').text((d) => d.years);
  nodes.each(function (d) { bind(this, { title: `${d.label}　${d.en}`, body: d.desc, extra: d.extra }); });

  let tilt = 0, cur = -1;
  return {
    update(s) {
      let i = 0;
      c.states.forEach((st, k) => { if (reduce ? k === c.states.length - 1 : s >= st.at) i = k; });
      if (i === cur) return;
      cur = i;
      const st = c.states[i];
      tilt = st.tilt;
      eraT.text(st.label); eraEn.text(`${st.en}｜${st.years}`); eraD.text(st.desc);
      setL(40 + Math.max(0, -tilt) * 34 + (tilt === 0 ? 8 : 0));
      setR(40 + Math.max(0, tilt) * 34 + (tilt === 0 ? 8 : 0));
      nodes.classed('on', (_, k) => k === i);
      beam.style('transform', `rotate(${tilt * 11}deg)`);
    },
    tick(t) {
      beam.style('transform', `rotate(${tilt * 11 + Math.sin(t / 700) * 1.2}deg)`);
    },
  };
}

// ---------- venn：兩個圓的交集，逐段強調左、右、落空、交集 ----------
function venn(el: HTMLElement, c: Extract<D3Chart, { kind: 'venn' }>): Instance {
  const W = 560, H = 420, cy = 210, r = 150, lx = 205, rx = 355;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'vn');
  const bind = tipLayer(el);
  const id = `vn-${Math.random().toString(36).slice(2, 7)}`;
  svg.append('defs').append('clipPath').attr('id', id).append('circle').attr('cx', lx).attr('cy', cy).attr('r', r);
  const L = svg.append('circle').attr('class', 'vn-c vn-l').attr('cx', lx).attr('cy', cy).attr('r', r);
  const R = svg.append('circle').attr('class', 'vn-c vn-r').attr('cx', rx).attr('cy', cy).attr('r', r);
  const both = svg.append('circle').attr('class', 'vn-both').attr('cx', rx).attr('cy', cy).attr('r', r).attr('clip-path', `url(#${id})`);
  const side = (x: number, d: { label: string; items: string[] }) => {
    const g = svg.append('g').attr('class', 'vn-text').attr('pointer-events', 'none');
    g.append('text').attr('class', 'vn-label').attr('x', x).attr('y', cy - 48).attr('text-anchor', 'middle').text(d.label);
    d.items.forEach((t, i) => g.append('text').attr('class', 'vn-item').attr('x', x).attr('y', cy - 16 + i * 22).attr('text-anchor', 'middle').text(t));
  };
  side(lx - 72, c.left);
  side(rx + 72, c.right);
  const mid = svg.append('g').attr('class', 'vn-mid').attr('pointer-events', 'none');
  mid.append('text').attr('class', 'vn-both-label').attr('x', W / 2).attr('y', cy - 6).attr('text-anchor', 'middle').text(c.both.label);
  // 交集的說明拆成兩行
  const half = Math.ceil(c.both.desc.length / 2);
  [c.both.desc.slice(0, half), c.both.desc.slice(half)].forEach((t, i) =>
    mid.append('text').attr('class', 'vn-both-desc').attr('x', W / 2).attr('y', cy + 18 + i * 16).attr('text-anchor', 'middle').text(t));
  const fail = svg.append('text').attr('class', 'vn-fail').attr('x', W / 2).attr('y', H - 8).attr('text-anchor', 'middle').text(c.fail ?? '');
  bind(L.node()!, { title: c.left.label, body: c.left.items.join('、'), extra: c.left.extra });
  bind(R.node()!, { title: c.right.label, body: c.right.items.join('、'), extra: c.right.extra });
  bind(both.node()!, { title: c.both.label, body: c.both.desc, extra: c.both.extra });
  let lit = false;
  return {
    update(s) {
      const st = reduce ? 99 : s;
      L.classed('focus', st === c.leftAt).classed('dim', st === c.rightAt);
      R.classed('focus', st === c.rightAt).classed('dim', st === c.leftAt);
      const failing = !!c.failAt && st === c.failAt;
      svg.classed('failing', failing);
      fail.style('opacity', failing ? 1 : 0);
      lit = st >= c.bothAt;
      both.classed('on', lit);
      mid.style('opacity', lit ? 1 : 0.25);
    },
    tick(t) {
      if (lit) both.style('opacity', 0.75 + Math.sin(t / 500) * 0.2);
    },
  };
}

// ---------- spectrum：由低到高的等級光譜，案例標記逐一落到自己的位置 ----------
function spectrum(el: HTMLElement, c: Extract<D3Chart, { kind: 'spectrum' }>): Instance {
  const W = 560, H = 380, x0 = 40, x1 = W - 40, ty = 210;
  const n = c.levels.length, seg = (x1 - x0) / n;
  const px = (pos: number) => x0 + seg * (pos + 0.5);
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'sp');
  const bind = tipLayer(el);
  const levels = svg.append('g').attr('class', 'sp-levels');
  const lv = levels.selectAll('g').data(c.levels).join('g').attr('class', (_, i) => `sp-level sp-l${i}`)
    .attr('transform', (_, i) => `translate(${x0 + i * seg},${ty})`);
  lv.append('rect').attr('width', seg - 4).attr('height', 34).attr('rx', 8);
  lv.append('text').attr('class', 'sp-lab').attr('x', (seg - 4) / 2).attr('y', 22).attr('text-anchor', 'middle').text((d) => d.label);
  // 等級說明拆兩行
  lv.each(function (d) {
    const g = select(this);
    const half = Math.ceil(d.desc.length / 2);
    [d.desc.slice(0, half), d.desc.slice(half)].forEach((t, i) =>
      g.append('text').attr('class', 'sp-desc').attr('x', (seg - 4) / 2).attr('y', 56 + i * 16).attr('text-anchor', 'middle').text(t));
    bind(this, { title: d.label, body: d.desc, extra: d.extra });
  });
  svg.append('path').attr('class', 'sp-arrow').attr('d', `M${x0},${ty + 110} H${x1} m-10,-6 l10,6 l-10,6`);
  svg.append('text').attr('class', 'sp-axis').attr('x', x0).attr('y', ty + 132).text('自主程度低');
  svg.append('text').attr('class', 'sp-axis').attr('x', x1).attr('y', ty + 132).attr('text-anchor', 'end').text('自主程度高');
  // 案例標記：同一位置的標記往上疊
  const seen = new Map<number, number>();
  const stack = c.markers.map((m) => { const k = Math.round(m.pos * 2); const s = seen.get(k) ?? 0; seen.set(k, s + 1); return s; });
  const mk = svg.append('g').selectAll('g').data(c.markers).join('g').attr('class', 'sp-mk');
  mk.append('line').attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', (_, i) => 30 + stack[i] * 44);
  mk.append('rect').attr('x', -56).attr('y', -18).attr('width', 112).attr('height', 30).attr('rx', 15);
  mk.append('text').attr('y', 2).attr('text-anchor', 'middle').text((d) => d.label);
  mk.each(function (d) { bind(this, { title: d.label, body: `約在「${c.levels[Math.min(n - 1, Math.round(d.pos))].label}」層`, extra: d.extra }); });
  // 用 CSS transform（而不是 SVG 屬性）才能套用落下的 transition
  const place = (st: number) => mk.style('transform', (d, i) => {
    const y = ty - 30 - stack[i] * 44;
    return `translate(${px(d.pos)}px,${st >= d.at ? y : y - 40}px)`;
  }).classed('on', (d) => st >= d.at);
  return {
    update(s) {
      const st = reduce ? 99 : s;
      levels.classed('on', st >= c.levelsAt);
      place(st);
    },
  };
}

// ---------- iceberg：水面上的工具指標 vs 水面下的文化暗流（冰山輕微浮動、水面波動） ----------
function iceberg(el: HTMLElement, c: Extract<D3Chart, { kind: 'iceberg' }>): Instance {
  const W = 560, H = 460, cx = W / 2, sea = 150;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'ib');
  const bind = tipLayer(el);
  svg.append('rect').attr('class', 'ib-water').attr('x', 0).attr('y', sea).attr('width', W).attr('height', H - sea);
  const berg = svg.append('g').attr('class', 'ib-berg');
  berg.append('path').attr('class', 'ib-tip').attr('d', `M${cx - 92},${sea} L${cx - 40},${sea - 92} L${cx + 6},${sea - 70} L${cx + 34},${sea - 112} L${cx + 96},${sea} Z`);
  berg.append('path').attr('class', 'ib-base').attr('d', `M${cx - 92},${sea} L${cx + 96},${sea} L${cx + 210},${sea + 120} L${cx + 160},${H - 30} L${cx - 150},${H - 16} L${cx - 220},${sea + 150} Z`);
  const wave = svg.append('path').attr('class', 'ib-wave');
  const label = (y: number, t: string, cls: string) => svg.append('text').attr('class', cls).attr('x', 16).attr('y', y).text(t);
  label(24, c.aboveTitle, 'ib-zone');
  label(sea + 28, c.belowTitle, 'ib-zone below');
  const chips = (items: (Tipped & { label: string })[], y0: number, cls: string) => {
    const g = svg.append('g').attr('class', `ib-chips ${cls}`);
    const n = items.length, w = 150, gap = 14, x0 = cx - (n * w + (n - 1) * gap) / 2;
    const cs = g.selectAll('g').data(items).join('g').attr('class', 'ib-chip').attr('transform', (_, i) => `translate(${x0 + i * (w + gap)},${y0})`);
    cs.append('rect').attr('width', w).attr('height', 40).attr('rx', 20);
    cs.append('text').attr('x', w / 2).attr('y', 25).attr('text-anchor', 'middle').text((d) => d.label);
    cs.each(function (d) { bind(this, { title: d.label, extra: d.extra }); });
    return g;
  };
  const up = chips(c.above, 40, 'up');
  const down = chips(c.below, sea + 150, 'down');
  let base = 0;
  return {
    update(s) {
      const st = reduce ? 99 : s;
      up.classed('on', st >= c.aboveAt).classed('focus', st === c.aboveAt);
      down.classed('on', st >= c.belowAt).classed('focus', st >= c.belowAt);
      base = st >= c.belowAt ? 1 : 0;
      svg.classed('deep', base === 1);
    },
    tick(t) {
      berg.attr('transform', `translate(0,${Math.sin(t / 900) * 4})`);
      const pts = [...Array(15).keys()].map((i) => `${(i * W) / 14},${sea + Math.sin(t / 500 + i * 0.9) * 3}`);
      wave.attr('d', `M${pts.join(' L')}`);
    },
  };
}

// ---------- rings：由內往外擴大的同心圓，漣漪持續向外擴散；pulls 從中心被往外帶走 ----------
function rings(el: HTMLElement, c: Extract<D3Chart, { kind: 'rings' }>): Instance {
  const W = 520, H = 500, cx = W / 2, cy = 236, r0 = 42, band = 46;
  const n = c.rings.length, rMax = r0 + n * band;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'rg');
  const bind = tipLayer(el);
  const ripple = svg.append('circle').attr('class', 'rg-ripple').attr('cx', cx).attr('cy', cy).attr('r', r0);
  // 外圈先畫，內圈蓋在上面；每一圈是一個可 hover 的環
  const ringG = svg.append('g').selectAll('g').data(c.rings.map((d, i) => ({ d, i })).reverse()).join('g')
    .attr('class', (o) => `rg-ring rg-${o.i}`);
  ringG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', (o) => r0 + (o.i + 1) * band);
  ringG.append('text').attr('class', 'rg-label').attr('x', cx).attr('y', (o) => cy - (r0 + o.i * band) - band / 2 + 1).attr('text-anchor', 'middle').text((o) => o.d.label);
  ringG.append('text').attr('class', 'rg-sub').attr('x', cx).attr('y', (o) => cy - (r0 + o.i * band) - band / 2 + 16).attr('text-anchor', 'middle').text((o) => o.d.sub);
  ringG.each(function (o) { bind(this, { title: o.d.label, body: o.d.desc, extra: o.d.extra }); });
  const core = svg.append('g').attr('class', 'rg-core');
  core.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r0 - 4);
  core.append('text').attr('x', cx).attr('y', cy + 6).attr('text-anchor', 'middle').text(c.center);
  // 被帶走的東西：箭頭從中心往下方三個方向射出
  const pulls = svg.append('g').attr('class', 'rg-pulls');
  const dirs = (c.pulls ?? []).map((p, i, arr) => {
    const ang = Math.PI / 2 + (i - (arr.length - 1) / 2) * 0.62;
    return { p, ang };
  });
  const arrows = pulls.selectAll('g').data(dirs).join('g').attr('class', 'rg-pull');
  arrows.append('line').attr('x1', (d) => cx + r0 * Math.cos(d.ang)).attr('y1', (d) => cy + r0 * Math.sin(d.ang))
    .attr('x2', (d) => cx + (rMax + 6) * Math.cos(d.ang)).attr('y2', (d) => cy + (rMax + 6) * Math.sin(d.ang));
  const tokens = arrows.append('g').attr('class', 'rg-token');
  tokens.append('rect').attr('x', -30).attr('y', -13).attr('width', 60).attr('height', 26).attr('rx', 13);
  tokens.append('text').attr('y', 5).attr('text-anchor', 'middle').text((d) => d.p);
  pulls.append('text').attr('class', 'rg-pull-note').attr('x', cx).attr('y', H - 6).attr('text-anchor', 'middle').text('誰會把這些從品牌身邊帶走？');
  const at = c.pullsAt ?? 99;
  const place = (k: number) => tokens.attr('transform', (d) => {
    const r = r0 + 16 + k * (rMax - r0 - 6);
    return `translate(${cx + r * Math.cos(d.ang)},${cy + r * Math.sin(d.ang)})`;
  });
  place(1);
  let step = 0;
  return {
    update(s) {
      step = s;
      pulls.classed('on', reduce ? !!c.pulls : s >= at);
    },
    tick(t) {
      const p = (t % 3600) / 3600;
      ripple.attr('r', r0 + p * (rMax - r0)).style('opacity', 0.55 * (1 - p));
      if (step >= at) place(((t % 3000) / 3000) * 0.85 + 0.1);
    },
  };
}

const builders: Record<string, (el: HTMLElement, c: never) => Instance> = { flowloop, groups, logrange, stages, esov, rings, allocate, balance, venn, iceberg, spectrum } as never;

export function initD3() {
  const charts = Array.from(document.querySelectorAll<HTMLElement>('[data-d3]'));
  const live = new Set<Instance>();
  for (const el of charts) {
    const c = JSON.parse(el.dataset.d3!) as D3Chart;
    const build = builders[c.kind];
    if (!build) continue;
    el.querySelector('.d3-fallback')?.remove();
    const inst = build(el, c as never);
    const graphic = el.closest<HTMLElement>('.graphic');
    const read = () => inst.update(reduce ? 99 : Number(graphic?.dataset.step ?? 99));
    read();
    if (graphic) new MutationObserver(read).observe(graphic, { attributes: true, attributeFilter: ['data-step'] });
    if (inst.tick && !reduce) {
      new IntersectionObserver(([e]) => (e.isIntersecting ? live.add(inst) : live.delete(inst))).observe(el);
    } else inst.tick?.(0);
  }
  if (!reduce && charts.length) {
    const loop = (t: number) => { live.forEach((i) => i.tick!(t)); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
}
