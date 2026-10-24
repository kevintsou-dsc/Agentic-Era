import type { Story } from '../../lib/story';

// 吳宗霖〈重建 SOV：在注意力被 AI 稀釋的時代，如何守住品牌被選擇的關鍵場域〉紙本 p.116–127
export const story: Story = {
  id: 'a13',
  reviewed: false,
  oneLiner: 'AI 投放讓廣告更精準，也讓品牌被選擇的理由更容易被稀釋。SOV 要從聲量占比，升級為選擇場域的占位。',
  scenes: [
    {
      kind: 'quote',
      lead: '吳宗霖點了一則手機磁吸支架的廣告，買了，不合用，又買了第二個。產品其實不錯，但盒子丟掉之後，他想不起品牌叫什麼。報表上這是成功的轉換，品牌卻沒有被記住。',
      quote: { article: 'a13', page: 119, text: '單次銷售是 Sales，能不能把每一次接觸、每一次購買、每一次使用經驗，累積成品牌的記憶、信任、偏好與再購理由，才是 Marketing。' },
    },
    {
      kind: 'quote',
      lead: '問題出在 AI 投放的效率悖論：每個品牌都能精準找到高意圖消費者，高意圖消費者也就成了所有競品共同爭奪的對象。越往 lower funnel 走：',
      quote: { article: 'a13', page: 120, text: '結果可能是 CPA 變漂亮了，但看見品牌訊息的人變少了；轉換率提高了，但品牌能累積的記憶變薄了；短期報表變有效率了，但中長期需求池沒有被擴大。' },
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'layers',
        from: 'Share of Voice',
        to: 'Share of Choice Context',
        layers: [
          { title: 'System Share', desc: '品牌在平台、通路與生活系統中的可見位置', detail: '搜尋結果、電商站內排序、AI 搜尋摘要，也包括門市、貨架與生活動線' },
          { title: 'Consumer & Community Share', desc: '品牌在消費者與社群心中的份額', detail: '不是誰發文最多，而是討論某個需求時，誰會自然被提起' },
          { title: 'Attention & Memory Share', desc: '品牌在注意力與記憶中的份額', detail: '消費者是否在某個情境下會想起品牌' },
        ],
        source: '整理：策展者｜依據 吳宗霖〈重建 SOV〉紙本 p.123–124',
      },
      figures: [
        { article: 'a13', page: 123, text: '品牌在平台、通路 與生活系統中的可見位置' },
        { article: 'a13', page: 123, text: '品牌在消費者與社群心中的份額' },
        { article: 'a13', page: 124, text: '品牌在注意力與記憶中的份額' },
      ],
      steps: [
        { text: '解方是把 SOV 拆成三層。第一層：品牌在平台、通路與生活系統裡，**看不看得到**。' },
        { text: '第二層：討論某個需求時，消費者和社群**會不會自然提起你**。' },
        {
          text: '第三層：在某個生活情境下，消費者**會不會想起你**。',
          quote: { article: 'a13', page: 124, text: '重建 SOV，不只是要看品牌在哪裡曝光，而是要看品牌有沒有在消費者生活中真正重要的時刻，被想起、被理解、被相信。' },
        },
      ],
    },
    {
      kind: 'quote',
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
