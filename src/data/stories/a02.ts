import type { Story } from '../../lib/story';

// 邵懿文〈Agentic 時代，品牌與人的真實距離〉紙本 p.12–17
// 原刊圖表：p.14 產品思維 vs 用戶思維（清單）、p.16 各部門想知道的問題（表格 → 清單）；
// 文字數據：People Model 吻合度 0.89（大數字）、AI 市場研究規模（長條）
export const story: Story = {
  id: 'a02',
  status: 'judged',
  oneLiner: '品牌離 AI 越近，不一定離人越遠；只要 AI 做的是幫品牌更懂人，距離就是真實的靠近。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '品牌離 AI 越近，會不會反而離人越遠？',
      beats: [
        {
          text: '過去兩年，生成式 AI 改變了工作的方式；今年，Agentic AI 要改變的是企業做決策的方式。AI 正一步步從工具變成代理人，能理解目標、拆解任務、串連資訊，甚至主動把事情做完。',
          src: [
            { article: 'a02', page: 13, text: '過去兩年，生成式 AI 改變了工作的方式。今年，Agentic AI 要改變的，是企業做決策的方式' },
            { article: 'a02', page: 13, text: 'AI 正一步步從工具變成代理人。它能理解目標、拆解任務、串連資訊，甚至主動把事情做完' },
          ],
        },
        {
          text: '企業愈來愈習慣把文案、分析、媒體規劃，甚至部分策略思考交給 AI。一個更值得思考的問題也隨之浮現：品牌離 AI 越來越近，會不會反而離人越來越遠？',
          src: [
            { article: 'a02', page: 13, text: '企業也愈來愈習慣把文案、分析、媒體規劃丟給 AI，連部分策略思考都交出去了' },
            { article: 'a02', page: 13, text: '然而，一個更值得思考的問題也隨之浮現' },
            { article: 'a02', page: 13, text: '當品牌離 AI 越來越近會不會反而離人越來越遠？' },
          ],
        },
        {
          text: '品牌存在的理由，從來不是會做廣告或會用最新科技，而是能理解人、創造價值並建立信任。AI 能在幾分鐘內整理完一份分析，但快，不等於理解。',
          src: [
            { article: 'a02', page: 13, text: '而是因為它能理解人、創造價值，並建立信任' },
            { article: 'a02', page: 13, text: 'AI 能幾分鐘內整理完一份分析，決策速度快了很多。但快，不等於理解' },
          ],
        },
        {
          text: '消費者為什麼選這個、不選那個？新產品到底有沒有人想要？這些答案建立在真實的人與長期累積的洞察上。所以 Agentic 時代比的不是誰用了更多 AI，而是誰更懂人。',
          src: [
            { article: 'a02', page: 13, text: '消費者為什麼選這個，不選那個？一個新產品到底有沒有人想要？' },
            { article: 'a02', page: 13, text: '我們想要的答案是建立在真實的人、真實的資料，以及長期累積的消費者洞察之上' },
            { article: 'a02', page: 13, text: 'Agentic 時代，戰場上比的不是誰用了更多 AI，而取決於誰更懂人' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '社群、電商與會員系統縮短的多半只是接觸的頻率，理解的深度沒有跟上。決策現場真正焦急的不是找不到答案，而是等答案的時間：等報告完成，市場風向可能又變了，對手也可能已經先動手。',
        src: [
          { article: 'a02', page: 13, text: '但這些縮短的，多半只是接觸的頻率，理解的深度往往沒有跟上' },
          { article: 'a02', page: 13, text: '真正焦急的不是找不到答案，而是等答案的那段時間' },
          { article: 'a02', page: 13, text: '等報告完成，市場風向可能又變了，對手也可能已經先動手了' },
        ],
      },
      quote: { article: 'a02', page: 13, text: '今天，這份信心最貴的成本，已經不是研究費，是等待。慢下來，其實就是一種不理解的代價。' },
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'venn',
          title: '兩種視角，靠對話才能疊合',
          left: {
            label: '產品思維', items: ['我有什麼功能？', '給誰聽？', '想說什麼？'],
            extra: '從產品出發是品牌的本能：先有功能與賣點，再找對象、想說法。問題是消費者不是從功能開始想事情，兩邊的起點不同，說法再精準也可能對不上。',
          },
          right: {
            label: '用戶思維', items: ['他們在什麼場景？', '遇到什麼問題？', '我的產品解決哪一個？'],
            extra: '消費者的起點是自己的處境：在什麼情境下卡住、需要什麼才能解決。品牌要先站到這一邊，才知道產品的哪一個功能真正有意義。',
          },
          both: {
            label: '對話', desc: 'People Model 讓這場對話，在品牌做決策之前就先發生',
            extra: '兩種視角不會因為一份調查報告就自動疊合，要靠反覆來回的對話。People Model 讓品牌在做決策前，就能先跟模擬的消費者對話、追問原因。',
          },
          leftAt: 1, rightAt: 2, bothAt: 3,
        },
        source: '圖：產品思維 vs 用戶思維｜邵懿文〈Agentic 時代〉紙本 p.14',
      },
      src: [{ article: 'a02', page: 14, text: '能拉近這兩種視角的，向來只有一件事，對話' }],
      figures: [
        { article: 'a02', page: 14, text: '產品思維' }, { article: 'a02', page: 14, text: '用戶思維' },
        { article: 'a02', page: 14, text: '我有什麼功能' }, { article: 'a02', page: 14, text: '他們在什麼場景' },
        { article: 'a02', page: 14, text: '遇到什麼問題' }, { article: 'a02', page: 14, text: '我的產品解決哪一個' },
      ],
      beats: [
        {
          text: '品牌天生從產品出發思考：這個功能能做什麼、給誰用、賣點該怎麼說。',
          src: [{ article: 'a02', page: 14, text: '品牌天生從產品出發思考，這個功能能做什麼、給誰用、賣點該怎麼說' }],
        },
        {
          text: '但消費者的起點是：我在什麼情境下會遇到這個問題，什麼能真正解決它。這兩種視角，不是一份調查報告就能疊合的。',
          src: [
            { article: 'a02', page: 14, text: '他們的起點是：我在什麼情境下會遇到這個問題、什麼能真正解決它' },
            { article: 'a02', page: 14, text: '這兩種視角，從來不是靠一份調查報告就能疊合的' },
          ],
        },
        {
          text: '過去的市場研究像拍照，記錄某個時間點的想法；AI 讓研究更像一場持續進行的對話。而 People Model，第一次讓這場對話在品牌做決策之前就先發生。',
          src: [
            { article: 'a02', page: 14, text: '它像是拍照，在某個時間點，透過問卷、訪談或焦點團體，記錄消費者當下的想法' },
            { article: 'a02', page: 14, text: '現在 AI 讓研究更像一場持續在進行的對話' },
            { article: 'a02', page: 14, text: '而 People Model 第一次讓這場對話，能在品牌做決策之前，就先發生' },
          ],
          more: {
            title: '從一次性驗證到持續性驗證',
            quote: { article: 'a02', page: 14, text: '品牌可以隨時丟出新的假設：增加 10 種溝通說法，哪一種更容易打動人？如果代言人改變，第一印象會不同嗎？換一個通路，消費者還會不會買？' },
          },
        },
      ],
    },
    {
      kind: 'prose',
      eyebrow: 'Agent 不只替企業工作',
      heading: '更應該替企業理解人',
      beats: [
        {
          text: '過去要回答一個複雜的問題，得先靠人拆解、找部門、調資料、再整合。真正的 Agentic 系統會自己把問題拆成子問題，同時交給消費者調查、市場數據與生活型態資料庫處理，再由負責整合的角色比對、篩選，送回最完整的答案。',
          src: [
            { article: 'a02', page: 15, text: '一套真正的 Agentic 系統會自己把問題拆成幾個子問題，分頭交給對應的資料來源同時處理' },
            { article: 'a02', page: 15, text: '例如同時調動消費者調查、市場數據、生活型態資料庫' },
            { article: 'a02', page: 15, text: '再由一個負責整合的角色比對、篩選， 把最完整的答案送回來' },
          ],
        },
        {
          text: '在電通台灣的系統裡，負責理解人的模型是 People Model。發展它不是因為相信 AI 能取代消費者，而是想讓品牌更頻繁地跟消費者對上話。',
          src: [
            { article: 'a02', page: 15, text: '在電通台灣的系統裡，負責理解人這一塊的模型是 People Model' },
            { article: 'a02', page: 15, text: '不是因為相信 AI 可以取代消費者，而是想讓品牌能更頻繁地跟消費者對上話' },
          ],
        },
      ],
    },
    {
      kind: 'bignum',
      value: 0.89,
      decimals: 2,
      unit: ' 吻合度',
      caption: {
        text: 'People Model 以電通每年的大型消費者調查為底，每一位 AI 數位分身都對應一位真實受訪者，與真人調查結果的吻合程度達到 0.89，已具備支持商業決策的可信度。',
        src: [
          { article: 'a02', page: 15, text: 'People Model 的底子是電通每年執行的大型消費者調查' },
          { article: 'a02', page: 15, text: '背後都對應一位真實受訪者，跟真人調查結果的吻合程度達到 0.89' },
          { article: 'a02', page: 15, text: '現在證明模擬結果已經具備支持商業決策的可信度' },
        ],
      },
      figure: { article: 'a02', page: 15, text: '吻合程度達到 0.89' },
      source: '資料來源 電通台灣 People Model，邵懿文〈Agentic 時代〉紙本 p.15。模型如何建立與驗證，見〈People Model 介紹和應用〉',
    },
    {
      kind: 'quote',
      lead: {
        text: '模擬再精準也有邊界。面對從未出現過的品類、劇烈的社會情緒轉變，或沒有先例的全新概念，AI Persona 的判斷仍需要真人研究校準。People Model 不是取代市場研究，而是把研究資源留給真正需要深度洞察的地方。',
        src: [
          { article: 'a02', page: 15, text: '但模擬能力再精準，也有它的邊界' },
          { article: 'a02', page: 15, text: 'AI Persona 的判斷仍然需要真人研究校準' },
          { article: 'a02', page: 15, text: '而是把研究資源留在真正需要人的深度洞察的地方' },
        ],
        more: {
          title: '還在校準的邊界',
          quote: { article: 'a02', page: 15, text: '這裡的邊界，也不只一種。樣本涵蓋的市場、族群的代表性，乃至於態度與長期行為之間的落差，都是我們持續在校準的課題。' },
        },
      },
      quote: { article: 'a02', page: 15, text: '不是為了生成出更多的分身，它要做的是把產品、價格、包裝、品牌溝通與媒體策略，都放在同一套消費者理解的基礎上驗證。' },
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'bars',
        title: 'AI 驅動的市場研究服務規模',
        axis: '億美元（Future Market Insights 預估）',
        badge: { text: '五年翻倍以上', at: 2 },
        bars: [
          { label: '2025', value: 80, display: '近 80 億', at: 1 },
          { label: '2030', sub: '預估', value: 168, display: '約 168 億', highlight: true, at: 2 },
        ],
        source: '資料來源 Future Market Insights，邵懿文〈Agentic 時代〉紙本 p.15–16',
      },
      src: [{ article: 'a02', page: 16, text: 'AI 驅動的市場研究服務規模，將從 2025 年的近八十億美元，在 2030 年成長到約一百六十八億美元' }],
      figures: [
        { article: 'a02', page: 16, text: '2025 年的近八十億美元' },
        { article: 'a02', page: 16, text: '在 2030 年成長到約一百六十八億美元' },
      ],
      beats: [
        {
          text: '這場改變的時間表已經起跑。Future Market Insights 預估，AI 驅動的市場研究服務規模，2025 年將近八十億美元。',
          src: [
            { article: 'a02', page: 15, text: '這場改變的時間表已經開始起跑了' },
            { article: 'a02', page: 16, text: 'AI 驅動的市場研究服務規模，將從 2025 年的近八十億美元' },
          ],
          more: {
            title: '報告出處', text: '原文引用的市場預估來源：Future Market Insights 的 AI 驅動市場研究服務報告。文中「2025 年近八十億美元」的數字出自這份報告。',
            links: [{ url: 'https://www.futuremarketinsights.com/reports/ai-based-research-services-market', label: 'Future Market Insights 報告', kind: 'report' }],
          },
        },
        {
          text: '到 2030 年將成長到約一百六十八億美元，消費品與零售是投入最深的產業。報告指出關鍵驅動力是合成受測者與虛擬樣本群的興起，這是一場決策效率與決策品質的競爭。',
          src: [
            { article: 'a02', page: 16, text: '在 2030 年成長到約一百六十八億美元' },
            { article: 'a02', page: 16, text: '消費品與零售產業會是投入最深的一群' },
            { article: 'a02', page: 16, text: '合成受測者與虛擬樣本群正在興起' },
            { article: 'a02', page: 16, text: '是一場關於決策效率與決策品質的競爭正在展開' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'list',
        layout: 'scatter', morphAt: 2, morphLabel: '問題不再被切成碎片',
        title: '一個新品上市，問題散落在四個部門',
        items: [
          { title: '研發部門', desc: '新口味會不會被接受？', at: 1 },
          { title: '設計部門', desc: '新包裝夠不夠吸引人？', at: 1 },
          { title: '業務部門', desc: '價格提高五元，還買不買？', at: 1 },
          { title: '行銷部門', desc: '廣告訴求怎麼說，消費者才聽得懂？', at: 1 },
        ],
        source: '依據 邵懿文〈Agentic 時代〉紙本 p.16 表格',
      },
      src: [{ article: 'a02', page: 16, text: '研發部門想知道：新口味會不會被接受？' }],
      figures: [
        { article: 'a02', page: 16, text: '設計部門想知道：新包裝夠不夠吸引人？' },
        { article: 'a02', page: 16, text: '業務部門想知道：價格提高五元，還買不買？' },
        { article: 'a02', page: 16, text: '行銷部門想知道：廣告訴求怎麼說，消費者才聽得懂？' },
      ],
      beats: [
        {
          text: '模擬還解決了企業內部一個巨大的隱形成本：最珍貴的資訊在部門交接時被切成碎片。新品上市的問題散落在研發、設計、業務與行銷手上，傳統流程要動用八到十二個團隊、三十場以上會議、歷經數個月才能定案。',
          src: [
            { article: 'a02', page: 16, text: '企業內最珍貴的資訊在部門交接過程被切成碎片，沒有人好好的把它們拼回去' },
            { article: 'a02', page: 16, text: '傳統流程，這需要動用八到十二個團隊、三十場以上的會議、歷經數個月才能定案' },
          ],
        },
        {
          text: '當驗證被壓縮到幾天甚至幾小時，省下的不只是時間，還有不斷被打散、又要重新拼起來的資訊。門檻不在企業規模，而在有沒有準備好把「理解人」當作核心決策依據。',
          src: [
            { article: 'a02', page: 16, text: '而當驗證這一段能被壓縮到幾天甚至幾小時，省下來的不只是時間' },
            { article: 'a02', page: 16, text: '而在於企業有沒有準備好把「理解人」當作核心決策依據' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '速度從來不是目的。Agentic AI 真正改變的不只是工作效率，而是企業驗證假設、修正方向與做出決策的方式；人，仍然是最後的答案。',
        src: [
          { article: 'a02', page: 16, text: '然而，速度從來不是目的' },
          { article: 'a02', page: 17, text: '不只是工作的效率，而是企業驗證假設、修正方向與做出決策的方式' },
          { article: 'a02', page: 17, text: '人，仍然是最後的答案' },
        ],
      },
      quote: { article: 'a02', page: 17, text: '只要 AI 做的是幫品牌更懂人，品牌與人之間的距離，才會是真實的靠近。' },
    },
  ],
  asksTitle: '帶走一個選擇',
  asks: [
    { article: 'a02', page: 16, text: '所以這不是要不要導入一項新工具的選擇，是要不要把「更快、更準地理解人」這件事，變成組織核心能力的選擇。' },
  ],
};
