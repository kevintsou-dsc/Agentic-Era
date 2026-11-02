// 換頁翻紙（global.css .curtain）：點站內連結 → 紙幕由下往上蓋滿 → 才換頁；新頁被紙幕蓋著開場，就緒後紙幕往上收走。
// 瀏覽器原生跨頁換場要等新頁載入完才播，一般點連結時讀者只看到卡一下就切換，所以改由這裡掌握時機。
// 只處理會由瀏覽器自己換頁的一般點擊：新分頁、修飾鍵、下載、站外、同頁錨點、已被其他腳本攔下的、減少動態都不管。
// 新頁的 is-entering 由 Loader.astro 的行內腳本在第一次繪製前加上（讀 sessionStorage['dw-nav']）。
const NAV = 'dw-nav';
const COVER = 360; // 與 curtain-in 的時間一致

export function initPageExit() {
  const root = document.documentElement;
  // 新頁：字體就緒（最多等 400ms）就收幕；CSS 另有 1.2 秒的保底
  if (root.classList.contains('is-entering')) {
    const open = () => root.classList.add('is-entered');
    Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 400))]).then(() => requestAnimationFrame(open));
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest?.('a');
    if (!a || !a.href || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
    const to = new URL(a.href, location.href);
    if (to.origin !== location.origin) return;
    if (to.pathname === location.pathname && to.search === location.search) return; // 同頁錨點
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    try { sessionStorage.setItem(NAV, '1'); } catch { /* 存不了就只是新頁沒有收幕動畫 */ }
    root.classList.remove('is-entering', 'is-entered');
    root.classList.add('is-leaving');
    setTimeout(() => location.assign(to.href), COVER);
  });
  // 從上一頁快取回來時，頁面會停在紙幕蓋滿的樣子：還原
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    root.classList.remove('is-leaving', 'is-entering', 'is-entered');
    try { sessionStorage.removeItem(NAV); } catch { /* 無妨 */ }
  });
}
