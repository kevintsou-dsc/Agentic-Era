// 捲動敘事引擎：
// - .scrolly 內的 .step 進入視窗中段時，把步驟編號寫到同一區塊的 .graphic（data-step 與累進的 is-1…is-n 類別），圖形用 CSS 依步驟變化
// - [data-count] 進入視窗時跑一次數字動畫
// - .reveal 進入視窗時淡入
// - 頂部進度條依整頁捲動比例更新

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setStep(graphic: HTMLElement, step: number) {
  graphic.dataset.step = String(step);
  for (let i = 1; i <= 12; i++) graphic.classList.toggle(`is-${i}`, i <= step);
}

// 步驟由捲動位置直接算出（最後一個頂端已越過視窗中線的 step），
// 所以重新整理後回到原位、快速捲過、停在最後一步之後，圖形狀態都正確。
function initSteps() {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>('.scrolly')).flatMap((block) => {
    const graphic = block.querySelector<HTMLElement>('.graphic');
    const steps = Array.from(block.querySelectorAll<HTMLElement>('.step'));
    return graphic && steps.length ? [{ block, graphic, steps, current: -1 }] : [];
  });
  const short = window.matchMedia('(max-height: 560px)');
  const update = () => {
    const mid = window.innerHeight / 2;
    for (const b of blocks) {
      // 矮視窗沒有固定圖，直接顯示最後一步（與 global.css 的 max-height: 560px 對應）
      if (short.matches) {
        if (b.current !== b.steps.length) { b.current = b.steps.length; setStep(b.graphic, b.current); }
        continue;
      }
      const rect = b.block.getBoundingClientRect();
      if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 2) continue;
      let idx = 0;
      b.steps.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) idx = i + 1; });
      if (idx === b.current) continue;
      b.current = idx;
      b.steps.forEach((s, i) => s.classList.toggle('is-active', i === idx - 1));
      setStep(b.graphic, idx);
    }
  };
  let ticking = false;
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

function animateCount(el: HTMLElement) {
  const to = Number(el.dataset.count);
  const from = Number(el.dataset.from ?? 0);
  const decimals = Number(el.dataset.decimals ?? 0);
  const prefix = el.dataset.prefix ?? '';
  const format = (v: number) => prefix + v.toLocaleString('zh-TW', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  if (reduceMotion) { el.textContent = format(to); return; }
  const duration = Number(el.dataset.duration ?? 1400);
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = format(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initOnce(selector: string, onEnter: (el: HTMLElement) => void, threshold = 0.4) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onEnter(entry.target as HTMLElement);
        io.unobserve(entry.target);
      });
    },
    { threshold },
  );
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => io.observe(el));
}

function initProgress() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

// 橫向捲動：依區塊的垂直捲動進度，把軌道向左平移（矮視窗與減少動態時由 CSS 退回原生滑動）
function initHScroll() {
  const fallback = window.matchMedia('(max-height: 560px), (prefers-reduced-motion: reduce)');
  const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-hscroll]')).map((el) => ({
    el,
    track: el.querySelector<HTMLElement>('[data-hs-track]'),
    bar: el.querySelector<HTMLElement>('[data-hs-progress]'),
  }));
  if (!blocks.length) return;
  const update = () => {
    for (const b of blocks) {
      if (!b.track) continue;
      if (fallback.matches) { b.track.style.transform = ''; continue; }
      const rect = b.el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      const overflow = b.track.scrollWidth - b.track.parentElement!.clientWidth;
      b.track.style.transform = `translate3d(${-p * Math.max(0, overflow)}px,0,0)`;
      if (b.bar) b.bar.style.transform = `scaleX(${p})`;
    }
  };
  let ticking = false;
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

export function initScrolly() {
  initSteps();
  initHScroll();
  initOnce('[data-count]', animateCount, 0.6);
  initOnce('.reveal', (el) => el.classList.add('is-in'), 0.2);
  initProgress();
}
