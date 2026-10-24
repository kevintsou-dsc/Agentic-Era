import type { Story } from '../../lib/story';

// 吳宗霖、陳炯文〈從金曲獎到甄嬛傳：共同記憶帶來的品牌價值〉紙本 p.80–93
export const story: Story = {
  id: 'a11',
  reviewed: false,
  oneLiner: '內容越多，「大家一起看過」的時刻越少。共同記憶，是讓不同世代重新相遇的入口。',
  scenes: [
    {
      kind: 'graphic',
      graphic: {
        type: 'bars',
        title: '近三屆金曲獎電視平均收視',
        badge: { text: '2026 較前一年 +46%', at: 3 },
        bars: [
          { label: '2024', sub: '第 35 屆', value: 2.78, display: '2.78', at: 1 },
          { label: '2025', sub: '第 36 屆', value: 2.31, display: '2.31', at: 1 },
          { label: '2026', sub: '第 37 屆', value: 3.37, display: '3.37', highlight: true, at: 2 },
        ],
        figures: [
          { article: 'a11', page: 84, text: '2024 年第 35 屆全體平均收視為 2.78' },
          { article: 'a11', page: 84, text: '電視整體平均收視達3.37，相較 2025 年第 36 屆的 2.31' },
          { article: 'a11', page: 84, text: '相對成長約 46%' },
        ],
        source: '資料來源 Nielsen Arianna／dentsu X 分析，引自 吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.84',
      },
      figures: [{ article: 'a11', page: 85, text: '55~64 歲族群的收視成長最為明顯，其次則是 25 ~ 34 歲的年輕族群' }],
      steps: [
        { text: '金曲獎電視平均收視：2024 年 2.78，2025 年掉到 2.31。' },
        { text: '2026 年回升到 **3.37**，成為當日全國收視冠軍。' },
        {
          text: '成長最明顯的是 55–64 歲，其次是 25–34 歲：不只是懷舊，年輕人也一起回來了。作者稱之為「**受眾橋接**」。',
          quote: { article: 'a11', page: 85, text: '先用「我認識」讓人進來，再讓他遇見「我還不認識」。' },
        },
      ],
    },
    {
      kind: 'quote',
      lead: '《甄嬛傳》的春節直播馬拉松示範了另一種力量：**儀式**。劇情早就不是秘密，但大家每年仍然回來。',
      quote: { article: 'a11', page: 86, text: '舊內容沒有增加新集數，但 Community 社群每一年都替它增加新的記憶。' },
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'list',
        title: 'ORANGE RANGE 的 72 個「平成梗」：把記憶設計成參與機制',
        items: [
          { title: '記憶符碼必須夠精準', desc: '扶桑花、改裝車把的腳踏車、教室裡的紙盒奶茶：真正來自某個世代共同生活過的細節' },
          { title: '不要過度美化過去', desc: '刻意不做成漂亮的 Y2K，保留當年的不完美與真實感' },
          { title: '上線後留空間給觀眾', desc: '讓人找梗、補充、回應與再創作，「我記得」變成「原來你也記得」' },
        ],
        source: '整理：策展者｜依據 吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.88–89',
      },
      figures: [
        { article: 'a11', page: 88, text: 'MV 裡的 72 個「平成梗」' },
        { article: 'a11', page: 89, text: '跨媒體累積超過 210 億次曝光，MV 在YouTube 突破 2,000 萬觀看' },
        { article: 'a11', page: 89, text: '第一，記憶符碼 必須夠精準，真正來自某個世代共同生活過的細節；第二，不要過度美化過去，適度保留當年的「不完美」與真實感，反而更容易觸發辨認；第三，內容上線後要讓觀眾有空間找梗、補充、回應與再創作' },
      ],
      steps: [
        { text: '電通日本為 ORANGE RANGE 的新版 MV 設計了 72 個「平成梗」，跨媒體累積超過 **210 億次**曝光。作者從中歸納出三個原則。第一：' },
        { text: '第二：' },
        { text: '第三，上線不是終點。觀眾自發整理出 72 個梗，連製作團隊沒設計的細節都被補了進來。' },
      ],
    },
    {
      kind: 'statement',
      eyebrow: '從 Share of Voice 到 Share of Memory',
      text: '除了問「被看見多少」，<br>也要問「最後留下什麼」',
      lede: '作者強調，Share of Memory 不是要取代 Share of Voice 的新 KPI，而是多一個長期視角（紙本 p.91–92）。',
    },
  ],
  asksTitle: '帶走三個問題',
  asks: [
    { article: 'a11', page: 91, text: '當消費者想到某一個年代、某種情緒、某一個生活場景時，品牌是否會自然出現在那段記憶裡？' },
    { article: 'a11', page: 91, text: '今天正在創造什麼，是十年後仍值得被重新叫回來的？' },
    { article: 'a11', page: 92, text: '下一次大家共同記住一件事時，我的品牌能不能也在裡面？' },
  ],
};
