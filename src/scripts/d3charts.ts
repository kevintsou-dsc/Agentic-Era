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

// ---------- 窄版：容器比 NARROW 窄（手機）時，圖改用 360 單位寬的版面 ----------
// 360 單位畫進 343px（375px 手機扣掉左右邊界）約縮成 0.95 倍，所以窄版字級一律 ≥ 12 單位，實際顯示才會 ≥ 11px。
// 寬度跨過門檻時整張圖重畫（見 initD3）；桌機版面完全不變。
const NARROW = 420;
const cjk = /[⺀-鿿豈-﫿＀-￯　-〿]/;
// 估計字寬（不量 DOM：字型可能還沒載入）：中文 1em、大寫與數字 0.62em、其他半形 0.52em
const estW = (s: string, fs: number) => [...s].reduce((w, ch) => w + (cjk.test(ch) ? 1 : ch === ' ' ? 0.3 : /[A-Z0-9]/.test(ch) ? 0.62 : 0.52) * fs, 0);
// 依估計字寬斷行：英文單字不拆開、標點不放行首，各行長度盡量平均
function wrap(s: string, maxW: number, fs: number): string[] {
  const toks = s.match(/[A-Za-z0-9.'’%&+\-–]+\s*|\s+|./gu) ?? [];
  const n = Math.max(1, Math.ceil(estW(s, fs) / maxW));
  const target = Math.min(maxW, (estW(s, fs) / n) * 1.08);
  const out: string[] = [];
  let cur = '';
  for (const t of toks) {
    const lead = /^[，。、：；？！」』）》,.:;?!)]/.test(t);
    if (cur && !lead && estW((cur + t).trimEnd(), fs) > target) { out.push(cur.trim()); cur = t.trimStart(); } else cur += t;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
// 一個 <text> 裡放多行（tspan），第一行在 y，之後每行往下 lh
function lines(t: ReturnType<typeof select<SVGTextElement, unknown>>, ls: string[], x: number, lh: number) {
  t.selectAll('tspan').remove();
  ls.forEach((l, k) => t.append('tspan').attr('x', x).attr('dy', k ? lh : 0).text(l));
}

// ---------- 圖表元素的說明框：滑鼠移上去、鍵盤聚焦或手指點一下都會出現 ----------
// 說明框只放策展補充（原文內容寫在左側主文，整張圖的出處只標一次）
interface Tip { title: string; body?: string; extra?: string }

function tipLayer(el: HTMLElement) {
  (el as HTMLElement & { __tipAC?: AbortController }).__tipAC?.abort();
  const ac = new AbortController();
  (el as HTMLElement & { __tipAC?: AbortController }).__tipAC = ac;
  const box = document.createElement('div');
  box.className = 'd3-tip';
  box.setAttribute('role', 'tooltip');
  box.hidden = true;
  el.appendChild(box);
  let pinned: Element | null = null;
  const show = (t: Tip, target: Element, ev?: MouseEvent | PointerEvent) => {
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
    box.style.top = `${above > 0 ? above : y + (ev ? 18 : Math.min(r.height, 96) + 8)}px`;
  };
  const hide = () => { box.hidden = true; pinned = null; };
  document.addEventListener('pointerdown', (e) => {
    const n = e.target as Node | null;
    if (pinned && n && !pinned.contains(n) && !box.contains(n)) hide();
  }, { signal: ac.signal });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); }, { signal: ac.signal });
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
    target.addEventListener('keydown', (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key === 'Enter' || ke.key === ' ') {
        ke.preventDefault();
        if (pinned === target) { hide(); return; }
        show(t, target);
        pinned = target;
      }
    });
    // 觸控：點一下固定顯示，再點一次或點空白處關閉
    target.addEventListener('click', (e) => {
      if (pinned === target) { hide(); return; }
      const me = e as MouseEvent;
      show(t, target, me.detail > 0 ? me : undefined);
      pinned = target;
    });
  };
}

// ---------- flowloop：節點圍成一圈，粒子沿弧線流動 ----------
function flowloop(el: HTMLElement, c: Extract<D3Chart, { kind: 'flowloop' }>, nw: boolean): Instance {
  const W = nw ? 360 : 520, H = nw ? 340 : 440, cx = W / 2, cy = H / 2, R = nw ? 116 : 160;
  const nr = nw ? 36 : 46, cr = nw ? 46 : 62;
  const n = c.nodes.length;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'fl nw' : 'fl');
  // 窄版：中文標籤底下純英文的副標（Activate、COMMERCE…）只是重複，手機上省略
  const subOf = (d: { label: string; sub?: string }) => (d.sub && !(nw && !cjk.test(d.sub) && cjk.test(d.label)) ? d.sub : undefined);
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
  const core = center.append('circle').attr('cx', cx).attr('cy', cy).attr('r', cr);
  center.append('text').attr('x', cx).attr('y', cy + (nw ? 5 : 7)).attr('text-anchor', 'middle').text(c.center);
  const nodes = svg.append('g').selectAll('g').data(c.nodes).join('g').attr('class', 'fl-node')
    .attr('transform', (_, i) => `translate(${pos(ang(i)).join(',')})`);
  nodes.append('circle').attr('r', nr);
  nodes.append('text').attr('class', 'fl-label').attr('text-anchor', 'middle').attr('y', (d) => (subOf(d) ? (nw ? -1 : -2) : nw ? 5 : 6)).text((d) => d.label);
  nodes.filter((d) => !!subOf(d)).append('text').attr('class', 'fl-sub').attr('text-anchor', 'middle').attr('y', nw ? 14 : 16).text((d) => subOf(d)!);
  const bind = tipLayer(el);
  if (c.centerExtra) bind(center.node()!, { title: c.center, extra: c.centerExtra });
  nodes.each(function (d) {
    bind(this, { title: d.label + (d.sub ? `　${d.sub}` : ''), body: d.desc, extra: d.extra });
  });
  // 粒子：每條弧 3 顆
  const dots = svg.append('g').attr('class', 'fl-dots');
  const particles = paths.flatMap((p, i) => [0, 0.33, 0.66].map((o) => ({ el: dots.append('circle').attr('r', nw ? 3.5 : 4.5).node()!, path: p.node()!, i, o })));
  // 節點第幾段亮起：預設第 k 段亮第 k 個；圓圈數與主文段數不同時用 at 指定（例如一段講兩個步驟）
  const at = c.nodes.map((d, i) => d.at ?? i + 1);
  let lit: boolean[] = at.map(() => false);
  return {
    update(step) {
      lit = at.map((a) => step >= a);
      nodes.classed('on', (_, i) => lit[i]).classed('cur', (_, i) => at[i] === step);
      paths.forEach((p, i) => p.classed('on', lit[i]));
      core.classed('shrink', !!c.shrink && step > n);
    },
    tick(t) {
      for (const pt of particles) {
        const visible = lit[pt.i];
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
function groups(el: HTMLElement, c: Extract<D3Chart, { kind: 'groups' }>, nw: boolean): Instance {
  const rowH = nw ? 24 : 30, gap = nw ? 22 : 34, W = nw ? 360 : 520, left = nw ? 96 : 118, right = nw ? 50 : 64, head = nw ? 26 : 28, pad = nw ? 6 : 5;
  const H = c.groups.reduce((s, g) => s + head + g.items.length * rowH, 0) + gap * (c.groups.length - 1) + 10;
  const x = scaleLinear().domain([0, max(c.groups.flatMap((g) => g.items.map((i) => i.value))) ?? 1]).range([0, W - left - right]).nice();
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'gr nw' : 'gr');
  let y = 0;
  const gs = c.groups.map((g) => {
    const top = y;
    const gg = svg.append('g').attr('class', 'gr-group').attr('transform', `translate(0,${top})`);
    gg.append('text').attr('class', 'gr-name').attr('y', 18).text(g.name + (g.sub ? `｜${g.sub}` : ''));
    const best = max(g.items, (i) => i.value);
    const rows = gg.selectAll('g.row').data(g.items).join('g').attr('class', 'row').attr('transform', (_, i) => `translate(0,${head + i * rowH})`);
    rows.append('text').attr('class', 'gr-label').attr('x', left - 10).attr('y', rowH / 2 + 4).attr('text-anchor', 'end').text((d) => d.label);
    rows.append('rect').attr('class', 'gr-track').attr('x', left).attr('y', pad).attr('height', rowH - pad * 2).attr('width', W - left - right).attr('rx', 5);
    const bars = rows.append('rect').attr('class', (d) => `gr-bar${d.value === best ? ' best' : ''}`).attr('x', left).attr('y', pad).attr('height', rowH - pad * 2).attr('rx', 5).attr('width', 0);
    const vals = rows.append('text').attr('class', 'gr-val').attr('y', rowH / 2 + 4).attr('x', W - right + 8).text((d) => `${d.value}%`);
    y += head + g.items.length * rowH + gap;
    return { g, gg, bars, vals, rows };
  });
  const bind = tipLayer(el);
  for (const { g, rows } of gs) {
    rows.each(function (d) { bind(this, { title: `${d.label}　${d.value}%`, body: g.name + (g.sub ? `｜${g.sub}` : ''), extra: d.extra }); });
  }
  return {
    update(step) {
      for (const { g, gg, bars } of gs) {
        const on = reduce || step >= g.at;
        gg.classed('on', on);
        bars.attr('width', (d) => (on ? x(d.value) : 0));
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
function logrange(el: HTMLElement, c: Extract<D3Chart, { kind: 'logrange' }>, nw: boolean): Instance {
  const W = nw ? 360 : 540, left = nw ? 92 : 128, right = nw ? 22 : 30, rowH = nw ? 54 : 64, top = nw ? 26 : 30;
  const H = top + c.rows.length * rowH + 30;
  const x = scaleLog().domain([1, 200]).range([left, W - right]);
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'lr nw' : 'lr');
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
  rows.append('text').attr('class', 'lr-label').attr('x', left - 12).attr('y', nw ? 20 : 22).attr('text-anchor', 'end').text((d) => d.label);
  rows.filter((d) => !!d.sub).append('text').attr('class', 'lr-sub').attr('x', left - 12).attr('y', nw ? 37 : 40).attr('text-anchor', 'end').text((d) => d.sub!);
  const bh = nw ? 20 : 22;
  const bars = rows.append('rect').attr('class', 'lr-bar').attr('y', nw ? 8 : 10).attr('height', bh).attr('rx', bh / 2)
    .attr('x', (d) => x(d.min)).attr('width', 0).attr('fill', `url(#${gid})`);
  rows.filter((d) => !!d.open).append('text').attr('class', 'lr-open').attr('y', nw ? 24 : 26).attr('x', (d) => x(d.max) + 6).text('→');
  const bind = tipLayer(el);
  rows.each(function (d) {
    const range = d.min === d.max ? `${d.min}×` : `${d.min}–${d.max}×${d.open ? ' 以上' : ''}`;
    bind(this, { title: `${d.label}　${range}`, body: d.sub, extra: d.extra });
  });
  return {
    update(step) {
      bars.attr('width', (d) => (reduce || step >= d.at ? Math.max(bh, x(d.max) - x(d.min)) : 0));
      rows.classed('on', (d) => reduce || step >= d.at);
    },
    tick(t) {
      const off = (t / 18) % 120;
      grad.attr('x1', off).attr('x2', off + 120);
    },
  };
}

// ---------- stages：消費模型演進，代表消費者的點在每一列的階段間循環移動 ----------
function stages(el: HTMLElement, c: Extract<D3Chart, { kind: 'stages' }>, nw: boolean): Instance {
  const cols = max(c.rows, (r) => r.steps.length) ?? 5;
  // 窄版：模型名稱與時代改放在每列上方，方格吃滿整個寬度；方格內只留中文（英文階段名在說明框裡）
  const W = nw ? 360 : 560, left = nw ? 0 : 112, rowH = nw ? 82 : 84, top = nw ? 6 : 8;
  const cellY = nw ? 24 : 10, cellH = nw ? 40 : 52;
  const H = top + c.rows.length * rowH;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'st nw' : 'st');
  const rows = svg.selectAll('g.st-row').data(c.rows).join('g').attr('class', 'st-row').attr('transform', (_, i) => `translate(0,${top + i * rowH})`);
  // 列標題（模型名稱）也能 hover：說明這個模型從哪裡來、適用什麼時代
  const heads = rows.append('g').attr('class', 'st-head');
  const eraX = (d: { model: string }) => estW(d.model, 15) * 1.05 + 10;
  if (nw) heads.append('rect').attr('class', 'st-head-hit').attr('x', -4).attr('y', 0).attr('width', (d) => eraX(d) + estW(d.era, 12) + 8).attr('height', 22).attr('rx', 6);
  else heads.append('rect').attr('class', 'st-head-hit').attr('x', -4).attr('y', 8).attr('width', left - 12).attr('height', 52).attr('rx', 8);
  heads.append('text').attr('class', 'st-model').attr('x', 0).attr('y', nw ? 16 : 30).text((d) => d.model);
  heads.append('text').attr('class', 'st-era').attr('x', (d) => (nw ? eraX(d) : 0)).attr('y', nw ? 16 : 50).text((d) => d.era);
  const band = scaleBand<number>().domain([...Array(cols).keys()]).range([left, W - (nw ? 0 : 10)]).paddingInner(nw ? 0.1 : 0.12);
  const cells = rows.selectAll('g.cell').data((d) => d.steps.map((s, i) => ({ ...s, i }))).join('g').attr('class', (d) => `cell${d.i === 0 ? ' first' : ''}`)
    .attr('transform', (d) => `translate(${band(d.i)},${cellY})`);
  cells.append('rect').attr('width', band.bandwidth()).attr('height', cellH).attr('rx', nw ? 8 : 10);
  if (!nw) cells.append('text').attr('class', 'st-en').attr('x', band.bandwidth() / 2).attr('y', 22).attr('text-anchor', 'middle').text((d) => d.en);
  cells.append('text').attr('class', 'st-zh').attr('x', band.bandwidth() / 2).attr('y', nw ? 25 : 41).attr('text-anchor', 'middle').text((d) => d.zh);
  const dots = rows.append('circle').attr('class', 'st-dot').attr('r', nw ? 5 : 6).attr('cy', nw ? cellY + cellH + 9 : 66).attr('cx', left);
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
function esov(el: HTMLElement, c: Extract<D3Chart, { kind: 'esov' }>, nw: boolean): Instance {
  // 窄版：三段縱向更緊湊，媒體場域排成每列 4 格、判斷問題每列 2 個
  const W = nw ? 360 : 560, H = nw ? 408 : 470, left = nw ? 84 : 112, right = nw ? 46 : 40;
  const x = scaleLinear().domain([0, Math.ceil(Math.max(c.sov.value, c.som.value) / 10) * 10 + 10]).range([left, W - right]);
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'es nw' : 'es');
  const bind = tipLayer(el);
  const yA = nw ? 32 : 44, yB = nw ? 80 : 104, bh = nw ? 28 : 34;

  // A. 減法：SOM 疊到 SOV 上，只剩超出的部分
  const a = svg.append('g').attr('class', 'es-a');
  a.append('text').attr('class', 'es-formula').attr('x', left).attr('y', nw ? 16 : 18).text(`${c.result.label} ＝ SOV − SOM`);
  const label = (y: number, d: { label: string; sub: string }) => {
    a.append('text').attr('class', 'es-label').attr('x', left - (nw ? 10 : 12)).attr('y', y + (nw ? 13 : 16)).attr('text-anchor', 'end').text(d.label);
    a.append('text').attr('class', 'es-sub').attr('x', left - (nw ? 10 : 12)).attr('y', y + (nw ? 27 : 32)).attr('text-anchor', 'end').text(d.sub);
  };
  label(yA, c.som);
  label(yB, c.sov);
  a.append('line').attr('class', 'es-axis').attr('x1', left).attr('x2', left).attr('y1', yA - 8).attr('y2', yB + bh + 8);
  const som = a.append('rect').attr('class', 'es-som').attr('x', left).attr('y', yA).attr('height', bh).attr('rx', 6).attr('width', x(c.som.value) - left);
  const valY = nw ? 20 : 23;
  a.append('text').attr('class', 'es-val').attr('x', x(c.som.value) + 8).attr('y', yA + valY).text(`${c.som.value}%`);
  const sovBase = a.append('rect').attr('class', 'es-sov').attr('x', left).attr('y', yB).attr('height', bh).attr('rx', 6).attr('width', x(c.sov.value) - left);
  const excess = a.append('rect').attr('class', 'es-excess').attr('x', x(c.som.value)).attr('y', yB).attr('height', bh).attr('rx', 6)
    .attr('width', x(c.sov.value) - x(c.som.value));
  a.append('text').attr('class', 'es-val').attr('x', x(c.sov.value) + 8).attr('y', yB + valY).text(`${c.sov.value}%`);
  const cutter = a.append('rect').attr('class', 'es-cutter').attr('x', left).attr('y', yA).attr('height', bh).attr('rx', 6).attr('width', x(c.som.value) - left);
  const ex = x(c.som.value), ex2 = x(c.sov.value), yBr = yB + bh + (nw ? 8 : 10);
  const brace = a.append('g').attr('class', 'es-brace');
  brace.append('path').attr('d', `M${ex},${yBr} v8 H${ex2} v-8 M${(ex + ex2) / 2},${yBr + 8} v8`);
  brace.append('text').attr('x', (ex + ex2) / 2).attr('y', yBr + (nw ? 30 : 34)).attr('text-anchor', 'middle').text(`${c.result.label} +${c.sov.value - c.som.value}`);
  bind(som.node()!, { title: `${c.som.label}　${c.som.value}%`, body: c.som.sub, extra: c.som.extra });
  bind(sovBase.node()!, { title: `${c.sov.label}　${c.sov.value}%`, body: c.sov.sub, extra: c.sov.extra });
  bind(excess.node()!, { title: `${c.result.label}　+${c.sov.value - c.som.value}`, body: `${c.sov.value}% − ${c.som.value}%`, extra: c.result.extra });

  // B. 媒體場域：同樣算一次曝光，意義卻不同
  const b = svg.append('g').attr('class', 'es-b');
  b.append('text').attr('class', 'es-h').attr('x', W / 2).attr('y', nw ? 172 : 238).attr('text-anchor', 'middle').text(c.fieldsTitle);
  const n = c.fields.length, perT = nw ? 4 : n, gapT = 6;
  const tw = nw ? (W - 16 - (perT - 1) * gapT) / perT : Math.min(70, (W - 40 - (n - 1) * 6) / n), th = nw ? 40 : 64;
  // 每格左上角座標：桌機一列排完；窄版每列 4 格，最後一列置中
  const tp = c.fields.map((_, i) => {
    const r = Math.floor(i / perT), inRow = Math.min(perT, n - r * perT);
    const rowX = (W - (inRow * tw + (inRow - 1) * gapT)) / 2;
    return [rowX + (i % perT) * (tw + gapT), (nw ? 182 : 258) + r * (th + 6)];
  });
  const tiles = b.selectAll('g.es-tile').data(c.fields).join('g').attr('class', 'es-tile')
    .attr('transform', (_, i) => `translate(${tp[i][0]},${tp[i][1]})`);
  tiles.append('rect').attr('width', tw).attr('height', th).attr('rx', 10);
  tiles.append('text').attr('x', tw / 2).attr('y', nw ? 18 : 30).attr('text-anchor', 'middle').text((d) => d.label);
  tiles.append('text').attr('class', 'es-one').attr('x', tw / 2).attr('y', nw ? 33 : 50).attr('text-anchor', 'middle').text('1 次曝光');
  tiles.each(function (d) { bind(this, { title: d.label, body: '同樣算一次曝光，意義卻不同', extra: d.extra }); });
  const lowY = nw ? 290 : 356;
  const note = b.append('text').attr('class', 'es-note').attr('x', W / 2).attr('y', lowY).attr('text-anchor', 'middle').text('注意力品質、情境、競品干擾、記憶效果都不同');
  // 掃描光條：第 3 段時從左到右掃過每個場域，代表逐一用問題檢查
  const bp = nw ? 5 : 6;
  const beam = b.append('rect').attr('class', 'es-beam').attr('y', tp[0][1] - bp).attr('width', tw + bp * 2).attr('height', th + bp * 2).attr('rx', 12);

  // C. 判斷場域值不值得進攻的問題
  const cc = svg.append('g').attr('class', 'es-c');
  cc.append('text').attr('class', 'es-h').attr('x', W / 2).attr('y', nw ? lowY : 360).attr('text-anchor', 'middle').text(c.checksTitle);
  const cw = nw ? 170 : 168, per = nw ? 2 : 3, ch = nw ? 30 : 34;
  const checks = cc.selectAll('g.es-check').data(c.checks).join('g').attr('class', 'es-check').attr('transform', (_, i) => {
    const r = Math.floor(i / per), inRow = Math.min(per, c.checks.length - r * per);
    const rowX = (W - (inRow * cw + (inRow - 1) * 8)) / 2;
    return `translate(${rowX + (i % per) * (cw + 8)},${nw ? 302 + r * 36 : 376 + r * 42})`;
  });
  checks.append('rect').attr('width', cw).attr('height', ch).attr('rx', ch / 2);
  checks.append('text').attr('class', 'es-check-no').attr('x', nw ? 13 : 16).attr('y', nw ? 20 : 22).text((_, i) => `Q${i + 1}`);
  checks.append('text').attr('x', nw ? 36 : 38).attr('y', nw ? 20 : 22).text((d) => d.label);
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
      if (reduce || s >= 2) setA(0.7); else if (s < 1) setA(0);
    },
    tick(t) {
      if (step === 1) setA((t % 5200) / 5200);
      if (step >= 3) {
        // 每個場域停 0.6 秒，依序掃過
        const i = Math.floor(t / 600) % n;
        beam.attr('x', tp[i][0] - bp).attr('y', tp[i][1] - bp);
        tiles.classed('scan', (_, j) => j === i);
      }
    },
  };
}

// ---------- allocate：同一筆預算的點陣，平均灑開 → 集中到主場域 → 一次交易 vs 累積資產 ----------
function allocate(el: HTMLElement, c: Extract<D3Chart, { kind: 'allocate' }>, nw: boolean): Instance {
  const W = nw ? 360 : 560, H = nw ? 340 : 440, lx = nw ? 112 : 184, dx = nw ? 10 : 13;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'al nw' : 'al');
  const bind = tipLayer(el);
  const N = c.dots, L = c.layers.length, R = c.roles.length;
  const perRole = Math.max(3, Math.round(N * 0.08)), mainN = N - perRole * R;
  const title = svg.append('text').attr('class', 'al-h').attr('x', 0).attr('y', nw ? 20 : 22);
  svg.append('text').attr('class', 'al-tag').attr('x', W).attr('y', nw ? 20 : 22).attr('text-anchor', 'end').text('示意，非實際比例');

  // 兩組列標題：第 1 段是 full funnel 各層，第 2 段是主場域＋輔助角色
  const rowY1 = (i: number) => (nw ? 46 + i * 25 : 52 + i * 31);
  const rowY2 = (i: number) => (nw ? 66 + i * 56 : 74 + i * 66);
  const hitH = nw ? 24 : 28;
  const rowsOf = (cls: string, data: (Tipped & { label: string })[], y: (i: number) => number, sub: (i: number) => string) => {
    const g = svg.append('g').attr('class', `al-rows ${cls}`);
    const rows = g.selectAll('g').data(data).join('g').attr('class', (_, i) => `al-row${cls === 'al-r2' && i === 0 ? ' main' : ''}`)
      .attr('transform', (_, i) => `translate(0,${y(i)})`);
    rows.append('rect').attr('class', 'al-hit').attr('x', 0).attr('y', -hitH / 2).attr('width', W).attr('height', hitH).attr('rx', 8);
    rows.append('text').attr('class', 'al-label').attr('x', lx - 12).attr('y', 5).attr('text-anchor', 'end').text((d) => d.label);
    rows.each(function (d, i) { bind(this, { title: d.label, body: sub(i), extra: d.extra }); });
    return g;
  };
  const g1 = rowsOf('al-r1', c.layers, rowY1, () => 'full funnel 的一層');
  const g2 = rowsOf('al-r2', [c.main, ...c.roles], rowY2, (i) => (i === 0 ? '主場域：承擔主要 SOV' : '輔助場域'));

  // 預算點：位置用 CSS transform，切換段落時以 transition 移動
  const pos1 = (k: number) => [lx + Math.floor(k / L) * dx, rowY1(k % L)];
  const pos2 = (k: number) => {
    if (k < mainN) { const line = k % 2, j = Math.floor(k / 2); return [lx + j * dx, rowY2(0) + (line ? 1 : -1) * (nw ? 7 : 9)]; }
    const r = Math.floor((k - mainN) / perRole), j = (k - mainN) % perRole;
    return [lx + j * dx, rowY2(1 + r)];
  };
  const dotsG = svg.append('g').attr('class', 'al-dots');
  const dots = dotsG.selectAll('circle').data([...Array(N).keys()]).join('circle').attr('r', nw ? 3.6 : 4.5)
    .style('transition-delay', (k) => `${(k % 12) * 25}ms`);
  const place = (fn: (k: number) => number[]) => dots.style('transform', (k) => { const [x, y] = fn(k); return `translate(${x}px,${y}px)`; });

  // 第 3 段：每一次投放的去向
  const g3 = svg.append('g').attr('class', 'al-out');
  const ex = W / 2, ey = nw ? 62 : 74, floor = nw ? 290 : 372, barX = nw ? 236 : 362, barW = nw ? 64 : 92, barMax = nw ? 170 : 250, zTop = nw ? 96 : 110;
  g3.append('text').attr('class', 'al-emit').attr('x', ex).attr('y', ey - (nw ? 14 : 16)).attr('text-anchor', 'middle').text('每一次投放');
  g3.append('circle').attr('class', 'al-emitter').attr('cx', ex).attr('cy', ey).attr('r', nw ? 8 : 10);
  const zone = (x0: number, x1: number, d: Tipped & { label: string }, cls: string) => {
    const z = g3.append('g').attr('class', `al-zone ${cls}`);
    z.append('rect').attr('class', 'al-zone-bg').attr('x', x0).attr('y', zTop).attr('width', x1 - x0).attr('height', floor - zTop + 14).attr('rx', 14);
    z.append('line').attr('class', 'al-floor').attr('x1', x0 + 12).attr('x2', x1 - 12).attr('y1', floor).attr('y2', floor);
    z.append('text').attr('class', 'al-zone-t').attr('x', (x0 + x1) / 2).attr('y', floor + (nw ? 38 : 44)).attr('text-anchor', 'middle').text(d.label);
    bind(z.node()!, { title: d.label, extra: d.extra });
  };
  if (nw) { zone(12, 172, c.once, 'once'); zone(188, 348, c.asset, 'asset'); }
  else { zone(54, 254, c.once, 'once'); zone(306, 506, c.asset, 'asset'); }
  const bar = g3.append('rect').attr('class', 'al-bar').attr('x', barX).attr('width', barW).attr('rx', 6).attr('y', floor).attr('height', 0);
  const P = 18;
  const parts = g3.selectAll('circle.al-p').data([...Array(P).keys()]).join('circle').attr('class', 'al-p').attr('r', nw ? 4 : 5);
  const barH = (t: number) => ((t % 36000) / 36000) * barMax;

  let step = 0, t0 = -1;
  return {
    update(s) {
      const prev = step;
      step = reduce ? 3 : s;
      if (step >= 3 && prev < 3) t0 = -1;
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
      if (t0 < 0) t0 = t;
      const h = barH(t - t0), top = floor - h;
      bar.attr('y', top).attr('height', h);
      parts.each(function (i) {
        const p = ((t / 2600) + i / P) % 1;
        const left = i % 2 === 0;
        const tx = left ? (nw ? 32 + ((i * 37) % 120) : 84 + ((i * 37) % 140)) : barX + 14 + ((i * 29) % (barW - 28));
        const ty = left ? floor - 6 : top - 6;
        const k = Math.min(1, p / 0.55), e = k * k * (3 - 2 * k);
        const x = ex + (tx - ex) * e, y = ey + (ty - ey) * e - Math.sin(Math.PI * e) * (nw ? 20 : 26);
        // 左邊：落地後慢慢消失；右邊：碰到長條就融進去
        const o = p < 0.55 ? 1 : left ? Math.max(0, 1 - (p - 0.55) / 0.4) : Math.max(0, 1 - (p - 0.55) / 0.08);
        select(this).attr('cx', x).attr('cy', y).style('opacity', o).classed('keep', !left);
      });
    },
  };
}

// ---------- balance：蹺蹺板，兩股力量的比重隨段落改變（輕微晃動） ----------
function balance(el: HTMLElement, c: Extract<D3Chart, { kind: 'balance' }>, nw: boolean): Instance {
  // 窄版：時代英文名省略（年代已在下方時間軸），說明文字可斷成兩行，蹺蹺板整組縮小
  const W = nw ? 360 : 560, H = nw ? 312 : 420, cx = W / 2, cy = nw ? 176 : 236, half = nw ? 132 : 200;
  const k = nw ? 0.72 : 1, fh = nw ? 40 : 52, tlY = nw ? 262 : 350;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'bl nw' : 'bl');
  const bind = tipLayer(el);
  const eraT = svg.append('text').attr('class', 'bl-era').attr('x', cx).attr('y', nw ? 26 : 34).attr('text-anchor', 'middle');
  const eraEn = nw ? null : svg.append('text').attr('class', 'bl-en').attr('x', cx).attr('y', 56).attr('text-anchor', 'middle');
  const eraD = svg.append('text').attr('class', 'bl-desc').attr('x', cx).attr('y', nw ? 50 : 80).attr('text-anchor', 'middle');
  svg.append('path').attr('class', 'bl-fulcrum').attr('d', `M${cx},${cy} l-${nw ? 23 : 30},${fh} h${nw ? 46 : 60} z`);
  svg.append('line').attr('class', 'bl-ground').attr('x1', cx - (nw ? 110 : 150)).attr('x2', cx + (nw ? 110 : 150)).attr('y1', cy + fh).attr('y2', cy + fh);
  // 橫桿與兩端的重量方塊：整組以支點為中心旋轉
  const beam = svg.append('g').attr('class', 'bl-beam').style('transform-origin', `${cx}px ${cy}px`);
  const bt = nw ? 10 : 12;
  beam.append('rect').attr('x', cx - half).attr('y', cy - bt / 2).attr('width', half * 2).attr('height', bt).attr('rx', bt / 2);
  const sides: Record<number, ReturnType<typeof select<SVGGElement, unknown>>> = {};
  const side = (sign: number, d: Tipped & { label: string }) => {
    const g = beam.append('g').attr('class', `bl-side ${sign < 0 ? 'l' : 'r'}`);
    sides[sign] = g as never;
    const box = g.append('rect').attr('class', 'bl-weight').attr('rx', 8);
    const t = g.append('text').attr('class', 'bl-label').attr('text-anchor', 'middle').text(d.label);
    bind(g.node()!, { title: d.label, extra: d.extra });
    return (size0: number) => {
      const size = size0 * k, x = cx + sign * (half - (nw ? 36 : 46));
      box.attr('x', x - size / 2).attr('y', cy - bt / 2 - size).attr('width', size).attr('height', size);
      t.attr('x', x).attr('y', cy - (nw ? 13 : 16) - size);
    };
  };
  const setL = side(-1, c.left), setR = side(1, c.right);
  // 下方時間軸：目前所在的時代
  const tl = svg.append('g').attr('class', 'bl-timeline');
  const tm = nw ? 56 : 90;
  const tx = (i: number) => tm + (i * (W - tm * 2)) / Math.max(1, c.states.length - 1);
  tl.append('line').attr('x1', tx(0)).attr('x2', tx(c.states.length - 1)).attr('y1', tlY).attr('y2', tlY);
  const nodes = tl.selectAll('g').data(c.states).join('g').attr('class', 'bl-node').attr('transform', (_, i) => `translate(${tx(i)},${tlY})`);
  nodes.append('circle').attr('r', nw ? 7 : 9);
  nodes.append('text').attr('y', nw ? 25 : 30).attr('text-anchor', 'middle').text((d) => d.label);
  nodes.append('text').attr('class', 'bl-years').attr('y', nw ? 42 : 48).attr('text-anchor', 'middle').text((d) => d.years);
  nodes.each(function (d) { bind(this, { title: `${d.label}　${d.en}`, body: d.desc, extra: d.extra }); });

  // 彩蛋：按住方塊往下拉，那一側變重；放開或移開後，像彈簧一樣慢慢回到這個時代的平衡（減少動態時不啟用）
  let bias = 0, vel = 0, dragging = 0, lastY = 0, sizeL = 40, sizeR = 40;
  svg.append('text').attr('class', 'bl-egg').attr('x', cx).attr('y', cy + (nw ? 62 : 76)).attr('text-anchor', 'middle').text('放手，它會回到這個時代的平衡');
  const resize = () => {
    setL(sizeL + Math.max(0, -bias) * 26);
    setR(sizeR + Math.max(0, bias) * 26);
  };
  if (!reduce) {
    const toSvg = (e: PointerEvent) => e.clientY * (H / (svg.node() as SVGSVGElement).getBoundingClientRect().height);
    [-1, 1].forEach((sign) => {
      const g = sides[sign];
      g.classed('bl-drag', true)
        .on('pointerdown', (e: PointerEvent) => {
          dragging = sign; lastY = toSvg(e); vel = 0;
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
          svg.classed('bl-free', true).classed('bl-dragging', true);
          e.preventDefault();
        })
        .on('pointermove', (e: PointerEvent) => {
          if (dragging !== sign) return;
          const y = toSvg(e);
          // 往下拉＝這一側加重：左側加重讓 bias 變負（逆時針），右側加重讓 bias 變正
          bias = Math.max(-1.8, Math.min(1.8, bias + sign * (y - lastY) / 70));
          lastY = y;
          resize();
        })
        .on('pointerup pointercancel lostpointercapture', () => { dragging = 0; svg.classed('bl-dragging', false); });
    });
    svg.on('pointerleave', () => { dragging = 0; svg.classed('bl-dragging', false); });
  }

  let tilt = 0, cur = -1;
  return {
    update(s) {
      let i = 0;
      c.states.forEach((st, k) => { if (reduce ? k === c.states.length - 1 : s >= st.at) i = k; });
      if (i === cur) return;
      cur = i;
      const st = c.states[i];
      tilt = st.tilt;
      eraT.text(st.label);
      eraEn?.text(`${st.en}｜${st.years}`);
      if (nw) lines(eraD, wrap(st.desc, W - 24, 12.5), cx, 18); else eraD.text(st.desc);
      sizeL = 40 + Math.max(0, -tilt) * 34 + (tilt === 0 ? 8 : 0);
      sizeR = 40 + Math.max(0, tilt) * 34 + (tilt === 0 ? 8 : 0);
      resize();
      nodes.classed('on', (_, k) => k === i);
      beam.style('transform', `rotate(${tilt * 11}deg)`);
    },
    tick(t) {
      // 放開後用阻尼彈簧回到 0：會稍微晃過頭再停下
      if (!dragging && bias !== 0) {
        vel = (vel - bias * 0.012) * 0.93;
        bias += vel;
        if (Math.abs(bias) < 0.002 && Math.abs(vel) < 0.002) { bias = 0; vel = 0; svg.classed('bl-free', false); }
        resize();
      }
      const eff = Math.max(-2.2, Math.min(2.2, tilt + bias));
      beam.style('transform', `rotate(${eff * 11 + Math.sin(t / 700) * 1.2}deg)`);
    },
  };
}

// ---------- venn：兩個圓的交集，逐段強調左、右、落空、交集 ----------
function venn(el: HTMLElement, c: Extract<D3Chart, { kind: 'venn' }>, nw: boolean): Instance {
  // 窄版：兩個圓改成上下疊，單側區域變成寬的半圓、交集變成橫向的透鏡，文字才放得下
  const r = nw ? 112 : 150, c1 = nw ? 6 + r : 210, c2 = nw ? c1 + 104 : 210;
  const W = nw ? 360 : 560, H = nw ? c2 + r + 6 + (c.fail ? 26 : 0) : 420, cy = 210, lx = nw ? 180 : 205, rx = nw ? 180 : 355;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'vn nw' : 'vn');
  const bind = tipLayer(el);
  const id = `vn-${Math.random().toString(36).slice(2, 7)}`;
  svg.append('defs').append('clipPath').attr('id', id).append('circle').attr('cx', lx).attr('cy', c1).attr('r', r);
  const L = svg.append('circle').attr('class', 'vn-c vn-l').attr('cx', lx).attr('cy', c1).attr('r', r);
  const R = svg.append('circle').attr('class', 'vn-c vn-r').attr('cx', rx).attr('cy', c2).attr('r', r);
  const both = svg.append('circle').attr('class', 'vn-both').attr('cx', rx).attr('cy', c2).attr('r', r).attr('clip-path', `url(#${id})`);
  // 窄版每一側：標籤在最寬處，項目往圓心排（上圓往下、下圓往上都靠近交集外側）
  const side = (x: number, d: { label: string; items: string[] }, ly: number, iy: number) => {
    const g = svg.append('g').attr('class', 'vn-text').attr('pointer-events', 'none');
    g.append('text').attr('class', 'vn-label').attr('x', x).attr('y', ly).attr('text-anchor', 'middle').text(d.label);
    d.items.forEach((t, i) => g.append('text').attr('class', 'vn-item').attr('x', x).attr('y', iy + i * (nw ? 19 : 22)).attr('text-anchor', 'middle').text(t));
  };
  if (nw) {
    side(lx, c.left, c1 - 78, c1 - 54);
    side(rx, c.right, c2 + 30, c2 + 52);
  } else {
    side(lx - 72, c.left, cy - 48, cy - 16);
    side(rx + 72, c.right, cy - 48, cy - 16);
  }
  const mid = svg.append('g').attr('class', 'vn-mid').attr('pointer-events', 'none');
  if (nw) {
    // 交集透鏡寬約 190、高約 120：標題在上，說明依字寬斷行（英文單字不拆）
    const my = (c1 + c2) / 2;
    const ls = wrap(c.both.desc, 132, 12);
    mid.append('text').attr('class', 'vn-both-label').attr('x', W / 2).attr('y', my - 6 - (ls.length - 1) * 7.5).attr('text-anchor', 'middle').text(c.both.label);
    ls.forEach((t, i) => mid.append('text').attr('class', 'vn-both-desc').attr('x', W / 2).attr('y', my + 14 + i * 15 - (ls.length - 1) * 7.5).attr('text-anchor', 'middle').text(t));
  } else {
    mid.append('text').attr('class', 'vn-both-label').attr('x', W / 2).attr('y', cy - 6).attr('text-anchor', 'middle').text(c.both.label);
    const ls = wrap(c.both.desc, 136, 11);
    ls.forEach((t, i) => {
      mid.append('text').attr('class', 'vn-both-desc').attr('x', W / 2).attr('y', cy + 16 + i * 16 - (ls.length - 1) * 4).attr('text-anchor', 'middle').text(t);
    });
  }
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
      // 呼吸動畫寫的是行內 opacity；未亮時要清掉，否則往回捲時交集仍是深色
      if (!lit) both.style('opacity', null);
      mid.style('opacity', lit ? 1 : 0);
    },
    tick(t) {
      if (lit) both.style('opacity', 0.75 + Math.sin(t / 500) * 0.2);
    },
  };
}

// ---------- spectrum：由低到高的等級光譜，案例標記逐一落到自己的位置 ----------
function spectrum(el: HTMLElement, c: Extract<D3Chart, { kind: 'spectrum' }>, nw: boolean): Instance {
  if (nw) return spectrumNarrow(el, c);
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
  // 等級說明依字寬智慧斷行（不切斷英文專有名詞）
  lv.each(function (d) {
    const g = select(this);
    wrap(d.desc, seg - 16, 11).forEach((t, i) =>
      g.append('text').attr('class', 'sp-desc').attr('x', (seg - 4) / 2).attr('y', 56 + i * 16).attr('text-anchor', 'middle').text(t));
    bind(this, { title: d.label, body: d.desc, extra: d.extra });
  });
  svg.append('path').attr('class', 'sp-arrow').attr('d', `M${x0},${ty + 110} H${x1} m-10,-6 l10,6 l-10,6`);
  svg.append('text').attr('class', 'sp-axis').attr('x', x0).attr('y', ty + 132).text('自主程度低');
  svg.append('text').attr('class', 'sp-axis').attr('x', x1).attr('y', ty + 132).attr('text-anchor', 'end').text('自主程度高');
  // 案例標記：寬度依名稱長度；和已放好的標記水平重疊時往上疊一層（不只看是否同一位置）
  const mw = c.markers.map((m) => Math.max(84, [...m.label].reduce((w, ch) => w + (ch.charCodeAt(0) > 255 ? 13 : 7.6), 0) + 30));
  const stack: number[] = [];
  c.markers.forEach((m, i) => {
    let lvl = 0;
    while (c.markers.some((o, j) => j < i && stack[j] === lvl && Math.abs(px(o.pos) - px(m.pos)) < (mw[i] + mw[j]) / 2 + 6)) lvl++;
    stack.push(lvl);
  });
  const mk = svg.append('g').selectAll('g').data(c.markers).join('g').attr('class', 'sp-mk');
  mk.append('line').attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', (_, i) => 30 + stack[i] * 44);
  mk.append('rect').attr('x', (_, i) => -mw[i] / 2).attr('y', -18).attr('width', (_, i) => mw[i]).attr('height', 30).attr('rx', 15);
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

// 窄版光譜：等級改成由上（低）到下（高）的直排，說明寫在等級右邊，案例標記從右側滑進自己的那一列
function spectrumNarrow(el: HTMLElement, c: Extract<D3Chart, { kind: 'spectrum' }>): Instance {
  const W = 360, top = 26, rowH = 64, n = c.levels.length, H = top + n * rowH + 22;
  const lx = 20, bw = 92, dx = lx + bw + 8, mx = 306;
  const py = (pos: number) => top + rowH * (pos + 0.5);
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'sp nw');
  const bind = tipLayer(el);
  const levels = svg.append('g').attr('class', 'sp-levels');
  const lv = levels.selectAll('g').data(c.levels).join('g').attr('class', (_, i) => `sp-level sp-l${i}`)
    .attr('transform', (_, i) => `translate(${lx},${top + i * rowH + 6})`);
  lv.append('rect').attr('width', bw).attr('height', rowH - 12).attr('rx', 8);
  lv.append('text').attr('class', 'sp-lab').attr('x', bw / 2).attr('y', (rowH - 12) / 2 + 5).attr('text-anchor', 'middle').text((d) => d.label);
  lv.each(function (d) {
    const g = select(this);
    const ls = wrap(d.desc, mx - 68 - dx, 12);
    ls.forEach((t, i) => g.append('text').attr('class', 'sp-desc').attr('x', dx - lx).attr('y', (rowH - 12) / 2 + 4 + i * 16 - (ls.length - 1) * 8).text(t));
    bind(this, { title: d.label, body: d.desc, extra: d.extra });
  });
  const yEnd = top + n * rowH;
  svg.append('path').attr('class', 'sp-arrow').attr('d', `M8,${top + 4} V${yEnd} m-6,-10 l6,10 l6,-10`);
  svg.append('text').attr('class', 'sp-axis').attr('x', 0).attr('y', top - 10).text('自主程度低');
  svg.append('text').attr('class', 'sp-axis').attr('x', 0).attr('y', yEnd + 18).text('自主程度高');
  const mw = c.markers.map((m) => Math.min(104, Math.max(64, estW(m.label, 12) + 24)));
  const mk = svg.append('g').selectAll('g').data(c.markers).join('g').attr('class', 'sp-mk');
  mk.append('line').attr('y1', 0).attr('y2', 0).attr('x1', (_, i) => -mw[i] / 2).attr('x2', (_, i) => -mw[i] / 2 - 12);
  mk.append('rect').attr('x', (_, i) => -mw[i] / 2).attr('y', -13).attr('width', (_, i) => mw[i]).attr('height', 26).attr('rx', 13);
  mk.append('text').attr('y', 4.5).attr('text-anchor', 'middle').text((d) => d.label);
  mk.each(function (d) { bind(this, { title: d.label, body: `約在「${c.levels[Math.min(n - 1, Math.round(d.pos))].label}」層`, extra: d.extra }); });
  const place = (st: number) => mk.style('transform', (d) => `translate(${st >= d.at ? mx : mx + 40}px,${py(d.pos)}px)`).classed('on', (d) => st >= d.at);
  return {
    update(s) {
      const st = reduce ? 99 : s;
      levels.classed('on', st >= c.levelsAt);
      place(st);
    },
  };
}

// ---------- iceberg：水面上的工具指標 vs 水面下的文化暗流（冰山輕微浮動、水面波動） ----------
function iceberg(el: HTMLElement, c: Extract<D3Chart, { kind: 'iceberg' }>, nw: boolean): Instance {
  // 窄版：冰山整組縮小；標籤一列放不下就換行（每列置中）
  const W = nw ? 360 : 560, H = nw ? 322 : 460, cx = W / 2, sea = nw ? 140 : 150;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'ib nw' : 'ib');
  const bind = tipLayer(el);
  svg.append('rect').attr('class', 'ib-water').attr('x', 0).attr('y', sea).attr('width', W).attr('height', H - sea);
  const berg = svg.append('g').attr('class', 'ib-berg');
  if (nw) {
    berg.append('path').attr('class', 'ib-tip').attr('d', `M${cx - 60},${sea} L${cx - 26},${sea - 62} L${cx + 4},${sea - 46} L${cx + 22},${sea - 74} L${cx + 62},${sea} Z`);
    berg.append('path').attr('class', 'ib-base').attr('d', `M${cx - 60},${sea} L${cx + 62},${sea} L${cx + 136},${sea + 78} L${cx + 104},${H - 18} L${cx - 98},${H - 10} L${cx - 142},${sea + 96} Z`);
  } else {
    berg.append('path').attr('class', 'ib-tip').attr('d', `M${cx - 92},${sea} L${cx - 40},${sea - 92} L${cx + 6},${sea - 70} L${cx + 34},${sea - 112} L${cx + 96},${sea} Z`);
    berg.append('path').attr('class', 'ib-base').attr('d', `M${cx - 92},${sea} L${cx + 96},${sea} L${cx + 210},${sea + 120} L${cx + 160},${H - 30} L${cx - 150},${H - 16} L${cx - 220},${sea + 150} Z`);
  }
  const wave = svg.append('path').attr('class', 'ib-wave');
  const label = (y: number, t: string, cls: string) => svg.append('text').attr('class', cls).attr('x', nw ? 10 : 16).attr('y', y).text(t);
  label(nw ? 20 : 24, c.aboveTitle, 'ib-zone');
  label(sea + (nw ? 26 : 28), c.belowTitle, 'ib-zone below');
  const chips = (items: (Tipped & { label: string })[], y0: number, cls: string) => {
    const g = svg.append('g').attr('class', `ib-chips ${cls}`);
    const n = items.length, gap = nw ? 10 : 14, h = nw ? 30 : 40;
    const w = nw ? Math.min(W - 20, (max(items, (d) => estW(d.label, 12.5)) ?? 0) + 28) : 150;
    const per = nw ? Math.max(1, Math.floor((W - 20 + gap) / (w + gap))) : n;
    const cs = g.selectAll('g').data(items).join('g').attr('class', 'ib-chip').attr('transform', (_, i) => {
      const r = Math.floor(i / per), inRow = Math.min(per, n - r * per);
      const x0 = cx - (inRow * w + (inRow - 1) * gap) / 2;
      return `translate(${x0 + (i % per) * (w + gap)},${y0 + r * (h + 8)})`;
    });
    cs.append('rect').attr('width', w).attr('height', h).attr('rx', h / 2);
    cs.append('text').attr('x', w / 2).attr('y', nw ? 19.5 : 25).attr('text-anchor', 'middle').text((d) => d.label);
    cs.each(function (d) { bind(this, { title: d.label, extra: d.extra }); });
    return g;
  };
  const up = chips(c.above, nw ? 32 : 40, 'up');
  const down = chips(c.below, sea + (nw ? 42 : 150), 'down');
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
function rings(el: HTMLElement, c: Extract<D3Chart, { kind: 'rings' }>, nw: boolean): Instance {
  // 窄版：圈數越多每圈越窄（總半徑固定），高度依有沒有「被帶走」的箭頭決定
  const n = c.rings.length;
  const r0 = nw ? 32 : 42, band = nw ? Math.min(44, (158 - r0) / n) : 46, rMax = r0 + n * band;
  const W = nw ? 360 : 520, cx = W / 2, cy = nw ? rMax + 6 : 236, H = nw ? cy + rMax + (c.pulls ? 34 : 8) : 500;
  const svg = select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', nw ? 'rg nw' : 'rg');
  const bind = tipLayer(el);
  const ripple = svg.append('circle').attr('class', 'rg-ripple').attr('cx', cx).attr('cy', cy).attr('r', r0);
  // 外圈先畫，內圈蓋在上面；每一圈是一個可 hover 的環
  const ringG = svg.append('g').selectAll('g').data(c.rings.map((d, i) => ({ d, i })).reverse()).join('g')
    .attr('class', (o) => `rg-ring rg-${o.i}`);
  ringG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', (o) => r0 + (o.i + 1) * band)
    // grow 收起時縮到內一圈的半徑，展開用 CSS transform 過場
    .style('--rg-k', (o) => String((r0 + o.i * band) / (r0 + (o.i + 1) * band)))
    // 同一段長出的多圈：由內往外錯開（只延遲 transform，hover 變色不等）
    .style('--rg-d', (o) => `${(o.i - c.rings.findIndex((x, j) => (x.at ?? j + 1) === (c.rings[o.i].at ?? o.i + 1))) * 0.35}s`);
  ringG.append('text').attr('class', 'rg-label').attr('x', cx).attr('y', (o) => cy - (r0 + o.i * band) - band / 2 + (nw ? -2 : 1)).attr('text-anchor', 'middle').text((o) => o.d.label);
  ringG.append('text').attr('class', 'rg-sub').attr('x', cx).attr('y', (o) => cy - (r0 + o.i * band) - band / 2 + (nw ? 12 : 16)).attr('text-anchor', 'middle').text((o) => o.d.sub);
  ringG.each(function (o) { bind(this, { title: o.d.label, body: o.d.desc, extra: o.d.extra }); });
  const core = svg.append('g').attr('class', 'rg-core');
  core.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r0 - 4);
  core.append('text').attr('x', cx).attr('y', cy + (nw ? 5 : 6)).attr('text-anchor', 'middle').text(c.center);
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
  const tw = nw ? 52 : 60, th = nw ? 24 : 26;
  tokens.append('rect').attr('x', -tw / 2).attr('y', -th / 2).attr('width', tw).attr('height', th).attr('rx', th / 2);
  tokens.append('text').attr('y', nw ? 4.5 : 5).attr('text-anchor', 'middle').text((d) => d.p);
  pulls.append('text').attr('class', 'rg-pull-note').attr('x', cx).attr('y', H - 6).attr('text-anchor', 'middle').text('誰會把這些從品牌身邊帶走？');
  const at = c.pullsAt ?? 99;
  const place = (k: number) => tokens.attr('transform', (d) => {
    const r = r0 + 16 + k * (rMax - r0 - 6);
    return `translate(${cx + r * Math.cos(d.ang)},${cy + r * Math.sin(d.ang)})`;
  });
  place(1);
  let step = 0, rOut = rMax;
  return {
    update(s) {
      step = s;
      pulls.classed('on', reduce ? !!c.pulls : s >= at);
      if (c.grow) {
        const at = (i: number) => c.rings[i].at ?? i + 1;
        const shown = reduce ? n : c.rings.filter((_, i) => at(i) <= s).length;
        svg.classed('rg-grow', true);
        ringG.classed('rg-in', (o) => reduce || at(o.i) <= s).classed('cur', (o) => at(o.i) === s);
        rOut = r0 + shown * band;
      }
    },
    tick(t) {
      const p = (t % 3600) / 3600;
      ripple.attr('r', r0 + p * (rOut - r0)).style('opacity', 0.55 * (1 - p));
      if (step >= at) place(((t % 3000) / 3000) * 0.85 + 0.1);
    },
  };
}

const builders: Record<string, (el: HTMLElement, c: never, nw: boolean) => Instance> = { flowloop, groups, logrange, stages, esov, rings, allocate, balance, venn, iceberg, spectrum } as never;

export function initD3() {
  const charts = Array.from(document.querySelectorAll<HTMLElement>('[data-d3]'));
  const live = new Set<Instance>();
  for (const el of charts) {
    const c = JSON.parse(el.dataset.d3!) as D3Chart;
    const build = builders[c.kind];
    if (!build) continue;
    el.querySelector('.d3-fallback')?.remove();
    const isNarrow = () => innerWidth < 600 || (el.clientWidth || el.parentElement?.clientWidth || innerWidth) < NARROW;
    let nw = isNarrow();
    let cur = build(el, c as never, nw);
    // 對外固定一個 instance，內部的 cur 在寬度跨過門檻時換成重畫的那一張
    const inst: Instance = { update: (s) => cur.update(s), tick: cur.tick ? (t) => cur.tick?.(t) : undefined };
    const graphic = el.closest<HTMLElement>('.graphic');
    const read = () => inst.update(reduce ? 99 : Number(graphic?.dataset.step ?? 99));
    read();
    new ResizeObserver(() => {
      if (isNarrow() === nw) return;
      nw = !nw;
      el.querySelectorAll(':scope > svg, :scope > .d3-tip').forEach((x) => x.remove());
      cur = build(el, c as never, nw);
      read();
      if (reduce) cur.tick?.(0);
    }).observe(el);
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
