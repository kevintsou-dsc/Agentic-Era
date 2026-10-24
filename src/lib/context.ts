// 建置時找出引文在原文中的上下文，給「書頁視窗」顯示：前文、引文（高亮）、後文。
// 比對規則與 scripts/verify/normalize.mjs 相同，但逐字元正規化並保留原始位置，才能把高亮對回原文。
import { loadFulltext } from './fulltext';
import type { Src } from './story';

function normChar(c: string): string {
  if (/\s/.test(c)) return '';
  const n = c.normalize('NFKC');
  if (/[「『“"]/.test(n)) return '「';
  if (/[」』”"]/.test(n)) return '」';
  if (/[—–－―‐-]/.test(n)) return '-';
  if (/[|｜]/.test(n)) return '|';
  return n;
}

/** 正規化字串並記錄每個正規化字元對應的原始索引 */
function mapped(raw: string) {
  let out = '';
  const idx: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    for (const ch of normChar(raw[i])) { out += ch; idx.push(i); }
  }
  return { out, idx };
}
const norm = (s: string) => mapped(s).out;

export interface Context { page: number; before: string; match: string; after: string }

const cache = new Map<string, ReturnType<typeof loadFulltext>>();
const PAD = 90;

export function contextOf(src: Src): Context {
  const blocks = cache.get(src.article) ?? loadFulltext(src.article);
  cache.set(src.article, blocks);
  const target = norm(src.text);
  // 依頁分組；引文可能跨頁，所以也嘗試「本頁＋下一頁」接起來
  const byPage = new Map<number, string>();
  let page = 0;
  for (const b of blocks) {
    if (b.kind === 'page') { page = b.page; continue; }
    byPage.set(page, (byPage.get(page) ?? '') + (byPage.has(page) ? '\n' : '') + b.text);
  }
  const candidates = [byPage.get(src.page) ?? '', (byPage.get(src.page) ?? '') + (byPage.get(src.page + 1) ?? '')];
  for (const raw of candidates) {
    const m = mapped(raw);
    const at = m.out.indexOf(target);
    if (at < 0) continue;
    const start = m.idx[at];
    const end = m.idx[at + target.length - 1] + 1;
    // 前後各取約 PAD 字，盡量從句子邊界開始
    let from = Math.max(0, start - PAD);
    const cut = raw.slice(from, start).search(/[。！？\n][^。！？\n]*$/);
    if (from > 0 && cut >= 0) from += cut + 1;
    let to = Math.min(raw.length, end + PAD);
    const stop = raw.slice(end, to).search(/[。！？\n]/);
    if (stop >= 0) to = end + stop + 1;
    return {
      page: src.page,
      before: (from > 0 ? '…' : '') + raw.slice(from, start).replace(/\n/g, ' '),
      match: raw.slice(start, end).replace(/\n/g, ' '),
      after: raw.slice(end, to).replace(/\n/g, ' ') + (to < raw.length ? '…' : ''),
    };
  }
  // 逐字比對閘門保證找得到；萬一沒找到，就只顯示引文本身
  return { page: src.page, before: '', match: src.text, after: '' };
}
