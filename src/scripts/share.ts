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

/** 中文逐字斷行；英文單字盡量不拆；避尾點黏回上一行、避頭點不孤立於行尾。 */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const tokens = text.match(/[A-Za-z0-9][A-Za-z0-9.%+\-'’]*|\s+|./gu) ?? [];
  const noStart = /^[，。、；：！？？」』）》〉—…]$/;
  const noEnd = /^[「『（《〈]$/;
  const lines: string[] = [];
  let line = '';
  for (const t of tokens) {
    if (!line && noStart.test(t) && lines.length) {
      lines[lines.length - 1] += t;
      continue;
    }
    const next = line + t;
    if (ctx.measureText(next).width > max && line.trim()) {
      if (noStart.test(t)) {
        lines.push((line + t).trimEnd());
        line = '';
      } else {
        const trimmed = line.trimEnd();
        const lastChar = [...trimmed].pop() ?? '';
        if (noEnd.test(lastChar) && trimmed.length > 1) {
          lines.push(trimmed.slice(0, -lastChar.length).trimEnd());
          line = lastChar + (/^\s+$/.test(t) ? '' : t);
        } else {
          lines.push(trimmed);
          line = /^\s+$/.test(t) ? '' : t;
        }
      }
    } else line = next;
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

/** 單行截斷：超出 max 寬度時以省略號收尾 */
function fitLine(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  const chars = [...text];
  while (chars.length > 1 && ctx.measureText(chars.join('') + '…').width > max) chars.pop();
  return chars.join('') + '…';
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
  const allSans = `${spec.text}${spec.title}${spec.src}${spec.eyebrow}`;
  try {
    await Promise.all([
      document.fonts.load(`700 60px ${body}`, spec.text),
      document.fonts.load(`700 36px ${sans}`, allSans),
      document.fonts.load(`500 30px ${sans}`, `${spec.src}${spec.url}`),
    ]);
  } catch { /* 用系統字 */ }

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  ctx.textBaseline = 'top';

  // 主句排版：同時控制行數與總高度，確保絕不撞穿頁尾
  const x0 = PAD + (spec.style === 'paper' ? 30 : 0);
  const maxW = W - PAD - x0;
  ctx.font = `500 30px ${sans}`;
  const srcLines = wrap(ctx, spec.src, maxW);
  const top = 240;
  const availH = H - FOOT - 64 - top;

  let size = 72;
  let lines: string[] = [];
  let lh = Math.round(size * 1.48);
  let block = 0;
  for (let s = 72; s >= 36; s -= 4) {
    ctx.font = `700 ${s}px ${body}`;
    const ls = wrap(ctx, spec.text, maxW);
    const curLh = Math.round(s * 1.48);
    const curBlock = ls.length * curLh + 36 + srcLines.length * 46;
    const maxLines = s >= 68 ? 4 : s >= 60 ? 5 : s >= 52 ? 6 : 8;
    size = s; lines = ls; lh = curLh; block = curBlock;
    if (ls.length <= maxLines && curBlock <= availH) break;
  }
  const y0 = Math.max(top, top + (availH - block) / 2);
  const page = spec.src.match(/p\.(\d+)/)?.[1];

  // ── 背景 ──
  if (spec.style === 'bold') {
    ctx.fillStyle = ch; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 16; ctx.strokeStyle = alpha(ink, 0.1);
    for (const r of [420, 330, 240]) { ctx.beginPath(); ctx.arc(W - 40, H - FOOT - 120, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = alpha(paper, 0.35); ctx.beginPath(); ctx.arc(W - 40, H - FOOT - 120, 150, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = alpha(paper, 0.55); ctx.font = `700 440px Georgia, "Times New Roman", ${serif}`; ctx.fillText('“', 40, -40);
  } else if (spec.style === 'paper') {
    ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);
    const r = rng(7);
    for (let i = 0; i < 5000; i++) { ctx.fillStyle = alpha(ink, r() * 0.06); ctx.fillRect(r() * W, r() * H, 2, 2); }
    ctx.fillStyle = ch; ctx.fillRect(0, 0, 30, H);
    // 筆記本橫線只畫在主句各行下方，不壓過出處文字
    ctx.strokeStyle = alpha(line, 0.85); ctx.lineWidth = 2;
    for (let i = 0; i < lines.length; i++) {
      const ly = y0 + (i + 1) * lh - 10;
      if (ly < H - FOOT - 24) { ctx.beginPath(); ctx.moveTo(x0, ly); ctx.lineTo(W - PAD, ly); ctx.stroke(); }
    }
    ctx.fillStyle = alpha(chInk, 0.14); ctx.font = `700 128px ${mono}`;
    const big = page ? `p.${page}` : '01';
    ctx.fillText(big, W - PAD - ctx.measureText(big).width + 8, 76);
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
  const eb = fitLine(ctx, spec.eyebrow, spec.style === 'paper' ? maxW - 220 : maxW - 48);
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
    if (spec.style === 'night') {
      const lw = Math.min(maxW + 12, ctx.measureText(l).width + 12);
      ctx.fillStyle = alpha(ch, 0.45);
      ctx.fillRect(x0 - 6, y + size * 0.62, lw, size * 0.34);
    }
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
  const titleLines = wrap(ctx, spec.title, W - PAD - x0);
  const shownTitle = titleLines.length > 2 ? [titleLines[0], fitLine(ctx, titleLines.slice(1).join(''), W - PAD - x0)] : titleLines;
  shownTitle.forEach((l, i) => ctx.fillText(l, x0, fy + 40 + i * 46));
  ctx.font = `700 22px ${mono}`;
  const brand = 'DECISION WISDOM 2026';
  const brandW = ctx.measureText(brand).width;
  ctx.fillStyle = spec.style === 'paper' ? alpha(ink, 0.55) : alpha(paper, 0.65);
  ctx.fillText(brand, W - PAD - brandW, H - 68);
  return c;
}

export interface AchievementCardSpec {
  no: string;
  kindLabel: string;
  packTag: string;
  name: string;
  /** 俏皮副標（卡名下方） */
  quip?: string;
  line: string;
  color: string;
  articleTitle?: string;
  progress: string;
  url: string;
}

/** 成就卡專屬分享圖（1080×1350）：呈現當下獲得的成就卡本體、觸發篇名／進度與連結。 */
export async function drawAchievementCard(spec: AchievementCardSpec): Promise<HTMLCanvasElement | null> {
  const css = getComputedStyle(document.documentElement);
  const v = (n: string, d: string) => css.getPropertyValue(n).trim() || d;
  const sans = v('--font-sans', 'sans-serif');
  const serif = v('--font-serif', 'serif').replace('var(--font-sans)', sans);
  const mono = v('--font-mono', 'monospace');
  const paper = v('--paper', '#f3eee4');
  const ink = v('--ink', '#1f1d1a');
  const ch = v(`--${spec.color}`, '#cbdd7a');
  const chInk = v(`--${spec.color}-ink`, '#2f5e35');
  const allText = `${spec.name}${spec.quip ?? ''}${spec.line}${spec.kindLabel}${spec.packTag}${spec.articleTitle ?? ''}${spec.progress}`;
  try {
    await Promise.all([
      document.fonts.load(`900 108px ${serif}`, spec.name),
      document.fonts.load(`700 36px ${sans}`, allText),
      document.fonts.load(`500 30px ${sans}`, allText),
    ]);
  } catch { /* 用系統字 */ }

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  ctx.textBaseline = 'top';

  // 深色底＋章節色暈光，凸顯中央成就卡本體
  ctx.fillStyle = ink; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.36, 40, W * 0.5, H * 0.36, 680);
  glow.addColorStop(0, alpha(ch, 0.55)); glow.addColorStop(0.6, alpha(ch, 0.14)); glow.addColorStop(1, alpha(ch, 0));
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  // 頂部標籤
  ctx.font = `700 28px ${sans}`;
  ctx.fillStyle = ch;
  ctx.fillText(`決策智慧 2026｜${spec.packTag}`, PAD, 88);

  // 中央實體成就卡（模擬 .acard）
  const cx = 132, cy = 164, cw = W - cx * 2, chH = 876;
  ctx.save();
  rr(ctx, cx, cy, cw, chH, 36);
  ctx.clip();
  ctx.fillStyle = paper; ctx.fillRect(cx, cy, cw, chH);
  const cg = ctx.createRadialGradient(cx + cw, cy, 0, cx + cw, cy, cw * 0.95);
  cg.addColorStop(0, ch); cg.addColorStop(0.65, alpha(ch, 0));
  ctx.fillStyle = cg; ctx.fillRect(cx, cy, cw, chH);
  const r = rng(19);
  for (let i = 0; i < 3200; i++) { ctx.fillStyle = alpha(ink, r() * 0.05); ctx.fillRect(cx + r() * cw, cy + r() * chH, 2, 2); }
  // 右下裝飾環
  ctx.strokeStyle = alpha(ch, 0.72); ctx.lineWidth = 36;
  ctx.beginPath(); ctx.arc(cx + cw - 30, cy + chH - 30, 180, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // 卡片外框
  ctx.strokeStyle = ink; ctx.lineWidth = 5;
  rr(ctx, cx, cy, cw, chH, 36); ctx.stroke();

  const ix = cx + 64, iw = cw - 128;
  // 卡片頂部編號與字樣
  ctx.font = `700 24px ${mono}`; ctx.fillStyle = alpha(ink, 0.6);
  ctx.fillText(spec.no, ix, cy + 54);
  const tagR = '知識補給包';
  ctx.font = `700 24px ${sans}`;
  ctx.fillText(tagR, cx + cw - 64 - ctx.measureText(tagR).width, cy + 54);

  // 類別膠囊
  ctx.font = `700 26px ${sans}`;
  const kw = ctx.measureText(spec.kindLabel).width;
  ctx.fillStyle = ink; rr(ctx, ix, cy + 124, kw + 44, 48, 24); ctx.fill();
  ctx.fillStyle = paper; ctx.fillText(spec.kindLabel, ix + 22, cy + 135);

  // 成就卡大名稱
  let nameSize = 104;
  let nameLines: string[] = [];
  for (let s = 104; s >= 64; s -= 8) {
    ctx.font = `900 ${s}px ${serif}`;
    nameLines = wrap(ctx, spec.name, iw);
    nameSize = s;
    if (nameLines.length <= 2) break;
  }
  const nameLh = Math.round(nameSize * 1.24);
  let ny = cy + 250;
  ctx.font = `900 ${nameSize}px ${serif}`;
  ctx.fillStyle = chInk;
  for (const l of nameLines) { ctx.fillText(l, ix, ny); ny += nameLh; }
  if (spec.quip) {
    ctx.font = `700 36px ${sans}`;
    ctx.fillStyle = alpha(chInk, 0.85);
    // 副標較長時折成兩行（第二行以後才省略）
    const ql = wrap(ctx, `— ${spec.quip}`, iw);
    ql.slice(0, 2).forEach((l, k) => ctx.fillText(k === 1 && ql.length > 2 ? fitLine(ctx, l + ql.slice(2).join(""), iw) : l, ix, ny + 6 + k * 50));
    ny += 58 + (Math.min(2, ql.length) - 1) * 50;
  }

  // 卡片金句
  ctx.font = `600 38px ${sans}`;
  ctx.fillStyle = ink;
  const lineLs = wrap(ctx, spec.line, iw);
  let ly = Math.max(ny + 44, cy + 510);
  for (const l of lineLs.slice(0, 4)) { ctx.fillText(l, ix, ly); ly += 58; }

  // 卡片底緣進度／解鎖篇名
  ctx.font = `600 26px ${sans}`;
  ctx.fillStyle = alpha(ink, 0.65);
  const subInfo = spec.articleTitle ? `讀完〈${spec.articleTitle}〉解鎖｜${spec.progress}` : spec.progress;
  ctx.fillText(fitLine(ctx, subInfo, iw), ix, cy + chH - 88);

  // 底部頁尾
  const fy = H - 200;
  ctx.fillStyle = ch; ctx.fillRect(PAD, fy, W - PAD * 2, 3);
  ctx.font = `700 32px ${sans}`; ctx.fillStyle = paper;
  const footHeadline = spec.articleTitle ? `〈${spec.articleTitle}〉` : '《決策智慧 2026》知識補給包成就收藏';
  ctx.fillText(fitLine(ctx, footHeadline, W - PAD * 2), PAD, fy + 38);
  ctx.font = `700 22px ${mono}`;
  const brand = 'DECISION WISDOM 2026';
  const brandW = ctx.measureText(brand).width;
  ctx.fillStyle = alpha(paper, 0.65);
  ctx.fillText(brand, W - PAD - brandW, H - 68);
  return c;
}

export interface FaceSpec { face: HTMLCanvasElement; n: number; url: string; parts: readonly (readonly [string, number, number, number[]])[] }

/** 首頁「分享人機智慧臉譜」：紙色底，上方「已點亮 n／22」，中間是讀者自己點亮的兩張臉，下方四章進度。 */
export async function drawFaceCard(spec: FaceSpec): Promise<HTMLCanvasElement | null> {
  const css = getComputedStyle(document.documentElement);
  const v = (n: string, d: string) => css.getPropertyValue(n).trim() || d;
  const sans = v('--font-sans', 'sans-serif');
  const serif = v('--font-serif', 'serif').replace('var(--font-sans)', sans);
  const mono = v('--font-mono', 'monospace');
  const paper = v('--paper', '#f3eee4'), ink = v('--ink', '#1f1d1a'), accent = v('--accent-ink', '#2f5e35');
  const big = `已點亮 ${spec.n}／22`;
  const partsText = spec.parts.map(([name]) => name).join('');
  try {
    await Promise.all([
      document.fonts.load(`900 104px ${serif}`, big),
      document.fonts.load(`700 36px ${sans}`, `決策智慧 2026｜人機智慧臉譜22篇觀點每讀完一篇就為這張臉譜點亮一塊色彩${partsText}`),
    ]);
  } catch { /* 用系統字 */ }
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  ctx.textBaseline = 'top';
  ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);
  const r = rng(11);
  for (let i = 0; i < 5000; i++) { ctx.fillStyle = alpha(ink, r() * 0.05); ctx.fillRect(r() * W, r() * H, 2, 2); }
  ctx.font = `700 28px ${sans}`; ctx.fillStyle = accent;
  ctx.fillText('決策智慧 2026｜人機智慧臉譜', PAD, 110);
  ctx.fillRect(PAD, 156, 64, 6);
  ctx.font = `900 104px ${serif}`; ctx.fillStyle = ink;
  ctx.fillText(big, PAD, 190);
  // 兩張臉（離屏畫好、透明底）放在中段，限制最大高度避免擠壓下方章節進度與頁尾
  const fy = 320;
  const maxFh = H - FOOT - fy - 108;
  const rawFh = Math.round(spec.face.height * (W / spec.face.width));
  const fh = Math.min(rawFh, maxFh);
  const fw = Math.round(fh * (spec.face.width / spec.face.height));
  ctx.drawImage(spec.face, Math.round((W - fw) / 2), fy, fw, fh);
  // 四章進度：色塊＋「人 3／9」
  let x = PAD; const py = fy + fh + 28;
  ctx.font = `700 30px ${sans}`;
  for (const [name, got, all, col] of spec.parts) {
    ctx.fillStyle = `rgb(${col.join(',')})`; rr(ctx, x, py + 4, 26, 26, 5); ctx.fill();
    ctx.fillStyle = ink; const t = `${name} ${got}／${all}`; ctx.fillText(t, x + 38, py);
    x += 38 + ctx.measureText(t).width + 36;
  }
  const ft = H - FOOT;
  ctx.fillStyle = alpha(ink, 0.85); ctx.fillRect(PAD, ft, W - PAD * 2, 3);
  ctx.font = `700 36px ${sans}`; ctx.fillStyle = ink;
  ctx.fillText('22 篇觀點，每讀完一篇就為這張臉譜點亮一塊色彩', PAD, ft + 44);
  ctx.font = `700 22px ${mono}`;
  const brand = 'DECISION WISDOM 2026';
  const brandW = ctx.measureText(brand).width;
  ctx.fillStyle = alpha(ink, 0.55);
  ctx.fillText(brand, W - PAD - brandW, H - 68);
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

export async function downloadCanvas(c: HTMLCanvasElement, name: string): Promise<boolean> {
  const blob = await toBlob(c);
  if (!blob) return false;
  download(blob, name);
  return true;
}

/** 能分享檔案就連圖分享（優先保留 user activation，分享完成或退回下載後再複製文字與連結）。 */
export async function shareCanvas(c: HTMLCanvasElement, name: string, title: string, text: string, url: string): Promise<string> {
  const blob = await toBlob(c);
  const f = blob ? new File([blob], name, { type: 'image/png' }) : null;
  const fullText = `${text}\n${url}`;
  try {
    if (f && navigator.canShare?.({ files: [f] })) {
      await navigator.share({ files: [f], title, text: fullText });
      const copied = await copyText(fullText);
      return copied ? '已開啟分享（文字與連結也同步複製好了）。' : '已開啟分享。';
    }
  } catch (e) {
    if ((e as DOMException).name === 'AbortError') return '';
  }
  if (!blob) return '這個瀏覽器不能產生圖片。';
  const copied = await copyText(fullText);
  download(blob, name);
  return copied ? '已下載卡片，文字和連結也複製好了，可以直接貼上。' : '已下載卡片。';
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
  const slug = root.dataset.path!.split('/').filter(Boolean).pop() || 'home';
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
    say(c ? await shareCanvas(c, file, root.dataset.title!, shareText(), url) : '這個瀏覽器不能產生圖片。');
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
