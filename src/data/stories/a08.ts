import type { Story } from '../../lib/story';

// 何華軒〈當注意力成為稀缺資源：娛樂與運動如何累積品牌心智資產？〉紙本 p.58–65
export const story: Story = {
  id: 'a08',
  reviewed: false,
  oneLiner: '品牌可以買到曝光，卻買不到記憶。娛樂與運動創造的共同記憶，才能把注意力變成品牌心智資產。',
  scenes: [
    {
      kind: 'graphic',
      graphic: {
        type: 'hbars',
        label: '平均停留在單一螢幕的時間',
        rows: [
          { label: '2004', value: 150, display: '約 150 秒', at: 1 },
          { label: '現在', value: 47, display: '約 47 秒', highlight: true, at: 2 },
        ],
        big: { from: '150', to: '47', unit: '秒', at: 3 },
        figures: [{ article: 'a08', page: 59, text: '從2004 的約 150 秒下降至約 47 秒' }],
        source: 'Gloria Mark（UC Irvine）研究，引自 何華軒〈當注意力成為稀缺資源〉紙本 p.59',
      },
      steps: [
        { text: '2004 年，人們平均在一個螢幕上停留約 **150 秒**。' },
        { text: '現在只剩下約 **47 秒**，不到原本的三分之一。' },
        {
          text: '但作者提醒，問題不在專注力消失：',
          quote: { article: 'a08', page: 59, text: '消費者並非失去了專注能力，而是對內容的選擇變得更加挑剔。' },
        },
      ],
    },
    {
      kind: 'quote',
      lead: '當情緒價值成為消費決策的核心，Gen Z 選品牌，是在表達自己的價值觀與身份認同。於是：',
      quote: { article: 'a08', page: 60, text: '品牌競爭的核心也正從 Share of Voice（聲量占比）逐漸轉向 Share of Culture（文化占比），誰能夠進入文化討論，誰就更有機會進入消費者心中。' },
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'list',
        title: '粉絲經濟的六個現場：品牌累積共同記憶的六個入口',
        items: [
          { title: '二次元', desc: '2026 台北國際動漫節逾 50.5 萬人次、約 2.5 億元商機', at: 1 },
          { title: '周邊商品', desc: '從「買商品送周邊」變成「為了周邊而買商品」', at: 1 },
          { title: '2.5 次元', desc: '《魔女宅急便》音樂劇、《神隱少女》舞台劇來台', at: 2 },
          { title: '經典 IP', desc: '《憤怒鳥》、《動物方城市3》等經典 IP 重返', at: 2 },
          { title: '短劇', desc: '過去三個月曾看短影音的 Z 世代高達 97%', at: 3 },
          { title: '運動', desc: '棒球從國際賽熱潮走向全年性的運動娛樂', at: 3 },
        ],
        source: '整理：策展者｜依據 何華軒〈當注意力成為稀缺資源〉紙本 p.60–63',
      },
      figures: [
        { article: 'a08', page: 60, text: '2026 年台北國際動漫節吸引超過 50.5 萬人次參與，創造約 2.5 億元商機' },
        { article: 'a08', page: 60, text: '過去是買商品送周邊；如今則是為了周邊而購買商品' },
        { article: 'a08', page: 62, text: '過去三個月曾觀看短影音的 Z 世代高達97%' },
        { article: 'a08', page: 63, text: '台灣棒球已從「國際賽熱潮」逐步發展為「全年性的運動娛樂」' },
      ],
      steps: [
        { text: '文化討論在哪裡發生？作者列出六個現場。先是**二次元**與**周邊商品**：粉絲主動參與擴散與再創造。', quote: { article: 'a08', page: 60, text: '對品牌而言，被納入二創與應援的品牌，才真正進入了這個生態。' } },
        { text: '**2.5 次元**讓粉絲從觀看走進作品世界；**經典 IP** 帶來懷舊與新鮮感兼具的雙重體驗。' },
        { text: '**短劇**是下一個內容戰場；**運動**正在成為最強的娛樂內容，啦啦隊也發展成獨立的娛樂 IP。' },
      ],
    },
    {
      kind: 'quote',
      lead: '所以作者的結論是：',
      quote: { article: 'a08', page: 65, text: '品牌可以購買曝光，卻無法購買記憶' },
    },
  ],
  asksTitle: '帶走這兩句',
  asks: [
    { article: 'a08', page: 65, text: '真正影響消費決策的，不是品牌被看見多少次，而是是否出現在那些值得被記住的重要時刻。' },
    { article: 'a08', page: 61, text: '二次元的下一步，不再只是被觀看，而是被親身參與。' },
  ],
};
