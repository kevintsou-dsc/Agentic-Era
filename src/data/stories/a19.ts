import type { Story } from '../../lib/story';

// 莊閔雯、呂季霖〈GEO 時代，被 AI 看見是技術，被消費者記住才是本事〉紙本 p.168–175
// 原刊圖表：圖1 i-Proof 五步驟（art iproof，依原圖波浪路徑重製）、CEPs 七個 W 聯想架構（清單）、CEPs 說明框（細節卡）；
// 跨國美妝集團案例的四個轉變（hscroll）
export const story: Story = {
  id: 'a19',
  status: 'judged',
  oneLiner: '被 AI 看見是技術，被消費者記住才是本事；當所有品牌都被 AI 引用，比的是溫度與情境。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '如果所有品牌都被 AI 引用了，那接下來呢？',
      beats: [
        {
          text: '過去二十年，品牌在數位世界砸下重金，只為了追逐同一個獎項：被看見。如今 AI Search 普及，許多企業開始積極投入 GEO（生成式引擎優化），瘋狂追求被 AI 引用、被 AI 推薦。',
          src: [
            { article: 'a19', page: 169, text: '過去二十年，品牌在數位世界裡砸下重金，只為了追逐同一個獎項：被看見(Visibility)' },
            { article: 'a19', page: 169, text: '使得許多企業開始積極投入 GEO (生成式引擎優化)，瘋狂追求被 AI 引用、被 AI 推薦' },
          ],
        },
        {
          text: '但消費者看完 AI 給的推薦與比較，不僅沒有立刻行動，反而轉向 Dcard、Threads、PTT 搜尋「真實評價」或「缺點」。',
          src: [{ article: 'a19', page: 169, text: '消費者看完了 AI 給出的推薦與比較，不僅沒有立刻採取行動，反而轉向 Dcard、Threads、PTT  或論壇，搜尋「真實評價」或「缺點」' }],
          quote: { article: 'a19', page: 169, text: '如果所有品牌都成功被 AI 引用了，那接下來呢？' },
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '外送平台出現大量 AI 優化的餐點圖，消費者發現與實際落差時，產生的不是購買慾而是信任流失；旅客也更相信其他人上傳的實拍，因為官方照片愈完美，愈擔心那並非真實。AI 就像一面鏡子，品牌餵給它什麼，它就吐出什麼。',
        src: [
          { article: 'a19', page: 169, text: '當消費者發現圖片與實際收到的餐點存在落差時，產生的不是購買慾望，而是信任流失' },
          { article: 'a19', page: 169, text: '因為官方照片愈完美，消費者反而愈擔心那並非真實體驗' },
          { article: 'a19', page: 170, text: 'AI 就像一面鏡子，品牌餵給它什麼，它就吐出什麼' },
        ],
      },
      quote: { article: 'a19', page: 170, text: '如果你的品牌內容只有資訊、規格、沒有溫度，即使被 AI 引用，也只是有效率地把消費者推向論壇而已。' },
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        layout: 'flatten', morphAt: 2, morphLabel: '有效率的隱形',
        title: '當大家都給標準答案，你只會成為「有效率的隱形」',
        items: [
          { title: '保養品牌', desc: '都在談「修護、保濕、抗老」', at: 1 },
          { title: '保健品牌', desc: '都在談「科學實證、專業認證」', at: 1 },
          { title: '汽車品牌', desc: '都在談「安全、科技、舒適」', at: 1 },
        ],
        source: '依據 莊閔雯、呂季霖〈GEO 時代〉紙本 p.170',
      },
      src: [{ article: 'a19', page: 170, text: '如果所有品牌都只提供安全、標準、同質化的詞彙' }],
      beats: [
        {
          text: '多數品牌為了正確性與產業標準，產出的內容像是法務與規格表拼湊出來的「標準公版」，毫無破綻也毫無情緒。AI 抓取出來的，自然是一份井然有序、卻冰冷至極的同質化報告。',
          src: [
            { article: 'a19', page: 170, text: '產出的內容都像是由法務與產品規格表拼湊出來的「標準公版」' },
            { article: 'a19', page: 170, text: 'AI 抓取出來的，自然是一份井然有序、卻冰冷至極的同質化報告' },
          ],
        },
        {
          text: '這就像電影《超完美嬌妻》：小鎮裡的妻子們符合所有理想標準，卻失去了個性。保養品牌都談修護保濕、汽車品牌都談安全舒適，AI 只會極有效率地把你包裝成「眾多相似競品中的其中一個」。',
          src: [
            { article: 'a19', page: 170, text: '小鎮裡的妻子們符合所有理想標準，卻失去了個性與辨識度' },
            { article: 'a19', page: 170, text: 'AI 只是極其有效率地，把你的品牌包裝成「眾多相似競品中的其中一個」' },
          ],
        },
      ],
    },
    {
      kind: 'statement',
      eyebrow: '戰場轉移',
      text: '從聲量佔有率，到被記住',
      lede: {
        text: '即使 AI 代勞了篩選與比較，最終按下購買鍵的仍是人。消費者不一定記得精華液的成分比例，但記得那是「專為熬夜上班族設計的急救精華」；真正進入記憶的，是帶著溫度的情境。',
        src: [
          { article: 'a19', page: 170, text: '因為即使 AI 代勞了篩選與比較，最終按下購買鍵的仍是「人」' },
          { article: 'a19', page: 171, text: '消費者不一定記得精華液的成分比例，但記得這是「專為熬夜上班族設計的急救精華」' },
          { article: 'a19', page: 171, text: '真正能進入記憶的，從來不是冰冷的資訊，而是「帶著溫度的情境」' },
        ],
      },
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'list',
        layout: 'radial', center: 'CEPs 品類進入點', centerAt: 1,
        title: 'CEPs 七個 W 的聯想架構',
        items: [
          { title: 'Why 動機', desc: '想放鬆、想省時間', at: 1 },
          { title: 'When 時機', desc: '早晨、換季、發薪日', at: 1 },
          { title: 'Where 地點', desc: '在家、辦公室、車上', at: 1 },
          { title: 'For whom 對象', desc: '家庭聚會、買給長輩', at: 1 },
          { title: 'What with 搭配', desc: '配咖啡、搭正餐', at: 1 },
          { title: 'While 同時情境', desc: '看劇時、運動後', at: 1 },
          { title: 'How feeling 情緒', desc: '疲累、想犒賞自己', at: 1 },
        ],
        source: '圖：CEPs 七個 W 的聯想架構｜莊閔雯、呂季霖〈GEO 時代〉紙本 p.171',
      },
      src: [{ article: 'a19', page: 171, text: 'CEPs 七個 W 的聯想架構' }],
      figures: [
        { article: 'a19', page: 171, text: '想放鬆、想省時間' }, { article: 'a19', page: 171, text: '早晨、換季、發薪日' }, { article: 'a19', page: 171, text: '在家、辦公室、車上' },
        { article: 'a19', page: 171, text: '家庭聚會、買給長輩' }, { article: 'a19', page: 171, text: '配咖啡、搭正餐' }, { article: 'a19', page: 171, text: '看劇時、運動後' }, { article: 'a19', page: 171, text: '疲累、想犒賞自己' },
      ],
      beats: [
        {
          text: '這也是 CEPs（品類進入點）將取代傳統關鍵字，成為 AI 時代內容戰略核心的原因。過去 SEO 研究消費者搜尋了什麼關鍵字；GEO 要研究消費者在什麼情境下產生需求，關鍵字只是需求被壓縮後的樣子。',
          src: [
            { article: 'a19', page: 171, text: '這也是為什麼CEPs（Category Entry Points，品類進入點）將取代傳統關鍵字，成為 AI 時代的戰略核心' },
            { article: 'a19', page: 171, text: '在 GEO，我們必須研究「消費者是在什麼情境下產生需求」' },
            { article: 'a19', page: 171, text: '關鍵字只是需求被壓縮後的樣子' },
          ],
          more: {
            title: '什麼是品類進入點（CEPs）？',
            quote: { article: 'a19', page: 171, text: '指的是任何會讓消費者進入某個品類思考的情境、需求或線索，例如朋友來訪、小孩出生、下午想提神，或家電突然故障。' },
          },
        },
        {
          text: '同樣一支口紅，有人為了面試、有人為了婚禮、有人為了送禮。品牌要思考的是：當帶有情緒的生活需求出現時，內容能不能讓 AI 辨識出你獨一無二的標籤，在對的情境下第一個想起你。',
          src: [
            { article: 'a19', page: 171, text: '同樣是一支口紅，有人為了面試、有人為了婚禮、有人為了送禮' },
            { article: 'a19', page: 171, text: '你的品牌內容是否能讓 AI 辨識出你獨一無二的標籤，並在對的情境下第一個想起你？' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'art',
        art: 'iproof',
        source: '圖1：i-Proof 模型：從信任到成效的五個步驟（依原圖重製）｜資料來源 安布思沛 iProspect／製圖，莊閔雯、呂季霖〈GEO 時代〉紙本 p.172',
      },
      src: [{ article: 'a19', page: 172, text: 'i-Proof 模型：從信任到成效的五個步驟' }],
      figures: [
        { article: 'a19', page: 172, text: '可抓取 & 可拆解 (Crawlability & Chunkability)' },
        { article: 'a19', page: 172, text: '可教化的答案內容 (LLM-Teachable Content)' },
        { article: 'a19', page: 172, text: 'AI 答案能見度 (AI Answer Visibility)' },
        { article: 'a19', page: 172, text: '實體與信任圖譜 (Entity & Trust Graph)' },
        { article: 'a19', page: 172, text: '持續量測 (Always-on Measurement)' },
      ],
      beats: [
        {
          text: '安布思沛開發的 i-Proof 模型，以「Trust to Performance」為核心，建立品牌從被發現、被理解，到被信任與持續被引用的五層路徑。第一層是可抓取與可拆解：用卓越的網頁架構確保爬蟲暢行無阻。',
          src: [
            { article: 'a19', page: 172, text: '開發 i-Proof 模型' },
            { article: 'a19', page: 172, text: '可抓取 & 可拆解 (Crawlability & Chunkability)' },
            { article: 'a19', page: 172, text: '以「Trust to Performance」為核心，建立品牌從被發現、被理解，到被信任與持續被引用的五層成長路徑' },
            { article: 'a19', page: 172, text: '底層技術門檻，藉由卓越的網頁架構，確保爬蟲暢行無阻' },
          ],
        },
        {
          text: '第二層是讓內容能被濃縮成答案：AI 不會完整讀每篇文章，因此內容要能濃縮成清晰的一句話定義、步驟或重點摘要，並搭配可信來源與佐證。',
          src: [{ article: 'a19', page: 173, text: '能夠被濃縮為清晰的一句話定義、步驟說明或重點摘要，同時搭配可信來源與佐證資料' }],
        },
        {
          text: '第三層是進入 AI 的推薦名單：透過主題佈局、內容覆蓋與媒體策略，提升在 ChatGPT、Perplexity、Google AI Overviews、Gemini 等答案引擎中的曝光機會。',
          src: [{ article: 'a19', page: 173, text: '提升在 ChatGPT、Perplexity、Google AI Overviews、Gemini 等主要答案引擎中的曝光機會' }],
        },
        {
          text: '第四層是讓 AI 模型記得你、信任你：透過一致的品牌實體資訊、第三方媒體背書與專業內容累積，讓品牌與特定主題形成穩定關聯。',
          src: [
            { article: 'a19', page: 173, text: '透過一致的品牌實體資訊、第三方媒體背書與專業內容累積，建立完整的品牌信任' },
            { article: 'a19', page: 173, text: '當品牌與特定主題形成穩定關聯時' },
          ],
        },
        {
          text: '第五層是把被引用轉化為可持續經營的能力：AI 能見度不是一次性成果，而是需要持續監測與優化的長期資產。',
          src: [
            { article: 'a19', page: 173, text: '將「被引用」轉化為可持續經營的能力' },
            { article: 'a19', page: 173, text: 'AI 能見度並非一次性成果，而是一項需要持續優化的長期資產' },
          ],
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '跨國美妝集團：從 SEO 到 AI Visibility 的四個轉變',
      intro: {
        text: '協助跨國美妝集團規劃 AI Search 策略時，團隊發現挑戰已不只是提升排名，而是在 AI 生成答案的過程中持續被看見、被理解，甚至被優先推薦。',
        src: [{ article: 'a19', page: 173, text: '而是如何在 AI 生成答案的過程中持續被看見、被理解，甚至被優先推薦' }],
      },
      panels: [
        {
          kicker: '轉變一', title: '從關鍵字曝光，到語境佔位',
          text: '消費者的提問從「抗老精華」這類產品詞，轉向「最近熬夜導致膚況變差怎麼辦？」這類情境問題。團隊建立品牌專屬的 CEPs 語境地圖，讓品牌與特定需求情境建立更強關聯。',
          src: [
            { article: 'a19', page: 173, text: '「最近熬夜導致膚況變差怎麼辦？」' },
            { article: 'a19', page: 173, text: '我們將策略從「關鍵字曝光」進一步提升至「語境佔位 (Context Ownership)」' },
            { article: 'a19', page: 173, text: '透過建立品牌專屬 CEPs 語境地圖' },
          ],
        },
        {
          kicker: '轉變二', title: '從網站 SEO，到全媒體 SEO',
          text: 'AI 的引用來源不只官網，也包括媒體、論壇、社群與影音平台。透過官網、第三方媒體、KOL、社群討論與影音內容的整合，建立跨平台一致的品牌訊號。',
          src: [
            { article: 'a19', page: 174, text: 'AI 搜尋結果會同時參考官網、媒體、論壇、社群與影音平台等多元資訊來源' },
            { article: 'a19', page: 174, text: '建立跨平台一致的品牌訊號' },
          ],
        },
        {
          kicker: '轉變三', title: '從網站最佳化，到 AI 可讀化',
          text: '除了基礎的 Schema Markup，再透過 FAQ、摘要段落與可引用的內容模組，提升 AI 對內容的理解效率與引用機率，讓內容能被轉化為答案的一部分。',
          src: [
            { article: 'a19', page: 174, text: '除了基礎的 Schema Markup 外，更透過 FAQ、摘要段落、可引用內容模組及結構化內容設計' },
            { article: 'a19', page: 174, text: '更能被 AI 轉化為答案的一部分' },
          ],
        },
        {
          kicker: '轉變四', title: '從排名與流量，到 AI 生態指標',
          text: '建立 AI Citation Share of Voice、引用來源分布、Time-to-Citation 等指標。流量只能告訴你有多少人來過，無法告訴你 AI 是否把你當成答案。',
          src: [
            { article: 'a19', page: 174, text: '包括 AI Citation Share of Voice、引用來源分布、 Time-to-Citation 等指標' },
            { article: 'a19', page: 174, text: '流量只能告訴你有多少人來過，無法告訴你 AI 是否把你當成答案' },
          ],
        },
      ],
      source: '整理：策展者｜依據 莊閔雯、呂季霖〈GEO 時代〉紙本 p.173–174（安布思沛服務經驗）',
    },
    {
      kind: 'quote',
      lead: {
        text: '不到兩年，品牌出現在 AI 的答案裡將成為基本門檻，而不是競爭優勢。要從「被引用」走向「被選擇」，演算法能做的到此為止；接下來比的，是品牌敢不敢展現溫度、搶佔 CEPs 情境。',
        src: [
          { article: 'a19', page: 174, text: '品牌出現在 AI 的答案裡，將成為基本門檻，而不再是競爭優勢' },
          { article: 'a19', page: 174, text: '但要從「被引用」走向「被選擇」，演算法能做的到此為止。接下來比的，是品牌敢不敢在內容中展現溫度、搶佔 CEPs 情境' },
        ],
      },
      quote: { article: 'a19', page: 174, text: '被 AI 看見，是技術的優化；被消費者記住，才是品牌的真本事。' },
    },
  ],
  asksTitle: '帶走一個問題',
  asks: [
    { article: 'a19', page: 169, text: '當消費者看著 AI 整理出來的答案，你的品牌真的被記住了嗎？' },
  ],
};
