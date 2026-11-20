// 首頁全書地圖「替這張臉上色」（components/home/FaceMap.astro）。
// 畫面：開場同一組素材（素描大衛、AI 碎裂臉）取樣成碎片——人臉是鉛筆短線、AI 臉是像素方塊，原圖淡淡墊在底下撐住五官。
//   People 9 篇＝人臉上的 9 塊、A.I 6 篇＝AI 臉上的 6 塊、序章 2 篇＝兩隻眼睛、Model 5 篇＝兩張臉之間的五道碎片流。
// 捲動為主：清單裡跨過「閱讀線」的那一列（或那一條主線）就是焦點——臉上那一塊亮起、鏡頭推近；章節標題之間拉遠看全臉。
// 已讀紀錄沿用 localStorage['dw-read']（scripts/readmap.ts 寫入）；上次來過之後新讀完的篇章，進到畫面時從灰色染開並浮出一句回饋。
// 只在區塊看得到時跑動畫；減少動態時鏡頭與碎片都不動，顏色直接到位。
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
type Ch = 'intro' | 'people' | 'model' | 'ai';
type Art = { i: number; slug: string; ch: Ch; t: string; th: string[] };
type Pt = { u: number; v: number; g: number; a: number };
type Bit = { k: 0 | 1; ux: number; uy: number; r: number; g: number; a: number; s: number; ph: number; fq: number; x: number; y: number; dd: number; ca: number; sa: number; c0: string; c6: string; c1: string };
type Flow = { s: number; art: number; u0: number; off: number; sp: number; dir: number; th: number; g: number; sz: number; ph: number; fq: number; tint: boolean; ca: number; sa: number; c0: string; c6: string; c1: string };
type P = { x: number; y: number };
type Thread = { art: number; s: number; a: P; b: P };

const COLS: Record<Ch, number[]> = { intro: [192, 138, 62], people: [111, 168, 58], model: [208, 84, 76], ai: [42, 157, 181] };
const CHZ: Record<Ch, string> = { intro: '序章', people: '人', model: '模型', ai: '行動' };
const KEY = 'dw-read', SEEN = 'dw-face-seen';
const TEAL = [63, 167, 196];
// 原圖上量好的位置（0～1）：兩張臉的眼睛，與五道碎片流在兩張臉上的起訖點（額、眉、鼻、唇、下巴）
const EYE: [number, number][] = [[0.27, 0.36], [0.68, 0.45]];
const HU: [number, number][] = [[0.22, 0.27], [0.17, 0.4], [0.11, 0.53], [0.21, 0.61], [0.3, 0.72]];
const AU: [number, number][] = [[0.7, 0.27], [0.75, 0.44], [0.79, 0.55], [0.73, 0.65], [0.68, 0.76]];

import { downloadCanvas, drawFaceCard, shareCanvas } from './share';

const load = (src: string) => new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
// 取樣：和開場同一套做法（不透明的像素才放碎片）
function sample(img: HTMLImageElement, target: number, h = 320) {
  const w = Math.round((img.width / img.height) * h), c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true })!; x.drawImage(img, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data; let op = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 50) op++;
  const step = Math.max(2, Math.round(Math.sqrt(op / target))), out: Pt[] = [];
  for (let y = 0; y < h; y += step) for (let xx = 0; xx < w; xx += step) { const i = (y * w + xx) * 4; if (d[i + 3] > 50) out.push({ u: xx / w, v: y / h, g: (d[i] + d[i + 1] + d[i + 2]) / 3, a: d[i + 3] / 255 }); }
  return { pts: out, ratio: w / h };
}
// 把一張臉的碎片分成 k 塊：固定初始點的 k-means，每次載入結果都一樣
function cluster(pts: Pt[], k: number, ratio: number) {
  const sorted = [...pts].sort((p, q) => p.v - q.v || p.u - q.u);
  let cs = Array.from({ length: k }, (_, j) => { const p = sorted[Math.floor(((j + 0.5) * sorted.length) / k)]; return { u: p.u, v: p.v }; });
  const lab = new Array<number>(pts.length).fill(0);
  for (let it = 0; it < 10; it++) {
    pts.forEach((p, n) => { let b = 0, bd = 1e9; cs.forEach((c, j) => { const d = ((p.u - c.u) * ratio) ** 2 + (p.v - c.v) ** 2; if (d < bd) { bd = d; b = j; } }); lab[n] = b; });
    cs = cs.map((c, j) => { let su = 0, sv = 0, n = 0; pts.forEach((p, m) => { if (lab[m] === j) { su += p.u; sv += p.v; n++; } }); return n ? { u: su / n, v: sv / n } : c; });
  }
  return cs;
}

export function initFaceMap() {
  const root = document.querySelector<HTMLElement>('[data-fm]');
  const cv = root?.querySelector<HTMLCanvasElement>('[data-fm-canvas]');
  if (!root || !cv) return;
  const stage = root.querySelector<HTMLElement>('[data-fm-stage]')!;
  const hudN = root.querySelector<HTMLElement>('[data-fm-n]')!, hudC = root.querySelector<HTMLElement>('[data-fm-c]')!, toast = root.querySelector<HTMLElement>('[data-fm-toast]')!;
  let ctx = cv.getContext('2d')!;
  const ARTS: Art[] = JSON.parse(root.dataset.fmData!);
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-fm-step]'));
  const rows = steps.filter((s) => s.dataset.i !== undefined);
  const bySlug = new Map(ARTS.map((a) => [a.slug, a.i]));
  const byCh = (c: Ch) => ARTS.filter((a) => a.ch === c).map((a) => a.i);

  // 已讀：讀不到儲存時當作沒讀過，不顯示數字以外的任何錯誤
  const loadList = (k: string): string[] => { try { const v: unknown = JSON.parse(localStorage.getItem(k) ?? '[]'); return Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string' && bySlug.has(s)) : []; } catch { return []; } };
  const readList = loadList(KEY), seen = new Set(loadList(SEEN));
  const read = new Set(readList.map((s) => bySlug.get(s)!));
  const fresh = readList.filter((s) => !seen.has(s));
  const readT = new Map<number, number>(); // 開始染色的時間；-Infinity＝早就上色
  read.forEach((i) => { if (seen.has(ARTS[i].slug)) readT.set(i, -Infinity); });
  rows.forEach((r) => r.classList.toggle('read', read.has(+r.dataset.i!)));

  let active = -1, pick = '', hoverR = -1, W = 0, H = 0, dpr = 1, narrow = false, ready = false, ymid = 0, topOffset = 58, stageH = 0;
  let bits: Bit[] = [], imgs: HTMLImageElement[] = [], ratios = [0.9, 0.8], cent: P[] = [], threads: Thread[] = [], boxes: { x: number; y: number; w: number; h: number }[] = [];
  const flows: Flow[] = [];
  const cam = { x: 0, y: 0, s: 1 };
  const yOff = () => (narrow ? 8 : 0);

  const hud = () => {
    hudN.innerHTML = `已點亮 ${read.size}<small>／22</small>`;
    const a = ARTS[active];
    hudC.textContent = a ? `${CHZ[a.ch]}｜${String(a.i + 1).padStart(2, '0')}〈${a.t}〉${read.has(a.i) ? '・已點亮' : ''}`
      : pick ? `${steps.find((s) => s.dataset.thread === pick)?.querySelector('.eyebrow')?.textContent ?? ''}｜共 ${ARTS.filter((x) => x.th.includes(pick)).length} 篇`
      : read.size ? '讀越多，這張臉譜越有溫度' : '往下捲，看 22 篇在臉譜上的哪裡';
  };

  const build = async () => {
    const [hu, ai] = await Promise.all([load('/art/cover/david-profile.webp'), load('/art/cover/ai-face-sample.png')]);
    imgs = [hu, ai];
    const per = innerWidth < 860 ? 1300 : 2600;
    const hs = sample(hu, per), as = sample(ai, per); ratios = [hs.ratio, as.ratio];
    hs.pts = hs.pts.filter((p) => p.g < 236); // 鉛筆畫的紙白不放碎片
    const isEye = (p: Pt, k: number) => { const dx = (p.u - EYE[k][0]) * ratios[k], dy = p.v - EYE[k][1]; return Math.hypot(dx, dy) < 0.07 * (1 + 0.22 * Math.sin(Math.atan2(dy, dx) * 5 + k)); };
    const hc = cluster(hs.pts.filter((p) => !isEye(p, 0)), 9, hs.ratio), ac = cluster(as.pts.filter((p) => !isEye(p, 1)), 6, as.ratio);
    // 區塊由上到下依書序；分界加低頻擾動，邊緣像顏料暈開
    const order = (cs: { u: number; v: number }[], arts: number[]) => { const m: number[] = []; cs.map((_, n) => n).sort((p, q) => cs[p].v - cs[q].v || cs[p].u - cs[q].u).forEach((n, k) => (m[n] = arts[k])); return m; };
    const hm = order(hc, byCh('people')), am = order(ac, byCh('ai'));
    const noisy = (p: Pt, cs: { u: number; v: number }[], ratio: number) => { let b = 0, bd = 1e9; cs.forEach((c, n) => { const d = ((p.u - c.u) * ratio) ** 2 + (p.v - c.v) ** 2 + 0.004 * (Math.sin(p.u * 41 + n * 1.7) * Math.sin(p.v * 37 - n * 2.3) + 0.5 * Math.sin((p.u + p.v) * 83 + n)); if (d < bd) { bd = d; b = n; } }); return b; };
    const intro = byCh('intro');
    const region = (p: Pt, k: number) => (isEye(p, k) ? intro[k] : k === 0 ? hm[noisy(p, hc, hs.ratio)] : am[noisy(p, ac, as.ratio)]);
    let sd = 23; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
    const mk = (k: 0 | 1, p: Pt): Bit => {
      const r = region(p, k), g = Math.round(p.g * (k === 0 ? 0.72 : 0.85)), ph = rnd() * 6.28, ang = -0.75 + ph * 0.08, col = COLS[ARTS[r].ch];
      return { k, ux: p.u, uy: p.v, r, g, a: k === 0 ? Math.min(0.85, 0.15 + (1 - p.g / 255) * 0.8) : 0.8, s: 1.8 + rnd() * 1.8, ph, fq: 0.6 + rnd() * 1.2, x: 0, y: 0, dd: 0, ca: Math.cos(ang) * 1.6, sa: Math.sin(ang) * 1.6, c0: `rgb(${g},${g},${g})`, c6: mix(g, col, 0.6), c1: mix(g, col, 1) };
    };
    bits = [...hs.pts.map((p) => mk(0, p)), ...as.pts.map((p) => mk(1, p))];
    // Model：五道碎片流。人那端是鉛筆短線，流過中段後一顆顆變成像素方塊；七成從人流向 AI，其餘反向
    const RED = COLS.model;
    byCh('model').forEach((art, s) => {
      for (let n = 0; n < (innerWidth < 860 ? 110 : 170); n++) {
        const g = Math.round(55 + rnd() * 80), ph = rnd() * 6.28, ang = -0.75 + ph * 0.08;
        flows.push({ s, art, u0: rnd(), off: rnd() + rnd() - 1, sp: 0.000028 + rnd() * 0.00003, dir: rnd() < 0.72 ? 1 : -1, th: 0.25 + rnd() * 0.5, g, sz: 1.6 + rnd() * 1.7, ph, fq: 0.6 + rnd() * 1.2, tint: rnd() < 0.14, ca: Math.cos(ang) * 1.6, sa: Math.sin(ang) * 1.6, c0: `rgb(${g},${g},${g})`, c6: mix(g, RED, 0.6), c1: mix(g, RED, 1) });
      }
    });
    ready = true; layout();
  };

  // 三次貝茲：兩端先朝中線收攏、中段靠在一起再分開；控制點隨時間微微呼吸
  const curve = (th: Thread, u: number, t: number): P => {
    const { a, b, s } = th, dx = b.x - a.x, wob = reduce ? 0 : Math.sin(t * 0.0006 + s * 1.3) * boxes[0].h * 0.016;
    const p1 = { x: a.x + dx * 0.42, y: a.y + (ymid - a.y) * 0.78 + wob }, p2 = { x: b.x - dx * 0.42, y: b.y + (ymid - b.y) * 0.78 - wob };
    const v = 1 - u;
    return { x: v * v * v * a.x + 3 * v * v * u * p1.x + 3 * v * u * u * p2.x + u * u * u * b.x, y: v * v * v * a.y + 3 * v * v * u * p1.y + 3 * v * u * u * p2.y + u * u * u * b.y };
  };

  const layout = () => {
    dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; narrow = innerWidth < 860;
    cv.width = W * dpr; cv.height = H * dpr;
    const bar = document.querySelector<HTMLElement>('.topbar');
    if (bar) {
      topOffset = bar.offsetTop + bar.offsetHeight;
      root.style.setProperty('--top', `${topOffset}px`);
    }
    stageH = stage.offsetHeight;
    geometry();
  };
  const geometry = (full = false) => {
    if (!ready || !W) return;
    // AI 臉右側是飄散的碎片尾巴，讓它超出畫面右緣約三成，兩張臉就能畫得更大
    const gapK = 0.26, vis = ratios[0] + gapK + ratios[1] * (full ? 1 : 0.72), fh = Math.min(H * (narrow ? 0.8 : 0.82), (W * 0.98) / vis);
    const x0 = (W - fh * vis) / 2, y0 = (H - fh) / 2 + (narrow ? 12 : 10);
    boxes = [{ x: x0, y: y0, w: fh * ratios[0], h: fh }, { x: x0 + fh * (ratios[0] + gapK), y: y0, w: fh * ratios[1], h: fh }];
    const at = (k: number, [u, v]: [number, number]) => ({ x: boxes[k].x + (1 - u) * boxes[k].w, y: boxes[k].y + v * boxes[k].h });
    threads = byCh('model').map((art, s) => ({ art, s, a: at(0, HU[s]), b: at(1, AU[s]) }));
    ymid = threads.reduce((n, th) => n + th.a.y + th.b.y, 0) / (threads.length * 2);
    const acc: Record<number, { x: number; y: number; n: number }> = {};
    bits.forEach((b) => {
      const bx = boxes[b.k]; b.x = bx.x + (1 - b.ux) * bx.w; b.y = bx.y + b.uy * bx.h;
      const c = (acc[b.r] ||= { x: 0, y: 0, n: 0 }); c.x += b.x; c.y += b.y; c.n++;
    });
    threads.forEach((th) => (acc[th.art] = { ...curve(th, 0.5, 0), n: 1 }));
    cent = ARTS.map((a) => { const c = acc[a.i]; return c ? { x: c.x / c.n, y: c.y / c.n } : { x: W / 2, y: H / 2 }; });
    bits.forEach((b) => { b.dd = Math.hypot(b.x - cent[b.r].x, b.y - cent[b.r].y); });
    if (!cam.x) { cam.x = W / 2; cam.y = H / 2; }
    dirty = true;
  };

  const camTarget = () => {
    if (active < 0 || reduce) return { x: W / 2, y: H / 2 + yOff(), s: 1 };
    const c = cent[active], br = ARTS[active].ch === 'model';
    return { x: c.x, y: c.y, s: br ? 1.3 : 1.45 };
  };
  // 上色時保留原本的明暗：暗的筆觸變深色、亮的變淺色，五官才不會糊成一片
  const mix = (g: number, c: number[], m: number) => { const t = Math.min(1.18, 0.5 + g / 330); return `rgb(${[0, 1, 2].map((n) => Math.round(g + (Math.min(255, c[n] * t) - g) * m)).join(',')})`; };
  const focusOn = (i: number) => i === active || i === hoverR || (!!pick && ARTS[i].th.includes(pick));
  const frag = (k: number, x: number, y: number, s: number, col: string, ca: number, sa: number) => {
    if (k === 0) {
      ctx.strokeStyle = col; ctx.lineWidth = s * 0.5;
      const dx = ca * s, dy = sa * s;
      ctx.beginPath(); ctx.moveTo(x - dx, y - dy); ctx.lineTo(x + dx, y + dy); ctx.stroke();
    } else { ctx.fillStyle = col; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
  };

  const frame = (t: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    if (!ready || !boxes.length) return;
    const tg = camTarget(), k = reduce ? 1 : 0.07;
    cam.x += (tg.x - cam.x) * k; cam.y += (tg.y - cam.y) * k; cam.s += (tg.s - cam.s) * k;
    ctx.setTransform(dpr * cam.s, 0, 0, dpr * cam.s, dpr * (W / 2 - cam.x * cam.s), dpr * (H / 2 + yOff() - cam.y * cam.s));
    // 原圖淡淡墊底（與碎片同樣鏡像，兩張臉相望）
    imgs.forEach((im, n) => { const bx = boxes[n]; ctx.save(); ctx.globalAlpha = n === 0 ? 0.3 : 0.16; ctx.translate(bx.x + bx.w, bx.y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, bx.w, bx.h); ctx.restore(); });
    // 焦點那塊底下的柔光
    [active, hoverR].forEach((i) => {
      if (i < 0) return; const c = cent[i], col = COLS[ARTS[i].ch].join(',');
      const gr = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, narrow ? 46 : 80); gr.addColorStop(0, `rgba(${col},.28)`); gr.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = gr; ctx.fillRect(c.x - 90, c.y - 90, 180, 180);
    });
    const dimOthers = active >= 0 || !!pick;
    for (const b of bits) {
      const col = COLS[ARTS[b.r].ch], rt = readT.get(b.r), f = focusOn(b.r);
      let m = rt === undefined ? 0 : reduce || rt === -Infinity ? 1 : Math.min(1, Math.max(0, (t - rt - b.dd * 9) / 520));
      if (f) m = Math.max(m, read.has(b.r) ? 1 : 0.6);
      const amp = reduce ? 0 : f ? 1.6 : 0.9;
      const x = b.x + Math.sin(t * 0.0011 * b.fq + b.ph) * amp, y = b.y + Math.cos(t * 0.0009 * b.fq + b.ph * 1.3) * amp;
      ctx.globalAlpha = b.a * (dimOthers && !f && !read.has(b.r) ? 0.7 : 1);
      const cStr = m === 0 ? b.c0 : m === 1 ? b.c1 : m === 0.6 ? b.c6 : mix(b.g, col, m);
      frag(b.k, x, y, b.s * (f ? 1.2 : 1) * (narrow ? 0.75 : 0.85), cStr, b.ca, b.sa);
    }
    const base = narrow ? 7 : 11, RED = COLS.model, TEAL_STR = `rgb(${TEAL.join(',')})`;
    for (const q of flows) {
      const th = threads[q.s]; if (!th) continue;
      const f = focusOn(q.art), rd = read.has(q.art), rt = readT.get(q.art);
      // 讀過：紅色從人那端沿著碎片流過去
      const fill = rt === undefined ? 0 : reduce || rt === -Infinity ? 1 : Math.min(1, (t - rt) / 1100);
      let u = reduce ? q.u0 : (q.u0 + t * q.sp * (f ? 1.8 : 1) * q.dir) % 1; if (u < 0) u += 1;
      const p = curve(th, u, t), p2 = curve(th, Math.min(1, u + 0.01), t);
      let nx = -(p2.y - p.y), ny = p2.x - p.x; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
      const spread = base * (0.35 + 2.6 * (u - 0.5) ** 2) * (f ? 1.15 : 1), amp = reduce ? 0 : 0.9;
      const x = p.x + nx * q.off * spread + Math.sin(t * 0.0011 * q.fq + q.ph) * amp, y = p.y + ny * q.off * spread + Math.cos(t * 0.0009 * q.fq + q.ph * 1.3) * amp;
      let m = u < fill ? 1 : 0; if (f) m = Math.max(m, rd ? 1 : 0.6);
      const pix = u > q.th;
      ctx.globalAlpha = 0.85 * Math.min(1, u / 0.07, (1 - u) / 0.07) * (dimOthers && !f && !rd ? 0.7 : 1);
      const cStr = pix && q.tint && !m ? TEAL_STR : m === 0 ? q.c0 : m === 1 ? q.c1 : m === 0.6 ? q.c6 : mix(q.g, RED, m);
      frag(pix ? 1 : 0, x, y, q.sz * (f ? 1.2 : 1) * (narrow ? 0.75 : 0.85), cStr, q.ca, q.sa);
    }
    ctx.globalAlpha = 1;
  };

  // 動畫迴圈：區塊看得到才跑；減少動態時只在狀態改變時重畫一次
  let visible = false, raf = 0, dirty = true, greeted = false;
  const loop = (t: number) => {
    if (!reduce || dirty) { frame(t); dirty = false; }
    raf = visible ? requestAnimationFrame(loop) : 0;
  };
  // 區塊很高（整份清單），不能用面積比例當門檻：有任何一部分在視窗內就跑；進到視窗上半部才算「看到了」
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  }).observe(root);
  let inView = false;
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView && !greeted && ready) greet();
  }, { rootMargin: '0px 0px -50% 0px' }).observe(root);

  // 上次來過之後新讀完的篇章：進到畫面時染開，浮出一句回饋，並記住已經看過
  let toastT = 0;
  const greet = () => {
    greeted = true;
    const now = performance.now();
    fresh.forEach((s, n) => readT.set(bySlug.get(s)!, now + n * 260));
    if (fresh.length) {
      const last = ARTS[bySlug.get(fresh[fresh.length - 1])!];
      toast.textContent = fresh.length > 1 ? `你${seen.size ? '又' : '已經'}讀完 ${fresh.length} 篇，點亮了臉譜上的 ${fresh.length} 塊色彩` : `你剛讀完〈${last.t}〉，點亮了臉譜上的一塊色彩`;
      toast.classList.add('on'); clearTimeout(toastT); toastT = window.setTimeout(() => toast.classList.remove('on'), 3200);
    }
    try { localStorage.setItem(SEEN, JSON.stringify(readList)); } catch { /* 儲存不能用：下次再染一次也無妨 */ }
    dirty = true;
  };

  // 捲動決定焦點：跨過「閱讀線」的那一步（桌機在畫面中線；手機在臉下方區域的三成處）
  const onScroll = () => {
    const sh = narrow ? stageH : 0;
    const line = narrow ? topOffset + sh + (innerHeight - topOffset - sh) * 0.3 : innerHeight * 0.5;
    let hit: HTMLElement | undefined;
    for (const s of steps) { const b = s.getBoundingClientRect(); if (b.top <= line && b.bottom > line) { hit = s; break; } }
    const na = hit?.dataset.i !== undefined ? +hit.dataset.i : -1, np = hit?.dataset.thread ?? '';
    if (na !== active || np !== pick) {
      active = na; pick = np;
      steps.forEach((s) => s.classList.toggle('on', s === hit));
      hud(); dirty = true;
    }
  };
  let tick = false;
  addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; onScroll(); }); }, { passive: true });

  // 點臉上的一塊：清單捲到那一篇（輔助路徑；主要還是捲動與點清單）
  const nearest = (e: PointerEvent | MouseEvent) => {
    const r = cv.getBoundingClientRect();
    const x = (e.clientX - r.left - (W / 2 - cam.x * cam.s)) / cam.s, y = (e.clientY - r.top - (H / 2 + yOff() - cam.y * cam.s)) / cam.s;
    let best = -1, bd = (narrow ? 26 : 34) ** 2;
    cent.forEach((c, i) => { const d = (c.x - x) ** 2 + (c.y - y) ** 2; if (d < bd) { bd = d; best = i; } });
    if (best < 0) for (const b of bits) { if ((b.x - x) ** 2 + (b.y - y) ** 2 < 64) { best = b.r; break; } }
    return best;
  };
  cv.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; const h = nearest(e); if (h !== hoverR) { hoverR = h; dirty = true; } cv.style.cursor = h >= 0 ? 'pointer' : ''; });
  cv.addEventListener('pointerleave', () => { hoverR = -1; dirty = true; });
  cv.addEventListener('click', (e) => { const i = nearest(e); if (i >= 0) rows.find((r) => +r.dataset.i! === i)?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); });

  // 分享你的這張臉：借同一支畫筆，在離屏畫布上以全臉、無焦點、顏色到位的狀態畫一次，再交給分享卡
  const share = root.querySelector<HTMLElement>('[data-fm-share]');
  if (share && read.size) {
    share.hidden = false;
    share.querySelector('[data-fm-share-n]')!.textContent = `${read.size}／22`;
    const msg = share.querySelector<HTMLElement>('[data-fm-share-msg]')!;
    const snapshot = () => {
      const face = document.createElement('canvas'); face.width = 1080; face.height = 640;
      const keep = { ctx, W, H, dpr, narrow, active, pick, hoverR, cam: { ...cam } };
      ctx = face.getContext('2d')!; W = face.width; H = face.height; dpr = 1; narrow = false; active = -1; pick = ''; hoverR = -1;
      geometry(true); Object.assign(cam, { x: W / 2, y: H / 2, s: 1 });
      frame(performance.now() + 1e7);
      ({ ctx, W, H, dpr, narrow, active, pick, hoverR } = keep); Object.assign(cam, keep.cam);
      geometry();
      return face;
    };
    const per = (c: Ch) => { const all = byCh(c); return [CHZ[c], all.filter((i) => read.has(i)).length, all.length, COLS[c]] as const; };
    const makeCard = () => drawFaceCard({ face: snapshot(), n: read.size, url: new URL('/', location.origin).href, parts: (['intro', 'people', 'model', 'ai'] as Ch[]).map(per) });
    share.querySelector('[data-fm-share-go]')?.addEventListener('click', async () => {
      if (!ready) return;
      msg.textContent = '製作卡片中…';
      const url = new URL('/', location.origin).href;
      const card = await makeCard();
      msg.textContent = card ? await shareCanvas(card, 'decision-wisdom-my-face.png', '人機智慧臉譜｜決策智慧 2026', `我在《決策智慧 2026》點亮了 ${read.size}／22 篇人機智慧臉譜`, url) : '這個瀏覽器不能產生圖片。';
    });
    share.querySelector('[data-fm-share-dl]')?.addEventListener('click', async () => {
      if (!ready) return;
      msg.textContent = '製作卡片中…';
      const card = await makeCard();
      msg.textContent = card && (await downloadCanvas(card, 'decision-wisdom-my-face.png')) ? '已下載卡片。' : '這個瀏覽器不能產生圖片。';
    });
  }

  new ResizeObserver(layout).observe(cv);
  hud();
  build().then(() => { onScroll(); if (inView && !greeted) greet(); }).catch(() => stage.setAttribute('hidden', ''));
}
