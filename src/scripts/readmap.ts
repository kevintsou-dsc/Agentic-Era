// 結尾全書地圖（components/ReadMap.astro）：已讀紀錄只存在讀者瀏覽器（localStorage['dw-read']，短名陣列），不傳出。
// 「已讀」＝帶走的問題（.asks）在視窗內連續停留 2 秒（docs/design-review/p1-02-ruling.md L5）。
// 儲存無法使用或內容壞掉時：只標示目前這篇，不顯示任何數字。
const KEY = 'dw-read';
const DWELL = 2000;

export function initReadMap() {
  const map = document.querySelector<HTMLElement>('[data-readmap]');
  if (!map) return;
  const dots = Array.from(map.querySelectorAll<HTMLAnchorElement>('.rm-dot'));
  const valid = new Set(dots.map((d) => d.dataset.slug!));
  const current = map.dataset.current!;
  const count = map.querySelector<HTMLElement>('[data-rm-count]')!;
  const tip = map.querySelector<HTMLElement>('[data-rm-tip]')!;

  const load = (): Set<string> | null => {
    try {
      const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      return new Set(Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string' && valid.has(s)) : []);
    } catch { return null; }
  };
  const render = (read: Set<string>) => {
    dots.forEach((d) => d.classList.toggle('is-read', read.has(d.dataset.slug!)));
    // 只讀過一篇時不顯示數字，避免像待辦清單
    count.textContent = read.size >= 2 ? `已讀 ${read.size} 篇` : '';
  };
  const read = load();
  if (read) render(read);

  // 滑過或聚焦圓點時，上方那行換成該篇標題
  const show = (d: HTMLAnchorElement | null) => { tip.textContent = d ? d.dataset.title! : tip.dataset.default!; };
  dots.forEach((d) => {
    d.addEventListener('pointerenter', () => show(d));
    d.addEventListener('focus', () => show(d));
    // 滑鼠離開時，若鍵盤焦點還停在某個圓點上，就繼續顯示那一篇
    d.addEventListener('pointerleave', () => show(dots.find((x) => x === document.activeElement) ?? null));
    d.addEventListener('blur', () => show(null));
  });

  const asks = document.querySelector('.asks');
  if (!asks || !read || read.has(current)) return;
  let timer = 0;
  const io = new IntersectionObserver(([e]) => {
    clearTimeout(timer);
    if (!e.isIntersecting) return;
    timer = window.setTimeout(() => {
      const now = load();
      if (!now) return;
      now.add(current);
      try { localStorage.setItem(KEY, JSON.stringify([...now])); } catch { return; }
      render(now);
      io.disconnect();
    }, DWELL);
  }, { rootMargin: '-30% 0px -30% 0px' }); // 進入視窗中段才算（問題清單在手機上可能比一屏高，不用比例門檻）
  io.observe(asks);
}
