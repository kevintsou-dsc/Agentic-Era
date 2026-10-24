// 書頁視窗：點任何 [data-book] 按鈕，把它內含的 <template> 放進 <dialog id="book"> 打開。
// 使用原生 <dialog>：Esc 關閉、焦點鎖在視窗內、關閉後焦點回到原按鈕，都由瀏覽器處理。
export function initBook() {
  const dialog = document.getElementById('book') as HTMLDialogElement | null;
  const body = dialog?.querySelector<HTMLElement>('[data-book-body]');
  if (!dialog || !body) return;
  let opener: HTMLElement | null = null;

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-book]');
    if (!btn) return;
    const tpl = btn.querySelector('template');
    if (!tpl) return;
    e.preventDefault();
    opener = btn;
    body.replaceChildren(tpl.content.cloneNode(true));
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-book-close]')?.focus();
  });

  dialog.addEventListener('click', (e) => {
    // 點視窗外（背景）或關閉鈕都關閉
    if (e.target === dialog || (e.target as HTMLElement).closest('[data-book-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus());
}
