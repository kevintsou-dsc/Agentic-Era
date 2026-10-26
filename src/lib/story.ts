// 單篇故事的資料模型（寫法規範見 docs/story-guide.md）。
//
// 兩個概念全站統一：
//   出處 src   ＝「這段話根據原文哪裡」。以「一段主文」或「一整張圖表」為單位標註；
//                點擊後在視窗中開啟整篇原文，並捲到該段落高亮。
//   細節 more  ＝「想多看一點」。原文中更詳細的文字、案例圖片、影片或網站連結；
//                hover 預覽，點擊開啟細節卡。
//
// 所有 Src 都會被 scripts/verify/verify-quotes.mjs 逐字比對；寫法必須維持
// { article: 'aNN', page: N, text: '…' } 這個順序，比對腳本才抓得到。

export interface Src { article: string; page: number; text: string }

/** 案例圖片（由 scripts/extract/extract_figures.py 從 PDF 抽出，放在 /fig/aNN/） */
export interface Img { src: string; alt: string; caption?: string; credit?: string; w?: number; h?: number }
export interface Link { url: string; label: string; kind?: 'video' | 'web' | 'social' | 'report' }

/** 細節卡：點擊才展開的延伸內容 */
export interface More {
  /** 按鈕／卡片標題，例如「案例：CeraVe 捷運吊環」 */
  title: string;
  /** 策展者的一句說明（可省略） */
  text?: string;
  /** 原文中更詳細的段落，整段照錄 */
  quote?: Src;
  image?: Img;
  links?: Link[];
}

/** 主文段落：完整的句子；讀者只讀主文也能讀懂整篇 */
export interface Beat {
  text: string;
  src: Src[];
  /** 這段之後接一則原文引言 */
  quote?: Src;
  more?: More;
}

/** at = 第幾段主文時出現（1 起算）。圖表元素不標出處，只能掛 more（細節） */
export type Graphic =
  | {
      type: 'bars';
      title: string;
      axis?: string;
      bars: { label: string; sub?: string; value: number; display: string; highlight?: boolean; at: number; more?: More }[];
      badge?: { text: string; at: number };
      source: string;
    }
  | {
      type: 'hbars';
      label: string;
      rows: { label: string; value: number; display: string; highlight?: boolean; at: number; more?: More }[];
      big?: { from: string; to: string; unit: string; at: number };
      source: string;
    }
  | { type: 'cycle'; label: string; nodes: { zh: string; en?: string; more?: More }[]; center: string; shrinkAt?: number; source: string }
  /** layers：預設第 k 段主文點亮第 k 層；主文第一段是總覽時，用 at 指定該層對應第幾段 */
  | { type: 'layers'; from?: string; to: string; layers: { title: string; desc: string; at?: number; more?: More }[]; source: string }
  | {
      type: 'matrix';
      title: string;
      y: { label: string; high: string; low: string };
      x: { label: string; left: string; right: string };
      /** 依序為左上、右上、左下、右下；第 k 段主文聚焦第 k 格 */
      quads: { case: string; name: string; items: string[] }[];
      source: string;
    }
  | { type: 'list'; title?: string; items: { title: string; desc?: string; at?: number; more?: More }[]; source: string }
  /** 案例圖片（可多張，第 k 段主文顯示第 k 張） */
  | { type: 'images'; images: (Img & { at: number; links?: Link[] })[]; source: string }
  /** d3 互動圖表；chart 對應 src/components/d3/ 下的元件 */
  | { type: 'd3'; chart: D3Chart; source: string }
  /** 分格插畫：作者小故事、個人經驗（不是統計數據，不用 bignum／長條呈現）。第 k 段主文顯示第 k 格 */
  | { type: 'art'; art: 'magnet-mount'; title?: string; source: string };

export type D3Chart =
  /** 粒子沿循環流動的生態系／循環圖 */
  /**
   * 圖表元素的說明框（hover／聚焦／點擊），規則見 docs/story-guide.md §5.1：
   *   只放策展補充（extra）：原文沒講、讀者需要才看得懂的背景、定義、例子，說明框標示「策展補充（非原文）」。
   *   原文內容一律寫進左側主文；整張圖的原文出處只標一次（scene.src 與 source）。
   * 每個元素都要有 extra，至少 40 字（lint 檢查）。
   */
  | {
      kind: 'flowloop'; title: string; center: string; centerExtra?: string;
      nodes: (Tipped & { label: string; sub?: string; desc?: string })[]; shrink?: boolean;
    }
  /** 多組橫向長條比較（例如不同世代） */
  | { kind: 'groups'; title: string; unit: string; groups: { name: string; sub?: string; items: (Tipped & { label: string; value: number })[]; at: number }[] }
  /** 對數尺度的範圍長條（例如成本倍數 1×、5–10×、10–100×） */
  | { kind: 'logrange'; title: string; unit: string; rows: (Tipped & { label: string; sub?: string; min: number; max: number; open?: boolean; at: number })[] }
  /** 消費模型演進：每列一個時代、每格一個階段，起點逐列改變；列本身也有說明（模型名稱） */
  | { kind: 'stages'; title: string; rows: (Tipped & { era: string; model: string; steps: (Tipped & { en: string; zh: string })[]; at: number })[] }
  /**
   * ESOV 減法圖：第 1 段 SOM 長條滑下來疊到 SOV 上，只剩超出的部分（ESOV）亮著；
   * 第 2 段攤開不同媒體場域（同樣一次曝光意義不同）；第 3 段收成「主場域＋輔助角色」。
   */
  | {
      kind: 'esov'; title: string;
      som: Tipped & { label: string; sub: string; value: number };
      sov: Tipped & { label: string; sub: string; value: number };
      result: Tipped & { label: string };
      fieldsTitle: string; fields: (Tipped & { label: string })[];
      main: Tipped & { label: string }; roles: (Tipped & { label: string })[];
    }
  /**
   * 同心圓：範圍由內往外擴大的概念（例如競爭從同品類擴大到整個生活預算）。所有圈一開始就全部顯示；
   * pulls（選用）在第 pullsAt 段出現：從中心往外被帶走的東西。
   */
  | {
      kind: 'rings'; title: string; center: string;
      rings: (Tipped & { label: string; sub: string; desc: string })[];
      pulls?: string[]; pullsAt?: number;
    };

/** 說明框內容（策展補充） */
export interface Tipped { extra?: string }

/** 橫向捲動的一格 */
export interface Panel {
  kicker?: string;
  title: string;
  text: string;
  src: Src[];
  figure?: { value: string; label: string };
  image?: Img;
  more?: More;
}

export type Scene =
  /** 固定圖＋捲動主文。src：整張圖表的出處（一個按鈕）；figures：圖中數字的逐字比對依據（不顯示） */
  | { kind: 'graphic'; side?: 'left' | 'right'; graphic: Graphic; beats: Beat[]; src?: Src[]; figures?: Src[] }
  | { kind: 'hscroll'; title: string; intro: Beat; panels: Panel[]; source: string }
  /** 一般排版：一段或多段主文，可配一張圖（左右交錯），不固定 */
  | { kind: 'prose'; eyebrow?: string; heading?: string; beats: Beat[]; image?: Img; links?: Link[] }
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
  asksTitle?: string;
  /** 審稿狀態：draft → judged（Jev 初評通過）→ reviewed（人工校閱完成） */
  status: 'draft' | 'judged' | 'reviewed';
}
