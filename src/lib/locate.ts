// 建置時把引文定位到原文頁的「第幾個文字區塊、第幾個字到第幾個字」，
// 讓原文視窗能直接捲到那裡並高亮。區塊編號與 src/pages/a/[slug]/full.astro 的 data-i 一致。
// 比對規則與 scripts/verify/normalize.mjs 相同，但逐字元正規化並保留原始位置。
import { loadFulltext } from './fulltext';
import { article } from './articles';
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

/** 文字區塊（標題與段落）依序編號，記錄所在頁 */
export interface TextBlock { i: number; page: number; text: string }

const cache = new Map<string, TextBlock[]>();
export function textBlocks(id: string): TextBlock[] {
  const hit = cache.get(id);
  if (hit) return hit;
  const out: TextBlock[] = [];
  let page = 0;
  for (const b of loadFulltext(id)) {
    if (b.kind === 'page') page = b.page;
    else out.push({ i: out.length, page, text: b.text });
  }
  cache.set(id, out);
  return out;
}

/** 一段高亮：[區塊編號, 起, 迄]（迄不含） */
export type Seg = [number, number, number];
export interface Loc { slug: string; page: number; segs: Seg[] }

export function locate(src: Src): Loc {
  const slug = article(src.article).slug;
  const blocks = textBlocks(src.article).filter((b) => b.page === src.page || b.page === src.page + 1);
  // 把候選區塊串成一個正規化字串，記錄每個正規化字元來自哪個區塊的第幾個字
  let norm = '';
  const from: [number, number][] = [];
  for (const b of blocks) {
    for (let k = 0; k < b.text.length; k++) {
      for (const ch of normChar(b.text[k])) { norm += ch; from.push([b.i, k]); }
    }
  }
  const target = [...src.text].map(normChar).join('');
  const at = norm.indexOf(target);
  if (at < 0 || !target) return { slug, page: src.page, segs: [] };
  // 依區塊切成多段（引文可能跨段落）
  const segs: Seg[] = [];
  for (let k = at; k < at + target.length; k++) {
    const [bi, ci] = from[k];
    const last = segs[segs.length - 1];
    if (last && last[0] === bi) last[2] = ci + 1;
    else segs.push([bi, ci, ci + 1]);
  }
  return { slug, page: src.page, segs };
}
