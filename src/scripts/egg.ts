// 彩蛋：
// 1. 打開開發者工具的人，主控台會看到一段小紙條（原始碼最上方的 HTML 註解也有完整版）。
// 2. 在頁面上直接用鍵盤打出 dentsu（不在輸入框裡），會飄出刊物的手繪小插圖，並出現一張手寫感的感謝紙條。
const WORD = 'dentsu';
const SPOTS = ['search', 'growth', 'box', 'pie', 'browser', 'board', 'stack', 'doc'];

export function initEgg() {
  console.log(
    '%c決策智慧 2026%c\n\n給評審：辛苦了！謝謝您花時間看完這些作品。\n給原文作者群：內容很精彩，我們反覆讀了很多遍。\n給每一位讀者：喜歡的話，歡迎多多交流！\n\n小提示：在頁面上用鍵盤打 dentsu 試試看。',
    'font: 800 20px "Noto Sans TC", sans-serif; color: #1f1d1a; background: #cbdd7a; padding: 4px 10px; border-radius: 6px;',
    'font: 14px/1.7 "Noto Sans TC", sans-serif; color: #5a544b;',
  );

  let buf = '';
  addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (e.ctrlKey || e.metaKey || e.altKey || t.closest('input, textarea, [contenteditable]')) return;
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-WORD.length);
    if (buf === WORD) { buf = ''; celebrate(); }
  });
}

function celebrate() {
  if (document.querySelector('.egg')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wrap = document.createElement('div');
  wrap.className = 'egg';
  wrap.setAttribute('role', 'status');
  // 飄起來的手繪小插圖
  if (!reduce) {
    for (let i = 0; i < 14; i++) {
      const s = SPOTS[i % SPOTS.length];
      const el = document.createElement('span');
      el.className = 'egg-spot';
      el.style.cssText = `--x:${Math.round(Math.random() * 92)}vw;--d:${(Math.random() * 0.8).toFixed(2)}s;--r:${Math.round(Math.random() * 40 - 20)}deg;--s:${(0.6 + Math.random() * 0.7).toFixed(2)};--fill:url(/art/spots/${s}-fill.webp);--line:url(/art/spots/${s}-line.webp)`;
      el.innerHTML = '<i class="f"></i><i class="l"></i>';
      wrap.append(el);
    }
  }
  const note = document.createElement('div');
  note.className = 'egg-note';
  note.innerHTML = `
    <img src="/art/cover/sunflower.webp" alt="" width="678" height="900" />
    <p class="egg-h">你找到彩蛋了！</p>
    <p>謝謝你一路讀到這裡。<br />喜歡的話，歡迎分享給朋友，也歡迎多多交流。</p>
    <svg viewBox="0 0 220 16" aria-hidden="true"><path d="M4 10 C 40 2, 70 14, 110 8 S 180 4, 216 9" /></svg>
    <button type="button">收起來</button>`;
  wrap.append(note);
  document.body.append(wrap);
  const close = () => { wrap.classList.add('egg-out'); setTimeout(() => wrap.remove(), 500); };
  note.querySelector('button')!.addEventListener('click', close);
  (note.querySelector('button') as HTMLButtonElement).focus({ preventScroll: true });
  setTimeout(close, 9000);
}
