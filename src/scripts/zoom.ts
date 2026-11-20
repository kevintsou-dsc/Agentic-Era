// 圖表放大：手機上寬版插畫（例如 a04 服務矩陣）縮得太小，點 [data-zoom] 把整張圖複製到 <dialog id="zoom"> 全螢幕顯示，
// 可左右捲動與雙指縮放。複製出來的圖不在捲動場景裡，dialog 的 CSS 讓所有步驟都呈現完成狀態。
export function initZoom() {
  const dialog = document.getElementById('zoom') as HTMLDialogElement | null;
  const body = dialog?.querySelector<HTMLElement>('[data-zoom-body]');
  if (!dialog || !body) return;
  let opener: HTMLElement | null = null;
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-zoom]');
    if (!btn || btn.closest('#zoom')) return;
    // 圖本身只在手機上可點開；按鈕則一律有效（按鈕本身只在手機顯示）
    if (!btn.matches('button') && !matchMedia('(max-width: 720px)').matches) return;
    const src = btn.closest('figure')?.querySelector('[data-zoom-src]');
    if (!src) return;
    e.preventDefault();
    opener = btn;
    const copy = src.cloneNode(true) as HTMLElement;
    copy.removeAttribute('data-zoom-src');
    // 複製 SVG 內若含 <defs> ID（如 marker），加上 -zoom 後綴避免與原圖 ID 衝突
    const ids = new Map<string, string>();
    copy.querySelectorAll('[id]').forEach((el) => {
      const oldId = el.id;
      if (!oldId) return;
      const newId = `${oldId}-zoom`;
      ids.set(oldId, newId);
      el.id = newId;
    });
    if (ids.size) {
      copy.querySelectorAll('*').forEach((el) => {
        for (const attr of Array.from(el.attributes)) {
          let val = attr.value;
          ids.forEach((n, o) => {
            val = val.replaceAll(`url(#${o})`, `url(#${n})`);
            if (attr.name === 'href' || attr.name === 'xlink:href') {
              if (val === `#${o}`) val = `#${n}`;
            }
          });
          if (val !== attr.value) el.setAttribute(attr.name, val);
        }
      });
    }
    body.replaceChildren(copy);
    dialog.showModal();
    body.scrollLeft = 0;
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || (e.target as HTMLElement).closest('[data-zoom-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => { body.replaceChildren(); opener?.focus(); });
}
