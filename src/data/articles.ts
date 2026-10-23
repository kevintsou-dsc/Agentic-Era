// 22 篇總表（POC 版）。標題依 K4 以文章內頁標題為準；起始頁取自 0-0_簡介目錄.pdf；原文分鐘數 = 字數 / 450。
export type Chapter = 'intro' | 'people' | 'model' | 'ai';

export interface ArticleMeta {
  id: number;
  chapter: Chapter;
  title: string;
  authors: string;
  page: number;
  minutes: number;
}

export const CHAPTERS: Record<Chapter, { name: string; zh: string }> = {
  intro: { name: 'Intro', zh: '序章' },
  people: { name: 'People', zh: '人' },
  model: { name: 'Model', zh: '模型' },
  ai: { name: 'A.I', zh: '行動' },
};

export const ALL: ArticleMeta[] = [
  { id: 1, chapter: 'intro', title: 'AI for Growth 看懂世界，加速成長', authors: '唐心慧', page: 6, minutes: 7 },
  { id: 2, chapter: 'intro', title: 'Agentic 時代 品牌與人的真實距離', authors: '邵懿文', page: 12, minutes: 7 },
  { id: 3, chapter: 'people', title: '真實的力量 重新定義中', authors: '周麗君', page: 20, minutes: 10 },
  { id: 4, chapter: 'people', title: 'Agents of Growth AI 代理時代的增長推手', authors: '紀緻謙', page: 28, minutes: 15 },
  { id: 5, chapter: 'people', title: 'AI 代理時代的增長架構師', authors: '朱芳儀', page: 36, minutes: 12 },
  { id: 6, chapter: 'people', title: '信任 為何成為 AI 時代最難複製的競爭力', authors: '楊欣怡', page: 44, minutes: 9 },
  { id: 7, chapter: 'people', title: 'AI 可以幫人買東西 但品牌要讓人想買東西', authors: '陳蒔', page: 50, minutes: 15 },
  { id: 8, chapter: 'people', title: '當注意力成為稀缺資源 娛樂與運動如何累積品牌心智資產？', authors: '何華軒', page: 58, minutes: 13 },
  { id: 9, chapter: 'people', title: '討好演算法，還是打動人？別讓效率邏輯把社群砍掉', authors: '孫韞筑', page: 66, minutes: 8 },
  { id: 10, chapter: 'people', title: '別買曝光了 開始買注意力吧', authors: '徐莉媛', page: 72, minutes: 12 },
  { id: 11, chapter: 'people', title: '從金曲獎到甄嬛傳 共同記憶帶來的品牌價值', authors: '吳宗霖、陳炯文', page: 80, minutes: 34 },
  { id: 12, chapter: 'model', title: 'People Model 讓消費者研究變成一場隨時能開口的對話', authors: '陳介立、孫郁喬、高靖萍', page: 96, minutes: 37 },
  { id: 13, chapter: 'model', title: '重建 SOV', authors: '吳宗霖', page: 116, minutes: 21 },
  { id: 14, chapter: 'model', title: 'AI 普及下的演算法世代「衡斷力 (Judgment)」將成為最稀缺的競爭力', authors: '強義明', page: 128, minutes: 12 },
  { id: 15, chapter: 'model', title: '生成式體驗來臨 誰能掌握顧客的下一步？', authors: '鄭怡櫛、張家誠', page: 136, minutes: 15 },
  { id: 16, chapter: 'model', title: '贏在 AI 時代的隱形戰場 看見「文化暗流」', authors: '王馥蓓、周允玉', page: 144, minutes: 11 },
  { id: 17, chapter: 'ai', title: '顧客為何停下來？從洞察到治理的體驗優化', authors: '陳詳翰、康晉嵐', page: 152, minutes: 14 },
  { id: 18, chapter: 'ai', title: '體驗這件事，我們一直只問了一半', authors: '王姿喨、詹佳穎、黃靖婷', page: 160, minutes: 14 },
  { id: 19, chapter: 'ai', title: 'GEO 時代 被 AI 看見是技術，被消費者記住才是本事', authors: '莊閔雯、呂季霖', page: 168, minutes: 11 },
  { id: 20, chapter: 'ai', title: '拒絕同質化 AI Slop', authors: '潘其偉', page: 176, minutes: 12 },
  { id: 21, chapter: 'ai', title: '超越效率 解碼 AI 製作驅動的創意代理商', authors: 'Trent Agnew', page: 182, minutes: 11 },
  { id: 22, chapter: 'ai', title: 'AI Agent 走進消費旅程', authors: '電通智能中心智庫', page: 188, minutes: 15 },
];

// 全書主線（content-map §3，策展判斷）
export const THREADS = [
  { key: 'trust', name: '真實與信任，是最貴的稀缺資產', ids: [3, 6, 9, 15, 19, 20] },
  { key: 'judge', name: '判斷力不能外包', ids: [1, 5, 12, 14, 16, 20] },
  { key: 'agent', name: 'Agent 經濟重寫「被選擇」的規則', ids: [4, 7, 13, 15, 18, 22] },
  { key: 'memory', name: '從注意力到記憶', ids: [8, 10, 11, 13] },
] as const;
