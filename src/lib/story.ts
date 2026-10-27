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

/** by：引言不是文章作者說的（例如原刊側欄的受訪者），寫「姓名｜職稱」 */
export interface Src { article: string; page: number; text: string; by?: string }

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
  /** 段落標籤，例如案例的「情境」「方法」「模擬」 */
  tag?: string;
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
  | { type: 'list'; title?: string; flip?: boolean; layout?: 'one' | 'two' | 'three' | 'timeline' | 'tram' | 'polaroid' | 'hanger'; items: { title: string; desc?: string; at?: number; more?: More }[]; source: string }
  /** 案例圖片（可多張，第 k 段主文顯示第 k 張） */
  | { type: 'images'; images: (Img & { at: number; links?: Link[] })[]; source: string }
  /** d3 互動圖表；chart 對應 src/components/d3/ 下的元件 */
  | { type: 'd3'; chart: D3Chart; source: string }
  /** 分格插畫：作者小故事、個人經驗（不是統計數據，不用 bignum／長條呈現）。第 k 段主文顯示第 k 格 */
  /** 原刊表格：第一欄可寫「主標｜副標」，儲存格換行（
）轉成條列；第 at 段主文點亮該列 */
  /** 雷達圖：第一軸在正上方、順時針；note 寫「示意」等說明 */
  | { type: 'radar'; title?: string; axes: { label: string; v: number; at?: number }[]; max?: number; note?: string; source: string }
  | { type: 'table'; title?: string; cols: string[]; rows: { cells: string[]; icon?: 'question' | 'blocks' | 'arrows' | 'data' | 'gear'; at: number }[]; source: string }
  | { type: 'art'; art: 'magnet-mount' | 'escalation' | 'persona-duo' | 'agent-team' | 'journey-compress' | 'judgment-sources' | 'iproof' | 'media-pp' | 'pillars' | 'ccs-model' | 'ai-pi' | 'e2e-rings' | 'foundation'; title?: string; source: string }
  /**
   * 案例模擬（情境 → 方法 → 模擬）：第 1 段主文顯示情境、第 2 段顯示方法、第 3 段起依序顯示 results。
   * 主文段數 = 2 + results.length。
   */
  | {
      type: 'case';
      no: number; total: number; kicker: string; title: string;
      /** 情境：要比較的選項（有素材圖就放圖） */
      options: { label: string; sub?: string; img?: Img; icon?: string }[];
      question: string;
      /** 方法：把什麼交給哪群 AI Persona、用什麼工具、看什麼反應 */
      method: { feed: string; persona: string; tools: string[]; out: string };
      results: CaseResult[];
      source: string;
    };

/** 案例模擬的結果畫面。數字一律是 AI Persona 模擬結果，必須逐字出現在主文。 */
export type CaseResult =
  /** 分階段比勝負：每一列標出勝出的選項（-1 = 兩者並列） */
  | { kind: 'stages'; title: string; rows: { label: string; win: number; value: string }[]; takeaway?: string[] }
  /** 判定章：每個選項的用途 */
  | { kind: 'verdict'; title: string; items: { opt: number; stamp: string; note: string }[]; voices?: { who: string; text: string }[]; common?: string }
  /** 分組長條（例如不同年齡層的首選率）；text 可寫區間「71–83%」 */
  | { kind: 'groups'; title: string; headline?: { value: string; label: string }; groups: { label: string; bars: { label: string; v: number; text: string; tone?: number }[] }[] }
  /** 比例拆分（100% 堆疊條） */
  | { kind: 'split'; title: string; groups: { label: string; parts: { label: string; v: number; tone: number }[] }[]; note?: string }
  /** 旅程：在哪一站流失 */
  | { kind: 'journey'; title: string; stages: string[]; drop: number; dropNote: string; needs: { who: string; text: string }[] }
  /** 排行長條 */
  | { kind: 'rank'; title: string; bars: { label: string; v: number }[] }
  /** 重點數字卡（warn = 風險） */
  | { kind: 'points'; title: string; points: { value: string; label: string; warn?: boolean }[]; tags?: { label: string; text: string; tone: number }[] };

export type D3Chart =
  /** 粒子沿循環流動的生態系／循環圖 */
  /**
   * 圖表元素的說明框（hover／聚焦／點擊），規則見 docs/story-guide.md §5.1：
   *   只放策展補充（extra）：原文沒講、讀者需要才看得懂的背景、定義、例子，說明框標示「策展補充（非原文）」。
   *   原文內容一律寫進左側主文；整張圖的出處只顯示 source 一次（scene.src 只供比對，不顯示）。
   * 每個元素都要有 extra，至少 40 字（lint 檢查）。
   */
  | {
      kind: 'flowloop'; title: string; center: string; centerExtra?: string;
      /** at：第幾段主文亮起（預設第 k 個節點對第 k 段）；圓圈數與段數不同時一定要指定 */
      nodes: (Tipped & { label: string; sub?: string; desc?: string; at?: number })[]; shrink?: boolean;
    }
  /** 多組橫向長條比較（例如不同世代） */
  | { kind: 'groups'; title: string; unit: string; groups: { name: string; sub?: string; items: (Tipped & { label: string; value: number })[]; at: number }[] }
  /** 對數尺度的範圍長條（例如成本倍數 1×、5–10×、10–100×） */
  | { kind: 'logrange'; title: string; unit: string; rows: (Tipped & { label: string; sub?: string; min: number; max: number; open?: boolean; at: number })[] }
  /** 消費模型演進：每列一個時代、每格一個階段，起點逐列改變；列本身也有說明（模型名稱） */
  | { kind: 'stages'; title: string; rows: (Tipped & { era: string; model: string; steps: (Tipped & { en: string; zh: string })[]; at: number })[] }
  /**
   * ESOV 減法圖：第 1 段 SOM 長條滑下來疊到 SOV 上，只剩超出的部分（ESOV）亮著；
   * 第 2 段攤開不同媒體場域（同樣一次曝光意義不同）；第 3 段用問題逐一檢查場域值不值得進攻。
   */
  | {
      kind: 'esov'; title: string;
      som: Tipped & { label: string; sub: string; value: number };
      sov: Tipped & { label: string; sub: string; value: number };
      result: Tipped & { label: string };
      fieldsTitle: string; fields: (Tipped & { label: string })[];
      checksTitle: string; checks: (Tipped & { label: string })[];
    }
  /**
   * 預算分配點陣（示意，非實際比例）：同一筆預算的點，
   * 第 1 段平均灑在每一層（每層都不夠深）→ 第 2 段聚到主場域、少數給輔助角色 →
   * 第 3 段持續投放：只換到一次交易的點落下消失，累積成品牌資產的點疊成越來越高的長條。
   */
  | {
      kind: 'allocate'; title: string; dots: number;
      layersTitle: string; layers: (Tipped & { label: string })[];
      splitTitle: string; main: Tipped & { label: string }; roles: (Tipped & { label: string })[];
      outcomeTitle: string; once: Tipped & { label: string }; asset: Tipped & { label: string };
    }
  /**
   * 蹺蹺板：兩股力量的比重隨時代或情境改變（例如品牌 vs 成效投資）。示意圖，不代表實際比例。
   * states 依 at 逐段切換；tilt：-1 左邊重、0 平衡、1 右邊重。
   */
  | {
      kind: 'balance'; title: string;
      left: Tipped & { label: string }; right: Tipped & { label: string };
      states: (Tipped & { label: string; en: string; years: string; desc: string; tilt: number; at: number })[];
    }
  /**
   * 文氏圖：兩種條件的交集才是答案（例如 AI 愛的 ∩ 人愛的）。
   * leftAt／rightAt：第幾段強調左／右圓；failAt：只顧一邊會兩邊落空；bothAt：之後交集亮起並持續脈動。
   */
  | {
      kind: 'venn'; title: string;
      left: Tipped & { label: string; items: string[] }; right: Tipped & { label: string; items: string[] };
      both: Tipped & { label: string; desc: string };
      fail?: string; leftAt: number; rightAt: number; failAt?: number; bothAt: number;
    }
  /**
   * 光譜：由低到高的等級（例如 Agent 權限：觀察 → 推薦 → 決策 → 行動），上方插上案例標記。
   * levelsAt：第幾段顯示等級；markers 依 at 逐一落下；pos 為 0 起算的等級位置，可用小數表示介於兩級之間。
   */
  | {
      kind: 'spectrum'; title: string; levelsAt: number;
      levels: (Tipped & { label: string; desc: string })[];
      markers: (Tipped & { label: string; pos: number; at: number })[];
    }
  /**
   * 冰山：水面上看得見的（工具、指標）vs 水面下真正的阻力（文化、情緒）。aboveAt／belowAt：第幾段點亮。
   */
  | {
      kind: 'iceberg'; title: string; aboveTitle: string; belowTitle: string;
      above: (Tipped & { label: string })[]; below: (Tipped & { label: string })[]; aboveAt: number; belowAt: number;
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
  /** 人物頭像（公眾人物）：只用 CC 等開放授權照片，存成站內檔案，卡片上標攝影者與授權並連回原始頁 */
  portrait?: { src: string; alt: string; credit: string; license: string; licenseUrl: string; sourceUrl: string; cropped?: boolean };
  more?: More;
}

export type Scene =
  /** 固定圖＋捲動主文。src：整張圖表的出處（一個按鈕）；figures：圖中數字的逐字比對依據（不顯示） */
  | { kind: 'graphic'; side?: 'left' | 'right'; graphic: Graphic; beats: Beat[]; src?: Src[]; figures?: Src[] }
  | { kind: 'hscroll'; title: string; intro: Beat; panels: Panel[]; source: string }
  /** 一般排版：一段或多段主文，可配一張圖（左右交錯），不固定 */
  | { kind: 'prose'; eyebrow?: string; heading?: string; beats: Beat[]; image?: Img; links?: Link[] }
  | { kind: 'quote'; lead?: Beat; quote: Src }
  /** people：人形圖，例如 { total: 20, filled: 13 } 表示 65%（filled／total 必須等於 value％） */
  | { kind: 'bignum'; value: number; decimals?: number; prefix?: string; unit: string; caption: Beat; figure: Src; source: string;
      people?: { total: number; filled: number; label?: string; icon?: 'elder' } }
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
  /** 主文字數上限（預設 3,000）。重點長文可放寬到 4,500，須在檔頭註明原因 */
  budget?: number;
}
