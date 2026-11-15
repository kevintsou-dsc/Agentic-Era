// 分享卡片（components/SharePanel.astro）：讀者挑一句、挑樣式，用 canvas 畫成 1080×1350 的圖；預覽就是這張圖。
// 不傳到任何伺服器。手機支援分享檔案就連圖一起分享；不支援就只分享連結；都不支援就下載圖片並複製連結。
const W = 1080;
const H = 1350;
const PAD = 96;
const FOOT = 230; // 頁尾高度

export type CardStyle = 'bold' | 'paper' | 'night';
export interface CardSpec { style: CardStyle; chapter: string; eyebrow: string; text: string; src: string; title: string; url: string; serif: boolean; }

export function absUrl(path: string) { return new URL(path, location.origin).href; }

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

/** 中文逐字斷行；英文單字盡量不拆；句首不放的標點黏回上一行。 */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const tokens = text.match(/[A-Za-z0-9][A-Za-z0-9.%+\-'’]*|\s+|./gu) ?? [];
  const lines: string[] = [];
  let line = '';
  for (const t of tokens) {
    const next = line + t;
    if (ctx.measureText(next).width > max && line.trim()) {
      lines.push(line.trimEnd());
      line = /^\s+$/.test(t) ? '' : t;
      if (/^[，。、；：！？」』）]$/.test(line)) { lines[lines.length - 1] += line; line = ''; }
    } else line = next;
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

/** 固定種子的亂數：紙紋每次都長一樣 */
function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }

function alpha(hex: string, a: number) {
  const m = hex.replace('#', '');
  const n = parseInt(m.length === 3 ? m.replace(/./g, '$&$&') : m, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export async function drawCard(spec: CardSpec): Promise<HTMLCanvasElement | null> {
  const css = getComputedStyle(document.documentElement);
  const v = (n: string, d: string) => css.getPropertyValue(n).trim() || d;
  const sans = v('--font-sans', 'sans-serif');
  const serif = v('--font-serif', 'serif').replace('var(--font-sans)', sans);
  const mono = v('--font-mono', 'monospace');
  const body = spec.serif ? serif : sans;
  const paper = v('--paper', '#f3eee4');
  const ink = v('--ink', '#1f1d1a');
  const line = v('--line', '#d6ccba');
  const ch = v(`--${spec.chapter}`, '#cbdd7a');
  const chInk = v(`--${spec.chapter}-ink`, '#2f5e35');
  try { await Promise.all([document.fonts.load(`700 60px ${body}`, spec.text), document.fonts.load(`700 34px ${sans}`)]); } catch { /* 用系統字 */ }

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  ctx.textBaseline = 'top';

  // 主句排版：字多就縮小，最多 8 行
  let size = 72;
  let lines: string[] = [];
  const maxW = W - PAD * 2 - (spec.style === 'paper' ? 30 : 0);
  for (; size >= 40; size -= 4) {
    ctx.font = `700 ${size}px ${body}`;
    lines = wrap(ctx, spec.text, maxW);
    if (lines.length <= 8) break;
  }
  const lh = Math.round(size * 1.5);
  ctx.font = `500 30px ${sans}`;
  const srcLines = wrap(ctx, spec.src, maxW);
  const block = lines.length * lh + 36 + srcLines.length * 46;
  const top = 250;
  const y0 = Math.max(top, top + (H - FOOT - 60 - top - block) / 2);
  const x0 = PAD + (spec.style === 'paper' ? 30 : 0);
  const page = spec.src.match(/p\.(\d+)/)?.[1];

  // ── 背景 ──
  if (spec.style === 'bold') {
    ctx.fillStyle = ch; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 16; ctx.strokeStyle = alpha(ink, 0.1);
    for (const r of [420, 330, 240]) { ctx.beginPath(); ctx.arc(W - 40, H - FOOT - 120, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = alpha(paper, 0.35); ctx.beginPath(); ctx.arc(W - 40, H - FOOT - 120, 150, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = alpha(paper, 0.6); ctx.font = `700 460px ${serif}`; ctx.fillText('“', 40, -40);
  } else if (spec.style === 'paper') {
    ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);
    const r = rng(7);
    for (let i = 0; i < 5000; i++) { ctx.fillStyle = alpha(ink, r() * 0.06); ctx.fillRect(r() * W, r() * H, 2, 2); }
    ctx.fillStyle = ch; ctx.fillRect(0, 0, 30, H);
    ctx.strokeStyle = alpha(line, 0.9); ctx.lineWidth = 2;
    for (let y = y0 + lh - 8; y < H - FOOT - 20; y += lh) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(W - PAD, y); ctx.stroke(); }
    ctx.fillStyle = alpha(chInk, 0.18); ctx.font = `700 190px ${mono}`;
    const big = page ? `p.${page}` : '01';
    ctx.fillText(big, W - PAD - ctx.measureText(big).width + 20, 60);
  } else {
    ctx.fillStyle = ink; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W * 0.88, H * 0.1, 0, W * 0.88, H * 0.1, 620);
    g.addColorStop(0, alpha(ch, 0.75)); g.addColorStop(0.55, alpha(ch, 0.18)); g.addColorStop(1, alpha(ch, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = alpha(paper, 0.08);
    for (let y = 30; y < H; y += 36) for (let x = 30; x < W; x += 36) ctx.fillRect(x, y, 3, 3);
  }

  // ── 眉標 ──
  ctx.font = `700 28px ${sans}`;
  const eb = spec.eyebrow;
  const ebW = ctx.measureText(eb).width;
  if (spec.style === 'bold') {
    ctx.fillStyle = ink; rr(ctx, PAD, 110, ebW + 48, 56, 28); ctx.fill();
    ctx.fillStyle = paper; ctx.fillText(eb, PAD + 24, 124);
  } else {
    ctx.fillStyle = spec.style === 'night' ? ch : chInk;
    ctx.fillText(eb, x0, 120);
    ctx.fillRect(x0, 166, 64, 6);
  }

  // ── 主句 ──
  ctx.font = `700 ${size}px ${body}`;
  let y = y0;
  for (const l of lines) {
    if (spec.style === 'night') { ctx.fillStyle = alpha(ch, 0.45); ctx.fillRect(x0 - 6, y + size * 0.62, ctx.measureText(l).width + 12, size * 0.34); }
    ctx.fillStyle = spec.style === 'night' ? paper : ink;
    ctx.fillText(l, x0, y);
    y += lh;
  }
  y += 36;
  ctx.font = `500 30px ${sans}`;
  ctx.fillStyle = spec.style === 'night' ? ch : spec.style === 'bold' ? alpha(ink, 0.75) : chInk;
  for (const l of srcLines) { ctx.fillText(l, x0, y); y += 46; }

  // ── 頁尾 ──
  const fy = H - FOOT;
  if (spec.style === 'bold') { ctx.fillStyle = ink; ctx.fillRect(0, fy, W, FOOT); }
  else { ctx.fillStyle = spec.style === 'night' ? ch : alpha(ink, 0.85); ctx.fillRect(x0, fy, W - PAD - x0, 3); }
  const footInk = spec.style === 'paper' ? ink : paper;
  ctx.fillStyle = footInk;
  ctx.font = `700 36px ${sans}`;
  wrap(ctx, spec.title, W - PAD - x0 - 40).slice(0, 2).forEach((l, i) => ctx.fillText(l, x0, fy + 44 + i * 48));
  ctx.fillStyle = spec.style === 'paper' ? alpha(ink, 0.55) : alpha(paper, 0.65);
  ctx.font = `500 26px ${sans}`;
  ctx.fillText(spec.url.replace(/^https?:\/\//, ''), x0, H - 70);
  ctx.font = `700 22px ${mono}`;
  const brand = 'DECISION WISDOM 2026';
  ctx.fillText(brand, W - PAD - ctx.measureText(brand).width, H - 68);
  return c;
}

const toBlob = (c: HTMLCanvasElement) => new Promise<Blob | null>((r) => c.toBlob(r, 'image/png'));

export function download(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export function initShare() {
  const root = document.querySelector<HTMLElement>('[data-share]');
  if (!root) return;
  const picks = Array.from(root.querySelectorAll<HTMLInputElement>('input[name="share-pick"]'));
  const styles = Array.from(root.querySelectorAll<HTMLInputElement>('input[name="share-style"]'));
  const img = root.querySelector<HTMLImageElement>('[data-sc-img]')!;
  const cap = root.querySelector<HTMLElement>('[data-sc-cap]')!;
  const msg = root.querySelector<HTMLElement>('[data-share-msg]')!;
  const say = (s: string) => { msg.textContent = s; };
  const pick = () => picks.find((r) => r.checked) ?? picks[0];
  const url = absUrl(root.dataset.path!);
  const slug = root.dataset.path!.split('/').filter(Boolean).pop();
  const file = `decision-wisdom-${slug}.png`;
  const spec = (): CardSpec => {
    const r = pick();
    return {
      style: ((styles.find((s) => s.checked)?.value) ?? 'bold') as CardStyle, chapter: root.dataset.ch!,
      eyebrow: `決策智慧 2026｜${root.dataset.chapter}`, text: r.dataset.text!, src: r.dataset.src!,
      title: root.dataset.title!, url, serif: !!r.dataset.serif,
    };
  };
  const shareText = () => `${pick().dataset.text}\n——〈${root.dataset.title}〉`;

  // 預覽：選項一變就重畫（只在區塊接近畫面時才開始畫，不拖慢首屏）
  let ticket = 0;
  const preview = async () => {
    const t = ++ticket;
    const c = await drawCard(spec());
    if (!c || t !== ticket) return;
    img.src = c.toDataURL('image/png');
    cap.textContent = pick().dataset.text!;
  };
  [...picks, ...styles].forEach((r) => r.addEventListener('change', () => { say(''); void preview(); }));
  new IntersectionObserver((es, io) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); void preview(); } }, { rootMargin: '600px 0px' }).observe(root);

  root.querySelector('[data-share-go]')?.addEventListener('click', async () => {
    say('製作卡片中…');
    const c = await drawCard(spec());
    const blob = c ? await toBlob(c) : null;
    const f = blob ? new File([blob], file, { type: 'image/png' }) : null;
    try {
      if (f && navigator.canShare?.({ files: [f] })) {
        await navigator.share({ files: [f], title: root.dataset.title, text: `${shareText()}\n${url}` });
        say(''); return;
      }
      if (navigator.share) { await navigator.share({ title: root.dataset.title, text: shareText(), url }); say(''); return; }
    } catch (e) {
      if ((e as DOMException).name === 'AbortError') { say(''); return; }
    }
    if (blob) download(blob, file);
    say((await copyText(`${shareText()}\n${url}`)) ? '已下載卡片，文字和連結也複製好了，可以直接貼上。' : '已下載卡片。');
  });
  root.querySelector('[data-share-dl]')?.addEventListener('click', async () => {
    const c = await drawCard(spec());
    const blob = c ? await toBlob(c) : null;
    if (blob) { download(blob, file); say('已下載卡片。'); } else say('這個瀏覽器不能產生圖片。');
  });
  root.querySelector('[data-share-copy]')?.addEventListener('click', async () => {
    say((await copyText(url)) ? '連結已複製。' : `請手動複製：${url}`);
  });
}
