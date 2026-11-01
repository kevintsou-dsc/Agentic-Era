// 分享預覽圖（og:image，1200×630）：首頁一張、22 篇各一張，輸出到 public/og/<短名>.png。
// 牛皮紙底＋章節色＋標題＋副標＋作者。用 sharp 把 SVG 轉 PNG；中文字要本機裝有 Noto Sans TC（Windows 11 內建 NotoSansTC-VF），
// 所以圖在本機產生後進 repo，Cloudflare 建置時不必有中文字體。標題、副標或作者改了就重跑：npm run og。
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = root + 'public/og/';
mkdirSync(out, { recursive: true });
const { articles } = JSON.parse(readFileSync(root + 'content/articles.json', 'utf8'));

const W = 1200, H = 630, X = 96, MAXW = W - X - 96;
const INK = '#1f1d1a', INK2 = '#5a544b';
const CH = {
  intro: { name: 'Intro', zh: '序章', c: '#e3cfa9', ink: '#6e4f24' },
  people: { name: 'People', zh: '人', c: '#cbdd7a', ink: '#2f5e35' },
  model: { name: 'Model', zh: '模型', c: '#ebc1c1', ink: '#a8423e' },
  ai: { name: 'A.I', zh: '行動', c: '#8ccfdd', ink: '#24636e' },
};
const FONT = `font-family="Noto Sans TC"`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const logo = readFileSync(root + 'public/dentsu-logo.svg', 'utf8').match(/<path[\s\S]*?\/>/g).join('').replace(/currentColor/g, INK);

// 估算字寬：全形字＝1 個字高，半形約 0.56；英文單字不拆開、標點不放行首
const cw = (ch) => (/[\u0000-ÿ]/.test(ch) ? 0.56 : 1);
function wrap(text, size, maxW) {
  const tokens = text.match(/[A-Za-z0-9.&'’-]+|\s+|./gu) ?? [];
  const lines = [''];
  let w = 0;
  for (const t of tokens) {
    const tw = [...t].reduce((s, c) => s + cw(c), 0) * size;
    if (w + tw > maxW && lines.at(-1).trim() && !/^[，。、：；？！」』）]/.test(t)) { lines.push(''); w = 0; if (/^\s+$/.test(t)) continue; }
    lines[lines.length - 1] += t; w += tw;
  }
  return lines.map((l) => l.trim());
}
// 優先在逗號、冒號後斷行（整段放得下就不拆），放不下的段落才逐字斷
function wrapAtPunct(text, size, maxW) {
  const segs = text.match(/[^，：、]+[，：、]?/g) ?? [text];
  const width = (t) => [...t].reduce((s, c) => s + cw(c), 0) * size;
  const lines = [''];
  for (const g of segs) {
    if (width(lines.at(-1) + g) <= maxW) lines[lines.length - 1] += g;
    else if (width(g) <= maxW) lines.push(g);
    else { const w = wrap(lines.at(-1) + g, size, maxW); lines.splice(-1, 1, ...w); }
  }
  return lines.filter(Boolean);
}
// 從大到小試字級，直到行數不超過 maxLines
function fit(text, sizes, maxLines, maxW = MAXW) {
  for (const s of sizes) { const l = wrapAtPunct(text, s, maxW); if (l.length <= maxLines) return { size: s, lines: l }; }
  const s = sizes.at(-1); return { size: s, lines: wrap(text, s, maxW).slice(0, maxLines) };
}
const textLines = (lines, x, y, size, lh, attrs) => lines.map((l, i) => `<text x="${x}" y="${y + i * size * lh}" ${FONT} font-size="${size}" ${attrs}>${esc(l)}</text>`).join('');

const kraft = await sharp(root + 'public/art/cover/kraft.webp').resize({ width: 600, height: 600, fit: 'cover' }).removeAlpha().linear(0.32, 255 * 0.68).png().toBuffer();
async function render(file, layer, band) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect x="0" y="0" width="28" height="${H}" fill="${band}"/>
    <g transform="translate(${X} 64) scale(${30 / 51.34})">${logo}</g>
    <line x1="${X + 160}" y1="66" x2="${X + 160}" y2="92" stroke="${INK2}" stroke-width="2"/>
    <text x="${X + 180}" y="88" ${FONT} font-size="24" font-weight="500" letter-spacing="2" fill="${INK2}">決策智慧 2026</text>
    ${layer}</svg>`;
  await sharp({ create: { width: W, height: H, channels: 3, background: '#f3eee4' } })
    .composite([{ input: kraft, tile: true, blend: 'multiply' }, { input: Buffer.from(svg) }])
    .png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out + file);
}

for (const a of articles) {
  const ch = CH[a.chapter];
  const pages = a.pages[0] === a.pages[1] ? `p.${a.pages[0]}` : `p.${a.pages[0]}–${a.pages[1]}`;
  const chip = `${ch.name}｜${ch.zh}`;
  const chipW = [...chip].reduce((s, c) => s + cw(c), 0) * 24 + 44;
  // 標題與副標要放在分隔線（H - 104）上方留白之前：從大字級往下試，直到放得下
  let title, sub, bottom;
  // 標題能縮到 72 以上排成一行就排一行（避免「架／構師」這種斷法）；否則在標點處分兩行
  const one = [96, 88, 80, 72].find((ts) => fit(a.title, [ts], 1).lines.length === 1 && wrapAtPunct(a.title, ts, MAXW).length === 1);
  for (const ts of one ? [one, 64] : [96, 88, 80, 72, 64]) {
    title = fit(a.title, [ts], 2);
    sub = a.subtitle ? fit(a.subtitle, [Math.min(40, Math.round(ts * 0.42)), 34, 30], 2) : null;
    bottom = 236 + ts * 0.88 + (title.lines.length - 1) * ts * 1.15 + (sub ? 30 + sub.size + (sub.lines.length - 1) * sub.size * 1.4 : 0);
    if (bottom <= H - 140) break;
  }
  let y = 236 + title.size * 0.88;
  let layer = `<rect x="${X}" y="150" width="${chipW}" height="44" rx="22" fill="${ch.c}"/>
    <text x="${X + 22}" y="181" ${FONT} font-size="24" font-weight="800" fill="${INK}">${esc(chip)}</text>
    <text x="${X + chipW + 20}" y="181" ${FONT} font-size="24" font-weight="500" fill="${INK2}">紙本 ${pages}</text>
    ${textLines(title.lines, X, y, title.size, 1.15, `font-weight="900" fill="${INK}"`)}`;
  y += (title.lines.length - 1) * title.size * 1.15 + 30;
  if (sub) {
    y += sub.size;
    layer += textLines(sub.lines, X, y, sub.size, 1.4, `font-weight="500" fill="${INK2}"`);
  }
  const names = a.authors.map((p) => p.name).join('、');
  layer += `<line x1="${X}" y1="${H - 104}" x2="${W - 96}" y2="${H - 104}" stroke="${ch.ink}" stroke-width="3"/>
    <text x="${X}" y="${H - 58}" ${FONT} font-size="26" font-weight="700" fill="${INK}">${esc(names)}</text>
    <text x="${W - 96}" y="${H - 58}" text-anchor="end" ${FONT} font-size="24" font-weight="500" fill="${INK2}">一個故事讀完一篇</text>`;
  await render(`${a.slug}.png`, layer, ch.c);
}

// 首頁：全書的核心問題
const home = `<text x="${X}" y="250" ${FONT} font-size="30" font-weight="500" fill="${INK2}">Agentic 時代，重塑品牌與人的真實距離</text>
  ${textLines(['品牌離 AI 越近，', '會離人越遠嗎？'], X, 360, 96, 1.2, `font-weight="900" fill="${INK}"`)}
  <line x1="${X}" y1="${H - 104}" x2="${W - 96}" y2="${H - 104}" stroke="${INK}" stroke-width="3"/>
  <text x="${X}" y="${H - 58}" ${FONT} font-size="26" font-weight="700" fill="${INK}">22 篇觀點，一個故事讀完整本</text>
  ${Object.values(CH).map((c, i) => `<rect x="${W - 96 - (4 - i) * 44}" y="${H - 82}" width="32" height="32" rx="16" fill="${c.c}"/>`).join('')}`;
await render('home.png', home, '#e3cfa9');
console.log(`✓ 分享預覽圖 ${articles.length + 1} 張 → public/og/`);
