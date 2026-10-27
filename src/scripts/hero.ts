// 首頁開場動畫（components/home/Hero.astro）。
// 1. 依網址 ?hero=c 決定提案（預設 a），寫在 <html data-hero>。
// 2. 捲動時算出整段 sticky 區的進度 --p（0～1），CSS 依 --p 演出；A 完全用 CSS。
// 3. C：從 AI 碎裂臉取樣像素，每顆碎片在「散落位置 ↔ 臉上位置」之間依 --p 內插，畫在 canvas；只在 --p 改變時重畫。
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

type Bit = { sx: number; sy: number; tx: number; ty: number; dx: number; dy: number; s: number; g: number; d: number };

export function initHero() {
  const hx = document.querySelector<HTMLElement>('[data-hero]');
  if (!hx) return;
  const v = new URLSearchParams(location.search).get('hero') === 'c' ? 'c' : 'a';
  document.documentElement.dataset.hero = v;
  if (reduce) return;

  let p = 0;
  let draw: ((p: number) => void) | null = null;
  const update = () => {
    const r = hx.getBoundingClientRect();
    const span = r.height - innerHeight;
    p = Math.min(1, Math.max(0, -r.top / (span || 1)));
    hx.style.setProperty('--p', p.toFixed(4));
    draw?.(p);
  };
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { setup?.(); update(); });
  update();

  let setup: (() => void) | null = null;
  if (v === 'c') {
    const canvas = hx.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
    if (!canvas) return;
    const img = new Image();
    img.src = canvas.dataset.src!;
    img.onload = () => {
      // 取樣：每 step 像素取一顆，透明處跳過；手機取得較疏
      const off = document.createElement('canvas');
      off.width = img.width; off.height = img.height;
      const octx = off.getContext('2d')!;
      octx.drawImage(img, 0, 0);
      const data = octx.getImageData(0, 0, img.width, img.height).data;
      const samples: { x: number; y: number; g: number }[] = [];
      const step = innerWidth < 720 ? 6 : 4;
      for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {
          const i = (y * img.width + x) * 4;
          if (data[i + 3] < 60) continue;
          samples.push({ x, y, g: Math.round((data[i] + data[i + 1] + data[i + 2]) / 3) });
        }
      }
      // 固定亂數種子，每次重整碎片位置一樣
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      const base = samples.map(() => ({ rx: rnd(), ry: rnd(), a: rnd() * Math.PI * 2, d: rnd(), s: 0.6 + rnd() * 0.9 }));
      const ctx = canvas.getContext('2d')!;
      let bits: Bit[] = [];
      setup = () => {
        const dpr = Math.min(2, devicePixelRatio || 1);
        const W = canvas.clientWidth, H = canvas.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // 臉放在畫面中央，高度約 78% 視窗
        const scale = Math.min((H * 0.78) / img.height, (W * 0.7) / img.width);
        const ox = (W - img.width * scale) / 2, oy = (H - img.height * scale) / 2;
        const size = Math.max(2, step * scale * 0.92);
        bits = samples.map((sm, i) => {
          const b = base[i];
          return {
            sx: b.rx * W, sy: b.ry * H,
            tx: ox + sm.x * scale, ty: oy + sm.y * scale,
            dx: Math.cos(b.a) * (W * 0.6), dy: Math.sin(b.a) * (H * 0.6),
            s: size * b.s, g: sm.g, d: b.d,
          };
        });
      };
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      draw = (p) => {
        const W = canvas.clientWidth, H = canvas.clientHeight;
        ctx.clearRect(0, 0, W, H);
        for (const b of bits) {
          // 組合：p 0.02～0.5，每顆依 d 錯開；炸開：p 0.58～0.86
          const k = ease(Math.min(1, Math.max(0, (p - 0.02 - b.d * 0.16) / 0.32)));
          const e = Math.min(1, Math.max(0, (p - 0.58 - b.d * 0.08) / 0.2));
          const x = b.sx + (b.tx - b.sx) * k + b.dx * e * e;
          const y = b.sy + (b.ty - b.sy) * k + b.dy * e * e;
          const alpha = (0.25 + 0.75 * k) * (1 - e);
          if (alpha <= 0.01) continue;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgb(${b.g},${b.g},${b.g})`;
          ctx.fillRect(x, y, b.s, b.s);
        }
        ctx.globalAlpha = 1;
      };
      setup();
      update();
    };
  }
}
