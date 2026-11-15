// 讀取 content/fulltext/aNN.md（只在建置時於伺服器端執行），轉成依紙本頁分段的區塊。
// 全文來自 InDesign 交換檔（scripts/extract/extract_idml.py），格式：
//   <!-- p.N -->  紙本頁界　　## 標題　　> 圖說　　| 側欄　　[註] 註解　　其他為內文段落
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export type Block =
  | { kind: 'page'; page: number }
  | { kind: 'h' | 'p' | 'cap' | 'box' | 'note'; text: string };

const dir = join(process.cwd(), 'content', 'fulltext');

export function hasFulltext(id: string) {
  return existsSync(join(dir, `${id}.md`));
}

export function loadFulltext(id: string): Block[] {
  // Windows 工作目錄可能是 CRLF，先統一成 LF 再依空行分段
  const md = readFileSync(join(dir, `${id}.md`), 'utf8').replace(/\r\n?/g, '\n');
  const blocks: Block[] = [];
  for (const raw of md.split(/\n{2,}/)) {
    const t = raw.trim().replace(/\n/g, '');
    if (!t) continue;
    const m = t.match(/^<!-- p\.(\d+) -->$/);
    if (m) blocks.push({ kind: 'page', page: Number(m[1]) });
    else if (t.startsWith('## ')) blocks.push({ kind: 'h', text: t.slice(3) });
    else if (t.startsWith('> ')) blocks.push({ kind: 'cap', text: t.slice(2) });
    else if (t.startsWith('| ')) blocks.push({ kind: 'box', text: t.slice(2) });
    else if (t.startsWith('[註] ')) blocks.push({ kind: 'note', text: t.slice(4) });
    else blocks.push({ kind: 'p', text: t });
  }
  return blocks;
}

/** 全文校稿完成的文章：與印刷版逐字比對、多代理校稿與覆核、隨機抽查通過（見 docs/review/fulltext-proofread.md）。
 *  未列入者原文頁仍會產生，但頁首標示「尚未校稿」；繳交前由 scripts/verify/verify-release.mjs 要求 22 篇全部列入。 */
export const FULLTEXT_REVIEWED = new Set<string>(['a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08', 'a09', 'a10', 'a11', 'a12', 'a13', 'a14', 'a15', 'a16', 'a17', 'a18', 'a19', 'a20', 'a21', 'a22']);
