// 成就卡（components/SnackPack.astro、scripts/snack.ts）：全部由已讀紀錄推算，不另外存資料。
// 三類共 13 張：讀完篇數 5 張、讀完一整章 4 張、讀完一條主線 4 張。
import { ARTICLES, CHAPTERS, CHAPTER_ORDER, THREADS, type Chapter } from './articles';
import { STORIES } from '../data/stories';

export interface Achievement {
  id: string;
  kind: 'count' | 'chapter' | 'thread';
  name: string;
  /** 卡片上的一句話 */
  line: string;
  /** 解鎖條件（未解鎖時顯示） */
  hint: string;
  /** 卡片配色：章節色 */
  color: Chapter;
  /** 讀完篇數門檻（kind=count） */
  n?: number;
  /** 要讀完的文章短名（kind=chapter/thread） */
  slugs?: string[];
}

export function achievements(): Achievement[] {
  const withStory = ARTICLES.filter((a) => STORIES[a.id]);
  const total = withStory.length;
  const half = Math.ceil(total / 2);
  const counts: [number, string, string, Chapter][] = [
    [1, '開讀', '第一篇讀完，補給包開張。', 'intro'],
    [3, '上手', '三篇了，開始看得出全書在談什麼。', 'people'],
    [5, '五篇在手', '五個觀點，已經夠開一場讀書會。', 'model'],
    [half, '讀過一半', `${half} 篇，全書過半。`, 'ai'],
    [total, '全書讀完', `《決策智慧》${total} 篇，全部讀過一遍。`, 'people'],
  ];
  const threadColor: Record<string, Chapter> = { trust: 'model', judge: 'people', agent: 'ai', memory: 'intro' };
  return [
    ...counts.map(([n, name, line, color]) => ({ id: `n${n}`, kind: 'count' as const, name, line, hint: `讀完 ${n} 篇解鎖`, color, n })),
    ...CHAPTER_ORDER.map((c) => {
      const slugs = withStory.filter((a) => a.chapter === c).map((a) => a.slug);
      return { id: `ch-${c}`, kind: 'chapter' as const, name: `${CHAPTERS[c].name} 章通關`, line: `「${CHAPTERS[c].zh}」這一章的 ${slugs.length} 篇都讀完了。`, hint: `讀完 ${CHAPTERS[c].name} 章 ${slugs.length} 篇解鎖`, color: c, slugs };
    }),
    ...THREADS.map((t) => {
      const slugs = withStory.filter((a) => a.threads.includes(t.key)).map((a) => a.slug);
      return { id: `th-${t.key}`, kind: 'thread' as const, name: `主線｜${t.short}`, line: `${t.name}。`, hint: `讀完主線「${t.short}」${slugs.length} 篇解鎖`, color: threadColor[t.key] ?? 'people', slugs };
    }),
  ];
}
