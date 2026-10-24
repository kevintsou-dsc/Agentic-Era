import type { Src } from '../lib/story';

// 首頁「全書故事」用到的原文（會被逐字比對）
export const CORE_QUESTION: Src = { article: 'a02', page: 12, text: '品牌離 AI 越近，會不會反而離人越遠？答案或許是：只要 AI 做的是幫品牌更懂人，品牌與人之間的距離，才會是真實的靠近。' };

// 四條主線的一句話（策展者整理），依 content/articles.json 的 threads 順序
export const THREAD_LINES: Record<string, string> = {
  trust: 'AI 越普及，「看起來像真的」越廉價，能被驗證、被信任的**真實**反而最貴。',
  judge: 'AI 改變的是分工與效率，**判斷**與決策責任不能外包。',
  agent: '當 AI Agent 替消費者篩選，品牌要同時說服人與 AI，**被選擇的規則**改寫了。',
  memory: '曝光不再稀缺，稀缺的是在不被打斷的情況下，**被記住**。',
};
