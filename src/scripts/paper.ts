// 紙上筆跡：滑鼠在空白的紙面上移動時，留下淡淡的鉛筆線（兩條略錯開的細線＝石墨的顆粒感），約 2 秒後褪去。
// 經過文字、卡片、圖表、按鈕時不畫，避免干擾閱讀；只對滑鼠生效，觸控與減少動態時不啟動。
// 畫在一張固定的全螢幕 canvas（multiply 疊色、不接收滑鼠事件）。
const SKIP = 'p, h1, h2, h3, li, blockquote, figure, a, button, input, dialog, .card, .graphic, .stage, .quote-block, .hx-quote, .hx-title, img, svg, table';

export function initPaper() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine)').matches) return;
  const c = document.createElement('canvas');
  c.className = 'paper-ink';
  c.setAttribute('aria-hidden', 'true');
  document.body.append(c);
  const ctx = c.getContext('2d')!;
  let dpr = 1;
  const size = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  addEventListener('resize', size);
  // 捲動時清掉（筆跡畫在視窗座標，跟著頁面捲走會不對位）
  addEventListener('scroll', () => ctx.clearRect(0, 0, innerWidth, innerHeight), { passive: true });

  let last: { x: number; y: number } | null = null;
  let lastDraw = 0, raf = 0;
  const fade = () => {
    // 每一幀把整張畫布擦淡一點；閒置 2.4 秒後清空並停止
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,.045)';
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'source-over';
    if (performance.now() - lastDraw > 2400) { ctx.clearRect(0, 0, innerWidth, innerHeight); raf = 0; return; }
    raf = requestAnimationFrame(fade);
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = e.target as Element | null;
    if (t?.closest?.(SKIP)) { last = null; return; }
    const x = e.clientX, y = e.clientY;
    if (last) {
      const d = Math.hypot(x - last.x, y - last.y);
      if (d > 1.5 && d < 160) {
        // 主線＋一條略錯開的髮絲線，粗細與濃淡隨速度變化（快＝淡、細）
        const k = Math.min(1, d / 40);
        ctx.lineCap = 'round';
        ctx.strokeStyle = `rgba(52,44,34,${0.26 - k * 0.12})`;
        ctx.lineWidth = 1.5 - k * 0.7;
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(x, y); ctx.stroke();
        ctx.strokeStyle = `rgba(52,44,34,${0.12 - k * 0.05})`;
        ctx.lineWidth = 0.6;
        const j = 1.2;
        ctx.beginPath(); ctx.moveTo(last.x + j, last.y - j); ctx.lineTo(x + j * 0.6, y - j * 1.2); ctx.stroke();
        lastDraw = performance.now();
        if (!raf) raf = requestAnimationFrame(fade);
      }
    }
    last = { x, y };
  }, { passive: true });
  document.addEventListener('pointerleave', () => { last = null; });
}
