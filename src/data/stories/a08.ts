import type { Story } from '../../lib/story';

// 何華軒〈當注意力成為稀缺資源：娛樂與運動如何累積品牌心智資產？〉紙本 p.58–65
export const story: Story = {
  id: 'a08',
  status: 'judged',
  oneLiner: '品牌可以買到曝光，卻買不到記憶。娛樂與運動創造的共同記憶，才能把注意力變成品牌心智資產。',
  scenes: [
    {
      kind: 'graphic',
      graphic: {
        type: 'hbars',
        label: '平均停留在單一螢幕的時間',
        rows: [
          {
            label: '2004', value: 150, display: '約 150 秒', at: 1,
            detail: {
              text: 'Gloria Mark 是 UC Irvine 資訊學系榮譽教授，長期研究人類與數位科技的互動；2004 年的平均停留時間約 150 秒。',
              src: [
                { article: 'a08', page: 59, text: '資訊學系榮譽教授' },
                { article: 'a08', page: 59, text: '平均停留在單一螢幕上的時間已從2004 的約 150 秒下降至約 47 秒' },
              ],
            },
          },
          {
            label: '現在', value: 47, display: '約 47 秒', highlight: true, at: 2,
            detail: { text: '人們在數位環境中的注意力切換越來越快，平均停留時間降到約 47 秒。', src: [{ article: 'a08', page: 59, text: '她指出人們在數位環境中的注意力切換速度越來越快' }] },
          },
        ],
        big: { from: '150', to: '47', unit: '秒', at: 3 },
        source: 'Gloria Mark（UC Irvine）研究，引自 何華軒〈當注意力成為稀缺資源〉紙本 p.59',
      },
      figures: [{ article: 'a08', page: 59, text: '從2004 的約 150 秒下降至約 47 秒' }],
      beats: [
        {
          text: 'UC Irvine 的 Gloria Mark 長期研究人與數位科技的互動，她發現 2004 年人們平均在單一螢幕上停留約 150 秒。',
          src: [{ article: 'a08', page: 59, text: '平均停留在單一螢幕上的時間已從2004 的約 150 秒下降至約 47 秒' }],
        },
        {
          text: '到了現在，這個時間只剩約 47 秒，不到原本的三分之一；每天都有大量內容在爭奪我們有限的注意力。',
          src: [{ article: 'a08', page: 59, text: '每天都有大量內容，在爭奪我們有限的時間與注意力' }],
        },
        {
          text: '但何華軒提醒，消費者並沒有失去專注能力，只是更挑剔：願意為有共鳴的內容停留，也會毫不猶豫滑過無感的訊息。',
          src: [{ article: 'a08', page: 59, text: '他們願意為真正有興趣、會產生共鳴或有價值的內容停留，也會毫不猶豫地滑過無感的訊息' }],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '當情緒價值成為消費決策的核心，Gen Z 選擇品牌，是在表達自己的價值觀、興趣圈層與身份認同。品牌競爭的重心因此跟著移動。',
        src: [{ article: 'a08', page: 60, text: '而是透過品牌表達自己的價值觀、興趣圈層與身份認同' }],
      },
      quote: { article: 'a08', page: 60, text: '品牌競爭的核心也正從 Share of Voice（聲量占比）逐漸轉向 Share of Culture（文化占比），誰能夠進入文化討論，誰就更有機會進入消費者心中。' },
    },
    {
      kind: 'hscroll',
      title: '粉絲經濟的六個現場',
      intro: {
        text: '文化討論在哪裡發生？作者列出六個現場，它們是文化占比被重新分配的第一線，也是品牌累積共同記憶的入口。',
        src: [{ article: 'a08', page: 60, text: '以下六個現場是文化占比被重新分配的第一線，也是品牌累積共同記憶的六個入口' }],
      },
      panels: [
        {
          kicker: '現場 1', title: '二次元', figure: { value: '50.5 萬人次', label: '2026 台北國際動漫節' },
          text: '2026 年台北國際動漫節吸引超過 50.5 萬人次、創造約 2.5 億元商機；被納入二創與應援的品牌，才真正進入這個生態。',
          src: [
            { article: 'a08', page: 60, text: '2026 年台北國際動漫節吸引超過 50.5 萬人次參與，創造約 2.5 億元商機' },
            { article: 'a08', page: 60, text: '被納入二創與應援的品牌，才真正進入了這個生態' },
          ],
        },
        {
          kicker: '現場 2', title: '周邊商品',
          text: '周邊商品已成為泛娛樂粉絲最共通的消費語言：過去是買商品送周邊，如今是為了周邊而購買商品。',
          src: [
            { article: 'a08', page: 60, text: '周邊商品正逐漸成為泛娛樂粉絲最共通的消費語言' },
            { article: 'a08', page: 60, text: '過去是買商品送周邊；如今則是為了周邊而購買商品' },
          ],
        },
        {
          kicker: '現場 3', title: '2.5 次元',
          text: '《魔女宅急便》音樂劇首度來台、《神隱少女》舞台劇也將登台；當角色從平面走向真人，粉絲買單的，是一段能夠親身參與的世界觀體驗。',
          src: [
            { article: 'a08', page: 61, text: '日本經典 IP《魔女宅急便》音樂劇首度來台演出' },
            { article: 'a08', page: 61, text: '《神隱少女》舞台劇也將於年底登台' },
            { article: 'a08', page: 61, text: '粉絲買單的，是一段能夠親身參與的世界觀體驗' },
          ],
        },
        {
          kicker: '現場 4', title: '經典 IP',
          text: '《憤怒鳥》宣布回歸、《亂馬½》推出重製版，眾多經典 IP 以不同形式重返大眾視野，帶來懷舊情懷與新鮮感兼具的雙重體驗。',
          src: [
            { article: 'a08', page: 61, text: '眾多經典 IP 以不同形式重返大眾視野，為消費者帶來懷舊情懷與新鮮感兼具的雙重體驗' },
            { article: 'a08', page: 61, text: '《憤怒鳥》3 正式宣布回歸' },
            { article: 'a08', page: 62, text: '《亂馬½》推出重製版' },
          ],
        },
        {
          kicker: '現場 5', title: '短劇', figure: { value: '97%', label: 'Z 世代三個月內看過短影音' },
          text: '短影音完成用戶教育之後，市場轉向更完整的故事與長期的 IP 價值，短劇正快速成為下一個內容競爭的新戰場。',
          src: [
            { article: 'a08', page: 62, text: '過去三個月曾觀看短影音的 Z 世代高達97%' },
            { article: 'a08', page: 62, text: '短劇正快速成為下一個內容競爭的新戰場' },
          ],
        },
        {
          kicker: '現場 6', title: '運動',
          text: '台灣棒球已從國際賽熱潮發展為全年性的運動娛樂，啦啦隊也逐漸成為獨立的娛樂 IP 與品牌合作的媒介。',
          src: [
            { article: 'a08', page: 63, text: '台灣棒球已從「國際賽熱潮」逐步發展為「全年性的運動娛樂」' },
            { article: 'a08', page: 63, text: '隨著啦啦隊逐漸發展為獨立的娛樂 IP' },
          ],
        },
      ],
      source: '整理：策展者｜依據 何華軒〈當注意力成為稀缺資源〉紙本 p.60–63',
    },
    {
      kind: 'quote',
      lead: {
        text: '電通娛樂與韓國 The SMC Group 打造原創娛樂 IP《The Inspector Global》，把線上的粉絲熱情轉成線下體驗與可衡量的商業成長。娛樂與運動的價值，正在於把 Attention 轉化為 Memory。',
        src: [
          { article: 'a08', page: 64, text: '將粉絲熱情轉化為可衡量的商業成長' },
          { article: 'a08', page: 65, text: '娛樂與運動之所以重要，正是因為它們能夠將 Attention 轉化為 Memory' },
        ],
      },
      quote: { article: 'a08', page: 65, text: '品牌可以購買曝光，卻無法購買記憶' },
    },
  ],
  asksTitle: '帶走這兩句',
  asks: [
    { article: 'a08', page: 65, text: '真正影響消費決策的，不是品牌被看見多少次，而是是否出現在那些值得被記住的重要時刻。' },
    { article: 'a08', page: 61, text: '二次元的下一步，不再只是被觀看，而是被親身參與。' },
  ],
};
