import type { Story } from '../../lib/story';

// 吳宗霖〈重建 SOV：在注意力被 AI 稀釋的時代，如何守住品牌被選擇的關鍵場域〉紙本 p.116–127
// 原刊沒有圖表與照片：本篇的圖都是依原文文字整理製圖（成本倍數、干擾場域、ESOV、三層占位、競品干擾、場域分工）
export const story: Story = {
  id: 'a13',
  status: 'judged',
  oneLiner: 'AI 投放讓廣告更精準，也讓品牌被選擇的理由更容易被稀釋。SOV 要從聲量占比，升級為選擇場域的占位。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: 'SOV 不是過時，而是要被重新定義',
      beats: [
        {
          text: '過去談 SOV，談的是品牌在某個品類、某段時間裡的聲量占比。邏輯很直接：消費者進入需求情境時，誰的聲音比較常出現，誰就比較容易被想起、被選擇。',
          src: [
            { article: 'a13', page: 117, text: '品牌在某一個品類、某一段時間、某一組媒體環境中的聲量占比' },
            { article: 'a13', page: 117, text: '誰的聲音比較常出現，誰的品牌比較容易被想起，誰就更有機會被選擇' },
          ],
        },
        {
          text: '今天的問題不是 SOV 不重要，而是它被稀釋的方式不同了：品牌不只和同品類競品搶聲量，而是在消費者每一個可能做選擇的場域中競爭。',
          src: [
            { article: 'a13', page: 117, text: '但今天的問題不是 SOV 不重要，而是 SOV 被稀釋的方式已經不同了' },
            { article: 'a13', page: 117, text: '品牌不是只在媒體版位中競爭，而是在消費者每一個可能做選擇的場域中競爭' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        title: '同一個意圖裡，競品在每一步等著你',
        items: [
          { title: '看完一支廣告', desc: '下一秒可能被短影音帶走', at: 1 },
          { title: '點進商品頁', desc: '平台推薦其他相似品牌', at: 1 },
          { title: '搜尋品牌字', desc: '看到競品比較文', at: 2 },
          { title: '進入電商站內', desc: '被促銷、評價、排序與相似商品重新影響', at: 2 },
        ],
        source: '整理：策展者｜依據 吳宗霖〈重建 SOV〉紙本 p.118',
      },
      src: [{ article: 'a13', page: 118, text: '內容會讓注意力分散，但競品會讓選擇動搖' }],
      beats: [
        {
          text: '稀釋品牌選擇的，未必只是「內容太多」，而是「競品也在同一個意圖裡出現」。內容會讓注意力分散，競品則會讓選擇動搖。',
          src: [
            { article: 'a13', page: 118, text: '稀釋品牌選擇的未必只是「內容太多」，而是「競品也在同一個意圖裡出現」' },
            { article: 'a13', page: 118, text: '內容會讓注意力分散，但競品會讓選擇動搖' },
          ],
        },
        {
          text: '從搜尋、比較文到電商站內的排序，這些干擾不一定出現在品牌的媒體報表裡，卻真實存在於消費者的決策歷程中。',
          src: [{ article: 'a13', page: 118, text: '這些干擾不一定都會出現在品牌的媒體報表裡，但它們真實存在於消費者的決策歷程中' }],
        },
      ],
    },
    {
      kind: 'prose',
      eyebrow: 'AI 投放的效率悖論',
      heading: '效率提高了，競爭也更集中',
      beats: [
        {
          text: 'Performance Max、Advantage+ 這類 AI 投放工具，讓品牌更容易找到「最可能有反應的人」。但當每個品牌都做得到，高意圖消費者就成了所有競品共同爭奪的對象。',
          src: [
            { article: 'a13', page: 118, text: '都讓品牌更容易找到「最可能有反應的人」' },
            { article: 'a13', page: 118, text: '高意圖消費者也就成為所有競品共同爭奪的對象' },
          ],
        },
        {
          text: '報表上的 CPC、CTR、CPA、ROAS 變好了，消費者經歷的卻是同一個需求被大量相似廣告包圍。最後他也許真的買了，但不一定記得買的是誰。',
          src: [
            { article: 'a13', page: 118, text: '品牌看到的可能是 CPC、CTR、CPA、ROAS 變好了' },
            { article: 'a13', page: 118, text: '最後，消費者也許真的買了，但不一定記得買的是誰' },
          ],
        },
        {
          text: '還有一個常被忽略的問題：如果沒有這次廣告，這個人會不會本來就買？AI 擅長找到高機率行動的人，但他們可能早就在需求裡，廣告只是接住了既有需求。',
          src: [
            { article: 'a13', page: 118, text: '如果沒有這次廣告，這個人會不會本來就買？' },
            { article: 'a13', page: 118, text: '這時候廣告可能只是接住了既有需求，而不是創造了新需求' },
          ],
          more: {
            title: '歸因轉換 vs. 增量轉換',
            text: '歸因轉換只說明「誰看了廣告之後買了」；增量轉換要回答「因為廣告才多買的有多少」。後者通常要用對照組或地區實驗才量得出來。',
            quote: { article: 'a13', page: 118, text: '這不是說成效型廣告沒有價值，而是品牌必須更清楚區分：這筆投放到底是在收割需求、加速決策、阻擋競品，' },
          },
        },
      ],
    },
    {
      kind: 'bignum',
      value: 20,
      prefix: '約 ',
      unit: ' 個',
      caption: {
        text: '吳宗霖買了一個手機磁吸支架，才發現只能吸附在玻璃上；再搜尋時，同時間大概有二十個類似廣告在對他投放，每個都在講磁吸、穩固、方便，價格也差不多。',
        src: [
          { article: 'a13', page: 119, text: '才發現那個產品只能吸附在玻璃上，並不符合我原本期待' },
          { article: 'a13', page: 119, text: '同時間大概有二十個左右的類似廣告與類似商品都在對我投放' },
          { article: 'a13', page: 119, text: '每個素材看起來都差不多，每個價格也差異不大' },
        ],
      },
      figure: { article: 'a13', page: 119, text: '二十個左右的類似廣告' },
      source: '作者親身經驗，吳宗霖〈重建 SOV〉紙本 p.119',
    },
    {
      kind: 'quote',
      lead: {
        text: '他又買了另一個，產品其實不錯用，但盒子丟掉之後，就不太記得那個品牌叫什麼。從成效報表看，這可能是成功的；從品牌經營看，卻是 SOV 被嚴重稀釋的案例。',
        src: [
          { article: 'a13', page: 119, text: '產品其實不錯用，但盒子丟掉之後，我也不太記得那個品牌叫什麼' },
          { article: 'a13', page: 119, text: '從成效報表來看，這可能是成功的' },
          { article: 'a13', page: 119, text: '但從品牌經營來看，這卻是一個 SOV 被嚴重稀釋的案例' },
        ],
      },
      quote: { article: 'a13', page: 119, text: 'Sales 解決的是這一次買不買，Marketing 解決的是下一次消費者想到這個需求時，會不會先想到你。' },
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'logrange',
          title: '換算成每千次曝光，越往 lower funnel 越貴',
          unit: '× CPM',
          rows: [
            { label: 'CPM', sub: '買接觸面', min: 1, max: 1, at: 1, extra: 'CPM（Cost Per Mille）是每千次曝光的價格。品牌買的是能觸及多少人、每人看到幾次，適合建立知名度與熟悉感，也是比較其他計價方式的基準。' },
            { label: 'CPC', sub: '買有反應的人', min: 5, max: 10, open: true, at: 2, extra: 'CPC（Cost Per Click）按點擊計價。系統會把廣告優先給「可能會點」的人，換算成每千次曝光就更貴，而且觸及的人更集中、更少。' },
            { label: 'CPA', sub: '以轉換事件優化', min: 10, max: 100, open: true, at: 3, extra: 'CPA（Cost Per Action）按購買、註冊等轉換計價。系統只追最可能轉換的人，成本最高；這群人往往也正被多個競品同時追著跑，品牌被看見的範圍最窄。' },
          ],
        },
        source: '圖：依原文文字整理製圖（倍數為作者經驗值，非固定比例）｜吳宗霖〈重建 SOV〉紙本 p.119–120',
      },
      src: [{ article: 'a13', page: 119, text: '越往 engagement 或 lower funnel 深入，曝光成本通常會越高' }],
      figures: [
        { article: 'a13', page: 119, text: '常常可能是 CPM 購買的五倍到十倍以上' },
        { article: 'a13', page: 119, text: '甚至可能放大到十倍、數十倍，某些情境下可能到百倍以上' },
      ],
      beats: [
        {
          text: '許多品牌重新加重 upper funnel，不是不重視成效，而是越往 lower funnel 走，競爭越集中、曝光成本越高，消費者也越容易進入比較模式。',
          src: [{ article: 'a13', page: 119, text: '越往 lower funnel 走，競爭越集中，曝光成本越高，消費者也越容易進入比較模式' }],
        },
        {
          text: '買 CPM 買到的是較大的接觸面與可控頻次；買 CPC 買到的是有反應的人，但換算成每千次曝光，常常是 CPM 的五到十倍以上。',
          src: [
            { article: 'a13', page: 119, text: '買 CPM 時，品牌買的是比較大的接觸面與可控頻次' },
            { article: 'a13', page: 119, text: '常常可能是 CPM 購買的五倍到十倍以上' },
          ],
        },
        {
          text: '若再以轉換事件優化，曝光成本甚至可能放大到數十倍、某些情境下百倍以上。結果可能是 CPA 變漂亮了，但看見品牌訊息的人變少了。',
          src: [
            { article: 'a13', page: 119, text: '甚至可能放大到十倍、數十倍，某些情境下可能到百倍以上' },
            { article: 'a13', page: 120, text: '結果可能是 CPA 變漂亮了，但看見品牌訊息的人變少了' },
          ],
          quote: { article: 'a13', page: 120, text: '轉換率提高了，但品牌能累積的記憶變薄了；短期報表變有效率了，但中長期需求池沒有被擴大。' },
        },
      ],
    },
    {
      kind: 'prose',
      eyebrow: 'Share of Search 的限制',
      heading: '不是每一個消費者都會搜尋',
      beats: [
        {
          text: 'Share of Search 被視為觀察品牌健康的重要指標，但它建立在「消費者會搜尋」的前提上。實際上有人看到廣告後直接去熟悉的門市，有人問親友、問店員，有人根本不需要搜尋就做了選擇。',
          src: [
            { article: 'a13', page: 120, text: '它建立在「消費者會搜尋」這個前提之上' },
            { article: 'a13', page: 120, text: '有些人會問親友、問店員、看現場陳列，而不是打開 Google' },
          ],
        },
        {
          text: '有個眼鏡門市品牌，希望把數位行銷目的鎖定在 Google Map 或門市搜尋。但只看搜尋，就可能把沒有搜尋行為的消費者排除在外，誤判數位廣告的真正角色。',
          src: [
            { article: 'a13', page: 120, text: '之前曾有一個眼鏡門市品牌，客戶很希望把數位行銷目的鎖定在 Google Map 或門市搜尋' },
            { article: 'a13', page: 120, text: '就可能把沒有搜尋行為的消費者排除在分析之外，也可能誤判數位廣告的真正角色' },
          ],
          more: {
            title: '怎麼補足搜尋數字看不到的來店行為？',
            quote: { article: 'a13', page: 120, text: '最好不要只依賴平台數字，而要搭配消費者訪談、門市來客訪問、購買後問卷、會員資料與銷售地區變化，去理解消費者真正的來店行為。' },
          },
        },
        {
          text: '到了 AI 搜尋時代，搜尋本身也變成自然語言提問、AI 摘要與推薦清單。作者認為品牌要看的，不只是 Share of Search，還有 Share of Discovery、Share of Recommendation，以及更重要的 Share of Choice。',
          src: [
            { article: 'a13', page: 120, text: '現在搜尋可能變成一段自然語言問題、一個 AI 摘要、一組整合答案、一段推薦清單' },
            { article: 'a13', page: 121, text: '未來品牌要看的，可能不只是 Share of Search，而是 Share of Discovery、Share of Consideration、Share of Store Visit、Share of Recommendation，以及更重要的 Share of Choice' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'bars',
        title: 'ESOV：聲量占比減去市占率',
        axis: '原文舉例（%）',
        badge: { text: 'ESOV = 30 − 20 = +10', at: 1 },
        bars: [
          { label: 'SOM', sub: '市場占有率', value: 20, display: '20%', at: 1 },
          { label: 'SOV', sub: '品類聲量占比', value: 30, display: '30%', highlight: true, at: 1 },
        ],
        source: '依據 吳宗霖〈重建 SOV〉紙本 p.121 的舉例製圖',
      },
      src: [{ article: 'a13', page: 121, text: '如果一個品牌的市場占有率是 20%，但它在品類中的聲量占比是 30%，那它的 ESOV 就是 +10' }],
      figures: [
        { article: 'a13', page: 121, text: '市場占有率是 20%' },
        { article: 'a13', page: 121, text: '聲量占比是 30%' },
      ],
      beats: [
        {
          text: 'ESOV 是品牌的 SOV 減去市占率。傳統觀點認為，長期維持正向 ESOV、讓聲量高於市占率，就更有機會推動未來成長。',
          src: [
            { article: 'a13', page: 121, text: '就是品牌的 SOV 減去 SOM 市占率' },
            { article: 'a13', page: 121, text: '當品牌能長期維持正向 ESOV，也就是聲量高於市場占有率，就更有機會推動未來成長' },
          ],
        },
        {
          text: '問題在於，不能把所有媒體粗略換算成一個總曝光：一次電視曝光、一次搜尋廣告、一次 AI 摘要出現，對消費者的影響完全不同。',
          src: [
            { article: 'a13', page: 121, text: '品牌不能只把所有媒體粗略換算成一個總曝光，再直接判斷誰的聲量大' },
            { article: 'a13', page: 121, text: '對消費者的影響完全不同' },
          ],
        },
        {
          text: '所以要先問這個場域值不值得進攻，再選一個主場域承擔主要的 SOV 任務，其他場域負責放大、提醒、補強或承接需求。',
          src: [
            { article: 'a13', page: 121, text: '這個場域值不值得進攻？' },
            { article: 'a13', page: 122, text: '選出一個品牌最值得進攻的主場域，讓它承擔主要 SOV 建立任務' },
          ],
        },
      ],
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
            more: {
              title: 'System Share 不只發生在線上',
              quote: { article: 'a13', page: 123, text: '對很多實體通路品牌來說，門市、貨架、店員、地點、陳列、商圈、生活動線，本身就是系統的一部分。' },
            },
          },
          {
            title: 'Consumer & Community Share', desc: '品牌在消費者與社群心中的份額',
            more: {
              title: '新品牌的做法',
              quote: { article: 'a13', page: 123, text: '這時候更重要的，可能是讓第一批使用者願意分享，讓會員推薦會員，讓真實體驗變成信任來源，讓社群裡有人願意替品牌說話。' },
            },
          },
          {
            title: 'Attention & Memory Share', desc: '品牌在注意力與記憶中的份額',
            more: {
              title: '例子：爬樓梯時想到關節保養',
              quote: { article: 'a13', page: 124, text: '真正重要的情境可能是消費者爬樓梯時覺得膝蓋卡卡、蹲下起身時覺得不舒服、陪家人出遊時擔心長輩走不久。' },
            },
          },
        ],
        source: '整理：策展者｜依據 吳宗霖〈重建 SOV〉紙本 p.122–124',
      },
      src: [{ article: 'a13', page: 123, text: '品牌在消費者選擇情境中的占位能力。這個占位能力，可以拆成三個層次' }],
      beats: [
        {
          text: '核心解方，是把 SOV 從 Share of Voice 升級為 Share of Choice Context：品牌在消費者選擇情境中的占位能力，並拆成三個層次。',
          src: [
            { article: 'a13', page: 122, text: 'SOV 要從 Share of Voice 升級為 Share of Choice Context' },
            { article: 'a13', page: 123, text: '品牌在消費者選擇情境中的占位能力。這個占位能力，可以拆成三個層次' },
          ],
        },
        {
          text: '第一層 System Share，是品牌在搜尋結果、電商排序、AI 摘要，以及門市與貨架上看不看得到。消費者不一定會搜尋，但他會經過；不一定會點擊，但他會看到。',
          src: [
            { article: 'a13', page: 123, text: '這包含搜尋結果、短影音推薦、社群動態、電商站內排序' },
            { article: 'a13', page: 123, text: '消費者不一定會搜尋，但他會經過；不一定會點擊，但他會看到' },
          ],
        },
        {
          text: '第二層 Consumer & Community Share：重點不是誰發文最多，而是消費者討論某個需求時，誰會自然成為被提起的選項。',
          src: [{ article: 'a13', page: 123, text: '這裡的 SOV，不是誰發文最多，而是誰能在消費者討論某個需求時，自然成為被提起的選項' }],
        },
        {
          text: '第三層 Attention & Memory Share：不只是消費者看過廣告，而是在某個生活情境下會不會想起品牌。例如長期佔據「爬樓梯想到關節保養」，競品就不容易扭轉既定印象。',
          src: [
            { article: 'a13', page: 124, text: '而是「消費者是否在某個情境下會想起品牌」' },
            { article: 'a13', page: 124, text: '如果品牌能長期佔據「爬樓梯想到關節保養」這個情境' },
          ],
          quote: { article: 'a13', page: 124, text: '重建 SOV，不只是要看品牌在哪裡曝光，而是要看品牌有沒有在消費者生活中真正重要的時刻，被想起、被理解、被相信。' },
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        title: '競品干擾不只來自同品類：四種競爭',
        items: [
          { title: '品類競爭', desc: '在同一類商品中比較不同品牌', at: 1 },
          { title: '通路競爭', desc: '在電商推薦、門市促銷、店員建議、貨架陳列中被改變選擇', at: 1 },
          { title: '信任競爭', desc: '比較誰比較可靠、誰比較多人用、誰比較有專業背書', at: 2 },
          { title: '預算競爭', desc: '錢不一定只在同品類裡流動，也可能流向醫美、旅遊或運動課程', at: 2 },
        ],
        source: '整理：策展者｜依據 吳宗霖〈重建 SOV〉紙本 p.125',
      },
      src: [{ article: 'a13', page: 125, text: '一個產品可能同時面對品類競爭、通路競爭、信任競爭與預算競爭' }],
      beats: [
        {
          text: '選擇要進攻的場域前，先問這個品類的消費者在哪裡形成偏好，以及品牌最容易被哪一種競品干擾。一個產品可能同時面對品類、通路、信任與預算四種競爭。',
          src: [
            { article: 'a13', page: 125, text: '這個品類的消費者在哪些場域形成偏好？' },
            { article: 'a13', page: 125, text: '一個產品可能同時面對品類競爭、通路競爭、信任競爭與預算競爭' },
          ],
        },
        {
          text: '所以競品干擾不是只看誰跟我賣一樣的東西，而是看誰會在消費者做選擇時，把他的注意力、信任或預算帶走。',
          src: [{ article: 'a13', page: 125, text: '而是看「誰會在消費者做選擇時，把他的注意力、信任或預算帶走」' }],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'list',
        title: '選一個主場域，其他場域分工',
        items: [
          { title: '建立主要心智', desc: '主場域：承擔主要 SOV 建立任務', at: 1 },
          { title: '放大聲量', at: 2 },
          { title: '提供信任', at: 2 },
          { title: '承接需求', at: 3 },
          { title: '轉換與再行銷', at: 3 },
        ],
        source: '整理：策展者｜依據 吳宗霖〈重建 SOV〉紙本 p.122、126',
      },
      src: [{ article: 'a13', page: 126, text: '一個場域負責建立主要心智，一個場域負責放大聲量，一個場域負責提供信任，一個場域負責承接需求，一個場域負責轉換與再行銷' }],
      beats: [
        {
          text: 'full funnel 是基本能力，但資源、團隊與消費者的注意力都有限，品牌不可能在每一層都做滿。full funnel 比較像一張診斷地圖，用來看出自己在哪一層最容易被稀釋。',
          src: [
            { article: 'a13', page: 122, text: '品牌不可能在 full funnel 每一層都做到滿' },
            { article: 'a13', page: 122, text: 'full funnel 是一張診斷地圖：品牌要用它看出自己在哪一層最容易被稀釋' },
          ],
        },
        {
          text: '因此品牌應該先選出主要進攻場域，再規劃其他媒體如何輔助，形成主次關係，讓每一個媒體都有明確任務。',
          src: [
            { article: 'a13', page: 126, text: '因此，品牌應該先選出主要進攻場域，再規劃其他媒體如何輔助' },
            { article: 'a13', page: 126, text: '而是讓每一個媒體都有明確任務，共同建立品牌被選擇的理由' },
          ],
        },
        {
          text: '最後要問：這次投放能否累積成品牌資產？如果答案是否定的，品牌可能只是花錢取得一次交易，卻沒有累積任何長期資產。',
          src: [
            { article: 'a13', page: 125, text: '這次投放能否累積成品牌資產？' },
            { article: 'a13', page: 125, text: '如果答案是否定的，那品牌可能只是花錢取得一次交易' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '消費者看似理性，但很多選擇在搜尋之前就被影響了。品牌不是要取代理性判斷，而是在消費者面對過多選項時，提供一個可以被信任的判斷捷徑。',
        src: [
          { article: 'a13', page: 126, text: '消費者看似理性，但很多選擇在搜尋之前就已經被影響' },
          { article: 'a13', page: 126, text: '品牌不是要取代理性判斷，而是要在消費者面對過多選項時，提供一個可以被信任的判斷捷徑' },
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
