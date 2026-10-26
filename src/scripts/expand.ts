// 展開／收合的平滑動畫：所有 <details data-expand> 點擊 summary 時，以高度＋透明度過渡打開或收起，
// 不再瞬間跳開。內容放在 summary 之後的單一元素（.expand-body）。減少動態時維持瀏覽器原生行為。
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(.2, .7, .2, 1)';

function animate(d: HTMLDetailsElement) {
  const summary = d.querySelector('summary')!;
  const body = d.querySelector<HTMLElement>('.expand-body');
  let running: Animation | null = null;
  let wantOpen = d.open; // 動畫中途再點一次時，依「目標狀態」反轉，而不是依 d.open
  summary.addEventListener('click', (e) => {
    if (reduce || !body) return;
    e.preventDefault();
    running?.cancel();
    const opening = !wantOpen;
    wantOpen = opening;
    // 開：先打開量出自然高度；收：扣掉內容與 summary 下方間距，就是收起後的高度
    const start = d.offsetHeight;
    if (opening) d.open = true;
    const end = opening ? d.offsetHeight : start - body.offsetHeight - parseFloat(getComputedStyle(summary).marginBottom || '0');
    d.style.overflow = 'hidden';
    running = d.animate({ height: [`${start}px`, `${end}px`] }, { duration: 380, easing: EASE });
    body.animate({ opacity: opening ? [0, 1] : [1, 0], transform: opening ? ['translateY(-4px)', 'none'] : ['none', 'translateY(-4px)'] }, { duration: 300, easing: EASE });
    running.onfinish = () => {
      if (!opening) d.open = false;
      d.style.overflow = '';
      running = null;
    };
  });
}

export function initExpand() {
  document.querySelectorAll<HTMLDetailsElement>('details[data-expand]').forEach(animate);
}
