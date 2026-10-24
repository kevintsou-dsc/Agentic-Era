import type { Story } from '../../lib/story';

// 徐莉媛〈別買曝光了，開始買注意力吧〉紙本 p.72–79
export const story: Story = {
  id: 'a10',
  reviewed: false,
  oneLiner: '曝光正在通膨、注意力正在升值。被看進去、被想起來，才算數。',
  scenes: [
    {
      kind: 'quote',
      lead: '文章從一個每個人都答不出來的問題開始：',
      quote: { article: 'a10', page: 73, text: '昨天你一定滑過上百則內容，但如果我問你現在還記得幾支廣告，數得出來嗎？' },
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'cycle',
        label: '廣告末日循環 The Doom Loop',
        nodes: [
          { zh: '把預算轉移到「成效型」格式', en: 'Shift budgets to “performance” formats' },
          { zh: '廣告效果進入高原期／停滯', en: 'Advertising playback plateaus' },
          { zh: '依據有缺陷的指標進行優化', en: 'Optimize against faulty metrics' },
        ],
        center: '品牌',
        shrinkAt: 4,
        source: '圖：廣告末日循環 The Doom Loop｜資料來源 WARC《The Multiplier Effect》(2025)，引自 徐莉媛〈別買曝光了〉紙本 p.73',
      },
      figures: [{ article: 'a10', page: 73, text: '把預算轉移到「成效型」格式' }],
      steps: [
        { text: '為了交出能即時量化的成效，預算一步步流向**轉換型格式**。' },
        { text: '報表越來越漂亮，廣告效果卻停在**高原期**。' },
        { text: '於是再依同一套有缺陷的指標繼續優化，循環就此成形：**The Doom Loop**。' },
        {
          text: '預算沒少、聲量沒小，品牌卻一點一點變淡。',
          quote: { article: 'a10', page: 73, text: '有注意力品質的曝光，才有機會變成品牌資產；沒有被看進去的曝光，只是報表上的庫存。' },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'bars',
        title: '同樣的秒數，「自己選擇看」比「被迫看」值錢得多',
        axis: '自願性注意力相較強迫性注意力的品牌回想增幅（%）',
        bars: [
          { label: '注視 5–10 秒', value: 18, display: '+18%', at: 1 },
          { label: '注視 > 10 秒', value: 79, display: '+79%', highlight: true, at: 2 },
        ],
        figures: [
          { article: 'a10', page: 77, text: '+18%' },
          { article: 'a10', page: 77, text: '+79%' },
        ],
        source: '資料來源 dentsu Japan International Brands《Introducing the Attention Economy》眼動研究，引自 徐莉媛〈別買曝光了〉紙本 p.77',
      },
      steps: [
        { text: 'dentsu 日本的眼動研究比較了同一則廣告：消費者**自己選擇看**，和**被迫看**。注視 5–10 秒時，自願觀看的品牌回想多了 **18%**。' },
        {
          text: '注視超過 10 秒，差距拉大到 **79%**。不可略過的廣告把人留在螢幕前，他等的卻是 skip 鍵。',
          quote: { article: 'a10', page: 77, text: '版位可以買，但主動靠近、伸手拿、拍照分享、真的記住，買不到。' },
          more: {
            summary: '案例：CeraVe 把體驗瓶掛上捷運吊環',
            text: 'CeraVe 適樂膚在淡水信義線把上萬份 30ml 潔膚露體驗瓶掛上車廂吊環，單日引爆 **2.4 萬篇**社群討論（紙本 p.78）。',
            quote: { article: 'a10', page: 78, text: '沒有人被逼著看任何東西，乘客卻自己湊上去、拍照、上傳，在Threads 上聊開了。' },
          },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'matrix',
        title: '先判斷決策情境，再決定主攻：品牌記憶、內容證據，或分眾收割',
        y: { label: '主張驗證門檻', high: '高（難證明）', low: '低（易證明）' },
        x: { label: '消費者問題一致性', left: '分歧', right: '一致' },
        quads: [
          { case: '需求分歧－主張難證明', name: 'TOM 先行', items: ['先建立品牌主敘事', '再分眾補證據', '避免品牌理解破碎'] },
          { case: '需求一致－主張難證明', name: '雙管齊下', items: ['廣告創造注意', '內容完成驗證', 'USP 與體驗證據同步推進'] },
          { case: '需求分歧－主張易證明', name: '各個擊破', items: ['拆解需求情境', '優先攻高商機場景', '測出最有效的轉換切角'] },
          { case: '需求一致－主張易證明', name: 'CEPs 先行', items: ['先讓內容成為答案', '再用媒體放大收割', 'FAQ／比較／實測先鋪'] },
        ],
        source: '圖：AI 影響消費者決策下的媒體布局矩陣｜筆者整理製圖，徐莉媛〈別買曝光了〉紙本 p.76',
      },
      figures: [{ article: 'a10', page: 76, text: '把這兩軸交叉，就能幫品牌判斷現在更適合主攻品牌記憶、內容證據，或分眾收割。' }],
      steps: [
        { text: '那預算先押哪裡？作者用兩個問題判斷：消費者是不是都在問同一個問題？你的主張好不好證明？需求分歧又難證明，就先建立**品牌主敘事**。' },
        { text: '需求一致但難證明：廣告創造注意、內容完成驗證，**雙管齊下**。' },
        { text: '需求分歧但容易證明：拆解情境，**各個擊破**。' },
        { text: '需求一致又容易證明：先讓內容成為 AI、搜尋與社群可以引用的**答案**。' },
        { text: '現在換你：點矩陣裡任一格，看看你的品牌該怎麼做。' },
      ],
    },
    {
      kind: 'quote',
      quote: { article: 'a10', page: 79, text: '現在真正稀缺的從來不是曝光，而是――在不被打斷的情況下，被記住。' },
    },
  ],
  asksTitle: '下次做媒體規劃前，先問自己三件事',
  asks: [
    { article: 'a10', page: 78, text: '你的儀表板上，有「記憶」這一欄嗎？' },
    { article: 'a10', page: 78, text: '你的 SOV，是聲量，還是注意力？' },
    { article: 'a10', page: 78, text: '你的媒體，有讓消費者願意參與嗎？' },
  ],
};
