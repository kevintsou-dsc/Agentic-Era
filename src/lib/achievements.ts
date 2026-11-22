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
  /** 俏皮副標（卡名下方的一句玩笑話） */
  quip: string;
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
  const counts: [number, string, string, string, Chapter][] = [
    [1, '開讀', '萬事起頭難，你已經不難了', '第一篇讀完，補給包開張。', 'intro'],
    [3, '上手', '手感來了，小心停不下來', '三篇了，開始看得出全書在談什麼。', 'people'],
    [5, '五篇在手', '讀書會主揪，非你莫屬', '五個觀點，已經夠開一場讀書會。', 'model'],
    [half, '讀過一半', '過了半山腰，接下來是下坡', `${half} 篇，全書過半。`, 'ai'],
    [total, '全書讀完', '傳說級讀者，正式誕生', `《決策智慧 2026》${total} 篇，全部讀過一遍。`, 'people'],
  ];
  const chapterQuip: Record<Chapter, string> = {
    intro: '開場白聽完，正戲要開演了',
    people: '人心這門課，學分到手',
    model: '模型在手，決策不抖',
    ai: '說到做到，行動派認證',
  };
  const threadQuip: Record<string, string> = {
    trust: '信任存摺，餘額又多一筆',
    judge: '判斷力 +1，演算法拿你沒辦法',
    agent: 'AI 代理人來敲門前，你先到了',
    memory: '恭喜，你被這條主線記住了',
  };
  const threadColor: Record<string, Chapter> = { trust: 'model', judge: 'people', agent: 'ai', memory: 'intro' };
  return [
    ...counts.map(([n, name, quip, line, color]) => ({ id: `n${n}`, kind: 'count' as const, name, quip, line, hint: `讀完 ${n} 篇解鎖`, color, n })),
    ...CHAPTER_ORDER.map((c) => {
      const slugs = withStory.filter((a) => a.chapter === c).map((a) => a.slug);
      return { id: `ch-${c}`, kind: 'chapter' as const, name: `${CHAPTERS[c].name} 章通關`, quip: chapterQuip[c], line: `「${CHAPTERS[c].zh}」這一章的 ${slugs.length} 篇都讀完了。`, hint: `讀完 ${CHAPTERS[c].name} 章 ${slugs.length} 篇解鎖`, color: c, slugs };
    }),
    ...THREADS.map((t) => {
      const slugs = withStory.filter((a) => a.threads.includes(t.key)).map((a) => a.slug);
      return { id: `th-${t.key}`, kind: 'thread' as const, name: `主線｜${t.short}`, quip: threadQuip[t.key] ?? '這條線，被你一路讀通了', line: `${t.name}。`, hint: `讀完主線「${t.short}」${slugs.length} 篇解鎖`, color: threadColor[t.key] ?? 'people', slugs };
    }),
  ];
}
