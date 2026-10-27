import type { Story } from '../../lib/story';

// 強義明〈AI 普及下的演算法世代，「衡斷力 (Judgment)」將成為最稀缺的競爭力〉紙本 p.128–135
// 原刊圖表：圖1 媒體三世代（d3 蹺蹺板）、圖2 AI vs PI（art ai-pi）、圖3 衡斷力五大來源（art judgment-sources）、圖4 Media++（art media-pp），圖2–4 皆依原圖重製
export const story: Story = {
  id: 'a14',
  status: 'judged',
  oneLiner: '當工具的門檻消失，差距就回到使用工具的人身上；衡斷力，是演算法世代最稀缺的能力。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '每個人都有 AI 之後，差距在哪裡？',
      beats: [
        {
          text: '近兩年，生成式 AI 幾乎成為所有產業最熱門的關鍵字。回到企業如何成長的根本問題就會發現：AI 確實讓執行變得更快、更便宜、更有效率，但真正決定成敗的關鍵，依然是人類的判斷。',
          src: [
            { article: 'a14', page: 129, text: '近兩年來，生成式 AI 幾乎成為所有產業最熱門的關鍵字' },
            { article: 'a14', page: 129, text: '當我們把目光拉回商業世界最根本的問題——企業如何成長、品牌如何持續創造價值——便會發現一個有趣的現象' },
            { article: 'a14', page: 129, text: 'AI 確實讓執行變得更快、更便宜、更有效率，但真正決定成敗的關鍵，依然是人類的判斷' },
          ],
        },
        {
          text: '當所有企業都能使用相同的大語言模型、演算法與工具，競爭優勢就不再來自誰擁有 AI，而是誰能做出更好的判斷。這項能力，作者稱為「衡斷力 (Judgment)」。',
          src: [
            { article: 'a14', page: 129, text: '當所有企業都能使用相同的大語言模型、相同的演算法以及相同的工具時，競爭優勢將不再來自於誰擁有 AI，而是誰能做出更好的判斷' },
            { article: 'a14', page: 129, text: '而這項能力，我們稱為「衡斷力 (Judgment)」' },
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
          kind: 'balance',
          title: '媒體三世代：品牌與成效投資的比重，漸趨平衡',
          left: { label: 'BRAND 品牌', extra: '品牌投資是為了讓人長期記得、喜歡、信任一個品牌，例如形象廣告、內容與贊助。效果通常要幾個月到幾年才看得到，但會累積成品牌資產。' },
          right: { label: 'DEMAND 需求', extra: '成效（需求）投資是為了在需求出現時接住消費者，例如搜尋廣告、再行銷與電商導購。效果立即、容易量化，但停投之後通常也很快消失。' },
          states: [
            {
              label: '放送世代', en: 'BROADCAST ERA', years: '2008 年以前', tilt: -1, at: 1,
              desc: '以大眾媒體為核心，快速建立共享規模並轉換為生意',
              extra: '電視、報紙與廣播是主要管道，品牌靠大量曝光建立知名度。訊息是單向的，品牌很容易被看見，卻很難知道消費者真正在想什麼。',
            },
            {
              label: '精準世代', en: 'PRECISION ERA', years: '2009–2020 年', tilt: 1, at: 2,
              desc: '追求個人化、績效行銷和投報，但品牌傳播較為碎片化',
              extra: 'Cookies 與第一方、第三方資料讓品牌第一次「看得見」消費者行為，可以按興趣與購買意圖精準投放。代價是預算大量流向成效，品牌訊息變得零碎。',
            },
            {
              label: '演算法世代', en: 'ALGORITHMIC ERA', years: '後疫情時代', tilt: 0, at: 3,
              desc: '透過品牌自己的演算法規劃，即時創造內容與 TA 間的價值交換',
              extra: '消費者看到什麼由平台推薦機制決定，品牌除了理解消費者，還要理解演算法如何理解消費者。品牌與成效不再是二選一，而要在同一套規劃裡取得平衡。',
            },
          ],
        },
        source: '圖：媒體三世代演進，品牌在 BRANDING 與成效投資上的比重變化，漸趨平衡（傾斜程度為示意）｜資料來源 凱絡媒體／製圖，強義明〈衡斷力〉紙本 p.130',
      },
      src: [{ article: 'a14', page: 130, text: '媒體三世代演進，品牌在 BRANDING 與 成效投資上的比重變化，漸趨平衡' }],
      figures: [
        { article: 'a14', page: 130, text: '以大眾媒體為核心，快速建立共享規模並轉換為生意' },
        { article: 'a14', page: 130, text: '追求個人化、績效行銷和投報，但品牌傳播較為碎片化' },
        { article: 'a14', page: 130, text: '透過品牌自己的演算法規劃，即時創造內容與 TA 間的價值交換' },
      ],
      beats: [
        {
          text: '第一個階段是 2008 年以前的「放送世代」：以電視廣告為核心，品牌透過大量媒體曝光建立知名度，但訊息是單向的，很難真正理解消費者的需求與想法。',
          src: [
            { article: 'a14', page: 129, text: '第一個階段是2008年以前的「放送世代 Broadcasting Era」' },
            { article: 'a14', page: 129, text: '品牌透過大量媒體曝光建立知名度。訊息傳播是單向的' },
            { article: 'a14', page: 129, text: '但卻很難真正理解消費者的需求與想法' },
          ],
        },
        {
          text: '第二個階段是 2009 到 2020 年的「精準世代」：數位媒體與 Cookies 讓品牌第一次看見消費者行為，競爭關鍵變成誰能用數據預測需求，並在需求發生時精準出現。',
          src: [
            { article: 'a14', page: 129, text: '第二個階段是 2009 年至 2020 年的「精準世代 Precision Era」' },
            { article: 'a14', page: 129, text: '品牌第一次有能力看見消費者行為' },
            { article: 'a14', page: 129, text: '在於誰能更有效地運用數據預測需求 (Demand)，並在需求發生時精準出現' },
          ],
        },
        {
          text: '後疫情時代進入「演算法世代」：消費者看到的內容由平台演算法主導，品牌除了理解消費者，更必須理解演算法如何理解消費者。原圖也顯示，品牌與成效投資的比重漸趨平衡。',
          src: [
            { article: 'a14', page: 129, text: '而後疫情時代，行銷產業逐漸進入第三個階段「演算法世代 Algorithmic Era」' },
            { article: 'a14', page: 129, text: '品牌除了理解消費者，更必須理解演算法如何理解消費者' },
            { article: 'a14', page: 130, text: '品牌在 BRANDING 與 成效投資上的比重變化，漸趨平衡' },
          ],
          quote: { article: 'a14', page: 130, text: '而當工具的門檻消失，差距就回到使用工具的人身上。' },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'art',
        art: 'ai-pi',
        title: 'AI 是強大的執行者，PI 是負責決策的人',
        source: '圖2：AI 是強大的執行者，尤其在 PI 三大核心能力的引導下，能實際創造兩者平衡又合一的綜效（依原圖重製）｜資料來源 凱絡媒體／製圖，強義明〈衡斷力〉紙本 p.131',
      },
      src: [{ article: 'a14', page: 131, text: 'AI 是強大的執行者，尤其在 PI 三大核心能力的引導下，能實際創造兩者平衡又合一的綜效' }],
      figures: [
        { article: 'a14', page: 131, text: '只能「生成」，不能「查核」' },
        { article: 'a14', page: 131, text: 'PI 補足 AI 的盲點，做出正確且有價值的決策' },
        { article: 'a14', page: 131, text: 'PI 的三項核心能力' },
      ],
      beats: [
        {
          text: '把 Agentic AI 想成一群能力極強的員工：能快速蒐集資訊、生成文案、製作簡報。但它的任務是生成而非核實，能生成最合理的答案，卻無法保證答案一定正確。',
          src: [
            { article: 'a14', page: 130, text: '讓我們把 Agentic AI 比喻成一群能力極強的員工' },
            { article: 'a14', page: 130, text: '它主要的任務是生成 (Generate) 而非核實 (Verify)' },
            { article: 'a14', page: 130, text: '它能生成最合理的答案 (封閉邏輯)，卻無法保證答案一定正確 (面對開放世界)' },
            { article: 'a14', page: 131, text: '強大的執行者，但缺乏判斷力' },
          ],
          more: {
            title: '什麼是 AI 幻覺？',
            text: '生成式 AI 依照訓練資料與機率推算「最像正確」的回答，不會自己查證；資料不足或問題超出範圍時，就可能一本正經地編出錯誤內容，這就是幻覺（Hallucination）。',
            quote: { article: 'a14', page: 130, text: '當資料本身存在偏誤、資訊不足，或問題超出既有知識範圍時，AI 便可能產生所謂的「幻覺 (Hallucination)」。' },
          },
        },
        {
          text: '使用者缺乏專業知識時，容易把 AI 生成的內容誤認為事實。People Intelligence 代表人類的專業決斷：如果 AI 是高效率的執行者，PI 就是負責指揮與決策的領導者。',
          src: [
            { article: 'a14', page: 130, text: '當使用者缺乏專業知識時，往往容易把 AI 生成的內容誤認為事實' },
            { article: 'a14', page: 130, text: '如果 AI 是一群高效率的執行者，那麼 PI 就是負責指揮與決策的領導者' },
            { article: 'a14', page: 131, text: '專業的決策者，具備判斷力與責任感' },
          ],
        },
        {
          text: '那麼優秀的 PI 該具備哪些能力？作者列出三項，第一項是 Sense 感知與洞察，也就是能理解市場脈絡、品牌現況與消費者需求，並從大量資訊中察覺變化與機會。',
          src: [
            { article: 'a14', page: 130, text: '那被定義為真正優秀的 PI，到底應該要具備哪些核心能力呢？' },
            { article: 'a14', page: 131, text: '第一是 Sense 感知與洞察：能夠理解市場脈絡、品牌現況與消費者需求，並從大量資訊中察覺變化與機會' },
          ],
        },
        {
          text: '第二是 Connect 創造與聯結：整合跨領域專業，把策略、創意、媒體、數據與技術串聯起來，讓想法真正落地。',
          src: [{ article: 'a14', page: 131, text: '第二是 Connect 創造與聯結：能夠整合跨領域專業，將策略、創意、媒體、數據與技術串聯起來，讓想法真正落地' }],
        },
        {
          text: '第三是 Judge 判斷與決策。Sense 看見問題、Connect 解決問題，Judge 則決定方向；一旦人放棄思考，就容易淪為 AI 答案的接收端，而不是問題的定義者。',
          src: [
            { article: 'a14', page: 131, text: '第三是 Judge 判斷與決策' },
            { article: 'a14', page: 131, text: 'Sense 負責看見問題，Connect 負責解決問題時，Judge 便是決定方向、做出正確決策的核心能力' },
            { article: 'a14', page: 131, text: '便容易淪為 AI 答案的接收端，而非問題的定義者與方向的決定者' },
          ],
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '科技領袖怎麼看：人的判斷不能外包',
      intro: {
        text: '全球產業巨頭、甚至 AI 大語言模型的創辦人，都提出了人類核心價值的倡議。結論是：讓 AI 處理可被規格化的執行，人保留不可取代的價值判斷。',
        src: [
          { article: 'a14', page: 131, text: '全球各大產業巨頭, 甚至AI大語言模型的創辦人都有提出人類核心價值的倡議' },
          { article: 'a14', page: 132, text: '讓 AI 協助可被規格化的執行項目，而讓 PI 真正不可取代的價值判斷，就是「衡斷力 (Judgment)」' },
        ],
      },
      panels: [
        {
          kicker: '微軟執行長', title: 'Satya Nadella',
          portrait: { src: '/fig/a14/people/nadella.webp', alt: 'Satya Nadella 的肖像照', credit: 'Brian Smale and Microsoft', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:MS-Exec-Nadella-Satya-2017-08-31-22_(cropped).jpg', cropped: true },
          text: '過度外包給 AI，會讓企業能力「空洞化」。企業不應只是部署 AI，而要重新設計工作流程，讓人的獨特經驗、行業脈絡判斷與組織知識發揮核心價值。',
          src: [
            { article: 'a14', page: 131, text: '過度外包給 AI，將導致企業能力「空洞化」' },
            { article: 'a14', page: 132, text: '而是要重新設計工作流程，讓人類的獨特經驗、行業脈絡判斷與組織知識發揮核心價值' },
          ],
          more: { title: 'iThome：過度外包 AI 的風險', text: '原文在這段附註的 iThome 報導，延伸這張卡片「過度外包給 AI 會讓企業能力空洞化」的討論。', links: [{ url: 'https://www.ithome.com.tw/news/176693', label: 'iThome 報導', kind: 'web' }] },
        },
        {
          kicker: 'IBM 執行長', title: 'Arvind Krishna',
          portrait: { src: '/fig/a14/people/krishna.webp', alt: 'Arvind Krishna 在 SXSW 2025 座談中發言', credit: 'Bea Phi', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Arvind_Krishna_at_SXSW_2025.jpg', cropped: true },
          text: 'AI 沒有偷走工作，是過度依賴讓人盲目。重點不在通用的操作工具，而是提升數據素養與批判性思考。',
          src: [
            { article: 'a14', page: 132, text: 'AI 沒偷走工作，是過度依賴讓人盲目' },
            { article: 'a14', page: 132, text: '而是提升數據素養 (Data Literacy) 與批判性思考 (Critical Thinking)' },
          ],
          more: { title: 'LinkedIn：AI 沒偷走工作', text: '原文在這段附註的 LinkedIn 貼文，延伸這張卡片「問題不在 AI，而在過度依賴」的觀點：重點是數據素養與批判性思考。', links: [{ url: 'https://www.linkedin.com/posts/smsubham_plot-twist-ai-didnt-steal-your-job-it-activity-7332387217983623168-xyTT%20/', label: 'LinkedIn 貼文', kind: 'social' }] },
        },
        {
          kicker: 'OpenAI 執行長', title: 'Sam Altman',
          portrait: { src: '/fig/a14/people/altman.webp', alt: 'Sam Altman 在 TechCrunch Disrupt 2019 座談中', credit: 'TechCrunch', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sam_Altman_CropEdit_James_Tamim.jpg', cropped: true },
          text: '他對 AI「不自覺轉移決策」感到危險：AI 只是提高工作速率的工具，集體決策與價值判斷的責任，絕對不能從人類手中移開。',
          src: [
            { article: 'a14', page: 132, text: '對 AI 的「不自覺轉移決策」感到危險' },
            { article: 'a14', page: 132, text: '但集體決策與價值判斷的責任，絕對不能從人類手中移開' },
          ],
          more: { title: 'Sam Altman 談 AI 與決策責任', text: '原文在這段附註的 Sam Altman 演講影片，對應這張卡片的提醒：AI 能加快工作，但決策與價值判斷的責任不能交給它。', links: [{ url: 'https://www.linkedin.com/videos/akash074_in-this-talk-openai-ceo-sam-altman-identifies-activity-7363272145814130689-r7ri', label: 'Sam Altman 演講影片', kind: 'video' }] },
        },
      ],
      source: '整理：策展者｜依據 強義明〈衡斷力〉紙本 p.131–132',
    },
    {
      kind: 'prose',
      eyebrow: '前沿企業的做法',
      heading: 'Apple × Gemini：用 AI，但不交出最終判斷權',
      beats: [
        {
          text: '2026 年初，Apple 宣布深化與 Google Gemini 的合作，把部分大型語言模型能力導入生態系統。但產品方向、隱私規範與使用者體驗的最終判斷權，Apple 並沒有交出去。',
          src: [
            { article: 'a14', page: 132, text: '2026 年初，Apple 宣布進一步深化與 Google Gemini 的合作' },
            { article: 'a14', page: 132, text: '但產品方向、隱私規範與使用者體驗的最終判斷權，Apple 並沒有交出去' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'art',
        art: 'judgment-sources',
        source: '圖：AI vs. Judgment／Judgment 的五大能力來源（依原刊資訊圖重製）｜強義明〈衡斷力〉紙本 p.132–133',
      },
      src: [{ article: 'a14', page: 133, text: 'Judgment 的五大能力來源' }],
      figures: [
        { article: 'a14', page: 133, text: '彙整大量數據與資訊' },
        { article: 'a14', page: 128, text: '答案多' },
        { article: 'a14', page: 132, text: '判斷哪些訊號值得相信' },
        { article: 'a14', page: 133, text: '決定哪些機會值得投入' },
        { article: 'a14', page: 133, text: '關鍵在於：判斷與責任' },
        { article: 'a14', page: 133, text: '理解人性與需求' },
        { article: 'a14', page: 133, text: '以數據建立洞察' },
        { article: 'a14', page: 133, text: '掌握市場與產業趨勢' },
        { article: 'a14', page: 133, text: '跨產業與專案的實戰經驗' },
        { article: 'a14', page: 133, text: '在有限資源下聚焦執行' },
      ],
      beats: [
        {
          text: '即使 AI 能協助完成 Sense 與 Connect 的部分工作，衡斷力仍是企業最不該交出的能力。AI 能彙整大量資訊，難的是判斷哪些訊號值得相信、哪些機會值得投入，並為結果負責。',
          src: [
            { article: 'a14', page: 132, text: '即使 AI 能協助完成 Sense 與 Connect 的部分工作，「衡斷力 (Judgment)」仍然是企業最不應該交出的能力' },
            { article: 'a14', page: 132, text: '難的是判斷哪些訊號值得相信、哪些機會值得投入，並對決策結果負責' },
          ],
          quote: { article: 'a14', page: 132, text: '「企業真正面對的問題，從來不是答案不夠，而是解法太多」' },
        },
        {
          text: '衡斷力可以從五個面向累積：生而為人的感受與感知、長期可驗證的數據基礎、觀察市場與產業趨勢的能力、跨產業與專案的經驗判斷，以及在有限資源下完成協作的組織能力。',
          src: [
            { article: 'a14', page: 132, text: '生而為人的感受與感知能力' },
            { article: 'a14', page: 132, text: '長期累積且可驗證的數據基礎' },
            { article: 'a14', page: 132, text: '觀察市場與產業趨勢的能力' },
            { article: 'a14', page: 132, text: '經歷不同產業與專案後形成的經驗判斷' },
            { article: 'a14', page: 132, text: '在有限資源下抓住重點並完成協作的組織能力' },
          ],
        },
        {
          text: '這些能力無法透過一次 Prompt 生成，也無法透過單一工具取得，必須經過長時間累積與磨練。',
          src: [{ article: 'a14', page: 132, text: '這些能力無法透過一次 Prompt 生成，也無法透過單一工具取得，而是必須經過長時間累積與磨練' }],
          quote: { article: 'a14', page: 133, text: 'Judgment 無法被生成，只能透過長期累積與磨練，為決策與結果負責。' },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'art',
        art: 'media-pp',
        title: 'Media++：六大模組、三個階段串聯',
        source: '圖4：Media++ 發展方向與差異化路線圖（依原圖重製）｜資料來源 凱絡媒體／製圖，強義明〈衡斷力〉紙本 p.134',
      },
      src: [{ article: 'a14', page: 134, text: 'Media++ 發展方向與差異化路線圖' }],
      figures: [
        { article: 'a14', page: 134, text: 'GROWTH STRATEGY 成長策略' },
        { article: 'a14', page: 134, text: 'EXPERIENCE TRANSFORMATION 體驗轉型' },
        { article: 'a14', page: 134, text: 'PERFORMANCE AGILITY 成效敏捷' },
      ],
      beats: [
        {
          text: '電通媒體以 Media++ 方法論培養能駕馭技術與人性的「媒體工匠」，由六大模組組成。Business 聚焦於品牌成長策略，透過效率優化、交易捕捉與品牌成長三大槓桿創造價值；Audience 透過數據資產辨識與活化真正具潛力的消費者。',
          src: [
            { article: 'a14', page: 133, text: '電通媒體以 Media++ 方法論培養演算法世代擁有 Judgment 的媒體工匠' },
            { article: 'a14', page: 133, text: '如同一位能夠駕馭技術與人性的媒體工匠' },
            { article: 'a14', page: 134, text: '這套方法論由 Business、Audience、Insight、Experience、Activation 與 Optimization六大模組組成' },
            { article: 'a14', page: 134, text: 'Business，聚焦於品牌成長策略，透過效率優化、交易捕捉與品牌成長三大槓桿創造商業價值' },
            { article: 'a14', page: 134, text: '辨識與活化真正具潛力的消費者' },
            { article: 'a14', page: 134, text: 'GROWTH STRATEGY 成長策略' },
          ],
        },
        {
          text: '接著是體驗轉型：Insight 用洞察金字塔把資料轉成資訊、知識與洞察；Experience 從 People as Themselves、Browser、Buyer 與 User 四個維度管理消費者體驗。',
          src: [
            { article: 'a14', page: 134, text: '將資料轉化為資訊、資訊累積成知識、知識提煉為洞察' },
            { article: 'a14', page: 134, text: '從People as Themselves、People as Browser、People as Buyer以及People as User四個維度管理消費者體驗' },
            { article: 'a14', page: 134, text: 'EXPERIENCE TRANSFORMATION 體驗轉型' },
          ],
        },
        {
          text: '最後是成效敏捷：Activation 把策略轉化為有效的市場行動，Optimization 依品牌成熟度與數據能力，用品牌金字塔、3×3 與 Layer Cake 等框架持續優化。',
          src: [
            { article: 'a14', page: 134, text: '協助團隊將策略轉化為具體且有效的市場行動' },
            { article: 'a14', page: 134, text: '運用品牌金字塔、3×3以及Layer Cake等優化框架' },
            { article: 'a14', page: 134, text: 'PERFORMANCE AGILITY 成效敏捷' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '放送世代比的是媒體資源，精準世代比的是數據資源；到了演算法世代，AI 讓工具能力趨於平等，企業最終的競爭不再是誰的工具更強，而是誰的衡斷更準確。',
        src: [
          { article: 'a14', page: 135, text: '在放送世代，媒體資源決定品牌能否被看見。在精準世代，數據資源決定品牌能否找到對的人' },
          { article: 'a14', page: 135, text: '企業最終的競爭將不再是誰擁有更強大的工具，而是誰擁有更準確的衡斷' },
        ],
      },
      quote: { article: 'a14', page: 135, text: 'AI 可以生成答案、提供選項、加速執行；但為決策負責、為價值定錨的，始終是人。' },
    },
  ],
  asksTitle: '帶走三句話',
  asks: [
    { article: 'a14', page: 132, text: '讓 AI 協助可被規格化的執行項目，而讓 PI 真正不可取代的價值判斷，就是「衡斷力 (Judgment)」' },
    { article: 'a14', page: 132, text: '「企業真正面對的問題，從來不是答案不夠，而是解法太多」' },
    { article: 'a14', page: 133, text: 'Judgment 無法被生成，只能透過長期累積與磨練，為決策與結果負責。' },
  ],
};
