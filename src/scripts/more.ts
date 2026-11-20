// 細節卡：點 [data-more] 按鈕，把它內含的 <template> 放進 <dialog id="more"> 打開。
// 細節卡裡的出處按鈕仍可再開原文視窗（兩個 dialog 可以疊加）。
export function initMore() {
  const dialog = document.getElementById('more') as HTMLDialogElement | null;
  const body = dialog?.querySelector<HTMLElement>('[data-more-body]');
  if (!dialog || !body) return;
  let opener: HTMLElement | null = null;

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-more]');
    if (!btn || btn.closest('#more')) return;
    const tpl = btn.querySelector('template');
    if (!tpl) return;
    e.preventDefault();
    opener = btn;
    body.replaceChildren(tpl.content.cloneNode(true));
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-more-close]')?.focus();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || (e.target as HTMLElement).closest('[data-more-close]')) dialog.close();
  });
  const placeTip = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const half = 152;
    const cx = r.left + r.width / 2;
    if (cx - half < 12) el.dataset.tipAlign = 'left';
    else if (cx + half > vw - 12) el.dataset.tipAlign = 'right';
    else delete el.dataset.tipAlign;
    if (r.top < 200) el.dataset.tipPos = 'bottom';
    else delete el.dataset.tipPos;
  };
  document.addEventListener('pointerenter', (e) => {
    const el = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-tip]') : null;
    if (el) placeTip(el);
  }, true);
  document.addEventListener('focusin', (e) => {
    const el = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-tip]') : null;
    if (el) placeTip(el);
  });

  dialog.addEventListener('close', () => opener?.focus());
}
