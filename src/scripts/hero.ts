// 首頁開場「雙像匯聚」（components/home/Hero.astro）。
// 捲動進度 --p（0～1）：
//   0.00–0.50 滿版散落的碎片匯聚成兩張臉（左：素描大衛，鉛筆短線；右：AI 碎裂臉，像素方塊）
//   0.35–0.75 兩張臉從畫面兩側往中間靠近（拉近距離）
//   0.64–0.80 引言在中間浮現
// 碎片一直帶細微擾動（各自的頻率與相位）；滑鼠經過時推開碎片，移動夠快會劃出擴散波紋，碎片以彈簧回到原位。
// 只在開場區在畫面內時跑動畫迴圈；減少動態時不啟動（Hero.astro 顯示靜態圖）。
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

type Kind = 0 | 1; // 0 = 人（鉛筆線）、1 = AI（像素）
type Bit = {
  k: Kind; ux: number; uy: number;      // 在臉上的位置（0～1，相對臉的寬高）
  rx: number; ry: number;               // 散落位置（0～1，相對畫面）
  d: number; g: number; s: number; a: number; tint: boolean;
  ph: number; fq: number;               // 擾動相位、頻率
  ox: number; oy: number; vx: number; vy: number; // 受滑鼠推動的位移與速度
};
type Ripple = { x: number; y: number; t: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
}

// 取樣一張圖：透明度（或深淺）夠的像素才放碎片，數量控制在 target 左右
function sample(img: HTMLImageElement, target: number, h = 320) {
  const w = Math.round((img.width / img.height) * h);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true })!;
  x.drawImage(img, 0, 0, w, h);
  const data = x.getImageData(0, 0, w, h).data;
  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 50) opaque++;
  const step = Math.max(2, Math.round(Math.sqrt(opaque / target)));
  const out: { u: number; v: number; g: number; a: number }[] = [];
  for (let yy = 0; yy < h; yy += step) {
    for (let xx = 0; xx < w; xx += step) {
      const i = (yy * w + xx) * 4;
      if (data[i + 3] <= 50) continue;
      out.push({ u: xx / w, v: yy / h, g: (data[i] + data[i + 1] + data[i + 2]) / 3, a: data[i + 3] / 255 });
    }
  }
  return { pts: out, ratio: w / h };
}

export function initHero() {
  const hx = document.querySelector<HTMLElement>('[data-hero]');
  const stage = hx?.querySelector<HTMLElement>('[data-hero-stage]');
  const canvas = hx?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (!hx || !stage || !canvas || reduce) return;
  const ctx = canvas.getContext('2d')!;

  let p = 0, W = 0, H = 0, dpr = 1, mobile = false;
  let bits: Bit[] = [];
  let ratios = [0.9, 0.75];
  const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, on: false };
  const ripples: Ripple[] = [];
  let lastRipple = 0;

  const measure = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mobile = W < 720;
  };
  const progress = () => {
    const r = hx.getBoundingClientRect();
    p = clamp(-r.top / ((r.height - innerHeight) || 1));
    hx.style.setProperty('--p', p.toFixed(4));
    hx.classList.toggle('q-on', p > 0.66);
  };

  // 臉的位置：依進度從兩側往中間靠近；手機放在上半部、較小
  const faceBox = (k: Kind) => {
    const close = ease(clamp((p - 0.35) / 0.4));
    const fh = mobile ? H * 0.36 : H * 0.7;
    const fw = fh * ratios[k];
    const cy = mobile ? H * 0.3 : H * 0.52;
    const cx = mobile
      ? (k === 0 ? W * (0.2 + 0.08 * close) : W * (0.8 - 0.08 * close))
      : (k === 0 ? W * (0.1 + 0.14 * close) : W * (0.9 - 0.14 * close));
    return { x: cx - fw / 2, y: cy - fh / 2, w: fw, h: fh };
  };

  const frame = (t: number) => {
    ctx.clearRect(0, 0, W, H);
    // 波紋：每個波紋半徑隨時間擴大，1.1 秒後消失
    for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i].t > 1100) ripples.splice(i, 1);
    const boxes = [faceBox(0), faceBox(1)];
    const R = mobile ? 60 : 110;
    for (const b of bits) {
      const box = boxes[b.k];
      // 匯聚：每顆依 d 錯開出發
      const k = ease(clamp((p - 0.02 - b.d * 0.2) / 0.3));
      // 臉上的位置（AI 那張鏡像，讓兩張臉相望）
      const fx = box.x + (b.k === 0 ? 1 - b.ux : 1 - b.ux) * box.w;
      const fy = box.y + b.uy * box.h;
      const sx = b.rx * W, sy = b.ry * H;
      let x = sx + (fx - sx) * k;
      let y = sy + (fy - sy) * k;
      // 擾動：散落時飄得大，成形後只剩細微顫動
      const amp = 1.2 + (1 - k) * 7;
      x += Math.sin(t * 0.0011 * b.fq + b.ph) * amp;
      y += Math.cos(t * 0.0009 * b.fq + b.ph * 1.3) * amp;
      // 滑鼠推力與波紋
      if (mouse.on) {
        const dx = x + b.ox - mouse.x, dy = y + b.oy - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 0.01) {
          const d = Math.sqrt(d2), f = (1 - d / R) * 1.6;
          b.vx += (dx / d) * f; b.vy += (dy / d) * f;
        }
      }
      for (const r of ripples) {
        const age = t - r.t, rad = age * 0.42;
        const dx = x - r.x, dy = y - r.y, d = Math.hypot(dx, dy);
        if (Math.abs(d - rad) < 16 && d > 0.01) {
          const f = 0.9 * (1 - age / 1100);
          b.vx += (dx / d) * f; b.vy += (dy / d) * f;
        }
      }
      // 彈簧回原位
      b.vx += -b.ox * 0.05; b.vy += -b.oy * 0.05;
      b.vx *= 0.86; b.vy *= 0.86;
      b.ox += b.vx; b.oy += b.vy;
      x += b.ox; y += b.oy;

      const alpha = (0.28 + 0.72 * k) * b.a;
      ctx.globalAlpha = alpha;
      if (b.k === 0) {
        // 人：鉛筆短線（排線方向一致，略帶隨機）
        ctx.strokeStyle = `rgb(${b.g},${b.g - 4},${b.g - 10})`;
        ctx.lineWidth = b.s * 0.45;
        const len = b.s * 1.6, ang = -0.75 + b.ph * 0.08;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(ang) * len, y - Math.sin(ang) * len);
        ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
        ctx.stroke();
      } else {
        // AI：像素方塊，少數帶 AI 藍
        ctx.fillStyle = b.tint ? '#3fa7c4' : `rgb(${b.g},${b.g},${b.g})`;
        ctx.fillRect(x - b.s / 2, y - b.s / 2, b.s, b.s);
      }
    }
    ctx.globalAlpha = 1;
  };

  // 動畫迴圈：只在開場區看得到、分頁在前景時跑
  let visible = true, raf = 0;
  const loop = (t: number) => { frame(t); raf = visible ? requestAnimationFrame(loop) : 0; };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf && bits.length) raf = requestAnimationFrame(loop);
  }).observe(stage);

  // 滑鼠：推開碎片；移動夠快時每 140ms 放一道波紋
  stage.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    const speed = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
    if (speed > 14 && e.timeStamp - lastRipple > 140) { ripples.push({ x: mouse.x, y: mouse.y, t: performance.now() }); lastRipple = e.timeStamp; }
    mouse.px = mouse.x; mouse.py = mouse.y;
  });
  stage.addEventListener('pointerleave', () => { mouse.on = false; });
  // 觸控：點一下放一道波紋
  stage.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
  });

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; progress(); });
  }, { passive: true });
  addEventListener('resize', () => { measure(); progress(); });
  measure();
  progress();

  Promise.all([loadImage(canvas.dataset.human!), loadImage(canvas.dataset.ai!)]).then(([human, ai]) => {
    const per = mobile ? 900 : 1900;
    const hs = sample(human, per), as = sample(ai, per);
    ratios = [hs.ratio, as.ratio];
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const make = (k: Kind, pt: { u: number; v: number; g: number; a: number }): Bit => ({
      k, ux: pt.u, uy: pt.v, rx: rnd(), ry: rnd(), d: rnd(),
      g: Math.round(k === 0 ? Math.min(90, pt.g + 30) : pt.g * 0.85),
      s: (mobile ? 1.6 : 2.2) + rnd() * (mobile ? 1.2 : 2),
      a: k === 0 ? Math.max(0.35, pt.a) : 0.9,
      tint: k === 1 && rnd() < 0.1,
      ph: rnd() * Math.PI * 2, fq: 0.6 + rnd() * 1.2,
      ox: 0, oy: 0, vx: 0, vy: 0,
    });
    bits = [...hs.pts.map((pt) => make(0, pt)), ...as.pts.map((pt) => make(1, pt))];
    if (!raf) raf = requestAnimationFrame(loop);
  }).catch(() => {});
}
