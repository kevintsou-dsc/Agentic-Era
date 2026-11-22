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
    const cards = steps.map((s) => s.querySelector<HTMLElement>('.card') ?? s);
    return graphic && steps.length ? [{ block, graphic, steps, cards, current: -1 }] : [];
  });
  const short = window.matchMedia('(max-height: 560px)');
  const mobile = window.matchMedia('(max-width: 899px)');
  const update = () => {
    const trigger = window.innerHeight * (mobile.matches ? 0.82 : 0.7);
    for (const b of blocks) {
      // 矮視窗沒有固定圖，直接顯示最後一步（與 global.css 的 max-height: 560px 對應）
      if (short.matches) {
        if (b.current !== b.steps.length) { b.current = b.steps.length; setStep(b.graphic, b.current); }
        continue;
      }
      const rect = b.block.getBoundingClientRect();
      if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 2) continue;
      let idx = 1;
      b.cards.forEach((c, i) => { if (c.getBoundingClientRect().top <= trigger) idx = i + 1; });
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
  initPeek(blocks.map((b) => b.block));

  // 案例模擬互動：點擊步驟列（情境／方法／模擬）或選項卡預測結果，立即切換圖形並捲至對應段落
  document.addEventListener('click', (e) => {
    const pickEl = (e.target as Element | null)?.closest<HTMLElement>('[data-cs-pick]');
    const stepBtn = pickEl ?? (e.target as Element | null)?.closest<HTMLElement>('[data-cs-step]');
    if (!stepBtn) return;
    const scrolly = stepBtn.closest<HTMLElement>('.scrolly');
    const b = blocks.find((x) => x.block === scrolly);
    if (!b) return;
    if (pickEl) {
      const opts = pickEl.closest('.cs-opts')?.querySelectorAll<HTMLElement>('[data-cs-pick]');
      opts?.forEach((o) => o.classList.toggle('is-picked', o === pickEl));
    }
    const k = Math.min(b.steps.length, Math.max(1, Number(pickEl ? 3 : stepBtn.dataset.csStep)));
    const targetStep = b.steps[k - 1];
    if (!targetStep) return;
    b.current = k;
    b.steps.forEach((s, i) => s.classList.toggle('is-active', i === k - 1));
    setStep(b.graphic, k);
    targetStep.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'instant' : 'smooth' });
  });
}

// 手機：卡片右上角的眼睛鈕切換「看圖模式」（同一段所有卡片淡化、點擊穿透到圖）。
// 離開這一段就自動恢復，避免讀者往下讀到別段時找不到文字。
function initPeek(blocks: HTMLElement[]) {
  const set = (block: HTMLElement, on: boolean) => {
    block.classList.toggle('is-peek', on);
    block.querySelectorAll<HTMLButtonElement>('[data-peek]').forEach((b) => {
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', on ? '顯示文字' : '淡化文字，看清楚圖表');
    });
  };
  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-peek]');
    const block = btn?.closest<HTMLElement>('.scrolly');
    if (block) set(block, !block.classList.contains('is-peek'));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (!en.isIntersecting && en.target.classList.contains('is-peek')) set(en.target as HTMLElement, false); });
  });
  blocks.forEach((b) => io.observe(b));
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
    overflow: 0,
    lastP: -1,
  }));
  if (!blocks.length) return;
  const measureOverflow = () => {
    for (const b of blocks) {
      b.overflow = b.track ? Math.max(0, b.track.scrollWidth - b.track.parentElement!.clientWidth) : 0;
      b.lastP = -1;
    }
  };
  const update = () => {
    for (const b of blocks) {
      if (!b.track) continue;
      if (fallback.matches || b.el.classList.contains('hs-free')) { b.track.style.transform = ''; b.lastP = -1; continue; }
      const rect = b.el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      if (p === b.lastP) continue;
      b.lastP = p;
      b.track.style.transform = `translate3d(${-p * b.overflow}px,0,0)`;
      if (b.bar) b.bar.style.transform = `scaleX(${p})`;
    }
  };
  let ticking = false;
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measureOverflow(); onScroll(); });
  measureOverflow();
  update();

  // 卡片展開後若比可用高度還高，收起上方引言（.hs-tight）；收合後恢復
  // 連引言收起都放不下最高的卡片時（小手機、長內容），整段改成一般的左右滑動（.hs-free），卡片照內容長高，
  // 不讓讀者在固定的卡片裡再上下捲。from：讀者剛展開的那張卡片，版面切換後把它留在畫面上。
  const fit = (el: HTMLElement, from?: HTMLElement) => {
    const pin = el.querySelector<HTMLElement>('.hs-pin');
    const vp = el.querySelector<HTMLElement>('.hs-viewport');
    if (!pin || !vp) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>('.hs-panel'));
    const natural = Math.max(...panels.map((p) => p.scrollHeight));
    const wasFree = el.classList.contains('hs-free');
    // 固定版面下卡片最多能用的高度：畫面高度（手機取網址列展開時的最小高度，與 100svh 一致）
    // 扣掉固定區塊上下留白 72＋20、小標、頁尾列，以及軌道留白與緩衝 40
    const fixed = (el.querySelector<HTMLElement>('.hs-head .eyebrow')?.offsetHeight ?? 0) + (el.querySelector<HTMLElement>('.hs-foot')?.offsetHeight ?? 0);
    const most = document.documentElement.clientHeight - 92 - fixed - 40;
    // 讀者收合卡片時不切回固定版面（版面跳動比多滑一下更干擾），只有視窗大小改變才重新判斷
    const free = !fallback.matches && (natural > most || (wasFree && !!from));
    const setFree = (on: boolean) => {
      el.classList.toggle('hs-free', on);
      if (on) pin.classList.remove('hs-tight');
      update();
      if (on && from) { el.scrollIntoView({ block: 'start', behavior: 'instant' }); vp.scrollLeft = from.offsetLeft - 16; }
    };
    if (free !== wasFree) setFree(free);
    if (free) return;
    // 以「引言展開時」的可用高度判斷：目前已收起的話，要扣掉引言本身的高度
    const room = vp.clientHeight - (pin.classList.contains('hs-tight') ? (el.querySelector<HTMLElement>('.hs-intro')?.scrollHeight ?? 0) : 0);
    pin.classList.toggle('hs-tight', natural > room - 20);
    // 卡片最高只能到可用高度（等高拉齊後，最高那張決定整組高度）
    const setRoom = () => el.style.setProperty('--hs-room', `${vp.clientHeight - 20}px`);
    setRoom();
    // 引言收起或展開有 0.45 秒過場，結束後的可用高度才是最後的值；只量一次會把卡片卡在過場前的矮高度
    // 上面的估算少算了頁尾折行這類細節時，這裡再實際量一次：卡片內容還是比卡片高，就改成左右滑動
    // （讀 scrollHeight 會強制重新排版，不必等下一個畫格；分頁在背景時 requestAnimationFrame 不會跑）
    setTimeout(() => {
      setRoom();
      if (!el.classList.contains('hs-free') && panels.some((p) => p.scrollHeight > p.clientHeight + 4)) setFree(true);
    }, 520);
  };
  for (const b of blocks) {
    // 展開動畫結束後再量（expand.ts 的高度動畫約 0.35 秒）
    b.el.addEventListener('toggle', (e) => setTimeout(() => fit(b.el, (e.target as HTMLElement).closest<HTMLElement>('.hs-panel') ?? undefined), 380), true);
    fit(b.el);
  }
  const refit = () => { measureOverflow(); blocks.forEach((b) => fit(b.el)); update(); };
  window.addEventListener('resize', refit);
  // 網頁字體載入後行數會變、圖片載入後高度會變，卡片高度要重新量
  window.addEventListener('load', refit);
  document.fonts?.ready.then(refit);
}

export function initScrolly() {
  initSteps();
  initHScroll();
  initOnce('[data-count]', animateCount, 0.6);
  initOnce('.reveal', (el) => el.classList.add('is-in'), 0.2);
  initProgress();
}
