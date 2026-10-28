import type { Story } from '../../lib/story';

// 吳宗霖、陳炯文〈從金曲獎到甄嬛傳：共同記憶帶來的品牌價值〉紙本 p.80–93
// 原刊圖表：圖1 平成 Retro 世代差異（d3 分組長條）、圖2 近三屆金曲獎收視（長條）、圖3 甄嬛傳聊天室（照片）、
// 圖4–5 ORANGE RANGE（照片）、圖6 日清、圖7 芬達、圖8 香港麥當勞（照片）、p.91 行動表（清單）
export const story: Story = {
  id: 'a11',
  status: 'judged',
  oneLiner: '內容越多，「大家一起看過」的時刻越少。共同記憶，是讓不同世代重新相遇的入口。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '內容越多，共同記憶越稀缺',
      beats: [
        {
          text: '過去只有幾個電視頻道，同一個世代星期六晚上看什麼、哪句廣告台詞好笑，隔天到學校就發現全班都在模仿，就這樣建立起共同的文化經驗。',
          src: [
            { article: 'a11', page: 81, text: '在只有幾個電視頻道、幾家報紙與有限廣播頻道的年代' },
            { article: 'a11', page: 81, text: '隔天去上學就發現全班在模仿。不知不覺中就建立起一個世代共同的文化經驗' },
          ],
        },
        {
          text: '今天則相反。UGC、創作者經濟與生成式 AI 讓內容近乎無限，演算法又把每個人帶往更個人化的媒體世界：每天看的東西愈來愈多，一起看過的反而愈來愈少。',
          src: [
            { article: 'a11', page: 81, text: 'UGC (使用者生成內容)、Creator Economy (創作者經濟) 與生成式 AI 讓內容生產進入近乎無限的狀態' },
            { article: 'a11', page: 81, text: '每天看的東西愈來愈多，但我們一起看過的東西，反而可能愈來愈少' },
          ],
        },
        {
          text: 'dentsu《2026 Media Trends》把「共同記憶更有感」列為重要趨勢：在演算法時代，人仍會追求共同體驗、歸屬感與社群。',
          src: [{ article: 'a11', page: 81, text: 'dentsu《2026 Media Trends》把「共同記憶更有感」(Shared Memories Hit Different) 列為重要趨勢' }],
          more: {
            title: '品牌要當「記憶工程師」',
            quote: { article: 'a11', page: 81, text: 'Vogue Business 2026 年指出，生成式 AI 讓影像與創意執行變得更容易、更大量，但真正難以快速建立的，反而是可辨識、能信任、記得住與情感共鳴' },
            links: [
              { url: 'https://insight.dentsu.com/2026-media-trends/explore-the-trends', label: 'dentsu 2026 Media Trends', kind: 'report' },
              { url: 'https://www.vogue.com/article/how-brands-can-create-meaning-in-the-age-of-ai', label: 'Vogue Business', kind: 'web' },
            ],
          },
        },
        {
          text: '當品牌能快速產出大量素材，策略重點不能只是再多做一支內容，而要更早回答：哪些顏色、人物、聲音與文化場景，是希望消費者長期記住的？',
          src: [
            { article: 'a11', page: 81, text: '策略重點不能只放在「再多做一支內容」，還要更早回答' },
            { article: 'a11', page: 82, text: '哪些顏色、人物、聲音、角色、產品符號與文化場景，是我們希望消費者長期記住的？' },
          ],
        },
      ],
    },
    {
      kind: 'bignum',
      value: 65,
      unit: '%',
      caption: {
        text: '串流平台 Vevo 的研究發現，65% 的 Z 世代會對自己出生前、或年紀太小記不得的年代產生「借用式懷舊」：我沒有活過那個年代，但我喜歡它代表的感覺。',
        src: [
          { article: 'a11', page: 82, text: '65% 的 Z 世代會對自己出生前、或年紀太小無法真正記得的文化時代產生「借用式懷舊」(Borrowed Nostalgia)' },
          { article: 'a11', page: 82, text: '我沒有活過那個年代，但我喜歡那個年代代表的感覺' },
        ],
      },
      figure: { article: 'a11', page: 82, text: '65% 的 Z 世代' },
      people: { total: 20, filled: 13, label: '位 Z 世代，對沒經歷過的年代懷舊' },
      source: '資料來源 Vevo《Then Is Now》(2026)，吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.82',
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'groups',
          title: '同一個「平成 Retro」，兩個世代感受不同',
          unit: '%',
          groups: [
            {
              name: '整體', sub: '對平成復古的共同印象', at: 1,
              items: [
                { label: '懷舊復古', value: 61.9, extra: '「懷舊復古」對應日文的「懐かしい」，是看到熟悉事物時「好懷念」的感覺。整體受訪者最常這樣形容平成文化，代表它首先被當成一段回憶。' },
                { label: '感性 emo', value: 46.7, extra: '「emo」譯自日文流行語「エモい」，形容難以言喻、帶點感傷又讓人心動的情緒。不一定要親身經歷過，也能對某個畫面或氛圍產生這種感覺。' },
                { label: '沉浸回憶', value: 35.7, extra: '指平成元素會把人拉回當時的生活場景，而不只是覺得「好看」。這類感受最容易延伸成分享與聊天，例如「我以前也有這個」。' },
              ],
            },
            {
              name: '10 多歲', sub: '感性與潮流感', at: 2,
              items: [
                { label: '感性 emo', value: 58.0, extra: '十幾歲的受訪者大多沒真正經歷過平成文化，對他們來說這是一種新鮮、有個性的美感，所以最常用「emo」而不是「懷念」來形容。' },
                { label: '適合拍照打卡', value: 38.9, extra: '對年輕世代而言，復古元素是可以被拍下來、放上社群的視覺素材，例如底片相機質感或舊式手機。重點是「好分享」，不是「好懷念」。' },
                { label: '覺得時髦', value: 33.8, extra: '舊元素在年輕人眼中反而是新的流行，這和 Z 世代的「借用式懷舊」一致：喜歡的是那個年代代表的氛圍，而不是真實的過去。' },
              ],
            },
            {
              name: '30 多歲', sub: '情感與真實體驗', at: 3,
              items: [
                { label: '懷舊復古', value: 72.1, extra: '三十幾歲的受訪者成長於平成時期，對他們來說這些元素連著童年與青春期的真實記憶，所以「懷念」的比例遠高於其他族群。' },
                { label: '沉浸回憶', value: 46.4, extra: '有親身經歷的人，看到電子雞、隨身聽或貼紙機照片，會想起當時的人、地點與事件。品牌若能觸發這種回憶，連結的是一整段生活。' },
                { label: '感性 emo', value: 38.7, extra: '即使是有經歷過的世代，也有近四成覺得平成元素「emo」。這份共同的情緒，正是兩個世代能透過同一段文化產生共鳴的交集。' },
              ],
            },
          ],
        },
        source: '圖：「平成 Retro」對不同世代的意義並不相同｜資料來源 Nihon Information Co., Ltd. (2026)，吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.83',
      },
      src: [{ article: 'a11', page: 83, text: '「平成 Retro」對不同世代的意義並不相同。30 代在懷念，而 10 代則投射自己的 emo 時刻' }],
      figures: [
        { article: 'a11', page: 83, text: '61.9%' }, { article: 'a11', page: 83, text: '46.7%' }, { article: 'a11', page: 83, text: '35.7%' },
        { article: 'a11', page: 83, text: '58.0%' }, { article: 'a11', page: 83, text: '38.9%' }, { article: 'a11', page: 83, text: '33.8%' },
        { article: 'a11', page: 83, text: '72.1%' }, { article: 'a11', page: 83, text: '46.4%' }, { article: 'a11', page: 83, text: '38.7%' },
      ],
      beats: [
        {
          text: '日本市調公司 NI 觀察到，同一份文化記憶可以同時對兩個世代產生不同意義。2026 年針對 13–39 歲女性的調查中，整體有 61.9% 以「懷舊復古」形容對平成復古的印象。',
          src: [
            { article: 'a11', page: 82, text: '同一份文化記憶可以同時對兩個世代產生不同意義' },
            { article: 'a11', page: 82, text: '2026 年針對 13 ~ 39 歲女性的調查顯示' },
            { article: 'a11', page: 83, text: '整體對平成復古的共同印象' },
            { article: 'a11', page: 83, text: '懷舊復古' },
            { article: 'a11', page: 83, text: '61.9%' },
          ],
          more: {
            title: '日本市調：平成 Retro 意識調查', text: '原文引用的日本市調來源：Nihon Information（NI）的平成 Retro 意識調查（日文）。文中 61.9% 以「懷舊復古」形容平成復古的數字出自這份報告。',
            links: [{ url: 'https://www.n-info.co.jp/report/report-0093/', label: 'Nihon Information 調查報告', kind: 'report' }],
          },
        },
        {
          text: '更年輕的族群則把相同元素看成「感性 emo」、新鮮、有個性的東西；調查中的 10 多歲族群，也覺得平成元素適合拍照打卡。',
          src: [
            { article: 'a11', page: 82, text: '更年輕的族群則把相同元素視為「感性 emo」(エモい)、新鮮、有個性' },
            { article: 'a11', page: 83, text: '10多歲｜感性與潮流感' },
            { article: 'a11', page: 83, text: '適合拍照打卡' },
          ],
        },
        {
          text: '真正經歷過平成文化的人感受到的是「懷念」。兩個世代背景不同，卻透過「感性 emo」這份共同的情緒產生共鳴。',
          src: [
            { article: 'a11', page: 82, text: '真正經歷平成文化的人感受到「懷念」(懐かしい)' },
            { article: 'a11', page: 83, text: '背景不同的兩個世代，透過「感性 emo」這一共同情感連結，進而產生共鳴。' },
          ],
        },
        {
          text: '電通日本的調查也發現，67.8% 的人認為童年喜歡的東西長大後仍會喜歡。這些舊元素被重新編輯：貼紙拿來裝飾手機殼，舊玩具變成包包配件。',
          src: [
            { article: 'a11', page: 82, text: '67.8% 受訪者認為童年喜歡的東西即使長大後仍會持續喜歡' },
            { article: 'a11', page: 83, text: '貼紙拿來裝飾手機殼、舊玩具變成包包配件' },
          ],
          quote: { article: 'a11', page: 83, text: '真正有價值的復古，不是把人帶回去，而是讓過去重新參與現在。' },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'list',
        layout: 'one',
        title: '為什麼「我們都記得」特別有力量？三組研究',
        items: [
          {
            title: '懷舊連結過去與現在的自己', desc: 'Sedikides 與 Wildschut：懷舊是高度自我相關的情緒，與社會連結感、意義感有關', at: 1,
            more: {
              title: '懷舊心理學的研究',
              quote: { article: 'a11', page: 83, text: '懷舊是高度自我相關的情緒，會把過去的自己、重要的人與現在重新連接，並與社會連結感、意義感等心理功能有關' },
              links: [{ url: 'https://journals.sagepub.com/doi/abs/10.1037/gpr0000109', label: 'Finding Meaning in Nostalgia', kind: 'report' }],
            },
          },
          {
            title: '集體懷舊拉近群體', desc: 'Wildschut 等：回想「和群體共同經歷的過去」，會提升對群體的正向感受', at: 2,
            more: {
              title: '集體懷舊研究',
              quote: { article: 'a11', page: 83, text: '會提升對群體的正向感受；而這些正向感受，也有助於提高人們接近群體其他成員的意願' },
              links: [{ url: 'https://pubmed.ncbi.nlm.nih.gov/25243415/', label: 'Collective nostalgia', kind: 'report' }],
            },
          },
          {
            title: '同時經歷會放大感受', desc: 'Boothby、Clark 與 Bargh：即使沒有交談，知道彼此同時經歷同一件事，感受就可能被放大', at: 3,
            more: {
              title: '共同經驗會被放大',
              quote: { article: 'a11', page: 83, text: '即使兩個人沒有交談，只要知道彼此正在同時經歷同一件事情，主觀感受就可能被放大' },
              links: [{ url: 'https://pubmed.ncbi.nlm.nih.gov/25274583/', label: 'Shared Experiences Are Amplified', kind: 'report' }],
            },
          },
        ],
        source: '整理：策展者｜依據 吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.83',
      },
      beats: [
        {
          text: '懷舊之所以有力量，不只是因為「以前比較美好」。懷舊會把過去的自己、重要的人與現在重新連接，也和社會連結感、意義感有關。',
          src: [
            { article: 'a11', page: 83, text: '懷舊之所以有力量，並不只是因為「以前比較美好」' },
            { article: 'a11', page: 83, text: '會把過去的自己、重要的人與現在重新連接' },
          ],
        },
        {
          text: '當人們回想的是「我和這個群體共同經歷的過去」，對群體的正向感受會提升，也更願意接近群體裡的其他人。',
          src: [{ article: 'a11', page: 83, text: '當人們回想的是「我和這個群體共同經歷的過去」，而非單純個人記憶時，會提升對群體的正向感受' }],
        },
        {
          text: '所以真正有價值的不是「這看起來很像 2005」，而是有人看到之後會說：「我知道這個」、「你居然也記得」。',
          src: [{ article: 'a11', page: 83, text: '真正有價值的不是「這看起來很像 2005」，而是有人看到之後會說：「我知道這個」、「你居然也記得」' }],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'bars',
        title: '近三屆金曲獎電視平均收視',
        badge: { text: '2026 較前一年 +1.06 收視點（約 +46%）', at: 2 },
        bars: [
          { label: '2024', sub: '第 35 屆', value: 2.78, display: '2.78', at: 1 },
          { label: '2025', sub: '第 36 屆', value: 2.31, display: '2.31', at: 1 },
          {
            label: '2026', sub: '第 37 屆', value: 3.37, display: '3.37', highlight: true, at: 2,
            more: {
              title: '電視之外的共同參與',
              quote: { article: 'a11', page: 84, text: '官方 YouTube 全程直播累積觀看突破 231 萬人次，相關內容總點擊數超過 1,190 萬次，也雙雙創下近年新高' },
              links: [{ url: 'https://www.ttv.com.tw/taiwan/ttvinfo/ttvinfo7711.htm', label: '台視收視新聞稿', kind: 'web' }],
            },
          },
        ],
        source: '圖：近三屆金曲獎全體平均收視｜資料來源 Nielsen Arianna／dentsu X 分析，吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.84',
      },
      src: [{ article: 'a11', page: 84, text: '2026 年第 37 屆金曲獎頒獎典禮的電視整體平均收視達 3.37' }],
      figures: [
        { article: 'a11', page: 84, text: '2.78' }, { article: 'a11', page: 84, text: '2.31' }, { article: 'a11', page: 84, text: '3.37' },
      ],
      beats: [
        {
          text: '音樂市場同樣高度分眾：大家都在聽很多音樂，卻愈來愈不是「同樣的音樂」。2025 年第 36 屆典禮後，出現不少「很多入圍作品沒聽過」的討論，平均收視是 2.31。',
          src: [
            { article: 'a11', page: 84, text: '我們可能都在聽很多音樂，卻愈來愈沒有在聽「同樣的音樂」' },
            { article: 'a11', page: 84, text: '第 36 屆典禮之後，市場上也出現不少「很多入圍者、得獎作品沒有聽過」的討論' },
            { article: 'a11', page: 84, text: '相較 2025 年第 36 屆的 2.31' },
          ],
        },
        {
          text: '2026 年第 37 屆回升到 **3.37**，相對成長約 46%，成為當日全國收視冠軍，也超越前兩屆的平均水準。',
          src: [
            { article: 'a11', page: 84, text: '相對成長約 46%，並成為當日全國收視冠軍' },
            { article: 'a11', page: 84, text: '2026 年不只明顯回升，也超越前兩屆的平均收視水準' },
          ],
        },
        {
          text: '關鍵不是「經典歌手回來了」，而是典禮沒有用過去取代現在，讓不同世代同時站上同一個舞台。這就是「熟悉 × 新鮮」的內容設計。',
          src: [
            { article: 'a11', page: 84, text: '它沒有用「過去」取代「現在」，而是讓不同世代同時存在於同一個舞台上' },
            { article: 'a11', page: 84, text: '這是一種 Familiar 熟悉 × New 新鮮的內容設計' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'hbars',
        label: '2026 金曲獎收視高點',
        rows: [
          { label: '孫淑媚', value: 4.36, display: '4.36', highlight: true, at: 1 },
          {
            label: '田馥甄', value: 4.35, display: '4.35', at: 1,
            more: { title: '跨年代的緬懷橋段', quote: { article: 'a11', page: 85, text: '第二高是田馥甄串聯〈征服〉、〈旋木〉等跨年代作品的緬懷橋段，收視 4.35' } },
          },
          { label: '莫文蔚', value: 3.92, display: '3.92', at: 1 },
          {
            label: '白冰冰', value: 2.52, display: '2.52', at: 1,
            more: { title: '星光大道最高點', quote: { article: 'a11', page: 85, text: '星光大道最高點則出現在睽違 28 年再次入圍的白冰冰，收視 2.52' } },
          },
        ],
        source: '資料來源 Nielsen Arianna／台視公開資料，吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.85。白冰冰為星光大道收視',
      },
      src: [{ article: 'a11', page: 85, text: '這個邏輯也能從 2026 年的收視高點' }],
      figures: [
        { article: 'a11', page: 85, text: '表演最高收視為孫淑媚 4.36' },
        { article: 'a11', page: 85, text: '收視 4.35' },
        { article: 'a11', page: 85, text: '收視 3.92' },
        { article: 'a11', page: 85, text: '收視 2.52' },
      ],
      beats: [
        {
          text: '熟悉感的作用是降低進入陌生內容的門檻：先看到「我認識的人」、「我聽過的歌」，觀眾比較願意留下來，接著遇見新的歌手與作品。',
          src: [
            { article: 'a11', page: 84, text: '降低進入一個陌生內容世界的門檻' },
            { article: 'a11', page: 85, text: '當觀眾先看到「我認識的人」、「我聽過的歌」或「我曾經擁有的記憶」，比較容易願意停留下來' },
          ],
          quote: { article: 'a11', page: 85, text: '先用「我認識」讓人進來，再讓他遇見「我還不認識」。' },
        },
        {
          text: '收視高點也看得到這個邏輯：孫淑媚、田馥甄的跨年代緬懷橋段、睽違十年回來的莫文蔚。共同點不是「夠老」，而是熟悉的人與歌被放進新的舞台與編排。',
          src: [
            { article: 'a11', page: 85, text: '睽違十年重返金曲舞台的莫文蔚' },
            { article: 'a11', page: 85, text: '這些橋段的共同點並不是「夠老」，而是熟悉的人物與歌曲被放進新的舞台、新的編排與新的文化語境中' },
          ],
        },
        {
          text: '受眾輪廓更說明這件事：收視成長最明顯的是 55–64 歲，其次是 25–34 歲。這不像單純的高齡化，更接近「受眾橋接」，把不同圈層的人拉進同一個文化事件。',
          src: [
            { article: 'a11', page: 85, text: '55~64 歲族群的收視成長最為明顯，其次則是 25 ~ 34 歲的年輕族群' },
            { article: 'a11', page: 85, text: '這比較不像單純的受眾高齡化，反而更接近受眾橋接' },
          ],
          quote: { article: 'a11', page: 85, text: '多元性增加之後，Common Ground 反而變得更加重要。' },
        },
      ],
    },
    {
      kind: 'prose',
      eyebrow: '從共同記憶到共同儀式',
      heading: '《甄嬛傳》：大家回來，不是因為不知道結局',
      image: { src: '/fig/a11/p86-1.webp', alt: '《後宮甄嬛傳》YouTube 直播畫面，聊天室中觀眾以各地「代表上香」刷屏', w: 457, h: 992, caption: '2026《甄嬛傳》馬拉松在「皇上駕崩」橋段吸引約 7.2 萬人同時在線，聊天室本身成為共同參與的一部分', credit: '資料來源：八大電視' },
      links: [{ url: 'https://www.gtv.com.tw/mobile/entertainmentNews.php?seqId=461C5D66-F09A-F606-846A-1886921B4172', label: '八大電視新聞稿', kind: 'web' }],
      beats: [
        {
          text: '如果金曲獎代表受眾橋接，《後宮甄嬛傳》的 YouTube 春節馬拉松示範的則是另一種力量：儀式。觀眾早知道皇上何時「駕崩」，但每年仍然回來。',
          src: [
            { article: 'a11', page: 86, text: '如果金曲獎代表的是受眾橋接，《後宮甄嬛傳》的 YouTube 春節馬拉松則示範了另一種力量：Ritual 儀式' },
            { article: 'a11', page: 86, text: '觀眾甚至知道皇上大概什麼時候會「駕崩」，但大家每年仍然回來' },
          ],
        },
        {
          text: '2025 年的 26 天直播累積超過 2,030 萬次觀看；2026 年前十天就達 1,026 萬，平均在線人數從約 1.7 萬增加到約 2.4 萬。',
          src: [
            { article: 'a11', page: 86, text: '2025 年的 26 天直播累積超過 2,030 萬次觀看' },
            { article: 'a11', page: 86, text: '2026 年截至前十天累積觀看已達 1,026 萬' },
            { article: 'a11', page: 86, text: '平均在線人數也由前一年的約 1.7 萬增加至約 2.4 萬' },
          ],
        },
        {
          text: '讓它持續生長的是聊天室：每年的新聞、流行語與迷因，都被重新塞回十多年前的劇情裡。',
          src: [
            { article: 'a11', page: 86, text: '真正讓它持續生長的是聊天室' },
            { article: 'a11', page: 86, text: '都被觀眾重新塞回十多年前的劇情裡' },
          ],
          quote: { article: 'a11', page: 86, text: '舊內容沒有增加新集數，但 Community 社群每一年都替它增加新的記憶。' },
        },
        {
          text: '這也是一般贊助和「記憶型合作」的差別：贊助是品牌出現在內容裡；記憶型合作，是品牌理解社群共同建立的梗、語言與儀式，並成為其中一部分。',
          src: [
            { article: 'a11', page: 86, text: '普通贊助合作是品牌「出現在內容裡」' },
            { article: 'a11', page: 86, text: '是品牌理解社群已經共同建立的梗、語言與儀式，並成為其中一部分' },
          ],
        },
      ],
    },
    {
      kind: 'prose',
      eyebrow: '電通日本案例',
      heading: 'ORANGE RANGE：把世代記憶變成 Community',
      image: { src: '/fig/a11/p87-1.webp', alt: '〈イケナイ太陽 令和ver.〉MV 中畫滿塗鴉的書包與室內鞋', w: 933, h: 1158, caption: '〈イケナイ太陽 令和ver.〉在書包及鞋履上塗鴉，讓平成生活細節做成可被辨認、尋找與分享的記憶符碼', credit: '資料來源：電通報《月刊CX》' },
      links: [
        { url: 'https://dentsu-ho.com/articles/9684', label: '電通報《月刊CX》製作幕後', kind: 'web' },
        { url: 'https://www.oricon.co.jp/news/2414252/photo/1/', label: 'ORICON NEWS MV 幕後照片', kind: 'web' },
      ],
      beats: [
        {
          text: 'ORANGE RANGE 睽違約 15 年回歸 Sony Music，電通日本協助推動品牌重塑。這不是把 2007 年的名曲重拍一次，而是把它重新設計成 2025 年可以再被參與、討論與擴散的文化事件。',
          src: [
            { article: 'a11', page: 87, text: 'ORANGE RANGE 在 2025 年睽違約 15 年回歸 Sony Music' },
            { article: 'a11', page: 87, text: '這不是單純把 2007 年的名曲重新拍一次' },
            { article: 'a11', page: 87, text: '重新設計成 2025 年可以再次被參與、討論與擴散的文化事件' },
          ],
        },
        {
          text: '團隊刻意不做「漂亮的 Y2K」，而是保留一點親切、甚至不精緻的真實感；MV 裡的 72 個「平成梗」，都是扶桑花、改裝車把的腳踏車、教室裡的紙盒奶茶這類生活細節。',
          src: [
            { article: 'a11', page: 88, text: '團隊刻意沒有把平成做成「漂亮的 Y2K」' },
            { article: 'a11', page: 88, text: '也保留一點親切、甚至有點不精緻的真實感' },
            { article: 'a11', page: 88, text: '扶桑花、改裝車把的腳踏車、教室裡喝紙盒奶茶' },
          ],
          more: {
            title: '幕後：太小眾沒人懂、太大眾沒驚喜',
            image: { src: '/fig/a11/p88-1.webp', alt: 'ORANGE RANGE〈イケナイ太陽 令和ver.〉MV 幕後製作畫面', w: 1206, h: 679, caption: '「イケナイ太陽 (令和ver. Music Video)」メイキング映像（ORANGE RANGE 幕後製作畫面）', credit: '圖片來源：ORICON NEWS (2025/10/23)' },
            quote: { article: 'a11', page: 88, text: '導演在題材選擇上刻意抓住「太小眾會沒人懂、太大眾又沒有驚喜」之間的甜蜜點' },
          },
        },
        {
          text: '上線後，觀眾自發尋找、整理這 72 個梗，連偶然入鏡的細節也被補充成新的平成梗。專案登上 X 熱門第一，跨媒體累積超過 210 億次曝光，MV 在 YouTube 突破 2,000 萬觀看。',
          src: [
            { article: 'a11', page: 89, text: '觀眾自發尋找、整理 72 個平成梗' },
            { article: 'a11', page: 89, text: '最終專案登上 X 熱門第一，跨媒體累積超過 210 億次曝光，MV 在 YouTube 突破 2,000 萬觀看' },
          ],
        },
        {
          text: '團隊把留言區形容成 ORANGE RANGE 世代的「同學會」，並得到一個關鍵發現：世代本身，也可以成為一種 Community。',
          src: [
            { article: 'a11', page: 89, text: '把留言區形容成 ORANGE RANGE 世代的「同學會」' },
            { article: 'a11', page: 89, text: '「世代本身也可以成為一種 Community」' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        layout: 'checklist',
        title: '把記憶設計成參與機制：三個做法',
        items: [
          { title: '記憶符碼要夠精準', desc: '真正來自某個世代共同生活過的細節', at: 1 },
          { title: '不要過度美化過去', desc: '保留當年的「不完美」與真實感，更容易觸發辨認', at: 2 },
          { title: '上線後留空間給觀眾', desc: '讓人找梗、補充、回應與再創作，「我記得」變成「原來你也記得」', at: 3 },
        ],
        source: '依據 吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.89',
      },
      src: [{ article: 'a11', page: 89, text: '它不是只把「舊」當作風格，而是把記憶設計成一種參與機制' }],
      beats: [
        {
          text: 'ORANGE RANGE 比一般懷舊行銷更值得學的地方，是把記憶設計成參與機制。第一，記憶符碼必須夠精準，真正來自某個世代共同生活過的細節。',
          src: [
            { article: 'a11', page: 89, text: '它不是只把「舊」當作風格，而是把記憶設計成一種參與機制' },
            { article: 'a11', page: 89, text: '記憶符碼 必須夠精準，真正來自某個世代共同生活過的細節' },
          ],
        },
        {
          text: '第二，不要過度美化過去，適度保留當年的「不完美」與真實感，反而更容易觸發辨認。',
          src: [{ article: 'a11', page: 89, text: '不要過度美化過去，適度保留當年的「不完美」與真實感，反而更容易觸發辨認' }],
        },
        {
          text: '第三，上線後要讓觀眾有空間找梗、補充、回應與再創作。這個過程，就是從記憶、參與，走到社群。',
          src: [
            { article: 'a11', page: 89, text: '內容上線後要讓觀眾有空間找梗、補充、回應與再創作' },
            { article: 'a11', page: 89, text: '就是從 Memory → Participation (參與) → Community' },
          ],
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '不是把過去帶回來，而是把過去帶向現在',
      intro: {
        text: '近年的案例有一個一致的方向：品牌不再只把歷史當成檔案或週年故事，而是把舊有的記憶符碼，重新放進今天的媒體、產品與參與方式裡。',
        src: [{ article: 'a11', page: 87, text: '品牌不再只把歷史當成檔案或週年故事，而是把舊有記憶符碼 (Memory Code) 重新放進今天的媒體、產品與參與方式裡' }],
      },
      panels: [
        {
          kicker: '台灣', title: '台視時光機',
          text: '台視把不同年代的綜藝、戲劇與經典節目帶到 YouTube 與 Facebook，片庫透過留言、短影音切片與社群討論被重新發現：經歷過的人回來找青春，年輕人也第一次走進這些內容。',
          src: [
            { article: 'a11', page: 86, text: '持續把不同年代的綜藝、戲劇與經典節目帶到 YouTube 與 Facebook' },
            { article: 'a11', page: 86, text: '真正經歷過的人可以回來尋找青春' },
          ],
          more: {
            title: '片庫可以變成「記憶型媒體」', text: '經典片庫重新上架後，品牌投放買到的不只是廣告版位，而是一起主辦大家的共同記憶。',
            quote: { article: 'a11', page: 87, text: '品牌此時買的就不只是前貼片廣告 (Pre-roll)、冠名或內容置入，而是在共同主辦一段大家的記憶。' },
            links: [{ url: 'https://www.youtube.com/@TTVClassic', label: '台視時光機 YouTube', kind: 'video' }],
          },
        },
        {
          kicker: '日清', title: 'どん兵衛 50 周年復刻',
          image: { src: '/fig/a11/p89-1.webp', alt: '日清「どん兵衛 Classic」復刻包裝', w: 404, h: 401 },
          text: '日清真的找回約 50 年前的配方資料，重現 1976 年上市時的產品設定。懷舊從行銷溝通走進產品體驗：記憶不只可以被看見，也可以被重新吃一次。',
          src: [
            { article: 'a11', page: 89, text: '重新找到約 50 年前的配方資料，重現 1976 年上市時的產品設定' },
            { article: 'a11', page: 89, text: '記憶不只可以被看見，也可以被重新吃一次' },
          ],
          more: {
            title: '案例：どん兵衛 Classic',
            image: { src: '/fig/a11/p89-3.webp', alt: '日清「どん兵衛 Classic」系列另一款復刻包裝', w: 382, h: 401, caption: '日清「どん兵衛 Classic」以 50 年前配方為基礎，重現 1976 年上市時的味道與包裝記憶', credit: '資料來源：日清食品' },
            links: [{ url: 'https://www.nissin.com/jp/company/news/13685/', label: '日清食品新聞稿', kind: 'web' }],
          },
        },
        {
          kicker: '日本芬達', title: 'ファンタ学園回來了',
          image: { src: '/fig/a11/p89-2.webp', alt: 'Fanta「3年L組 バブル先生」廣告畫面：學生走進校門', w: 929, h: 478 },
          text: '日本芬達把 2000 年代的「ファンタ学園」帶回來，加入網路電影、遊戲、Coke ON 與新的參與機制，產品本身也運用 AI 分析改良，把最舊的記憶與最新的科技放在一起。',
          src: [
            { article: 'a11', page: 89, text: '日本芬達則把 2000 年代的「ファンタ学園」重新帶回來' },
            { article: 'a11', page: 89, text: '同時，產品本身也在 2026 年運用 AI 分析與改良' },
            { article: 'a11', page: 90, text: '而是把最舊的記憶與最新的科技放在一起' },
          ],
          more: {
            title: '案例：3年L組 バブル先生',
            image: { src: '/fig/a11/p89-2.webp', alt: 'Fanta「3年L組 バブル先生」廣告畫面', w: 929, h: 478, caption: 'Fanta「3年L組 バブル先生」把經典「ファンタ学園」重新放進 2026 的產品與數位互動', credit: '資料來源：日本 Coca-Cola' },
            links: [{ url: 'https://www.coca-cola.com/jp/ja/media-center/news-20260413-10', label: '日本 Coca-Cola 新聞稿', kind: 'web' }],
          },
        },
        {
          kicker: '香港麥當勞', title: '重回 1975 年的起點',
          image: { src: '/fig/a11/p90-1.webp', alt: '香港麥當勞 50 周年展覽現場', w: 508, h: 696 },
          text: '香港麥當勞 50 周年重建第一間店舖、制服與城市情境，再延伸成實體週年展；2026 年又讓劉德華與姜濤兩個世代共同演繹新版〈沒有翅膀的天使〉。',
          src: [
            { article: 'a11', page: 90, text: '重建第一間香港麥當勞的店舖、制服、產品與城市情境' },
            { article: 'a11', page: 90, text: '讓劉德華與姜濤兩個世代的代表人物共同演繹新版〈沒有翅膀的天使〉' },
          ],
          more: {
            title: '案例：香港麥當勞 50 周年',
            image: { src: '/fig/a11/p90-1.webp', alt: '香港麥當勞 50 周年展覽現場', w: 508, h: 696, caption: '香港麥當勞 50 周年展把首店、經典角色與商品記憶重新組成消費者可進入、可體驗的品牌歷史', credit: '資料來源：McDonald\'s Hong Kong' },
            quote: { article: 'a11', page: 90, text: '好的懷舊，不是讓上一代再看一次，而是讓下一代也在今天第一次走進來。' },
            links: [{ url: 'https://mcdonalds.com.hk/en/news/the-ultimate-reveal-mcdonalds-hong-kong-celebrates-50th-anniversary-with-back-to-the-beginning-in-1975-microfilms-ten-unmissable-highlights/', label: '香港麥當勞 50 周年企劃', kind: 'web' }],
          },
        },
      ],
      source: '整理：策展者｜依據 吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.86–90',
    },
    {
      kind: 'prose',
      eyebrow: 'AI 時代的品牌記憶策略',
      heading: 'AI 愈能增加變化，品牌愈要管好一致性',
      beats: [
        {
          text: '行銷學者 Jenni Romaniuk 的研究長期強調：顏色、Logo、角色、包裝、聲音與廣告歌，可以透過長期、一致的使用，成為辨認品牌的記憶線索。',
          src: [{ article: 'a11', page: 90, text: '可以透過長期、一致的使用成為辨認品牌的記憶線索' }],
        },
        {
          text: 'McKinsey 2026 年也指出，品牌即使能大量生產因人而異的內容，前提仍是一致性：先把品牌語氣、視覺識別與創意規範制度化，再讓 AI 在範圍內擴大數量與速度。',
          src: [
            { article: 'a11', page: 90, text: '品牌即便能大量生產因人、因情境而異的內容，但前提仍是維持品牌一致性' },
            { article: 'a11', page: 90, text: '再讓 AI 在這個範圍內擴大數量與速度' },
          ],
          quote: { article: 'a11', page: 90, text: 'AI 可以幫品牌增加變化，但品牌必須自己管理一致性。否則累積的是內容曝光，而不是品牌記憶' },
        },
        {
          text: '所以 AI 創意治理不該只管 Logo 有沒有放對，更要管理「記憶架構」：哪些視覺、聲音、人物與敘事必須持續累積，哪些地方才能交給 AI 自由變化。',
          src: [
            { article: 'a11', page: 91, text: 'AI 創意治理不應只管理 Logo 有沒有放對、字體有沒有違反規範，更應該管理「記憶架構」' },
            { article: 'a11', page: 91, text: '哪些地方才可以交給 AI 自由變化' },
          ],
        },
        {
          text: '有歷史的品牌可以先做品牌記憶盤點，找出一出現就讓人說「我記得這個」的東西；沒有悠久歷史的品牌，可以先借用 MSN、無名小站、放學後的便利商店這類共同生活記憶。',
          src: [
            { article: 'a11', page: 91, text: '對有歷史的品牌而言，第一步可以做的是品牌記憶盤點 (Brand Memory Audit)' },
            { article: 'a11', page: 91, text: '對沒有悠久歷史的品牌，則可以先從記憶借用 (Memory Borrowing) 開始' },
            { article: 'a11', page: 91, text: 'MSN、無名小站、第一次拿手機、學生福利社、放學後的便利商店' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'list',
        layout: 'polaroid',
        title: '從記憶符碼到新記憶：五個階段',
        items: [
          { title: '記憶｜大家已經共同記得什麼？', desc: '盤點記憶符碼、獨特品牌資產、經典內容與生活場景', at: 1 },
          { title: '共同時刻｜如何讓記憶重新同時發生？', desc: '直播、節慶、復刻、同步共看、限定體驗、儀式', at: 1 },
          { title: '參與｜如何讓人重新使用這段記憶？', desc: 'UGC、創作者、迷因、找彩蛋、再創作、社群共創', at: 2 },
          { title: '橋接｜如何讓熟悉成為新內容入口？', desc: '用熟悉的人物與作品，帶出新的內容', at: 2 },
          { title: '新記憶｜今天要留下什麼給十年後？', desc: '建立可持續的角色、聲音、視覺、產品符號與文化事件', at: 3 },
        ],
        source: '依據 吳宗霖、陳炯文〈從金曲獎到甄嬛傳〉紙本 p.91 行動表；拍立得造型為策展的視覺比喻',
      },
      src: [{ article: 'a11', page: 91, text: '盤點記憶符碼、獨特品牌資產、經典內容與生活場景' }],
      beats: [
        {
          text: '整套做法可以整理成五個階段。第一步盤點大家已經共同記得什麼，第二步用直播、節慶、復刻或同步共看，讓這段記憶重新同時發生。',
          src: [
            { article: 'a11', page: 91, text: '盤點記憶符碼、獨特品牌資產、經典內容與生活場景' },
            { article: 'a11', page: 91, text: '直播、節慶、復刻、同步共看、限定體驗、儀式' },
          ],
        },
        {
          text: '第三步讓人重新使用這段記憶，例如找彩蛋、再創作與社群共創；第四步讓熟悉的東西，成為通往新內容的入口。',
          src: [
            { article: 'a11', page: 91, text: 'UGC、創作者、迷因、找彩蛋、再創作、社群共創' },
            { article: 'a11', page: 91, text: '如何讓熟悉成為新內容入口？' },
          ],
        },
        {
          text: '最後一步要回答今天要留下什麼給十年後：第一年它也許只是一個 Campaign，第五年可能成為慣例，十年之後才有機會成為集體記憶。',
          src: [{ article: 'a11', page: 91, text: '第一年，它也許只是一個 Campaign；第五年可能成為傳統或慣例；十年之後，才有機會成為集體記憶' }],
        },
      ],
    },
    {
      kind: 'statement',
      eyebrow: '從 Share of Voice 到 Share of Memory',
      text: '除了問「被看見多少」，也要問「最後留下什麼」',
      lede: {
        text: 'Share of Memory 不是要取代 Share of Voice 的單一指標，而是多問一句：消費者想到某個年代、某種情緒或生活場景時，品牌會不會自然出現在那段記憶裡。',
        src: [
          { article: 'a11', page: 91, text: '它不是一個要取代Share of Voice 的單一指標' },
          { article: 'a11', page: 91, text: '當消費者想到某一個年代、某種情緒、某一個生活場景時，品牌是否會自然出現在那段記憶裡？' },
        ],
        more: {
          title: '研究：Sonic 為什麼被記住',
          text: 'Ameritest 與 Research Now 記錄 2009 年 17 個速食品牌的 268 支電視廣告，2017 年再拿出去掉品牌識別的畫面，問消費者還記不記得、能不能說出是哪個品牌。',
          quote: { article: 'a11', page: 92, text: '始終保留「兩個人坐在車內，一邊吃東西、一邊聊天」的核心視覺語彙' },
          links: [{ url: 'https://www.quirks.com/articles/memory-s-role-in-creating-the-future-of-brands', label: 'Quirk\'s：Memory\'s role in creating the future of brands', kind: 'report' }],
        },
      },
    },
    {
      kind: 'quote',
      lead: {
        text: '共同記憶不是要把大家拉回只有一種主流的年代，它真正的價值，是創造一個讓不同的人願意一起進來的入口；品牌最好的懷舊策略，是利用大家共同記得的以前，創造下一件大家都會記得的事。',
        src: [
          { article: 'a11', page: 92, text: '它真正有價值的功能，是創造一個讓不同的人願意一起進來的入口' },
          { article: 'a11', page: 92, text: '利用大家共同記得的以前，創造下一件大家都會記得的事' },
        ],
      },
      quote: { article: 'a11', page: 92, text: '共同記憶真正的價值，不是把所有人帶回過去，而是讓不同世代，在今天重新碰面。' },
    },
  ],
  asksTitle: '帶走兩個問題',
  asks: [
    { article: 'a11', page: 91, text: '今天正在創造什麼，是十年後仍值得被重新叫回來的？' },
    { article: 'a11', page: 92, text: '下一次大家共同記住一件事時，我的品牌能不能也在裡面？' },
  ],
};
