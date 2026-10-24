import type { Story } from '../../lib/story';

// 吳宗霖〈重建 SOV：在注意力被 AI 稀釋的時代，如何守住品牌被選擇的關鍵場域〉紙本 p.116–127
export const story: Story = {
  id: 'a13',
  status: 'judged',
  oneLiner: 'AI 投放讓廣告更精準，也讓品牌被選擇的理由更容易被稀釋。SOV 要從聲量占比，升級為選擇場域的占位。',
  scenes: [
    {
      kind: 'quote',
      lead: {
        text: '吳宗霖點了一則手機磁吸支架的廣告，買了才發現只能吸附在玻璃上，於是又買了另一個。產品其實不錯用，但盒子丟掉之後，他不太記得那個品牌叫什麼；從成效報表來看，這可能是成功的。',
        src: [
          { article: 'a13', page: 119, text: '我點擊了一個手機磁吸支架的廣告' },
          { article: 'a13', page: 119, text: '才發現那個產品只能吸附在玻璃上，並不符合我原本期待' },
          { article: 'a13', page: 119, text: '後來我又買了另一個' },
          { article: 'a13', page: 119, text: '產品其實不錯用，但盒子丟掉之後，我也不太記得那個品牌叫什麼' },
          { article: 'a13', page: 119, text: '從成效報表來看，這可能是成功的' },
        ],
      },
      quote: { article: 'a13', page: 119, text: '單次銷售是 Sales，能不能把每一次接觸、每一次購買、每一次使用經驗，累積成品牌的記憶、信任、偏好與再購理由，才是 Marketing。' },
    },
    {
      kind: 'quote',
      lead: {
        text: '問題出在 AI 投放的效率悖論：當每個品牌都能更精準地找到高意圖消費者，這群人也就成為所有競品共同爭奪的對象。越往 lower funnel 走，代價越清楚。',
        src: [{ article: 'a13', page: 118, text: '高意圖消費者也就成為所有競品共同爭奪的對象' }],
      },
      quote: { article: 'a13', page: 120, text: '結果可能是 CPA 變漂亮了，但看見品牌訊息的人變少了；轉換率提高了，但品牌能累積的記憶變薄了；短期報表變有效率了，但中長期需求池沒有被擴大。' },
    },
    {
      kind: 'statement',
      eyebrow: '越往 lower funnel，看見品牌的人越少',
      text: '每千次曝光的成本，CPC 常是 CPM 的五到十倍以上',
      lede: {
        text: '買 CPM 買到的是較大的接觸面；買 CPC 買到的是有反應的人。若再以轉換事件優化，換算成曝光成本甚至可能放大到數十倍、百倍以上。',
        src: [
          { article: 'a13', page: 119, text: '常常可能是 CPM 購買的五倍到十倍以上' },
          { article: 'a13', page: 119, text: '甚至可能放大到十倍、數十倍，某些情境下可能到百倍以上' },
        ],
      },
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'layers',
        from: 'Share of Voice',
        to: 'Share of Choice Context',
        layers: [
          {
            title: 'System Share', desc: '品牌在平台、通路與生活系統中的可見位置',
            detail: { text: '消費者不一定會搜尋，但他會經過；不一定會點擊，但他會看到。', src: [{ article: 'a13', page: 123, text: '消費者不一定會搜尋，但他會經過；不一定會點擊，但他會看到' }] },
          },
          {
            title: 'Consumer & Community Share', desc: '品牌在消費者與社群心中的份額',
            detail: { text: '讓第一批使用者願意分享、會員推薦會員，讓社群裡有人願意替品牌說話。', src: [{ article: 'a13', page: 123, text: '讓第一批使用者願意分享，讓會員推薦會員' }] },
          },
          {
            title: 'Attention & Memory Share', desc: '品牌在注意力與記憶中的份額',
            detail: { text: '記憶線索可能是顏色、聲音、代言人、包裝、口號或使用情境。', src: [{ article: 'a13', page: 124, text: '這些線索可能是顏色、聲音、代言人、角色、包裝、口號、使用情境、產品符號' }] },
          },
        ],
        source: '整理：策展者｜依據 吳宗霖〈重建 SOV〉紙本 p.122–124',
      },
      figures: [
        { article: 'a13', page: 123, text: '品牌在平台、通路 與生活系統中的可見位置' },
        { article: 'a13', page: 123, text: '品牌在消費者與社群心中的份額' },
        { article: 'a13', page: 124, text: '品牌在注意力與記憶中的份額' },
      ],
      beats: [
        {
          text: '吳宗霖的解方，是把 SOV 從聲量占比升級為 Share of Choice Context，並拆成三層。第一層，是品牌在平台、通路與生活系統裡看不看得到。',
          src: [
            { article: 'a13', page: 122, text: 'SOV 要從 Share of Voice 升級為 Share of Choice Context' },
            { article: 'a13', page: 126, text: '它不是單純的媒體聲量，而是品牌在系統可見度、社群討論度、注意' },
            { article: 'a13', page: 123, text: '第一個層次是 System Share，也就是品牌在平台生態、通路環境與消費者生活系統中的可見位置' },
          ],
        },
        {
          text: '第二層是消費者與社群：重點不是誰發文最多，而是討論某個需求時，誰會自然成為被提起的選項。',
          src: [{ article: 'a13', page: 123, text: '這裡的 SOV，不是誰發文最多，而是誰能在消費者討論某個需求時，自然成為被提起的選項' }],
        },
        {
          text: '第三層是注意力與記憶：消費者在某個生活情境下，會不會想起這個品牌。',
          src: [{ article: 'a13', page: 124, text: '而是「消費者是否在某個情境下會想起品牌」' }],
          quote: { article: 'a13', page: 124, text: '重建 SOV，不只是要看品牌在哪裡曝光，而是要看品牌有沒有在消費者生活中真正重要的時刻，被想起、被理解、被相信。' },
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '所以品牌不必在 full funnel 的每一層都做滿，而是先選出最值得進攻的主場域，再讓其他場域分工：有的放大聲量，有的提供信任，有的承接需求與轉換。',
        src: [
          { article: 'a13', page: 126, text: '因此，品牌應該先選出主要進攻場域，再規劃其他媒體如何輔助' },
          { article: 'a13', page: 126, text: '一個場域負責建立主要心智，一個場域負責放大聲量，一個場域負責提供信任，一個場域負責承接需求，一個場域負責轉換與再行銷' },
        ],
      },
      quote: { article: 'a13', page: 127, text: '真正稀缺的不是曝光，而是消費者在眾多選項中，仍然願意把某一個品牌放在心上的理由。' },
    },
  ],
  asksTitle: '規劃前，先回答這四個問題',
  asks: [
    { article: 'a13', page: 125, text: '這個品類的消費者在哪些場域形成偏好？' },
    { article: 'a13', page: 125, text: '這個品牌最容易被哪一種競品干擾？' },
    { article: 'a13', page: 125, text: '品牌要在哪一個心理階段或生活情境先建立優勢？' },
    { article: 'a13', page: 125, text: '這次投放能否累積成品牌資產？' },
  ],
};
