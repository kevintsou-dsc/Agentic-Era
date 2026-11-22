// 原文視窗：點 [data-reader]（出處按鈕）→ 抓取該篇原文頁 → 放進 <dialog id="reader"> →
// 依建置時算好的位置高亮引文 → 捲到第一個高亮處。一個動作完成，不用先看片段再跳頁。
// 抓不到原文（離線等）時，退回一般連結，直接前往原文頁。
type Seg = [number, number, number];
interface Payload { slug: string; page: number; segs: Seg[] }

const pages = new Map<string, Promise<{ title: string; meta: string; body: string }>>();

function load(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return Promise.reject(new Error('Invalid slug'));
  let p = pages.get(slug);
  if (!p) {
    p = fetch(`/story/${slug}/original/`).then(async (r) => {
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
  // 同一段落有多處高亮時從後往前包：包住後段不會改變前段所在的文字節點與位置
  const ordered = [...segs].sort((x, y) => x[0] - y[0] || y[1] - x[1]);
  for (const [i, s, e] of ordered) {
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

// 等待抓取時的骨架：兩段假段落，末行較短，像真的段落輪廓（樣式見 global.css .skel）
const SKEL = [92, 100, 96, 58, 0, 100, 94, 98, 40];
function skeleton() {
  const box = document.createElement('div');
  box.className = 'skel';
  box.setAttribute('aria-hidden', 'true');
  let gap = false;
  SKEL.forEach((w, i) => {
    if (!w) { gap = true; return; }
    const line = document.createElement('i');
    line.style.width = `${w}%`;
    line.style.setProperty('--i', String(i));
    if (gap) { line.className = 'p'; gap = false; }
    box.append(line);
  });
  return box;
}

export function initReader() {
  const dialog = document.getElementById('reader') as HTMLDialogElement | null;
  if (!dialog) return;
  const title = dialog.querySelector<HTMLElement>('[data-reader-title]')!;
  const meta = dialog.querySelector<HTMLElement>('[data-reader-meta]')!;
  const body = dialog.querySelector<HTMLElement>('[data-reader-body]')!;
  const full = dialog.querySelector<HTMLAnchorElement>('[data-reader-full]')!;
  let opener: HTMLElement | null = null;
  let seq = 0; // 載入中又點了別的出處：只採用最後一次點擊的結果，較早的請求晚回來時直接丟掉

  document.addEventListener('click', async (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('[data-reader]');
    if (!a) return;
    e.preventDefault();
    const data = JSON.parse(a.dataset.reader!) as Payload;
    opener = a;
    a.classList.add('is-loading');
    const mine = ++seq;
    title.textContent = '載入原文…';
    meta.innerHTML = '';
    body.replaceChildren(skeleton());
    body.setAttribute('aria-busy', 'true');
    full.href = `/story/${data.slug}/original/#p${data.page}`;
    if (!dialog.open) dialog.showModal();
    try {
      const page = await load(data.slug);
      if (mine !== seq) return;
      title.textContent = page.title;
      meta.innerHTML = page.meta;
      body.innerHTML = page.body;
      highlight(body, data.segs);
      const target = body.querySelector('mark') ?? body.querySelector(`#p${data.page}`);
      // 開啟時直接跳到引用處（不從文章開頭捲動過去）
      target?.scrollIntoView({ block: 'center', behavior: 'instant' });
    } catch {
      if (mine === seq) window.location.href = full.href;
    } finally {
      a.classList.remove('is-loading');
      if (mine === seq) body.removeAttribute('aria-busy');
    }
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || (e.target as HTMLElement).closest('[data-reader-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus());
}
