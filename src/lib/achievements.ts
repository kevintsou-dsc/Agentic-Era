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
  // 文案：三組提案（概念／行銷人日常／人與 AI 的距離）經讀者與總編輯盲評，以「行銷人日常」為骨架的最佳組合定稿。
  // 篇數卡＝提案流程（Brief → 洞察 → 提案 → 期中 → 全案），章節卡＝首席 X 官，主線卡扣回各主線主張。
  const counts: [number, string, string, string, Chapter][] = [
    [1, 'Brief 到手', '先問對問題，再談答案', '讀完第 1 篇，全書的核心問題已放進你的 Brief。', 'intro'],
    [3, '洞察初現', '數據之外，開始看見人', '讀完 3 篇，你的筆記正從觀察長成洞察。', 'people'],
    [5, '提案成形', '觀點有了，論述也立起來了', '讀完 5 篇，已足以撐起一場內部提案。', 'model'],
    [half, '期中檢視', '全站看完 50%，現在的你強得可怕', `讀完 ${half} 篇，全書過半，品牌與人的距離已看清一半。`, 'ai'],
    [total, '修為大成', '100% 看完，你已經準備好讓世界看看你的實力了', `讀完全部 ${total} 篇，品牌與人的真實距離，換你來定義。`, 'people'],
  ];
  const chapterCopy: Record<Chapter, [string, string, (n: number) => string]> = {
    intro: ['首席提問官', '看懂世界，加速成長', (n) => `讀完序章 ${n} 篇，先問：品牌離 AI 越近，會離人越遠嗎？`],
    people: ['首席洞察官', 'AI 幫人買，品牌讓人想買', (n) => `讀完 People｜人 ${n} 篇，真實、信任與共同記憶，都在人身上。`],
    model: ['首席研究官', '消費者研究，隨時能開口', (n) => `讀完 Model｜模型 ${n} 篇，用模型看見顧客的下一步。`],
    ai: ['首席行動官', '從簡報頁走進執行表', (n) => `讀完 A.I｜行動 ${n} 篇，把 AI 的生成力升級為交付力。`],
  };
  const threadCopy: Record<string, [string, string, (n: number) => string]> = {
    trust: ['信任資產入帳', '最貴的，AI 複製不來', (n) => `讀完「真實與信任」${n} 篇，收齊這份最貴的稀缺資產。`],
    judge: ['判斷力不外包', 'AI 出選項，你來拍板', (n) => `讀完「判斷力」${n} 篇，提案最後一頁，永遠留給你的判斷。`],
    agent: ['通過 Agent 初選', '先被 AI 選中，再被人愛上', (n) => `讀完「Agent 經濟」${n} 篇，「被選擇」的新規則你已掌握。`],
    memory: ['滑不走的記憶', '曝光會過去，記憶會留下', (n) => `讀完「注意力到記憶」${n} 篇，品牌從被看見走到被記住。`],
  };
  const threadColor: Record<string, Chapter> = { trust: 'model', judge: 'people', agent: 'ai', memory: 'intro' };
  return [
    ...counts.map(([n, name, quip, line, color]) => ({ id: `n${n}`, kind: 'count' as const, name, quip, line, hint: `讀完 ${n} 篇解鎖`, color, n })),
    ...CHAPTER_ORDER.map((c) => {
      const slugs = withStory.filter((a) => a.chapter === c).map((a) => a.slug);
      const [name, quip, line] = chapterCopy[c];
      return { id: `ch-${c}`, kind: 'chapter' as const, name, quip, line: line(slugs.length), hint: `讀完 ${CHAPTERS[c].name} 章 ${slugs.length} 篇解鎖`, color: c, slugs };
    }),
    ...THREADS.map((t) => {
      const slugs = withStory.filter((a) => a.threads.includes(t.key)).map((a) => a.slug);
      const [name, quip, line] = threadCopy[t.key] ?? [`主線｜${t.short}`, t.name, () => `${t.name}。`];
      return { id: `th-${t.key}`, kind: 'thread' as const, name, quip, line: line(slugs.length), hint: `讀完主線「${t.short}」${slugs.length} 篇解鎖`, color: threadColor[t.key] ?? 'people', slugs };
    }),
  ];
}
