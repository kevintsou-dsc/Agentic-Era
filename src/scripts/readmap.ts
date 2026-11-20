// 結尾全書地圖（components/ReadMap.astro）：已讀紀錄只存在讀者瀏覽器（localStorage['dw-read']，短名陣列），不傳出。
// 「已讀」＝帶走的問題（.asks）在視窗內連續停留 3 秒；捲到分享區或「接下來」停留 0.9 秒也算。
// 儲存無法使用或內容壞掉時：只標示目前這篇，不顯示任何數字。
const KEY = 'dw-read';
const DWELL = 3000;

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

  // 「已讀」：帶走的問題在視窗中段停留 2 秒；或捲過問題、到了分享區或「接下來」停留 1 秒（快速捲動的讀者也算讀完）
  const asks = document.querySelector('.asks');
  const ends = Array.from(document.querySelectorAll('[data-share], nav.next'));
  if (!asks || !read || read.has(current)) return;
  let done = false;
  const mark = () => {
    if (done) return;
    const now = load();
    if (!now) return;
    done = true;
    const before = [...now];
    now.add(current);
    try { localStorage.setItem(KEY, JSON.stringify([...now])); } catch { return; }
    render(now);
    document.dispatchEvent(new CustomEvent('dw:read', { detail: { before, after: [...now] } })); // 成就卡（scripts/snack.ts）
    io.disconnect();
    io2.disconnect();
  };
  const timers = new Map<Element, number>();
  const watch = (ms: number) => (es: IntersectionObserverEntry[]) => es.forEach((e) => {
    clearTimeout(timers.get(e.target));
    if (e.isIntersecting) timers.set(e.target, window.setTimeout(mark, ms));
  });
  const io = new IntersectionObserver(watch(DWELL), { rootMargin: '-30% 0px -30% 0px' }); // 進入視窗中段停留 3 秒才算，讓讀者先看完帶走的問題
  const io2 = new IntersectionObserver(watch(900));
  io.observe(asks);
  ends.forEach((el) => io2.observe(el));
}
