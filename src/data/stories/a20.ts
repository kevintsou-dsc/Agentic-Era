import type { Story } from '../../lib/story';

// 潘其偉〈拒絕同質化 AI Slop：將 AI 的「生成力」升級為品牌的「交付力」〉紙本 p.176–181
// 原刊圖表：p.177 品牌競爭力三次遷移（表格 → 逐段清單）；文字結構：成本位置轉移（d3 蹺蹺板）、
// SLIP 循環（d3 循環）、Human-in-the-Loop ROI（大數字）、Vanguard 交付時間（長條）
export const story: Story = {
  id: 'a20',
  status: 'judged',
  oneLiner: 'AI 讓生成內容的能力變成人人都有的商品；品牌要靠規格、產線、檢驗與模式化這套交付系統，把生成力轉化為能持續交付品牌辨識度的交付力。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: 'AI 最大的風險不是犯錯，而是變得平均',
      beats: [
        {
          text: '星期三晚上 7 點 47 分，廣告公司的製作中心正在投放前衝刺：同一個活動要同時上線 Meta、YouTube、電商、CRM 與數位看板，每個平台又衍生不同尺寸、秒數與語言版本。品牌面對的是規模化內容管理的嚴峻考驗。',
          src: [
            { article: 'a20', page: 177, text: '星期三晚上 7 點 47 分，廣告公司的製作中心 (Production Center) 正處於投放前最後衝刺的關鍵時刻' },
            { article: 'a20', page: 177, text: '需要同時上線 Meta、YouTube、電商平台、CRM、EDM 以及數位看板等數十種素材版本' },
            { article: 'a20', page: 177, text: '而是規模化內容管理的嚴峻考驗' },
          ],
          notes: [{ term: 'Meta', text: 'Facebook、Instagram 等社群平台的母公司，行銷上常用來指在這些平台上投放的廣告。' }, { term: 'CRM', text: '顧客關係管理，指企業記錄顧客資料、經營會員關係的系統與做法，常用來發送會員訊息與優惠。' }],
        },
        {
          text: '生成式 AI 看似完美解決了版本爆炸，但素材完成得更快，品牌卻更難被辨識；內容更多，差異化卻更少。這種同質化的內容洪流，被稱為「AI Slop」。',
          src: [
            { article: 'a20', page: 177, text: '素材完成得更快了，品牌卻更難被辨識；內容數量變得更多了，差異化卻變得更少了' },
            { article: 'a20', page: 177, text: '「AI Slop」——亦即由生成式 AI 所堆疊出的同質化內容洪流' },
          ],
        },
        {
          text: '就像超加工食品帶來健康危機，內容產業正步入「超加工創意」時代：AI 提供大量創意的熱量（產量），卻可能在規模化生產中移除品牌最重要的營養價值，也就是觀點、個性、文化脈絡與情感溫度。',
          src: [
            { article: 'a20', page: 177, text: '今天的內容產業正步入 「超加工創意 (Ultra-Processed Creativity) 」 時代' },
            { article: 'a20', page: 177, text: '亦即觀點、個性、文化脈絡與情感溫度' },
          ],
          quote: { article: 'a20', page: 177, text: '而平均，正是品牌差異化最大的敵人。' },
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        layout: 'tram',
        title: '品牌競爭力的三次遷移',
        items: [
          { title: '第一階段｜創意競爭', desc: '比拼消費者洞察、核心概念與創意表現', at: 1 },
          { title: '第二階段｜內容供應鏈競爭', desc: '比拼速度、產量與回應市場的能力', at: 2 },
          { title: '第三階段｜品牌交付系統競爭', desc: '比拼能否穩定且持續地交付品牌辨識度', at: 3 },
        ],
        source: '表：品牌競爭力的三次遷移｜潘其偉〈拒絕同質化 AI Slop〉紙本 p.177；電車造型為策展的視覺比喻',
      },
      src: [{ article: 'a20', page: 177, text: '企業的核心競爭力正在經歷三次重大的戰略轉移' }],
      figures: [
        { article: 'a20', page: 177, text: '第一階段｜創意競爭 Creative Competition' },
        { article: 'a20', page: 177, text: '第二階段｜內容供應鏈競爭 Content Supply Chain Competition' },
        { article: 'a20', page: 177, text: '第三階段｜品牌交付系統競爭 Brand Delivery System Competition' },
      ],
      beats: [
        {
          text: '回顧過去二十年，品牌競爭力經歷三次遷移。第一階段是創意競爭：品牌比拼的是精準的消費者洞察、引人入勝的核心概念與創意表現。',
          src: [{ article: 'a20', page: 177, text: '品牌比拼的是精準的消費者洞察、引人入勝的核心概念與創意表現' }],
        },
        {
          text: '第二階段是內容供應鏈競爭：數位媒體與社群平台興起後，品牌開始比拼速度、產量，以及回應市場的能力。',
          src: [{ article: 'a20', page: 177, text: '在數位媒體與社群平台興起後，品牌開始比拼速度、比拼產量、以及回應市場的能力' }],
        },
        {
          text: '第三階段是品牌交付系統競爭，也就是當前邁入的時代。當生成能力普及，內容本身快速商品化，競爭焦點就不再是誰能生產內容，而是誰能穩定且持續地交付品牌辨識度。',
          src: [
            { article: 'a20', page: 177, text: '第三階段｜品牌交付系統競爭 Brand Delivery System Competition' },
            { article: 'a20', page: 178, text: '而是誰能穩定且持續地交付品牌辨識度' },
          ],
          quote: { article: 'a20', page: 178, text: 'AI 讓生成力變成商品 (Commodity)，而交付力將成為新的競爭力。' },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'balance',
          title: 'AI 沒有消除成本，只是改變了成本的位置',
          left: { label: '前端產能', extra: '人力、時間與預算決定能做出多少素材。過去數十年，企業的投資都在提高生產效率：多請人、外包、買更快的工具。' },
          right: { label: '中後端治理', extra: '品質控管、品牌一致性、法規審查與決策效率。AI 讓產量暴增後，這些「檢查與決定」的工作量跟著變大，成為新的瓶頸。' },
          states: [
            {
              label: '過去', en: 'CAPACITY', years: 'AI 之前', tilt: -1, at: 1,
              desc: '瓶頸在前端：團隊不夠大、時間不夠多、預算不夠高',
              extra: '素材做不出來是最大的問題，所以內容供應鏈的改善幾乎都集中在生產端，例如增加人手或縮短製作流程。',
            },
            {
              label: '今天', en: 'GOVERNANCE', years: 'AI 之後', tilt: 1, at: 2,
              desc: '瓶頸移到中後端：治理、品質控管與決策效率',
              extra: '生成幾乎不花時間，但每一則內容仍要有人確認是否符合品牌、是否合法、是否值得上線。沒有標準流程時，修正錯誤反而更花時間。',
            },
          ],
        },
        source: '圖：策展者依原文整理製圖（傾斜程度為示意）｜潘其偉〈拒絕同質化 AI Slop〉紙本 p.178',
      },
      src: [{ article: 'a20', page: 178, text: 'AI 並沒有消除成本，它只是改變了成本的位置' }],
      beats: [
        {
          text: '長期以來，內容供應鏈最大的問題是前端產能不足：團隊不夠大、時間不夠多、預算不夠高，企業因此數十年來不斷投資提高生產效率。',
          src: [{ article: 'a20', page: 178, text: '長期以來，內容供應鏈最大的問題來自於前端產能不足，像是團隊不夠大、時間不夠多、預算不夠高' }],
        },
        {
          text: 'AI 解決產能限制後，瓶頸移到中後端的治理、品質控管與決策效率，代價隨之出現：研究指出「Workslop」（職場垃圾）現象，即大量看似專業卻無實質價值的 AI 內容。缺乏標準的流程中，每次 AI 錯誤平均需兩小時以上修正；超過三成工作者說，常收到這類內容會降低對發送者的專業信任。',
          src: [
            { article: 'a20', page: 178, text: '新的瓶頸卻移轉到了中後端的治理、品質控管與決策效率上' },
            { article: 'a20', page: 178, text: '每一次 AI 錯誤平均需要超過兩小時進行修正' },
            { article: 'a20', page: 178, text: '超過三成的工作者表示，頻繁接收缺乏價值的 AI 內容將直接降低對發送者與品牌的專業信任感' },
          ],
          quote: { article: 'a20', page: 178, text: 'AI 的問題從來不只是內容錯誤，而是內容平均。' },
        },
      ],
    },
    {
      kind: 'prose',
      eyebrow: '製作中心的下一個角色',
      heading: '從生產內容，到設計品牌交付系統',
      beats: [
        {
          text: '因此製作中心的角色必須質變：過去它的價值在於生產內容，後來在於管理供應商與交付流程；在 AI 參與製作的時代，核心價值轉向設計品牌交付系統，也就是一套能守護品牌獨特性的交付流程。',
          src: [{ article: 'a20', page: 178, text: '在 AI Production 時代，製作中心 的核心價值將轉向：設計品牌交付系統 (Brand Delivery System)' }],
          notes: [{ term: '品牌交付系統', text: '原文是 Brand Delivery System。作者團隊的 SLIP Framework 就是這樣一套系統：前端由 Creator-in-the-Loop 守護品牌的獨特性，後端由 Human-in-the-Loop 守護可信度（p.178、p.181）。' }],
        },
        {
          text: '當成果的生產變得廉價，創意價值就往前置作業移動：過去創意人的工作是「產出」，未來是「定義」。因此創意人從創作者變成結構設計者，設計的不再只是一支影片，而是品牌的世界觀、規則與決策框架，以及品牌如何被規模化地生產。',
          src: [
            { article: 'a20', page: 178, text: '當成果的生產變得廉價且容易時，創意價值將不可逆地往「手前 (前置作業) 」移動' },
            { article: 'a20', page: 178, text: '轉變為 「結構設計者 (Architecture Designer) 」' },
            { article: 'a20', page: 178, text: '而是品牌的世界觀、品牌規則、品牌決策框架，以及品牌如何被規模化地生產' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'flowloop',
          title: 'SLIP Framework：從生成管理走向交付管理',
          center: '品牌交付系統',
          centerExtra: 'SLIP 的四步會繞成一圈：每次投放的成效被整理成勝率模式，再寫回規格與模組庫，下一輪生成就比上一輪更懂這個品牌。重點是把 AI 放進嚴謹的產線，而不只是個人的靈感裡。',
          nodes: [
            { label: 'Spec', sub: '規格化', desc: '定義什麼絕對不能被妥協', extra: '比 Prompt 更重要的是生產規格書：品牌語氣、世界觀、視覺原則、法規限制與價值觀。一句「幫我做年輕化的貼文」，AI 只能交出市場平均值。' },
            { label: 'Line', sub: '產線化', desc: '用結構守住品牌的偏執', extra: '把品牌 DNA 拆成模組：開場鉤子庫、行動呼籲庫、視覺組件庫與品牌敘事資產。AI 是在既定框架內組裝元件，而不是從零亂猜品牌的樣子。' },
            { label: 'Inspection', sub: '檢驗化', desc: '一致性、授權法規、媒體就緒度三道關卡', extra: '人類在後端把關：視覺與語氣是否符合品牌、有沒有版權或法規風險、在各平台介面與手機遮罩下關鍵訊息是否清楚。這是品牌的品質系統。' },
            { label: 'Pattern', sub: '模式化', desc: '把成功經驗回饋到模組庫與規格', extra: '成效數據不該只躺在媒體報表裡。找出勝率模式、抽象化後寫回模組庫，最後沉澱成每個素材的「資產履歷」，讓供應鏈具備學習能力。' },
          ],
        },
        source: '圖：策展者依原文整理製圖｜潘其偉〈拒絕同質化 AI Slop〉紙本 p.179–180',
      },
      src: [{ article: 'a20', page: 179, text: '為此，我們結合電通集團的核心思維，提出 SLIP Framework' }],
      beats: [
        {
          text: 'S 是規格化。AI Slop 的起點通常不是模型能力不足，而是規格定義不清。因此 Spec（生產規格書）要定義什麼絕對不能被妥協，這正是電通提出的「Creator-in-the-Loop」（創意人在迴路）：創意人的價值不是檢查 AI，而是定義 AI。',
          src: [
            { article: 'a20', page: 179, text: 'AI Slop 的起點通常不是模型能力不足，而是規格定義不清' },
            { article: 'a20', page: 179, text: 'Spec 的目的不是描述要做什麼，而是定義什麼絕對不能被妥協' },
            { article: 'a20', page: 179, text: '創意人的價值不是檢查 AI，而是定義 AI' },
          ],
          notes: [{ term: 'Creator-in-the-Loop', text: 'in-the-Loop 指 AI 流程中留給人的環節。許多人把人機協作理解為人來檢查 AI；Creator-in-the-Loop 則是 AI 負責動手生成，創意人在前端設計世界觀與規則，角色是定規格，不是審稿（p.179）。' }],
        },
        {
          text: 'L 是產線化：建立模組化品牌資產庫，如吸睛鉤子庫、行動呼籲庫、視覺組件庫與品牌敘事資產，讓 AI 在既定的品牌框架內組裝元件，而不是從零猜測。再用變體矩陣限定有限、可管理的組合，讓內容高速繁衍時仍保持品牌一致。',
          src: [
            { article: 'a20', page: 179, text: '建立屬於自己的 「模組化品牌資產庫」' },
            { article: 'a20', page: 179, text: '透過變體矩陣 (Variant Matrix) 設計出有限且可管理的變體組合' },
            { article: 'a20', page: 179, text: '讓大量內容在高速繁衍時依然保持絕對的品牌一致性' },
          ],
          notes: [{ term: '變體矩陣', text: '把開場鉤子、視覺元素、行動呼籲等可替換的版本列成表格，事先限定可用的組合，有系統地產生多個素材版本。' }],
        },
        {
          text: 'I 是檢驗化。如果說 Creator-in-the-Loop 在前端解決差異化，Human-in-the-Loop（人類在迴路）就在後端解決安全治理：建立品牌一致性、授權與法規、媒體就緒度三道關卡。前者保護品牌不平庸，後者保護品牌不犯錯。',
          src: [
            { article: 'a20', page: 180, text: '「Human-in-the-Loop(人類在迴路)」 在後端解決的則是安全治理問題' },
            { article: 'a20', page: 180, text: '製作中心應硬性建立三道檢驗關卡' },
            { article: 'a20', page: 180, text: '如果說 Creator-in-the-Loop 保護品牌不變得平庸，那麼 Human-in-the-Loop 則保護品牌不犯錯' },
          ],
          notes: [{ term: 'Human-in-the-Loop', text: '指在 AI 自動化流程中保留由人審核、修正或做最終決定的步驟，避免 AI 的錯誤直接送出。' }],
        },
        {
          text: 'P 是模式化：從成效數據中找出勝率模式（Winning Pattern），把成功經驗抽象化後回饋到模組庫與規格系統，讓每一次 AI 生產都比上一次更聰明，內容供應鏈也因此具備學習能力。',
          src: [
            { article: 'a20', page: 180, text: 'Pattern 的任務，就是找出 Winning Pattern (勝率模式)' },
            { article: 'a20', page: 180, text: '並持續回饋至品牌模組庫與規格系統中。這讓品牌每一次的 AI 生產都比上一次更聰明' },
          ],
        },
      ],
    },
    {
      kind: 'bignum',
      value: 104,
      prefix: '+',
      unit: '% ROI',
      caption: {
        text: '在 AI 時代，完全自動化並非最佳解答。一項針對 200 個 B2B AI 專案的研究發現，採用 Human-in-the-Loop 的專案，ROI 平均比完全自動化高出 104%，重大錯誤發生率也降低 4.3 倍。AI 的價值不是取代人的判斷，而是放大判斷的效能。',
        src: [
          { article: 'a20', page: 180, text: '採用 Human-in-the-Loop 的專案，其 ROI 平均比完全自動化模式高出 104%；重大錯誤發生率則顯著降低了 4.3 倍' },
          { article: 'a20', page: 180, text: 'AI 的價值不是取代人類的判斷，而是放大判斷的效能' },
        ],
      },
      figure: { article: 'a20', page: 180, text: '高出 104%' },
      source: '資料來源 Denis Atlan, AI ROI Analysis: Evidence from 200 B2B Deployments，潘其偉〈拒絕同質化 AI Slop〉紙本 p.180',
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'bars',
        title: 'Vanguard：社群素材從 Brief 到交付的時間',
        axis: '天',
        badge: { text: '接近 100% 品牌與法規合規率', at: 2 },
        bars: [
          { label: '原本', value: 5.5, display: '5.5 天', at: 1 },
          { label: '重整後', value: 0.25, display: '0.25 天', highlight: true, at: 1 },
        ],
        source: '資料來源 Adobe for Business（Vanguard 案例），潘其偉〈拒絕同質化 AI Slop〉紙本 p.180–181',
      },
      src: [{ article: 'a20', page: 181, text: '從原本的 5.5 天極限縮短至 0.25 天 (約 6 小時)' }],
      figures: [
        { article: 'a20', page: 181, text: '5.5 天' }, { article: 'a20', page: 181, text: '0.25 天' },
      ],
      beats: [
        {
          text: '全球投資管理公司 Vanguard 透過 AI Agent、模組化內容資產與供應鏈重整，把社群素材從 Brief 到交付的流程，從 5.5 天縮短到 0.25 天，大約 6 小時。',
          src: [
            { article: 'a20', page: 180, text: '透過 AI Agent、模組化內容資產與品牌供應鏈的重整' },
            { article: 'a20', page: 181, text: '從原本的 5.5 天極限縮短至 0.25 天 (約 6 小時)' },
          ],
        },
        {
          text: '更關鍵的是，產能與速度倍增的同時，系統性的治理讓它維持接近 100% 的品牌與法規合規率。作者認為這不只是效率提升，而是內容供應鏈的底層升級：企業未來的競爭優勢，不會來自 AI 工具本身，而是來自如何治理與管理 AI。',
          src: [
            { article: 'a20', page: 181, text: '系統性的治理機制讓其維持了接近 100% 的高度品牌與法規合規率' },
            { article: 'a20', page: 181, text: '企業未來的競爭優勢，絕對不會來自 AI 工具本身，而是來自你如何治理與管理 AI' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '技術普及沒有讓品牌更容易被看見，只是讓所有人都更容易被生產；品牌最大的挑戰，是避免被平庸化與平均化。真正摧毀差異化的不是 AI，而是誤把 AI 當成廉價的內容生成工具，忽略了它作為品牌交付系統的戰略價值。',
        src: [
          { article: 'a20', page: 181, text: '技術的普及並沒有讓品牌變得更容易被看見，它只是讓所有人都更容易被生產' },
          { article: 'a20', page: 181, text: '真正摧毀差異化的，是誤把 AI 當成廉價的內容生成工具，而忽略了它作為品牌交付系統的核心戰略價值' },
        ],
      },
      quote: { article: 'a20', page: 181, text: 'AI 讓生成力變成商品，而交付力，將成為新時代最強大的競爭護城河。' },
    },
  ],
  asksTitle: '帶走一個問題',
  asks: [
    { article: 'a20', page: 177, text: '「如何將 AI 的生成力，轉化為品牌可持續的交付力？」' },
  ],
};
