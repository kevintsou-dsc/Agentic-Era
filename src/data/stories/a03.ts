import type { Story } from '../../lib/story';

// 周麗君〈真實的力量，重新定義中〉紙本 p.20–27
// 原刊圖片：圖1 彩虹雲、圖2 Prada、圖3 樂高、圖4 Coinbase、圖5 The RealReal、圖6 南山人壽、圖7 Speak（全部使用）
export const story: Story = {
  id: 'a03',
  status: 'judged',
  oneLiner: '在 AI 真假難辨的時代，品牌要用真實感、人性與情感認同，重建別人複製不了的信任。',
  scenes: [
    {
      kind: 'hscroll',
      title: '當真實，越來越不真實',
      intro: {
        text: '我們活在一個真實越來越不真實的時代：奇蹟發生了沒人相信，教宗打電話來被當成詐騙，五十人的心血，第一個反應是「AI 做的吧」。',
        src: [
          { article: 'a03', page: 22, text: '我們活在一個，真實越來越不真實的時代' },
          { article: 'a03', page: 22, text: '奇蹟發生了，沒有人相信。教宗打電話來，對方以為是詐騙。五十人的心血，第一個反應是「AI 做的吧」' },
        ],
      },
      panels: [
        {
          kicker: '2026 年 5 月｜印尼', title: '沒人相信的彩虹雲',
          image: { src: '/fig/a03/p21-1.webp', alt: '印尼茂物縣上空的彩虹雲照片', w: 901, h: 669 },
          text: '西爪哇省茂物縣上空出現一片油畫般的彩虹雲，照片刷爆全球社群，留言卻不是讚嘆而是質疑。即使氣象單位出面證明它真實存在，許多人依然不信。',
          src: [
            { article: 'a03', page: 21, text: '2026 年 5 月 1 日，印尼西爪哇省茂物縣的上空，出現了一片彩虹雲' },
            { article: 'a03', page: 21, text: '但底下的留言，不是讚嘆，是質疑' },
            { article: 'a03', page: 21, text: '證明那片雲真實存在。許多人，依然不信' },
          ],
          more: {
            title: '台灣網友也一起質疑',
            image: { src: '/fig/a03/p21-2.webp', alt: 'Threads 上台灣網友質疑彩虹雲是 AI 生成的討論串', w: 710, h: 767, caption: '彩虹雲照片傳到 Threads 後，台灣網友也異口同聲質疑是 AI 繪製', credit: '資料來源：sipa5402 tiktok、threads' },
            links: [
              { url: 'https://www.tiktok.com/@sipa5402', label: '原始 TikTok', kind: 'social' },
              { url: 'https://www.threads.com/@bank2207/post/DYCPx8liZAI/', label: 'Threads 討論串', kind: 'social' },
            ],
          },
        },
        {
          kicker: '同一時期', title: '被掛電話的教宗',
          image: { src: '/fig/a03/pope-call.svg', alt: '策展插畫：一支微微傾斜、正在撥出的手機，旁邊一個問號', w: 846, h: 341 },
          text: '教宗良十四世致電美國一家銀行想更改通訊地址，客服聽了幾句，認定是詐騙電話就掛了。在 AI 可以完美複製人聲的時代，你無法相信親耳聽見的。',
          src: [
            { article: 'a03', page: 21, text: '現任教宗良十四世致電美國一家銀行，想更改通訊地址' },
            { article: 'a03', page: 21, text: '在這個 AI 可以完美複製人聲的時代，你無法相信你親耳聽見的' },
          ],
        },
        {
          kicker: 'Prada 2026 春夏', title: '「這是 AI slop 吧？」',
          image: { src: '/fig/a03/p22-3.webp', alt: 'Prada 2026 春夏形象廣告：模特兒與巨大紅色羽毛生物', w: 566, h: 341 },
          text: '巨大的獵奇生物挑戰視覺極限，留言卻問是不是 AI 做的。Prada 只好澄清：近五十人團隊實景拍攝、藝術家手繪設計、二十多人的 CGI 團隊後製。',
          src: [
            { article: 'a03', page: 21, text: '底下留言卻是：「這是 AI slop 吧？」' },
            { article: 'a03', page: 21, text: '近五十人的團隊在攝影棚實景拍攝，藝術家 Jordan Wolfson 手繪設計，特效由二十多人的 CGI 團隊後製完成' },
          ],
          more: {
            title: '案例：Prada × Jordan Wolfson',
            image: { src: '/fig/a03/p22-2.webp', alt: 'Prada 2026 春夏形象廣告中明星與人偶合影', w: 765, h: 526, caption: '大明星們與看似荒謬的人偶合影，實際上是背後 50 人團隊精心雕琢的成果', credit: '資料來源：Prada YouTube 頻道' },
            quote: { article: 'a03', page: 21, text: '對於講究工藝與時間價值的精品受眾，這是最難忍受的一種背叛。' },
            links: [{ url: 'https://www.youtube.com/watch?v=SCgrRfaZbfQ', label: 'Prada 形象廣告', kind: 'video' }],
          },
        },
        {
          kicker: '樂高世界盃廣告', title: 'This video is not AI.',
          image: { src: '/fig/a03/p22-1.webp', alt: '樂高 Instagram：四位足球巨星同桌拼樂高世界盃，留言寫 This has to be AI', w: 1166, h: 834 },
          text: '四大足壇巨星同框玩樂高，夢幻到官方必須特別聲明：這支影片不是 AI。',
          src: [{ article: 'a03', page: 22, text: '樂高的世界盃廣告，四大足壇巨星同框出現，夢幻到官方必須特別聲明：This video is not AI.' }],
          more: {
            title: '留言：This has to be AI',
            links: [{ url: 'https://www.instagram.com/p/DWoDIAVDyUP/', label: '樂高 Instagram 貼文', kind: 'social' }],
          },
        },
      ],
      source: '整理：策展者｜依據 周麗君〈真實的力量〉紙本 p.21–22',
    },
    {
      kind: 'statement',
      eyebrow: '品牌最核心的生存命題',
      text: '愈容易複製的東西，價值就愈低',
      lede: {
        text: '這不只是審美或傳播問題，而是品牌接下來最核心的生存命題：在一個真假難辨的世界裡，品牌要如何讓人願意相信？',
        src: [
          { article: 'a03', page: 22, text: '這不只是審美問題，不只是傳播問題。這是品牌接下來最核心的生存命題' },
          { article: 'a03', page: 22, text: '在一個真假難辨的世界裡，品牌，要如何讓人願意相信？' },
        ],
      },
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        title: 'AI 比任何人都更會理性分析：這些優勢將被削平',
        items: [
          { title: '資訊落差', at: 1 },
          { title: '媒體優勢', at: 1 },
          { title: '流量購買', at: 1 },
          { title: 'SEO', at: 1 },
          { title: '功能比較', at: 1 },
          { title: '精準投放', at: 1 },
        ],
        source: '依據 周麗君〈真實的力量〉紙本 p.23',
      },
      src: [{ article: 'a03', page: 23, text: '資訊落差、媒體優勢、流量購買、SEO、功能比較、精準投放' }],
      beats: [
        {
          text: 'AI Agent 的本質是最佳化：找最低價格、最高效率、最短路徑。品牌過去依賴的資訊落差、媒體優勢、流量購買、SEO、功能比較與精準投放，都會被快速削平。',
          src: [
            { article: 'a03', page: 23, text: 'AI Agent 的本質，是最佳化。它會找最低價格、找最高效率、找最短路徑、找最佳組合' },
            { article: 'a03', page: 23, text: '品牌過去依賴的許多優勢，將快速被削平——資訊落差、媒體優勢、流量購買、SEO、功能比較、精準投放' },
          ],
        },
        {
          text: '未來多數產品，都可能被 AI 歸納成「功能接近、價格接近、體驗接近」。世界會越來越有效率，也越來越無聊，不被最佳化的創意趨勢因此悄悄成形。',
          src: [
            { article: 'a03', page: 23, text: '未來，多數產品都可能被 AI 自動歸納成：「功能接近、價格接近、體驗接近。」' },
            { article: 'a03', page: 23, text: '這代表世界會越來越有效率，也越來越無聊。因此，不被最佳化的創意趨勢，正在悄悄成形' },
          ],
        },
      ],
    },
    {
      kind: 'prose',
      eyebrow: '越 AI 的世界',
      heading: '人越渴望「真實」',
      beats: [
        {
          text: 'Coca-Cola 用 AI 生成整支聖誕影片，引爆爭議。人們反對的不只是 AI，而是「沒有靈魂的生成感」，尤其在特別需要溫度與情感的歡聚時刻。',
          src: [
            { article: 'a03', page: 23, text: 'Coca-Cola AI 用 AI 生成整支聖誕影片，引爆爭議' },
            { article: 'a03', page: 23, text: '人們反對的，從來不只是 AI，而是「沒有靈魂的生成感。」' },
          ],
        },
        {
          text: '當世界充滿 AI 圖像、聲音、文案與情緒，人會越來越敏感：什麼是真的、什麼是假的？品牌未來最珍貴的資產，可能不是完美，而是真實感。',
          src: [
            { article: 'a03', page: 23, text: '人會越來越敏感並且抗拒：什麼是真的？什麼是假的？' },
            { article: 'a03', page: 24, text: '品牌未來最珍貴的資產，可能不是「完美」。而是真實感' },
          ],
          quote: { article: 'a03', page: 24, text: '不完美、人性、缺陷、溫度、偶然、脆弱 ……那才是人類存在過的證據。' },
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'left',
      graphic: {
        type: 'images',
        images: [
          { src: '/fig/a03/p23-1.webp', alt: 'Coinbase 形象廣告：演員戴印刷頭套扮演扁平的 NPC', w: 1211, h: 654, caption: '看似 AI 生成的奇異世界，細看會發現由大量臨時演員打造一個不完美的遊戲世界', credit: '資料來源：Coinbase YouTube 頻道', at: 1, links: [{ url: 'https://www.youtube.com/watch?v=qxMtu6jQa5k', label: 'Coinbase 廣告', kind: 'video' }] },
          { src: '/fig/a03/p24-1.webp', alt: 'The RealReal 廣告《The Last Real Man》：AI 生成的男性角色', w: 734, h: 514, caption: 'The RealReal 用 AI 生成大量場景，凸顯最後一幕出現的那個最珍貴的實品', credit: '資料來源：The RealReal YouTube 頻道', at: 2, links: [{ url: 'https://www.youtube.com/watch?v=m0PudxvAU5c', label: 'The RealReal 廣告', kind: 'video' }] },
          { src: '/fig/a03/p24-2.webp', alt: 'The RealReal 廣告結尾：崩塌的畫面中只剩一只認證皮革包', w: 738, h: 508, caption: '虛假世界崩塌後，唯一留下來的是經過平台認證的真實皮革包', credit: '資料來源：The RealReal YouTube 頻道', at: 3 },
        ],
        source: '圖4 Coinbase、圖5 The RealReal｜周麗君〈真實的力量〉紙本 p.23–24',
      },
      beats: [
        {
          text: 'Coinbase 的形象廣告讓演員戴上印刷頭套、穿上 2D 紋理服裝，刻意呈現「真人在演 NPC」的荒誕感。不是為了省錢，而是想讓你知道：這是人做的，瑕疵是他們選擇的語言。',
          src: [
            { article: 'a03', page: 23, text: '演員戴上印刷頭套，穿上 2D 紋理服裝' },
            { article: 'a03', page: 23, text: '刻意呈現「真人在演 NPC」的荒誕感。不是因為省錢，是因為他們想讓你知道：這是人做的' },
            { article: 'a03', page: 23, text: '瑕疵，是他們選擇的語言' },
          ],
        },
        {
          text: '二手奢侈品平台 The RealReal 則用 AI 拍了一支《The Last Real Man》：AI 生成的男性角色竭力說服你他是真的，但畫面開始抖動、錯位、崩壞，虛假世界轟然瓦解。',
          src: [
            { article: 'a03', page: 24, text: '二手奢侈品平台 The RealReal 用 AI 拍了一支廣告《The Last Real Man》' },
            { article: 'a03', page: 24, text: '畫面開始抖動、錯位、崩壞，故障一波接一波蔓延' },
          ],
        },
        {
          text: '唯一撐過崩塌、依然在場的，是一只經過平台認證的真實皮革包。用 AI 製造的廣告，證明 AI 無法偽裝成真實，把時代的矛盾變成最強的論點。',
          src: [
            { article: 'a03', page: 24, text: '唯一撐過那場崩塌、依然在場的，是一只經過平台認證過的真實皮革包' },
            { article: 'a03', page: 24, text: '用 AI 的崩潰，證明 AI 無法偽裝成真實' },
            { article: 'a03', page: 24, text: '然後把那個時代的矛盾，變成最強的論點' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '人會因為回憶買東西、因為價值觀選品牌、因為被理解而信任。人類真正的決策，很多時候不是「哪個最好」，而是「哪個最像我」。品牌真正販售的，是身份認同與情感投射。',
        src: [
          { article: 'a03', page: 24, text: '人會因為回憶買東西，因為價值觀選品牌，因為情緒產生偏好，因為被理解而信任' },
          { article: 'a03', page: 24, text: '人類真正的決策，很多時候不是：「哪個最好？」而是「哪個最像我？」' },
          { article: 'a03', page: 24, text: '品牌真正販售的，從來不只是產品，而是身份認同、情感投射、生活信仰、存在感' },
        ],
      },
      quote: { article: 'a03', page: 24, text: 'AI 很擅長模仿、重組、預測、最佳化，但它缺少一件最重要的東西：「真正活過的生命經驗」。' },
    },
    {
      kind: 'bignum',
      value: 20,
      unit: '%',
      caption: {
        text: '台灣在 2025 年正式進入超熟齡時代：每五個人裡就有一個 65 歲以上。南山人壽「百歲人生」專案不說勵志故事、不美化高齡想像，只是帶你走進日常。',
        src: [
          { article: 'a03', page: 25, text: '台灣，在 2025 年已正式進入超熟齡時代' },
          { article: 'a03', page: 25, text: '此刻台灣，每五個人裡就有一個 65 歲以上' },
          { article: 'a03', page: 25, text: '不說勵志故事，不美化高齡想像。只是帶你走進日常' },
        ],
      },
      figure: { article: 'a03', page: 25, text: '每五個人裡就有一個 65 歲以上' },
      people: { total: 5, filled: 1, label: '位台灣人是 65 歲以上', icon: 'elder' },
      source: '周麗君〈真實的力量〉紙本 p.25（原文：每五個人裡就有一個 65 歲以上）',
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'images',
        images: [
          { src: '/fig/a03/p25-1.webp', alt: '南山人壽「百歲人生」廣告畫面：高齡者的日常', w: 1213, h: 569, caption: '南山人壽面對超熟齡台灣社會，選擇透過廣告捕捉大家都應該要正視的日常', credit: '資料來源：南山人壽廣告影片', at: 1, links: [{ url: 'https://www.youtube.com/watch?v=W8gXaKIbzdo', label: '南山人壽廣告影片', kind: 'video' }] },
          { src: '/fig/a03/p26-1.webp', alt: '語言學習 app Speak 廣告：李洋開口說英文', w: 766, h: 433, caption: 'Speak 從台灣人學英文最痛的洞察出手，直擊觀眾的內心', credit: '資料來源：安索帕', at: 3 },
          { src: '/fig/a03/p26-2.webp', alt: '語言學習 app Speak 廣告：納豆與鳳小岳', w: 748, h: 433, caption: '敢用不完美的語言表達自己，這份勇敢本身就很帥', credit: '資料來源：安索帕', at: 4, links: [{ url: 'https://www.youtube.com/watch?v=xSRdl0LBgBY', label: 'Speak 廣告影片', kind: 'video' }] },
        ],
        source: '圖6 南山人壽、圖7 Speak｜周麗君〈真實的力量〉紙本 p.25–26',
      },
      beats: [
        {
          text: '在習慣用焦慮和恐懼驅動決策的壽險業，南山人壽選擇直面現實：百歲人生不再是奇蹟，而是正在發生，夢想有了更長的跑道，財務也要重新計算。',
          src: [
            { article: 'a03', page: 25, text: '在習慣以焦慮和恐懼驅動決策的壽險業中，南山人壽選擇與台灣社會同行' },
            { article: 'a03', page: 25, text: '百歲人生不再是奇蹟，而是正在發生的現實。這意味著夢想有了更長的跑道，人生的財務要重新計算' },
          ],
        },
        {
          text: '它讓社會正視：老，不只是老人的事。專案從一支廣告延伸出「學老」論壇、健康活動與財經教育，長成一場社會對話。',
          src: [
            { article: 'a03', page: 25, text: '老，不只是老人的事' },
            { article: 'a03', page: 25, text: '專案因此延伸出「學老」論壇、健康活動與財經教育，從一支廣告，長成一場社會對話' },
          ],
        },
        {
          text: '語言學習 app Speak 也從人性出發：台灣人不敢講英文，不是能力問題而是信心問題。廣告邀請奧運金牌李洋在鏡頭前說出不完美的英文，傳達「講英文，要先不怕講爛」。',
          src: [
            { article: 'a03', page: 26, text: '台灣人不敢講英文，從來不是能力問題，而是信心問題' },
            { article: 'a03', page: 26, text: '邀請奧運金牌李洋在鏡頭前說出不完美的英文，傳達「講英文，要先不怕講爛」的精神' },
          ],
        },
        {
          text: '納豆與鳳小岳則讓人看見：敢用不完美的語言表達自己，這份勇敢本身就很帥。用真實的勇敢瓦解集體的完美主義，正是演算法無法最佳化的創意核心。',
          src: [
            { article: 'a03', page: 26, text: '當一個人敢用不完美的語言表達自己，這份勇敢，本身就是一件很帥的事' },
            { article: 'a03', page: 26, text: '我們用真實的勇敢，瓦解了社會集體的完美主義' },
            { article: 'a03', page: 26, text: '是 AI 的演算法永遠無法最佳化的創意核心' },
          ],
        },
      ],
      src: [{ article: 'a03', page: 25, text: '創意的力量，從不來自「正確」，而來自「真實」' }],
    },
    {
      kind: 'statement',
      eyebrow: '創意正從「傳播包裝」變成「情感架構」',
      text: '不只是爭奪目光（Attention），而是建立依戀（Affection）',
      lede: {
        text: '當技術拉平了產品優勢，品牌最後競爭的只剩下誰更能創造情感偏好。創意不再只是讓人看見，而是讓人願意靠近；不只留下印象，而是刻下情感印記。',
        src: [
          { article: 'a03', page: 25, text: '因為當技術拉平了產品優勢，品牌最後競爭的，只剩下：誰更能創造情感偏好' },
          { article: 'a03', page: 26, text: '創意不再只是讓人看見。而是讓人願意靠近' },
          { article: 'a03', page: 26, text: '不只是留下印象 (Impression)，而是刻下情感印記 (Emotional Impression)' },
        ],
      },
    },
    {
      kind: 'quote',
      lead: {
        text: '真正強大的品牌，讓人願意拋開理性：Nike 販售的是無畏，Apple 挑戰的是常規，Patagonia 守護的是地球。這種偏好，演算法算不出來；長期的增長，來自信任的累積。',
        src: [
          { article: 'a03', page: 26, text: '真正強大的品牌，擁有讓人願意拋開理性的魔力' },
          { article: 'a03', page: 26, text: '因為 Nike 販售的是無畏，Apple 挑戰的是常規，Patagonia 守護的是地球' },
          { article: 'a03', page: 26, text: '長期的增長，來自「信任」的累積' },
        ],
      },
      quote: { article: 'a03', page: 26, text: '真正的 AI for Growth，不是幫品牌自動化，而是幫品牌更像一個「人」。' },
    },
    {
      kind: 'quote',
      lead: {
        text: '真正的轉型不看用了多少新工具，而在有沒有勇氣從最基礎的打底做起：清理數據、重新定義工作流程、調整團隊的協作基因，再把最珍貴的人性智慧注入其中。',
        src: [
          { article: 'a03', page: 27, text: '真正的轉型，從不看你用了多少新工具，而在於你有沒有勇氣從最基礎的打底做起' },
          { article: 'a03', page: 27, text: '清理繁雜的數據，重新盤點並定義工作流程，調整團隊的協作基因' },
          { article: 'a03', page: 27, text: '再將最珍貴的人性智慧注入其中' },
        ],
      },
      quote: { article: 'a03', page: 27, text: '科技給了我們計算的速度，但唯有人類，能賦予它前行的溫度。' },
    },
  ],
  asksTitle: '帶走一個問題',
  asks: [
    { article: 'a03', page: 22, text: '在一個真假難辨的世界裡，品牌，要如何讓人願意相信？' },
  ],
};
