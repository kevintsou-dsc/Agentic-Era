// 原文視窗：點 [data-reader]（出處按鈕）→ 抓取該篇原文頁 → 放進 <dialog id="reader"> →
// 依建置時算好的位置高亮引文 → 捲到第一個高亮處。一個動作完成，不用先看片段再跳頁。
// 抓不到原文（離線等）時，退回一般連結，直接前往原文頁。
type Seg = [number, number, number];
interface Payload { slug: string; page: number; segs: Seg[] }

const pages = new Map<string, Promise<{ title: string; meta: string; body: string }>>();

function load(slug: string) {
  let p = pages.get(slug);
  if (!p) {
    p = fetch(`/a/${slug}/full/`).then(async (r) => {
      if (!r.ok) throw new Error(String(r.status));
      const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
      return {
        title: doc.querySelector('h1')?.textContent ?? '',
        meta: doc.querySelector('.reader-meta')?.innerHTML ?? '',
        body: doc.querySelector('[data-fulltext]')?.innerHTML ?? '',
      };
    });
    pages.set(slug, p);
    p.catch(() => pages.delete(slug));
  }
  return p;
}

function highlight(root: HTMLElement, segs: Seg[]) {
  for (const [i, s, e] of segs) {
    const el = root.querySelector<HTMLElement>(`[data-i="${i}"]`);
    const node = el?.firstChild;
    if (!el || !node || node.nodeType !== Node.TEXT_NODE) continue;
    const range = document.createRange();
    range.setStart(node, Math.min(s, node.textContent!.length));
    range.setEnd(node, Math.min(e, node.textContent!.length));
    const mark = document.createElement('mark');
    range.surroundContents(mark);
  }
}

export function initReader() {
  const dialog = document.getElementById('reader') as HTMLDialogElement | null;
  if (!dialog) return;
  const title = dialog.querySelector<HTMLElement>('[data-reader-title]')!;
  const meta = dialog.querySelector<HTMLElement>('[data-reader-meta]')!;
  const body = dialog.querySelector<HTMLElement>('[data-reader-body]')!;
  const full = dialog.querySelector<HTMLAnchorElement>('[data-reader-full]')!;
  let opener: HTMLElement | null = null;

  document.addEventListener('click', async (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('[data-reader]');
    if (!a) return;
    e.preventDefault();
    const data = JSON.parse(a.dataset.reader!) as Payload;
    opener = a;
    title.textContent = '載入原文…';
    meta.innerHTML = '';
    body.replaceChildren();
    full.href = `/a/${data.slug}/full/#p${data.page}`;
    if (!dialog.open) dialog.showModal();
    try {
      const page = await load(data.slug);
      title.textContent = page.title;
      meta.innerHTML = page.meta;
      body.innerHTML = page.body;
      highlight(body, data.segs);
      const target = body.querySelector('mark') ?? body.querySelector(`#p${data.page}`);
      target?.scrollIntoView({ block: 'center' });
    } catch {
      window.location.href = full.href;
    }
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || (e.target as HTMLElement).closest('[data-reader-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus());
}
