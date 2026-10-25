// d3 互動圖表。每張圖：
//   1. 依所在 .graphic 的 data-step（捲動到第幾段主文）逐步揭示
//   2. 進入視窗時才跑循環動畫（requestAnimationFrame），離開就停；偏好「減少動態」時只畫靜態最終狀態
// 圖表資料由 src/components/d3/D3Chart.astro 以 data-d3 屬性傳入（JSON）。
import { select } from 'd3-selection';
import { scaleLinear, scaleLog, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import type { D3Chart } from '../lib/story';

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

const builders: Record<string, (el: HTMLElement, c: never) => Instance> = { flowloop, groups, logrange, stages } as never;

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
