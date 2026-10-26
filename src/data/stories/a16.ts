import type { Story } from '../../lib/story';

// 王馥蓓、周允玉〈贏在 AI 時代的隱形戰場：看見「文化暗流」啟動企業真實的轉型動能〉紙本 p.144–149
// 原刊圖表：圖1 AI 轉型暗流雷達圖（原刊即為示意圖，數值與項目對應不明，只列六個病灶名稱）
// 文字結構：水面上 vs 水面下（d3 冰山）、BCG 調查（長條）、3C 策略行動與案例（hscroll）
export const story: Story = {
  id: 'a16',
  status: 'judged',
  oneLiner: 'AI 轉型不是技術軍備競賽，而是組織文化的重塑；先看見水面下的文化暗流，才能釋放真實的轉型動能。',
  scenes: [
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'iceberg',
          title: '只看見水面上的冰山',
          aboveTitle: '水面上：衡量「工具能力」',
          belowTitle: '水面下：阻礙績效的「文化暗流」',
          above: [
            { label: '買了多少 AI 算力', extra: '硬體與雲端資源的投入最容易被看見，也最容易寫進年度報告；但算力只是讓 AI 能跑起來，不代表員工會用、敢用，或用在對的地方。' },
            { label: '導入多少軟體', extra: '工具清單越長，看起來越像在轉型。若沒有配套的流程與權責調整，工具往往被各部門零散使用，甚至變成沒人管的「工具孤兒」。' },
            { label: '上了多少堂 AI 課', extra: '課程時數容易統計，卻量不出行為是否改變。員工學會了操作，回到工作現場若沒有人告訴他省下的時間該做什麼，學習很快就停在原地。' },
          ],
          below: [
            { label: '員工對失業的恐懼', extra: '當員工擔心 AI 會取代自己，最理性的反應就是低調、少用、不分享成果。這種恐懼不會出現在任何系統報表上，卻會讓導入率卡住。' },
            { label: '中階主管的權力焦慮', extra: '中階主管過去的價值常來自資訊與流程的掌握。AI 讓資訊更透明、流程更短，若沒有重新定義他們的角色，就容易成為轉型中的阻塞點。' },
            { label: '跨部門的穀倉效應', extra: '各部門各自採購工具、各自保管資料，AI 就難以跨部門學習與優化。穀倉（Silos）是組織長期的分工慣性，不會因為導入新系統就自動消失。' },
          ],
          aboveAt: 1, belowAt: 2,
        },
        source: '圖：策展者依原文整理製圖｜王馥蓓、周允玉〈贏在 AI 時代的隱形戰場〉紙本 p.145',
      },
      src: [{ article: 'a16', page: 145, text: '傳統導入轉型只看見水面上的冰山' }],
      beats: [
        {
          text: '企業重金投入最新的 AI 工具，卻常陷入「高期待、高投資、低成功率」的泥淖。麥肯錫長期追蹤指出，全球高達 70% 的數位轉型專案無法達到預期目標。傳統做法只看見水面上的冰山：買了多少算力與軟體、上了多少堂 AI 課。',
          src: [
            { article: 'a16', page: 145, text: '卻往往陷入「高期待、高投資、低成功率」的轉型泥淖中' },
            { article: 'a16', page: 145, text: '全球高達 70% 企業數位轉型專案，最終無法達到預期目標' },
            { article: 'a16', page: 145, text: '例如「買了多少 AI 算力與軟體」、「上了多少堂 AI 基礎課」' },
          ],
        },
        {
          text: '失敗的真正原因無關技術門檻，而是水面下的巨大冰山：員工對失業的恐懼、中階主管對權力流失的焦慮，以及跨部門由來已久的穀倉效應。這些隱形的文化暗流，才決定 AI 轉型的成敗。',
          src: [
            { article: 'a16', page: 145, text: '其實無關於技術門檻的高低，而是與「人」及「組織文化」等非技術因素密切相關' },
            { article: 'a16', page: 145, text: '員工對失業的恐懼、中階主管對權力流失的焦慮，以及跨部門由來已久的穀倉效應 (Silos)' },
            { article: 'a16', page: 145, text: '這些隱形的「文化暗流」，才是決定 AI 轉型成敗的真正底層邏輯' },
          ],
        },
      ],
    },
    {
      kind: 'statement',
      eyebrow: '高層火熱，基層徬徨',
      text: '高階主管對轉型成果的正面感受，比基層員工高出 19%',
      lede: {
        text: '全球電通 2024 年底針對 6 個國家的企業轉型調查發現，台灣領導層雖有高度共識，這份信心卻沒有轉化為全體員工的共同語言。台灣企業轉型多半聚焦「工具層次」，卻沒真正走進「人的層次」與「文化層次」。',
        src: [
          { article: 'a16', page: 145, text: '全球電通在 2024 年底針對 6 個國家所進行的企業轉型調查發現：在台灣市場，高階主管對轉型成果的正面感受，足足比基層員工高出 19%' },
          { article: 'a16', page: 145, text: '但這份信心並未轉化為全體員工共同語言' },
          { article: 'a16', page: 145, text: '台灣企業轉型多半聚焦於「工具層次」優化，卻未真正走進「人的層次」，更遑論「文化層次」' },
        ],
      },
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'bars',
        title: 'AI 省下了時間，卻沒人說該拿來做什麼',
        axis: '受訪員工比例（%）',
        bars: [
          { label: '每週省下一天', sub: '高階 AI 工具幫基層員工省下至少整整一天', value: 42, display: '42%', at: 1 },
          { label: '沒有任何指引', sub: '不知道省下的時間該拿來做什麼', value: 66, display: '66%', highlight: true, at: 2 },
        ],
        source: '資料來源 BCG《AI at Work 2026》，王馥蓓、周允玉〈贏在 AI 時代的隱形戰場〉紙本 p.145',
      },
      src: [{ article: 'a16', page: 145, text: '波士頓顧問 (BCG) 2026 AI at Work 調查報告也印證這項觀察' }],
      figures: [
        { article: 'a16', page: 145, text: '42% 基層使用員工表示，高階 AI 工具每週幫他們省下至少整整一天工作時間' },
        { article: 'a16', page: 145, text: '但高達 66% 受訪者卻承認，根本沒有收到管理階層任何指引' },
      ],
      beats: [
        {
          text: 'BCG 2026 年的 AI at Work 調查也印證這點：42% 的基層員工表示，高階 AI 工具每週幫他們省下至少整整一天的工作時間。',
          src: [{ article: 'a16', page: 145, text: '42% 基層使用員工表示，高階 AI 工具每週幫他們省下至少整整一天工作時間' }],
        },
        {
          text: '但高達 66% 的受訪者承認，根本沒有收到管理階層任何指引，不知道省下來的這一天該做什麼。工具層次思維永遠大於人的層次配套，浪費了 AI 驅動自主創新的機會。',
          src: [
            { article: 'a16', page: 145, text: '但高達 66% 受訪者卻承認，根本沒有收到管理階層任何指引，不知道省下來的這一天該拿來做什麼' },
            { article: 'a16', page: 145, text: '「工具層次思維」永遠大於「人的層次配套」，浪費 AI 驅動自主創新文化的大好機會' },
          ],
          more: {
            title: 'BCG 報告',
            links: [{ url: 'https://www.bcg.com/publications/2026/ai-at-work-why-strategy-matters-more-than-tools', label: 'AI at Work 2026', kind: 'report' }],
          },
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '化阻力為動能：3C 三大策略行動',
      intro: {
        text: '企業必須把「人」放在「AI 工具」之前，有系統地設計員工進場的路徑。電通顧問團隊依實戰經驗提出 Check、Connect、Cultivate 三大策略行動。',
        src: [
          { article: 'a16', page: 146, text: '企業必須將「人 Human」放在「AI 工具 Technology」之前，有系統地設計員工進場的路徑' },
          { article: 'a16', page: 146, text: '提出 3C——Check、Connect、Cultivate 三大策略行動' },
        ],
      },
      panels: [
        {
          kicker: '策略行動一｜Check', title: '健檢 AI 轉型現況，找出文化暗流', figure: { value: '6.6%', label: '台灣企業完全整合 AI 於核心營運與文化的比例' },
          text: '47.8% 的台灣企業已導入 AI 專案或規模化應用，但真正完全整合 AI 於核心營運、決策與文化的只有 6.6%。電通以全員問卷加利害關係人訪談，健檢六大維度的結構性矛盾。',
          src: [
            { article: 'a16', page: 146, text: '47.8% 已進行 AI 專案導入或進行規模化的業務應用。但是真正完全整合 AI 於核心營運流程、決策模式與組織文化的企業僅有 6.6%' },
            { article: 'a16', page: 147, text: '電通顧問以全員線上問卷方式，再輔以利害關係人訪談' },
          ],
          more: {
            title: '典型病灶：經驗倚賴指數過高',
            quote: { article: 'a16', page: 147, text: '但是面對關鍵決策時，高層又回復以往仰賴直覺，忽略 AI 分析與預測的客觀數據，白白浪費了 AI 真正可以驅動的文化效益。' },
            links: [{ url: 'https://aif.tw/event/ai-research/', label: '台灣產業 AI 化大調查', kind: 'report' }],
          },
        },
        {
          kicker: '策略行動二｜Connect', title: '連結文化與商業成果', figure: { value: '227 億小時', label: 'Sanrio Time 創造的顧客體驗時間' },
          text: '企業文化是員工在沒有人監督時的行為總和。三麗鷗把「One World, Connecting Smiles」的願景，具象化為新 KPI「Sanrio Time」，以消費者沉浸於品牌體驗的時間作為經營指標。',
          src: [
            { article: 'a16', page: 147, text: '所謂企業文化是員工在沒有人監督時的行為總和' },
            { article: 'a16', page: 147, text: '具象化為全新的商業 KPI「Sanrio Time (三麗鷗時光)」' },
            { article: 'a16', page: 147, text: '更成功創造超過 227 億小時顧客體驗時間' },
          ],
          more: {
            title: '莫德納：把文化價值寫進 AI 行動',
            quote: { article: 'a16', page: 148, text: '例如「能用演算法完成的工作就不依賴人工處理」，鼓勵員工善用 AI 與低程式碼工具提升效率' },
            links: [{ url: 'https://www.modernatx.com/media-center/all-media/blogs/moderna-powered-AI', label: 'Moderna 官方部落格', kind: 'web' }],
          },
        },
        {
          kicker: '策略行動三｜Cultivate', title: '創造員工有感的象徵行動', figure: { value: '90 萬名', label: '每週使用 Ask Sam 的沃爾瑪員工' },
          text: '文化改變需要持續整地與灌溉，可以先聚焦槓桿點。沃爾瑪把 AI 直接整合進員工 App，建置「Ask Sam」語音助手，店員直接用語音問「洗手液在哪個貨架」，每天處理超過 300 萬個問題。',
          src: [
            { article: 'a16', page: 148, text: '這是一項需要持續整地、播種、灌溉的組織發展成長旅程' },
            { article: 'a16', page: 148, text: '建置「Ask Sam 」語音助手' },
            { article: 'a16', page: 148, text: '目前每週有超過 90 萬名員工使用，每天處理超過 300 萬個問題' },
          ],
          more: {
            title: '賦能員工，而不是取代員工',
            quote: { article: 'a16', page: 148, text: '只要在文化上給予員工足夠的「心理安全感」，清楚地將 AI 定位為「賦能副駕駛」，龐大的組織慣性也有機會被改變。' },
            links: [{ url: 'https://hbr.org/2026/03/the-hbr-interview-with-outgoing-walmart-ceo-doug-mcmillon', label: 'HBR 專訪沃爾瑪 CEO', kind: 'web' }],
          },
        },
      ],
      source: '整理：策展者｜依據 王馥蓓、周允玉〈贏在 AI 時代的隱形戰場〉紙本 p.146–148',
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        title: 'AI 轉型暗流診斷：六種常見病灶',
        items: [
          { title: '願景幻覺', at: 1 },
          { title: '沉默抗拒', at: 1 },
          { title: '經驗依賴', at: 1 },
          { title: '創新落差', at: 1 },
          { title: '中層阻塞', at: 1 },
          { title: '工具孤兒', at: 1 },
        ],
        source: '圖：AI 轉型暗流雷達圖示意圖（原刊為 0–100 指數示意，數值越高潛在風險越大；本頁只列病灶名稱）｜資料來源 電通商業顧問，王馥蓓、周允玉〈贏在 AI 時代的隱形戰場〉紙本 p.146',
      },
      src: [{ article: 'a16', page: 146, text: 'AI 轉型暗流雷達圖示意圖' }],
      figures: [
        { article: 'a16', page: 146, text: '願景幻覺' }, { article: 'a16', page: 146, text: '沉默抗拒' }, { article: 'a16', page: 146, text: '經驗依賴' },
        { article: 'a16', page: 146, text: '創新落差' }, { article: 'a16', page: 146, text: '中層阻塞' }, { article: 'a16', page: 146, text: '工具孤兒' },
      ],
      beats: [
        {
          text: '電通的「AI 轉型暗流指數」從文化與組織配套出發，檢視導入 AI 後在願景、心態、能力、協作、落地與價值創造六大維度上的結構性矛盾，找出轉型的落點與病灶。',
          src: [
            { article: 'a16', page: 146, text: '「AI 轉型暗流指數」(AI Transformation Undercurrent Index) 診斷工具' },
            { article: 'a16', page: 147, text: '在願景、心態、能力、協作、落地、價值創造等六大維度上所展現的結構性矛盾' },
          ],
        },
        {
          text: '許多企業停留在願景宣示，管理階層不斷描繪藍圖，卻沒有與基層對接的衡量標準，組織就陷入「願景幻覺」與「創新落差」：人人都在談 AI，卻沒有人敢真正拿它改動流程。',
          src: [
            { article: 'a16', page: 147, text: '讓組織易陷入「願景幻覺」與「創新落差」' },
            { article: 'a16', page: 147, text: '人人都在談 AI，卻沒有人敢真正拿它來改動流程' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '請暫時放下昂貴的 AI 採購清單，誠實地問自己：真的在進行 AI 轉型，還是只是買了一堆工具，丟進波濤洶湧的文化暗流？忽視水底下的暗流，再強大的 AI 引擎也只能在水面上空轉。',
        src: [
          { article: 'a16', page: 148, text: '請暫時放下手邊昂貴的 AI 採購清單，對自己的組織進行一次誠實的靈魂拷問' },
          { article: 'a16', page: 149, text: '其實只是買了一堆 AI 工具，丟進了波濤洶湧的文化暗流之中？' },
          { article: 'a16', page: 149, text: '忽視水底下的文化暗流，再強大的 AI 引擎也只能在水面上空轉' },
        ],
      },
      quote: { article: 'a16', page: 149, text: 'AI 時代的企業競爭，從來就不是一場單純的軍備競賽，而是一場高難度的組織文化重塑戰役。' },
    },
  ],
  asksTitle: '帶走一個問題',
  asks: [
    { article: 'a16', page: 148, text: '貴公司真的在進行 AI 轉型了嗎？' },
  ],
};
