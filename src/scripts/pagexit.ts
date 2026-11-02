// 換頁回饋（global.css 跨頁換場）：點站內連結的當下就讓舊頁內容開始淡出。
// 跨頁換場要等新頁載入完成才開始播；上一頁／下一頁有快取幾乎立刻播，一般點連結卻要先等 0.3–0.7 秒（網路慢更久），
// 那段時間舊頁完全不動，讀者感覺不到換頁。點下去就先淡出，等新頁好了再接上換場。
// 只處理會由瀏覽器自己換頁的一般點擊：新分頁、修飾鍵、下載、站外、同頁錨點、已被其他腳本攔下的都不管。
const LEAVING = 'is-leaving';

export function initPageExit() {
  if (!('CSSViewTransitionRule' in window)) return; // 沒有跨頁換場的瀏覽器照常換頁
  const root = document.documentElement;
  let timer = 0;
  const reset = () => { clearTimeout(timer); root.classList.remove(LEAVING); };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest?.('a');
    if (!a || !a.href || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
    const to = new URL(a.href, location.href);
    if (to.origin !== location.origin) return;
    if (to.pathname === location.pathname && to.search === location.search) return; // 同頁錨點
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.classList.add(LEAVING);
    // 換頁沒發生（例如被取消）時把頁面還原
    timer = window.setTimeout(reset, 5000);
  });
  // 從上一頁快取回來時，頁面會停在離開前的樣子：還原
  addEventListener('pageshow', (e) => { if (e.persisted) reset(); });
}
