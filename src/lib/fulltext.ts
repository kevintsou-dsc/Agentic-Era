// 讀取 content/fulltext/aNN.md（只在建置時於伺服器端執行），轉成依紙本頁分段的區塊。
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export type Block = { kind: 'page'; page: number } | { kind: 'h'; text: string } | { kind: 'p'; text: string };

const dir = join(process.cwd(), 'content', 'fulltext');

export function hasFulltext(id: string) {
  return existsSync(join(dir, `${id}.md`));
}

export function loadFulltext(id: string): Block[] {
  // Windows 工作目錄可能是 CRLF，先統一成 LF 再依空行分段
  const md = readFileSync(join(dir, `${id}.md`), 'utf8').replace(/\r\n?/g, '\n');
  const blocks: Block[] = [];
  for (const raw of md.split(/\n{2,}/)) {
    const t = raw.trim();
    if (!t) continue;
    const m = t.match(/^<!-- p\.(\d+) -->$/);
    if (m) blocks.push({ kind: 'page', page: Number(m[1]) });
    else if (t.startsWith('## ')) blocks.push({ kind: 'h', text: t.slice(3) });
    else blocks.push({ kind: 'p', text: t.replace(/\n/g, '') });
  }
  return blocks;
}

/** 全文人工校正完成的文章。未列入者原文頁仍會產生，但頁首標示「未校正」；
 *  繳交前由 scripts/verify/verify-release.mjs 要求 22 篇全部列入。 */
export const FULLTEXT_REVIEWED = new Set<string>([]);
