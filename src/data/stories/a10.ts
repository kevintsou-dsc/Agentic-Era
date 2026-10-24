import type { Story } from '../../lib/story';

// 徐莉媛〈別買曝光了，開始買注意力吧〉紙本 p.72–79
export const story: Story = {
  id: 'a10',
  status: 'judged',
  oneLiner: '曝光正在通膨、注意力正在升值。被看進去、被想起來、被帶進決策的曝光，才算數。',
  scenes: [
    {
      kind: 'quote',
      lead: {
        text: '報表上的曝光越買越多、單次成本越壓越低，可是一打開品牌市調，卻是知名度遇到瓶頸、指名度下滑。這正是現在媒體最尷尬的地方。',
        src: [
          { article: 'a10', page: 73, text: '報表上的數字越來越漂亮：曝光越買越多、單次成本越壓越低、效率年年進步' },
          { article: 'a10', page: 73, text: '可是一打開品牌市調，卻是另一個樣貌：知名度遇到瓶頸、指名度下滑' },
          { article: 'a10', page: 73, text: '這正是現在媒體最尷尬的地方' },
        ],
      },
      quote: { article: 'a10', page: 73, text: '昨天你一定滑過上百則內容，但如果我問你現在還記得幾支廣告，數得出來嗎？' },
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'cycle',
        label: '廣告末日循環 The Doom Loop',
        nodes: [
          {
            zh: '把預算轉移到「成效型」格式', en: 'Shift budgets to “performance” formats',
            detail: { text: '為了交出能即時量化的成效，預算不斷流向短期、點擊與轉換。', src: [{ article: 'a10', page: 73, text: '為了交出能即時量化的成效，預算不斷流向短期、點擊與轉換' }] },
          },
          {
            zh: '廣告效果進入高原期／停滯', en: 'Advertising playback plateaus',
            detail: { text: '報表上的效率年年進步，品牌市調的知名度與指名度卻遇到瓶頸。', src: [{ article: 'a10', page: 73, text: '知名度遇到瓶頸、指名度下滑' }] },
          },
          {
            zh: '依據有缺陷的指標進行優化', en: 'Optimize against faulty metrics',
            detail: { text: '可視率與品牌回想幾乎沒有關係，更能預測回想的是平均觀看秒數。', src: [{ article: 'a10', page: 74, text: '可視率(Viewability) 與品牌回想之間幾乎沒有關係；真正更能預測回想的，是平均觀看秒數' }] },
          },
        ],
        center: '品牌',
        shrinkAt: 4,
        source: '圖：廣告末日循環 The Doom Loop｜資料來源 WARC《The Multiplier Effect》(2025)，引自 徐莉媛〈別買曝光了〉紙本 p.73',
      },
      figures: [{ article: 'a10', page: 73, text: '把預算轉移到「成效型」格式' }],
      beats: [
        {
          text: '為了交出能即時量化的成效，品牌把預算一步步移向短期、點擊與轉換型的格式。',
          src: [{ article: 'a10', page: 73, text: '為了交出能即時量化的成效，預算不斷流向短期、點擊與轉換' }],
        },
        {
          text: '可是無盡的優化，有時反而稀釋了廣告本身的力量，也悄悄磨損了品牌，讓廣告效果進入高原期。',
          src: [
            { article: 'a10', page: 73, text: '無盡的優化，有時反而稀釋了廣告本身的力量，也悄悄磨損了品牌' },
            { article: 'a10', page: 73, text: '廣告效果進入高原期／停滯' },
          ],
        },
        {
          text: '於是品牌再依同一套有缺陷的指標繼續優化，陷入「成效越優化、品牌越萎縮」的 **Doom Loop**。',
          src: [{ article: 'a10', page: 73, text: '陷入成效越優化、品牌越萎縮的惡性循環「The Doom Loop」' }],
        },
        {
          text: '預算沒少、聲量沒小，品牌卻在競品的雜訊裡一點一點變淡。作者因此主張，曝光必須被重新定義。',
          src: [{ article: 'a10', page: 73, text: '預算沒少、聲量沒小，品牌卻在競品的雜訊裡一點一點變淡' }],
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
          {
            label: '注視 5–10 秒', value: 18, display: '+18%', at: 1,
            detail: {
              text: '消費者注視 5–10 秒時，自願觀看相較被迫觀看，品牌回想多出 18%。',
              src: [
                { article: 'a10', page: 77, text: '自願性注意力相較強迫性注意力的品牌回想增幅' },
                { article: 'a10', page: 77, text: '+18%' },
                { article: 'a10', page: 77, text: '注視 5~10 秒' },
              ],
            },
          },
          {
            label: '注視 > 10 秒', value: 79, display: '+79%', highlight: true, at: 2,
            detail: {
              text: '注視超過 10 秒時，自願觀看相較被迫觀看，品牌回想多出 79%；強迫式格式雖把人留在螢幕前，卻常養出「負面注意力」。',
              src: [
                { article: 'a10', page: 77, text: '自願性注意力相較強迫性注意力的品牌回想增幅' },
                { article: 'a10', page: 77, text: '+79%' },
                { article: 'a10', page: 77, text: '注視 > 10 秒' },
                { article: 'a10', page: 77, text: '卻常常養出「負面注意力」' },
              ],
            },
          },
        ],
        source: '資料來源 dentsu Japan International Brands《Introducing the Attention Economy》眼動研究，引自 徐莉媛〈別買曝光了〉紙本 p.77',
      },
      figures: [
        { article: 'a10', page: 77, text: '+18%' },
        { article: 'a10', page: 77, text: '+79%' },
      ],
      beats: [
        {
          text: '日本電通的研究比較了同一則廣告：當注意力是消費者自己選擇給的，品牌回想明顯高於被迫觀看；注視 5–10 秒時，回想多出 **18%**。',
          src: [
            { article: 'a10', page: 77, text: '日本電通的研究曾做過一組對照：同樣一則廣告，當這份注意力是消費者「自己選擇」給的，品牌回想明顯高於被迫觀看' },
            { article: 'a10', page: 77, text: '+18%' },
            { article: 'a10', page: 77, text: '注視 5~10 秒' },
          ],
        },
        {
          text: '注視超過 10 秒，回想的差距拉大到 **79%**。不可略過的影音廣告雖然把人留在螢幕前，他等的卻是 skip 鍵，不是品牌。',
          src: [
            { article: 'a10', page: 77, text: '+79%' },
            { article: 'a10', page: 77, text: '注視 > 10 秒' },
            { article: 'a10', page: 77, text: '例如不可略過的影音廣告，雖然把人留在螢幕前' },
            { article: 'a10', page: 77, text: '他等的是 skip 鍵，不是你的品牌' },
          ],
          quote: { article: 'a10', page: 77, text: '版位可以買，但主動靠近、伸手拿、拍照分享、真的記住，買不到。' },
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
        source: '圖：AI 影響消費者決策下的媒體布局矩陣｜筆者整理製圖，徐莉媛〈別買曝光了〉紙本 p.76｜點任一格看做法',
      },
      figures: [{ article: 'a10', page: 76, text: '把這兩軸交叉，就能幫品牌判斷現在更適合主攻品牌記憶、內容證據，或分眾收割。' }],
      beats: [
        {
          text: '有限的注意力預算該押哪裡？作者用兩個問題判斷：消費者是不是都在問同一個問題，以及產品主張好不好被快速證明。需求分歧又難證明時，要先建立清楚的品牌主敘事。',
          src: [
            { article: 'a10', page: 76, text: '判斷的關鍵有兩個：「消費者問題一致性」與「主張驗證門檻」' },
            { article: 'a10', page: 77, text: '當需求分歧且主張難證明時，品牌需要先建立清楚的主敘事' },
          ],
        },
        {
          text: '需求一致但主張難證明時，就讓廣告負責創造注意、內容負責完成驗證，兩者雙管齊下。',
          src: [{ article: 'a10', page: 76, text: '廣告創造注意◆內容完成驗證' }],
        },
        {
          text: '需求分歧但主張容易證明時，就拆解需求情境，優先攻下高商機的場景，各個擊破。',
          src: [{ article: 'a10', page: 76, text: '拆解需求情境◆優先攻高商機場景' }],
        },
        {
          text: '需求一致、主張又容易證明時，品牌反而應該先讓內容成為 AI、搜尋與社群可以引用的答案。',
          src: [{ article: 'a10', page: 77, text: '品牌反而應該先讓內容成為 AI、搜尋與社群可以引用的答案' }],
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '把媒體做成體驗：四個高注意力的現場',
      intro: {
        text: '最有價值的注意力不只是花錢買到版位，而是透過情境、內容與互動設計出來的；高注意力場域的價值，在專注之上還能疊加信任與參與。',
        src: [
          { article: 'a10', page: 77, text: '「最有價值的注意力」不只是花錢買到版位，而是透過情境、內容與互動被設計出來' },
          { article: 'a10', page: 78, text: '高注意力場域的價值，不只在專注，更在專注之上還能疊加信任與參與' },
        ],
      },
      panels: [
        {
          kicker: '戶外廣告', title: '路人真的會看', figure: { value: '54%', label: '路人至少注視過一次戶外廣告' },
          text: 'dentsu 與 JCDecaux、Ocean Outdoor 的研究發現，54% 的路人至少注視過一次戶外廣告；全動態的數位戶外，比靜態多觸及 20% 的人。',
          src: [
            { article: 'a10', page: 77, text: '54% 的路人至少注視過一次戶外廣告物' },
            { article: 'a10', page: 77, text: '全動態的數位戶外，更比靜態多觸及 20% 的人、視線多停 10%' },
          ],
        },
        {
          kicker: '捷運吊環', title: 'CeraVe 適樂膚', figure: { value: '2.4 萬篇', label: '單日社群討論' },
          text: 'CeraVe 在淡水信義線把上萬份 30ml 潔膚露體驗瓶掛上車廂吊環，乘客抬頭看到、伸手帶走，再自己拍照上傳。',
          src: [
            { article: 'a10', page: 78, text: '把上萬份 30ml 的潔膚露體驗瓶直接掛上車廂吊環' },
            { article: 'a10', page: 78, text: 'CeraVe 適樂膚單日引爆 2.4 萬篇社群討論' },
          ],
        },
        {
          kicker: '捷運通道', title: '外送平台互動優惠牆',
          text: '外送平台把捷運通道的牆面變成互動優惠牆，讓通勤族停下來掃碼領折扣，把單向曝光翻成雙向參與。',
          src: [{ article: 'a10', page: 78, text: '外送平台把捷運通道的牆面變成互動優惠牆，讓通勤族停下來、掃碼領折扣，把單向曝光翻成雙向參與' }],
        },
        {
          kicker: 'Podcast', title: '美妝品牌的伴聽時光',
          text: '美妝品牌走進 Podcast，借主持人與聽眾長年累積的信任，在沒有視覺干擾的伴聽時光裡，好好把話講完。',
          src: [{ article: 'a10', page: 78, text: '美妝品牌走進 Podcast，借主持人與聽眾長年累積的信任' }],
        },
      ],
      source: '整理：策展者｜依據 徐莉媛〈別買曝光了〉紙本 p.77–78',
    },
    {
      kind: 'quote',
      lead: {
        text: '說到底，品牌與其在零碎的注意力裡多撿幾片碎片，不如找到消費者真正專注的那個當下，在對的場景遞上對的邀請。',
        src: [{ article: 'a10', page: 79, text: '品牌不如找到消費者真正專注的那個當下，在對的場景遞上對的邀請' }],
      },
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
