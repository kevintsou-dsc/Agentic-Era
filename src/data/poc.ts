// POC 用的引文與數字。每一則 text 都必須是 content/fulltext/<article>.md 的逐字子字串，
// page 為紙本頁碼。由 scripts/verify/verify-quotes.mjs 檢查。

export interface Source {
  article: string;
  page: number;
}
export interface Quote extends Source {
  text: string;
}

export const ARTICLES = {
  a02: { title: 'Agentic 時代：品牌與人的真實距離', short: 'Agentic 時代', authors: '邵懿文 Freda Shao', role: '電通集團策略創新長', chapter: 'intro', pages: 'p.12–17', minutes: 7 },
  a08: { title: '當注意力成為稀缺資源：娛樂與運動如何累積品牌心智資產？', short: '當注意力成為稀缺資源', authors: '何華軒 Louis Ho', role: 'dentsu sports & entertainment Entertainment Marketing Senior Director', chapter: 'people', pages: 'p.58–65', minutes: 13 },
  a10: { title: '別買曝光了，開始買注意力吧：把媒體做成體驗，幫品牌累積「滑不走」的記憶資產', short: '別買曝光了，開始買注意力吧', authors: '徐莉媛 Amy Hsu', role: '安布思沛副總監', chapter: 'people', pages: 'p.72–79', minutes: 12 },
  a11: { title: '從金曲獎到甄嬛傳：共同記憶帶來的品牌價值', short: '從金曲獎到甄嬛傳', authors: '吳宗霖 Jeremy Wu、陳炯文 Elmo Chen', role: '貝立德營運長暨媒體實驗室所長、貝立德媒體企劃經理', chapter: 'people', pages: 'p.80–93', minutes: 34 },
  a13: { title: '重建 SOV：在注意力被 AI 稀釋的時代，如何守住品牌被選擇的關鍵場域', short: '重建 SOV', authors: '吳宗霖 Jeremy Wu', role: '電通集團媒體事業群洞察與媒體效能領導人、貝立德營運長', chapter: 'model', pages: 'p.116–127', minutes: 21 },
} as const;

export type ArticleId = keyof typeof ARTICLES;

export const QUOTES = {
  scrolledHundreds: { article: 'a10', page: 73, text: '昨天你一定滑過上百則內容，但如果我問你現在還記得幾支廣告，數得出來嗎？' },
  notLostFocus: { article: 'a08', page: 59, text: '消費者並非失去了專注能力，而是對內容的選擇變得更加挑剔。' },
  inventory: { article: 'a10', page: 73, text: '有注意力品質的曝光，才有機會變成品牌資產；沒有被看進去的曝光，只是報表上的庫存。' },
  cantBuy: { article: 'a10', page: 77, text: '版位可以買，但主動靠近、伸手拿、拍照分享、真的記住，買不到。' },
  familiarNew: { article: 'a11', page: 85, text: '先用「我認識」讓人進來，再讓他遇見「我還不認識」。' },
  salesMarketing: { article: 'a13', page: 119, text: '單次銷售是 Sales，能不能把每一次接觸、每一次購買、每一次使用經驗，累積成品牌的記憶、信任、偏好與再購理由，才是 Marketing。' },
  buyExposure: { article: 'a08', page: 65, text: '品牌可以購買曝光，卻無法購買記憶' },
  remembered: { article: 'a10', page: 79, text: '現在真正稀缺的從來不是曝光，而是――在不被打斷的情況下，被記住。' },
  coreQuestion: { article: 'a02', page: 12, text: '品牌離 AI 越近，會不會反而離人越遠？答案或許是：只要 AI 做的是幫品牌更懂人，品牌與人之間的距離，才會是真實的靠近。' },
  ask1: { article: 'a10', page: 78, text: '你的儀表板上，有「記憶」這一欄嗎？' },
  ask2: { article: 'a10', page: 78, text: '你的 SOV，是聲量，還是注意力？' },
  ask3: { article: 'a10', page: 78, text: '你的媒體，有讓消費者願意參與嗎？' },
  cerave: { article: 'a10', page: 78, text: '沒有人被逼著看任何東西，乘客卻自己湊上去、拍照、上傳，在Threads 上聊開了。' },
} satisfies Record<string, Quote & { article: ArticleId }>;

// 數字：text 為原文中可逐字找到的片段
export const FIGURES = {
  screen2004: { article: 'a08', page: 59, text: '從2004 的約 150 秒下降至約 47 秒' },
  attention18: { article: 'a10', page: 77, text: '+18%' },
  attention79: { article: 'a10', page: 77, text: '+79%' },
  golden: { article: 'a11', page: 84, text: '2024 年第 35 屆全體平均收視為 2.78' },
  golden2026: { article: 'a11', page: 84, text: '電視整體平均收視達3.37，相較 2025 年第 36 屆的 2.31' },
  golden46: { article: 'a11', page: 84, text: '相對成長約 46%' },
  ages: { article: 'a11', page: 85, text: '55~64 歲族群的收視成長最為明顯，其次則是 25 ~ 34 歲的年輕族群' },
} satisfies Record<string, Quote & { article: ArticleId }>;
