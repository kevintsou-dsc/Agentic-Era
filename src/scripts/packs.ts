// 知識補給包的四種 3D 包裝（樣式在 components/SnackPack.astro）。由 scripts/snack.ts 依這次解鎖的卡挑一種：
//   candy 糖果紙：第一篇讀完｜foil 鋁箔枕頭袋：讀完篇數｜envelope 摺紙信封：讀完一章｜capsule 扭蛋：讀完一條主線
// 全部用 CSS 3D 面片拼成：曲面由多條窄面組成，每條的明暗依目前旋轉角度計算（light）。
// 打開動畫由 .snack.is-ripped 觸發；拉動撕條時 --pull（0–1）讓封口先動一點。

export type PackKind = 'foil' | 'candy' | 'envelope' | 'capsule';
export interface MiniCard { name: string; color: string; no: string }
export type Light = (rx: number, ry: number) => void;

const DEG = Math.PI / 180;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function el(cls: string, parent: Element, css = ''): HTMLDivElement {
  const e = document.createElement('div');
  e.className = cls;
  if (css) e.style.cssText = css;
  parent.appendChild(e);
  return e;
}
function txt(tag: string, cls: string, text: string, parent: Element) {
  const e = document.createElement(tag);
  e.className = cls;
  e.textContent = text;
  parent.appendChild(e);
  return e;
}

interface Lit { sh: HTMLElement; sp: HTMLElement; d?: string; s?: string }
const lit = (p: Element): Lit => ({ sh: el('p3-lit p3-sh', p), sp: el('p3-lit p3-sp', p) });
// 只在數值真的變了才寫回樣式：每格上百條面片，沒變的不要讓瀏覽器重算
const setLit = (p: Lit, d: number, s: number) => {
  // 量化成 0.04 一階：肉眼看不出差別，但每格真正要改的樣式少很多
  const q = (v: number) => (Math.round(v * 25) / 25).toFixed(2);
  const a = q(0.62 * (1 - clamp01(d))), b = q(s);
  if (a !== p.d) { p.d = a; p.sh.style.opacity = a; }
  if (b !== p.s) { p.s = b; p.sp.style.opacity = b; }
};

// 打開時從包裡冒出來的小卡（最多 3 張）
function minis(parent: Element, cards: MiniCard[]) {
  const g = el('p3-minis', parent);
  const list = cards.slice(0, 3);
  const pos = list.length === 1 ? ['c'] : list.length === 2 ? ['l', 'r'] : ['l', 'c', 'r'];
  list.forEach((c, i) => {
    const m = el(`p3-mc c-${c.color} m-${pos[i]}`, g, `--i:${i}`);
    txt('span', 'p3-mc-top', `No.${c.no}`, m);
    txt('b', 'p3-mc-name', c.name, m);
    txt('span', 'p3-mc-foot', 'DECISION WISDOM 2026', m);
  });
}

// ── 鋁箔枕頭袋：前後各 11 條曲面，上下各接一段斜面收到平的鋸齒封口 ──
// 效能：原本前後各 16 條、每條含曲面與上下斜面共 3 組明暗層（96 個混合模式圖層、728 個元素），中階手機只剩約 15 fps。
// 現在 11 條；斜面不再逐格算明暗，依位置給固定陰影；高光不用混合模式；角度幾乎沒變就不重算
function foil(host: HTMLElement, n: number): Light {
  const N = 11, W = 196, TH = 84 * DEG, R = W / 2 / Math.sin(TH / 2), ARC = R * TH, w = ARC / N, H = 196, h0 = 20, SEAL = 24, C = R * Math.cos(TH / 2);
  const FRONT = `<p class="fa-kick">DECISION WISDOM 2026</p><p class="fa-title">知識<br>補給包</p><span class="fa-stk"><span>內含</span><b>${n}</b><span>張</span></span><p class="fa-sub">成就卡｜讀過就有</p>`;
  const BACK = `<p class="ba-t">成分表</p><p class="ba-l"><span><em>成就卡</em><em>${n} 張</em></span><span><em>原文逐字核對</em><em>100%</em></span><span><em>捲動劫持</em><em>0 g</em></span><span><em>保存期限</em><em>讀過就有</em></span></p><p class="ba-n">開封後請立即閱讀</p>`;
  const parts: { a: number; f: Lit }[] = [];
  for (const side of [0, 1]) {
    for (let i = 0; i < N; i++) {
      const a = -TH / 2 + (i + 0.5) * TH / N;
      const depth = R * Math.cos(a) - C;
      const s = el('p3-strip', host, `width:${w + 0.8}px;height:${H}px;margin:${-H / 2}px 0 0 ${-w / 2}px;transform:rotateY(${side * 180}deg) translateZ(${-C}px) rotateY(${a / DEG}deg) translateZ(${R}px)`);
      const face = el('p3-face', s);
      const art = el('p3-art ' + (side ? 'back' : 'front'), face, `width:${ARC}px;height:${H}px;left:${-i * w}px`);
      art.innerHTML = side ? BACK : FRONT;
      // 斜面：從曲面邊緣收到 z=0 的封口，垂直投影固定 h0
      const t = depth / Math.cos(a), L = Math.hypot(h0, t), phi = Math.atan2(t, h0);
      const shade = (k: number) => `rgba(30, 34, 36, ${(k * (1 - Math.max(0, Math.cos(a + side * Math.PI + 0.35)))).toFixed(2)})`;
      el('p3-cap top', s, `height:${L}px;transform:rotateX(${phi / DEG}deg)`).appendChild(document.createElement('i')).setAttribute('style', `background:${shade(0.35)}`);
      el('p3-cap bot', s, `height:${L}px;transform:rotateX(${-phi / DEG}deg)`).appendChild(document.createElement('i')).setAttribute('style', `background:${shade(0.5)}`);
      parts.push({ a: a + side * Math.PI, f: lit(face) });
    }
  }
  const zig = (k: number, top: boolean) => {
    const p: string[] = [];
    for (let j = 0; j <= k; j++) p.push(`${(j / k) * 100}% ${top ? (j % 2 ? 0 : 22) : (j % 2 ? 100 : 78)}%`);
    return top ? `polygon(${p.join(',')},100% 100%,0 100%)` : `polygon(0 0,100% 0,${p.reverse().join(',')})`;
  };
  const sw = W + 6;
  const st = el('p3-seal top', host, `width:${sw}px;height:${SEAL}px;margin-left:${-sw / 2}px;top:${-H / 2 - h0 - SEAL + 1}px;clip-path:${zig(28, true)}`);
  el('p3-notch', st, 'right:10px');
  el('p3-seal bot', host, `width:${sw}px;height:${SEAL}px;margin-left:${-sw / 2}px;top:${H / 2 + h0 - 1}px;clip-path:${zig(28, false)}`);
  let lx = NaN, ly = NaN;
  return (rx, ry) => {
    if (Math.abs(rx - lx) < 0.25 && Math.abs(ry - ly) < 0.25) return;
    lx = rx; ly = ry;
    const cx = Math.cos(rx * DEG);
    for (const p of parts) {
      const yaw = p.a + ry * DEG;
      const d = Math.cos(yaw + 0.35) * (0.8 + 0.2 * cx);
      const s = Math.pow(Math.max(0, Math.cos(yaw - 0.3)), 26) * 0.85;
      setLit(p.f, d, s);
    }
  };
}

// ── 沿 X 軸的圓柱／圓錐段（糖果用） ──
interface RingOpt { x0: number; r0: number; x1: number; r1: number; N: number; cls: string; frill?: boolean; unlit?: boolean; decorate?: (e: HTMLElement, i: number, h: number) => void }
function ring(parent: Element | ((a: number) => Element), o: RingOpt) {
  const len = Math.hypot(o.x1 - o.x0, o.r1 - o.r0), beta = Math.atan2(o.r1 - o.r0, o.x1 - o.x0), rmax = Math.max(o.r0, o.r1), h = 2 * Math.PI * rmax / o.N + 0.9;
  const k0 = o.r0 / rmax, k1 = o.r1 / rmax, out: (Lit & { a: number })[] = [];
  for (let i = 0; i < o.N; i++) {
    const a = i * 2 * Math.PI / o.N;
    const host = typeof parent === 'function' ? parent(a) : parent;
    const e = el(`p3-pt ${o.cls}${i % 2 ? ' alt' : ''}`, host, `width:${len}px;height:${h}px;margin-top:${-h / 2}px;transform:rotateX(${a}rad) translate3d(${o.x0}px,0,${o.r0}px) rotateY(${-beta}rad)`);
    if (o.r0 !== o.r1) {
      const right = o.frill ? `100% ${50 - 50 * k1}%,92% 35%,100% 50%,92% 65%,100% ${50 + 50 * k1}%` : `100% ${50 - 50 * k1}%,100% ${50 + 50 * k1}%`;
      e.style.clipPath = `polygon(0 ${50 - 50 * k0}%,${right},0 ${50 + 50 * k0}%)`;
    }
    o.decorate?.(e, i, h);
    // 不算明暗的面片：依位置給一個固定的陰影，靠背光那側暗一點，看起來仍有立體感
    if (o.unlit) e.style.backgroundColor = `rgba(40, 46, 46, ${(0.42 * (1 - Math.max(0, Math.cos(a - 0.55)))).toFixed(2)})`;
    else out.push({ a, ...lit(e) });
  }
  return out;
}

// ── 糖果紙：圓柱糖身＋兩端玻璃紙扭花 ──
function candy(host: HTMLElement): Light {
  // 效能：原本 26＋2×(26＋14)＝106 條面片、每條兩層明暗，旋轉時每格重算上百個半透明 3D 圖層；
  // 現在糖身仍 26 條（再少標籤會被面片接縫切到）、玻璃紙 2×(12＋8) 條且不加明暗層，條紋改畫在面片本身，標籤只放在會露出它的幾條上
  const R = 56, L = 184, N = 26;
  const halfT = el('p3-half t', host), halfB = el('p3-half b', host);
  const parts = ring((a) => (Math.sin(a) > 0 ? halfT : halfB), { x0: -L / 2, r0: R, x1: L / 2, r1: R, N, cls: 'p3-body', decorate: (e, i, h) => {
    const row = (N / 2 - i + N) % N; // 正面中央對到圖案中線
    const top = -row * h + h / 2, mid = (N * h) / 2;
    e.style.backgroundSize = `100% ${N * h}px`;
    e.style.backgroundPosition = `0 ${top}px`;
    // 標籤高 72px：只有視窗（row*h±h/2）跟標籤範圍重疊的面片才放
    if (Math.abs(row * h - mid) < 36 + h * 1.5) {
      const art = el('p3-cart', e, `height:${N * h}px;top:${top}px`);
      art.innerHTML = '<div class="p3-clabel"><i>DECISION WISDOM</i><b>知識補給包</b></div>';
    }
  } });
  for (const side of ['l', 'r']) {
    const g = el('p3-end ' + side, host);
    ring(g, { x0: L / 2 - 1, r0: R, x1: L / 2 + 22, r1: 9, N: 12, cls: 'p3-cello', unlit: true });
    ring(g, { x0: L / 2 + 21, r0: 9, x1: L / 2 + 66, r1: 52, N: 8, cls: 'p3-cello', frill: true, unlit: true });
  }
  let last = NaN;
  return (rx) => {
    if (Math.abs(rx - last) < 0.25) return; // 糖果的明暗只跟上下翻轉有關，角度沒怎麼變就不重算
    last = rx;
    for (const p of parts) {
      const d = Math.cos(p.a - rx * DEG - 0.55);
      setLit(p, 0.35 + 0.65 * d, Math.pow(Math.max(0, Math.cos(p.a - rx * DEG - 0.35)), 30) * 0.8);
    }
  };
}

// ── 摺紙信封：四片三角紙摺到中心，封蠟封住 ──
function envelope(host: HTMLElement): Light {
  const S = 200, hS = S / 2;
  const base = el('p3-ebase', host, `width:${S}px;height:${S}px;left:${-hS}px;top:${-hS}px`);
  el('p3-eface in', base);
  txt('b', 'p3-eback-t', '知識補給包', el('p3-eface out', base));
  const flaps: [string, string, string, string, string, string][] = [
    ['t', `left:${-hS}px;top:${-S}px;width:${S}px;height:${hS}px`, 'polygon(0 100%,50% 0,100% 100%)', 'polygon(0 0,50% 100%,100% 0)', '180deg', 'Intro'],
    ['b', `left:${-hS}px;top:${hS}px;width:${S}px;height:${hS}px`, 'polygon(0 0,50% 100%,100% 0)', 'polygon(0 100%,50% 0,100% 100%)', '0deg', 'A.I'],
    ['l', `left:${-S}px;top:${-hS}px;width:${hS}px;height:${S}px`, 'polygon(100% 0,0 50%,100% 100%)', 'polygon(0 0,100% 50%,0 100%)', '90deg', 'People'],
    ['r', `left:${hS}px;top:${-hS}px;width:${hS}px;height:${S}px`, 'polygon(0 0,100% 50%,0 100%)', 'polygon(100% 0,0 50%,100% 100%)', '270deg', 'Model'],
  ];
  flaps.forEach(([k, pos, cin, cout, sh, label], i) => {
    const f = el('p3-flap ' + k, host, pos);
    txt('i', 'p3-flap-t', label, el('p3-eface in', f, `clip-path:${cin}`));
    const flip = k === 't' || k === 'b' ? 'rotateX(180deg)' : 'rotateY(180deg)';
    el('p3-eface out', f, `clip-path:${cout};transform:${flip};--fs:${sh};--k:${i}`);
  });
  txt('span', 'p3-wax', '決', host);
  return () => {};
}

// ── 扭蛋：9 片經線半圓疊出球殼，光澤層永遠面向觀者 ──
function capsule(host: HTMLElement): Light {
  const M = 9;
  const top = el('p3-dgrp p3-dtop', host), bot = el('p3-dgrp', host);
  for (let i = 0; i < M; i++) {
    el('p3-dh up', el('p3-dm', top, `transform:rotateY(${i * 180 / M}deg)`));
    el('p3-dh dn', el('p3-dm', bot, `transform:rotateY(${i * 180 / M}deg)`));
  }
  el('p3-dring', bot);
  el('p3-dring lip', top);
  el('p3-dknob', top);
  txt('span', 'p3-dlabel', '知識補給包', bot);
  el('p3-gloss', host.parentElement!);
  return () => {};
}

export function buildPack(host: HTMLElement, kind: PackKind, cards: MiniCard[], tint: string): Light {
  host.replaceChildren();
  host.parentElement?.querySelectorAll('.p3-gloss').forEach((g) => g.remove());
  host.className = `p3 p3-${kind}`;
  host.style.setProperty('--tint', `var(--${tint})`);
  host.style.setProperty('--tint-ink', `var(--${tint}-ink)`);
  host.parentElement?.setAttribute('data-kind', kind);
  const n = cards.length;
  const light = kind === 'foil' ? foil(host, n) : kind === 'candy' ? candy(host) : kind === 'envelope' ? envelope(host) : capsule(host);
  minis(host, cards);
  return light;
}
