// 單篇 90 秒故事的資料模型（寫法規範見 docs/story-guide.md）。
// 所有 Src 都會被 scripts/verify/verify-quotes.mjs 逐字比對；寫法必須維持
// { article: 'aNN', page: N, text: '…' } 這個順序，比對腳本才抓得到。

export interface Src { article: string; page: number; text: string }

/** 圖表元素的補充資訊：hover 顯示 text，點擊開啟書頁視窗並附原文 */
export interface Detail { text: string; src?: Src[] }

/**
 * 主文段落（beat）：一到兩句完整的話，讀者只讀主文也能讀懂整個故事。
 * src 是這段主文所依據的原文；每段至少一則，讀者點「紙本 p.xx」可開啟書頁視窗。
 */
export interface Beat {
  text: string;
  src: Src[];
  /** 這段之後接一則原文引言 */
  quote?: Src;
  /** 可展開的延伸細節（案例等） */
  more?: { summary: string; text: string; src?: Src[] };
}

/** at = 第幾段主文時出現（1 起算） */
export type Graphic =
  | {
      type: 'bars';
      title: string;
      axis?: string;
      bars: { label: string; sub?: string; value: number; display: string; highlight?: boolean; at: number; detail?: Detail }[];
      badge?: { text: string; at: number };
      source: string;
    }
  | {
      type: 'hbars';
      label: string;
      rows: { label: string; value: number; display: string; highlight?: boolean; at: number; detail?: Detail }[];
      big?: { from: string; to: string; unit: string; at: number };
      source: string;
    }
  | { type: 'cycle'; label: string; nodes: { zh: string; en?: string; detail?: Detail }[]; center: string; shrinkAt?: number; source: string }
  | { type: 'layers'; from?: string; to: string; layers: { title: string; desc: string; detail?: Detail }[]; source: string }
  | {
      type: 'matrix';
      title: string;
      y: { label: string; high: string; low: string };
      x: { label: string; left: string; right: string };
      /** 依序為左上、右上、左下、右下；第 k 段主文聚焦第 k 格 */
      quads: { case: string; name: string; items: string[] }[];
      source: string;
    }
  | { type: 'list'; title?: string; items: { title: string; desc?: string; at?: number; detail?: Detail }[]; source: string };

/** 橫向捲動的一格：讀者仍往下捲，畫面橫向移動 */
export interface Panel {
  kicker?: string;
  title: string;
  /** 主文：完整句子 */
  text: string;
  src: Src[];
  figure?: { value: string; label: string };
}

export type Scene =
  /** figures：圖中數字在原文的出處，只供逐字比對，不顯示 */
  | { kind: 'graphic'; side?: 'left' | 'right'; graphic: Graphic; beats: Beat[]; figures?: Src[] }
  | { kind: 'hscroll'; title: string; intro: Beat; panels: Panel[]; source: string }
  | { kind: 'quote'; lead?: Beat; quote: Src }
  | { kind: 'bignum'; value: number; decimals?: number; prefix?: string; unit: string; caption: Beat; figure: Src; source: string }
  | { kind: 'statement'; eyebrow?: string; text: string; lede?: Beat };

export interface Story {
  id: string;
  /** 一句話主張（策展者整理） */
  oneLiner: string;
  scenes: Scene[];
  /** 帶走的問題或做法：原文 */
  asks: Src[];
  /** 結尾區塊的標題，預設「帶走這幾個問題」 */
  asksTitle?: string;
  /** 審稿狀態：draft → judged（Jev 初評通過）→ reviewed（人工校閱完成） */
  status: 'draft' | 'judged' | 'reviewed';
}
