// 單篇 90 秒故事的資料模型。所有 Src 都會被 scripts/verify/verify-quotes.mjs 逐字比對。
// 寫法必須維持 { article: 'aNN', page: N, text: '…' } 這個順序，比對腳本才抓得到。

export interface Src { article: string; page: number; text: string }

/** 捲動卡片：策展者整理（text，支援 **粗體**）、原文（quote）、可展開的細節（more） */
export interface Card {
  text?: string;
  quote?: Src;
  more?: { summary: string; text?: string; quote?: Src };
}

/** at = 第幾步出現（1 起算） */
export type Graphic =
  | {
      type: 'bars';
      title: string;
      axis?: string;
      bars: { label: string; sub?: string; value: number; display: string; highlight?: boolean; at: number }[];
      badge?: { text: string; at: number };
      figures: Src[];
      source: string;
    }
  | {
      type: 'hbars';
      label: string;
      rows: { label: string; value: number; display: string; highlight?: boolean; at: number }[];
      big?: { from: string; to: string; unit: string; at: number };
      figures: Src[];
      source: string;
    }
  | { type: 'cycle'; label: string; nodes: { zh: string; en?: string }[]; center: string; shrinkAt?: number; source: string }
  | { type: 'layers'; from?: string; to: string; layers: { title: string; desc: string; detail?: string }[]; source: string }
  | {
      type: 'matrix';
      title: string;
      y: { label: string; high: string; low: string };
      x: { label: string; left: string; right: string };
      /** 依序為左上、右上、左下、右下；第 k 步聚焦第 k 格 */
      quads: { case: string; name: string; items: string[] }[];
      source: string;
    }
  | { type: 'list'; title?: string; items: { title: string; desc?: string; at?: number }[]; source: string };

export type Scene =
  /** figures：圖中數字在原文的出處，只供逐字比對，不顯示 */
  | { kind: 'graphic'; side?: 'left' | 'right'; graphic: Graphic; steps: Card[]; figures?: Src[] }
  | { kind: 'quote'; lead?: string; quote: Src }
  | { kind: 'bignum'; value: number; decimals?: number; prefix?: string; unit: string; caption: string; figure: Src; source: string }
  | { kind: 'statement'; eyebrow?: string; text: string; lede?: string };

export interface Story {
  id: string;
  /** 一句話主張（策展者整理） */
  oneLiner: string;
  scenes: Scene[];
  /** 帶走的問題或做法：原文 */
  asks: Src[];
  /** 結尾區塊的標題，預設「帶走這幾個問題」 */
  asksTitle?: string;
  /** 人工審定後才設為 true；未審定的故事在正式建置中不會產生頁面 */
  reviewed: boolean;
}
