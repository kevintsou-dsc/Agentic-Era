import type { Story } from '../../lib/story';

// 陳介立、孫郁喬、高靖萍〈People Model 讓消費者研究變成一場隨時能開口的對話〉紙本 p.96–115
// 原刊圖表：CCS 八大構面（清單）、訓練方法表（細節卡）、模擬 vs 真人散布圖（圖片）、Lisa／Cindy 對照表（art persona-duo 人物檔案）、
// Multi-Agent 分工（art agent-team）、五個模擬案例（hscroll，含兩組廣告素材圖）、三種輸出層次（layers）
export const story: Story = {
  id: 'a12',
  status: 'judged',
  oneLiner: '用十餘年 CCS 調查一比一捏塑數位分身，讓消費者研究從一次性的調查，變成隨時能追問的對話。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '報告是死的，客戶的問題卻是活的',
      beats: [
        {
          text: '25 歲的 Lisa 買 3C 先算「CP 值高嗎」，35 歲的 Cindy 先想「能不能解決我的麻煩」。這個答案不是猜出來的，而是「問了又問」出來的：同一群消費者隨時都在，隨時能追問。',
          src: [
            { article: 'a12', page: 97, text: '25 歲的 Lisa 買 3C 先算「這個 CP 值高嗎？」，35 歲的 Cindy 則先想「這東西能不能解決我的麻煩」' },
            { article: 'a12', page: 97, text: '更準確地說，是「問了又問」出來的' },
            { article: 'a12', page: 97, text: '同一群消費者，隨時都在，隨時能追問' },
          ],
        },
        {
          text: '傳統研究從問題定義、問卷設計到報告撰寫，少則數週、多則數月；等報告送到，市場可能已經轉了風向。研究成本也讓它只能用在「大哉問」上，沒有品牌會為每次臨時提問重跑焦點訪談。',
          src: [
            { article: 'a12', page: 97, text: '少則數週，多則數月。等報告送到手上，市場可能已經轉了風向' },
            { article: 'a12', page: 97, text: '研究的成本讓它只能用在「大哉問」上' },
          ],
        },
        {
          text: '過去的研究像一本印好的說明書，寫的時候很完整，但客戶要問的永遠不在那一頁上。他們真正想要的，是一個能被追問、能對話的消費者，這正是電通台灣開發 People Model 的出發點。',
          src: [
            { article: 'a12', page: 97, text: '過去的研究像一本印好的說明書，寫的時候很完整，但客戶要問的，永遠不在那一頁上' },
            { article: 'a12', page: 97, text: '他們真正想要的，是一個能被追問、能對話的消費者' },
            { article: 'a12', page: 98, text: '這正是電通台灣開發 People Model——一個可以模擬台灣消費者的模型——的出發點' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        title: '電通 CCS 消費者調查八大構面',
        items: [
          { title: '人口輪廓', desc: 'Demographics', at: 1 },
          { title: '嗜好與活動', desc: 'Hobbies & Activities', at: 1 },
          { title: '態度與興趣', desc: 'Attitudes & Interests', at: 1 },
          { title: '意見與人格', desc: 'Opinions & Personality', at: 1 },
          { title: '產品與品牌', desc: 'Products & Brands', at: 1 },
          { title: '決策與購買旅程', desc: 'Decision & Journey', at: 1 },
          { title: '媒體接觸', desc: 'Media', at: 1 },
          { title: '通路規劃', desc: 'Channel Planning', at: 1 },
        ],
        source: '圖：電通 CCS 消費者調查八大構面｜〈People Model〉紙本 p.98',
      },
      src: [{ article: 'a12', page: 98, text: '電通 CCS 消費者調查八大構面' }],
      beats: [
        {
          text: '通用模型靠「35 歲、住台北、愛運動」一句話人設去推測角色，回答自然表淺。People Model 則注入電通獨家的 CCS 資料，這是持續十餘年、每年執行的大型消費者追蹤調查。',
          src: [
            { article: 'a12', page: 98, text: '通用模型可以靠「35 歲、住台北、愛運動」這樣一句話人設去推測角色，但往往缺乏真實態度、偏好與行為的依據，回答自然表淺' },
            { article: 'a12', page: 98, text: '這是電通已持續十餘年，每年執行的大型消費者追蹤調查' },
          ],
        },
        {
          text: 'CCS 依性別、年齡及地區配額抽樣，在全台取得 5,000 份以上、15 至 74 歲的有效樣本。每位受訪者花約 60 分鐘完成數百道題，橫跨人口輪廓、生活態度、品牌關係、媒體接觸與購買行為。',
          src: [
            { article: 'a12', page: 98, text: '它採性別、年齡及地區配額抽樣，在全台取得 5,000 份以上橫跨 15 至 74 歲的有效樣本' },
            { article: 'a12', page: 98, text: '每位受訪者花約 60 分鐘完成數百道題，橫跨人口輪廓、生活態度、品牌關係、媒體接觸與購買行為' },
          ],
        },
        {
          text: '每位受訪者的資料展開成約 6,900 個資料點，一比一捏塑成數位分身，再用來微調大型語言模型。產生的不是幾千個消費者故事，而是一群有統計結構的人，稱為 AI Persona。',
          src: [
            { article: 'a12', page: 98, text: '展開成約 6,900 個資料點，利用這些資料點一比一捏塑成具備完整輪廓的數位分身' },
            { article: 'a12', page: 98, text: '它產生的不是幾千個消費者故事，而是一群有統計結構的人' },
            { article: 'a12', page: 99, text: '這些數位分身就是「虛擬消費者」，我們稱為 AI Persona' },
          ],
          more: {
            title: 'People Model 訓練方法',
            text: '模型訓練資料：電通 Consumer Connection System 消費者溝通研究資料庫，5,045 份有效樣本、台灣 15 至 74 歲、依性別年齡地區配額抽樣；每人約 60 分鐘、展開約 6,900 個資料點。訓練方法為大型語言模型微調，以未參與訓練的資料回測。',
            quote: { article: 'a12', page: 99, text: '你要它演誰，它就像誰。' },
          },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'images',
        images: [
          { src: '/fig/a12/p101-1.webp', alt: '散布圖：People Model 模擬回答比例 vs 真人調查回答比例，點沿對角線分布', w: 1060, h: 910, caption: '每個點為一個回答選項，共 9,221 點；r = 0.89 趨勢一致、MAE 9.4% 平均落差、RMSE 13.1%', credit: '資料來源：電通智能中心 真實驗證集 eval_v3（未參與訓練之留存回測）', at: 1 },
        ],
        source: '圖：People Model 模擬結果 vs. 真人調查｜資料來源 電通智能中心，〈People Model〉紙本 p.101',
      },
      src: [{ article: 'a12', page: 101, text: 'People Model 模擬結果 vs. 真人調查' }],
      figures: [
        { article: 'a12', page: 101, text: 'r = 0.89 趨勢一致' },
        { article: 'a12', page: 101, text: 'MAE 9.4% 平均落差' },
        { article: 'a12', page: 101, text: 'RMSE 13.1% 含大誤差' },
      ],
      beats: [
        {
          text: '模擬準不準，最終要用數字檢驗。團隊保留一部分未參與訓練的真實調查當測試集，就像學生讀完教材後還得通過一場獨立的期末考。結果，模擬與真人回答的相關係數達 0.89。',
          src: [
            { article: 'a12', page: 100, text: '我們保留一部分未參與訓練的真實調查資料作為測試集' },
            { article: 'a12', page: 100, text: '就像讓學生讀完教材後，還得通過一場獨立的期末考' },
            { article: 'a12', page: 100, text: '模擬與真人回答的相關係數達 0.89 (滿分 1.0)' },
          ],
        },
        {
          text: '0.89 多準？想像兩個人替同一批電影打分數：你給高分的對方也給高分，你給低分的對方也給低分，品味愈一致就愈接近 1.0。通用模型的角色扮演沒有標準答案可對，People Model 每次模擬背後都有一份真人考卷。',
          src: [
            { article: 'a12', page: 100, text: '兩個人各自替同一批電影打分數——你給高分的，對方也給高分；你給低分的，對方也給低分' },
            { article: 'a12', page: 100, text: 'People Model的每一次模擬，背後都有一份真人考卷可以檢驗' },
          ],
        },
        {
          text: '同時檢驗的還有 MAE 9.4% 與 RMSE 13.1%。但相關係數不是誤差率，不能用「1 − 0.89」推論模型平均只差 11%，也不代表模型能正確預測每一個人的行為。',
          src: [
            { article: 'a12', page: 110, text: '相關係數 0.89、MAE 9.4%、RMSE 13.1%' },
            { article: 'a12', page: 110, text: '但相關係數不是誤差率，不能用「1 - 0.89」推論模型平均只差 11%' },
            { article: 'a12', page: 110, text: '也不代表模型已全然理解人的心理機制或能正確預測每一個人的行為' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'art',
        art: 'persona-duo',
        title: '同樣是台北女性上班族，十歲之差',
        source: '表：設定兩個 AI Persona 後模擬的購買考量與心聲｜〈People Model〉紙本 p.102',
      },
      src: [{ article: 'a12', page: 102, text: '設定完兩個 AI Persona 後，可以透過 People Model 模擬他們的購買考量因素、心聲' }],
      figures: [
        { article: 'a12', page: 102, text: '價格 → 續航 → 使用者評價' },
        { article: 'a12', page: 102, text: '續航 → 規格效能 → 價格' },
      ],
      beats: [
        {
          text: '回到開場的 Lisa 和 Cindy。設定兩人的 AI Persona 後問同一件事：最近買新 3C 時在考量什麼？Lisa 依序看價格、續航、使用者評價，心裡想的是「可別花這筆錢還買到斷線爛音質」。',
          src: [
            { article: 'a12', page: 102, text: '還記得開場的 Lisa 和 Cindy 嗎？' },
            { article: 'a12', page: 102, text: '價格 → 續航 → 使用者評價 這 CP 值高不高？可別花這筆錢還買到斷線爛音質' },
          ],
        },
        {
          text: 'Cindy 則依序看續航、規格效能、價格，最怕出門在外沒電。Lisa 較開放，看重網紅試用與社群聲量；Cindy 認為代言人再紅也不代表安全好用，更看重品質聲譽與親友口碑。',
          src: [
            { article: 'a12', page: 102, text: '續航 → 規格效能 → 價格 這電池到底撐不撐得了一整天？很怕出門在外沒電很麻煩' },
            { article: 'a12', page: 102, text: 'Lisa 較開放，看重網紅試用與社群聲量；Cindy 則認為代言人再紅也不代表安全好用' },
          ],
        },
        {
          text: '這就是模擬出的「信任門檻」：不同的人對同一個行銷動作，會啟動完全不同的防禦機制。過去只能事後發現，現在能在行銷動作開始前先看到，例如為 Cindy 這類受眾強化實體試用與真實口碑。',
          src: [
            { article: 'a12', page: 102, text: '指的是不同的人對同一個行銷動作會啟動完全不同的防禦機制' },
            { article: 'a12', page: 102, text: '現在能在行銷動作開始前就先看到' },
            { article: 'a12', page: 102, text: '例如強化線下實體通路的試用體驗、或放大真實用戶口碑' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'art',
        art: 'agent-team',
        title: 'People Model 的 Multi-Agent 分工',
        source: '圖：PEOPLE MODEL MULTI-AGENT 運作流程｜資料來源 電通智能中心，〈People Model〉紙本 p.111',
      },
      src: [{ article: 'a12', page: 111, text: '一個問題進來，Super Agent 拆解並分派給 People Model、CCS Agent 與 Deep Research Agent，再把三方結果檢核彙整成一份可追問的回答' }],
      beats: [
        {
          text: '品牌的商業問題很少只有一個面向。眼前的 AI Persona 看起來是一個消費者分身，背後卻是一個多 Agent 協作的系統：由 Super Agent 擔任專案負責人，拆解問題後，再把子任務分派給各領域專家。',
          src: [
            { article: 'a12', page: 102, text: '品牌真正的商業問題，很少只有一個面向' },
            { article: 'a12', page: 102, text: '先由一位 Super Agent 擔任專案負責人，他會拆解問題、判斷需要哪些資料與分析' },
            { article: 'a12', page: 102, text: '再把子任務分派給各領域專家' },
          ],
        },
        {
          text: 'AI Persona 負責模擬消費者觀點，Deep Research Agent 搜尋網路資料補充脈絡，CCS Agent 回頭檢索原始調查驗證，最後交回 Super Agent 比對、彙整成一份完整回答。',
          src: [
            { article: 'a12', page: 102, text: '由 People Model 生成的 AI Persona 負責模擬消費者觀點' },
            { article: 'a12', page: 103, text: 'Deep Research Agent 負責搜索網路資料補充脈絡，CCS Agent 會回頭檢索原始調查做進一步驗證' },
          ],
        },
        {
          text: '作者把價值收斂成四點：快，幾分鐘內展開探索；靈活，隨時調整受眾與問法；量質並進，用數字找現象、用對話補原因；縱深，多個 Agent 補上市場、媒體與生活型態的視角。',
          src: [{ article: 'a12', page: 103, text: '快，幾分鐘內展開探索；靈活，隨時調整受眾與問法、反覆檢驗假設；量質並進，用數字找出現象、用對話補上原因；縱深，多個 Agent 協作補上市場、媒體與生活型態的完整視角' }],
        },
      ],
    },
    {
      kind: 'statement',
      eyebrow: 'Simulation Before Decision',
      text: '先模擬，再決策',
      lede: {
        text: '過去品牌最昂貴的代價，往往來自產品開發出來、預算燒下去才看成效修正。People Model 讓品牌在真實資金投入前，先在虛擬世界試錯、淘汰，只把最高勝率的方案推向真實市場。',
        src: [
          { article: 'a12', page: 104, text: '產品開發出來、廣告預算燒下去，才等著看市場成效與數據來修正方向' },
          { article: 'a12', page: 104, text: '模擬的實質價值，就是讓品牌在虛擬世界中先試錯、先淘汰，只把最高勝率的方案推向真實市場' },
        ],
      },
    },
    {
      kind: 'hscroll',
      title: '五個模擬案例：情境 → 方法 → 模擬',
      intro: {
        text: 'People Model 能派上用場的不只是「哪個比較好」。以下五個案例涵蓋創意概念、新品測試與分眾溝通，每一個都先提出問題，再看解法與模擬結果。',
        src: [
          { article: 'a12', page: 105, text: 'People Model 能派上用場的場景，遠不只回答「哪個比較好」' },
          { article: 'a12', page: 105, text: '每一個都依「情境—方法—模擬」呈現' },
        ],
      },
      panels: [
        {
          kicker: '創意概念測試', title: '極簡科技感 vs 溫潤自然感', figure: { value: '98%', label: '模擬：溫潤自然感的第一眼吸引力' },
          image: { src: '/fig/a12/p105-1.webp', alt: '模擬測試素材：溫潤自然感的一瓶多效保養品廣告', w: 569, h: 758 },
          text: '溫潤自然感以 98% 的第一眼吸引力勝出，但評估是否值得選擇時，68% 偏好極簡科技感。便利負責建立關聯，成分與功效證據負責建立可信度，兩者是同一條決策路徑的前後兩層。',
          src: [
            { article: 'a12', page: 105, text: '溫潤自然感素材以 98% 的第一眼吸引力勝出' },
            { article: 'a12', page: 106, text: '68% 偏好極簡科技感素材' },
            { article: 'a12', page: 106, text: '便利負責建立 relevance，成分與功效證據則負責建立 credibility' },
          ],
          more: {
            title: '兩個測試素材',
            image: { src: '/fig/a12/p105-2.webp', alt: '模擬測試素材：另一個包裝方向的一瓶多效保養品廣告', w: 569, h: 759, caption: '同一個「一瓶多效」概念的另一個包裝方向', credit: '〈People Model〉紙本 p.105' },
            quote: { article: 'a12', page: 106, text: '先讓消費者看見生活價值，再讓她相信一瓶真的有效。' },
          },
        },
        {
          kicker: '廣告訊息測試', title: '專業代言 vs 明星溫情',
          image: { src: '/fig/a12/p106-2.webp', alt: '模擬測試素材：知名藝人代言、母女共讀的感性版保健食品廣告', w: 661, h: 963 },
          text: '針對 45 歲以上客群，AI Persona 都偏好理性訴求與專業人士組合。感性版能留下守護家人的印象，卻沒建立清楚的產品差異，藝人代言也容易被質疑缺乏真實使用經驗。',
          src: [
            { article: 'a12', page: 106, text: '針對 45 歲以上客群，到底哪一種更打得動人？' },
            { article: 'a12', page: 106, text: '受訪 AI Persona 均偏好理性訴求與專業人士的組合' },
            { article: 'a12', page: 107, text: '情感訴求雖能留下母女共讀與守護家人的印象，卻未能建立清楚的產品差異，藝人代言也容易被質疑缺乏真實使用經驗' },
          ],
          more: {
            title: '理性版素材',
            image: { src: '/fig/a12/p106-1.webp', alt: '模擬測試素材：營養學博士代言的理性版保健食品廣告', w: 661, h: 964, caption: '理性版：強調專利成分與臨床數據，由營養學博士掛名代言', credit: '〈People Model〉紙本 p.106' },
            quote: { article: 'a12', page: 107, text: '理性訴求能否轉換，取決於博士身分、成分規格、研究與檢驗資訊是否可查證；模糊或誇大的宣稱反而會破壞信任。' },
          },
        },
        {
          kicker: '新產品上市測試', title: '手搖飲三款新口味', figure: { value: '58%', label: '模擬：荔枝烏龍首次購買率' },
          text: '荔枝烏龍以 58% 首次購買率勝出；它在 25–34 歲女性的首選率達 71%–83%，到 40–44 歲降至 36%，黑糖桂圓則升至 64%。油柑氣泡吸引力低，最多保留為小規模限定測試。',
          src: [
            { article: 'a12', page: 107, text: '荔枝烏龍以 58% 的首次購買率勝出' },
            { article: 'a12', page: 107, text: '荔枝烏龍在 25 至 34 歲女性中的首選率達 71%–83%，到了 40至 44 歲降至 36%，黑糖桂圓則在該年齡層升至 64%' },
            { article: 'a12', page: 108, text: '最多保留為小規模限定測試' },
          ],
          more: {
            title: '品牌主怎麼看',
            quote: { article: 'a12', page: 107, text: '我想石安期待的關鍵字應該是「速度」、「重複使用 (變換不同問題)」、「有進化性」吧！' },
          },
        },
        {
          kicker: '目標人群細分', title: '「25 到 44 歲男性」不是一群人', figure: { value: '71%', label: '模擬：35–44 歲避險導向比例' },
          text: '買刮鬍刀時，25–34 歲男性有 60% 偏向多付錢換耐用與售後，35–44 歲的避險導向升到 71%。前者需要評測與 CP 值證據，後者需要耐用、保固與長期省心。',
          src: [
            { article: 'a12', page: 108, text: '25 至 34 歲男性中有 60% 偏向多付一些錢換取耐用、可靠與完善售後' },
            { article: 'a12', page: 108, text: '到了 35 至 44 歲，避險導向進一步升至 71%' },
            { article: 'a12', page: 108, text: '對 25 至 34 歲應強化性能比較、評測證據與 CP 值，對 35 至 44 歲則應主打耐用、保固與長期省心' },
          ],
        },
        {
          kicker: '產品賣點測試', title: '掃地機器人只能主打一個賣點', figure: { value: '73%', label: '模擬：「售後與養護成本無憂」列為第一優先' },
          text: '雙薪家庭中，售後與養護成本無憂以 73% 成為第一優先，遠超過集塵清潔的 14% 與續航的 11%。但 49% 可能因不清楚家庭地圖與影像的資料用途而放棄購買，個資仍是門檻。',
          src: [
            { article: 'a12', page: 108, text: '但行銷預算只夠針對雙薪家庭主打一個' },
            { article: 'a12', page: 109, text: '售後與養護成本無憂 73% 成為選購第一優先，明顯領先集塵與清潔容易的 14% 及續航更久的 11%' },
            { article: 'a12', page: 109, text: '但 49% 可能因不清楚家庭地圖與影像的資料用途而放棄購買，顯示個資仍是重要門檻' },
          ],
        },
      ],
      source: '整理：策展者｜依據〈People Model〉紙本 p.105–109；百分比皆為 AI Persona 模擬結果，不是真人調查',
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'layers',
        to: 'People Model 輸出的三種層次',
        layers: [
          { title: '資料直接支持的洞察', desc: '來自真實調查、已授權問卷、第三方實測或可核對的公開資訊', at: 2 },
          { title: '模型估計', desc: '在熟悉的研究領域、但無法完全對應既有問卷時，估計可能的回答分布', at: 3 },
          { title: '情境模擬', desc: '新品牌、新概念或未發生的事件：只代表「在這組條件下模型可能如何反應」', at: 4 },
        ],
        source: '依據〈People Model〉紙本 p.112',
      },
      src: [{ article: 'a12', page: 112, text: 'People Model 的輸出可以分成以下三種概念層次' }],
      beats: [
        {
          text: '模擬也有邊界。如果先向模型介紹一個陌生品牌，再問它「是否聽過」，測量本身就已受污染；沒有參考資料時，系統會明確提出「目前證據不足」，而不是生成一組看似精確的百分比。',
          src: [
            { article: 'a12', page: 110, text: '如果先向模型介紹一個陌生品牌，再問它「是否聽過這個品牌」，測量本身就已經受到污染' },
            { article: 'a12', page: 110, text: 'People Model 系統會明確提出「目前證據不足」警告' },
            { article: 'a12', page: 112, text: '而不是逕自生成一組看似精確的百分比' },
          ],
        },
        {
          text: '因此輸出分成三種層次。第一種是資料直接支持的洞察，來自真實調查或可核對的資料，證據基礎明確，但仍要注意調查時間、樣本與適用母體。',
          src: [
            { article: 'a12', page: 112, text: '第一種是「資料直接支持的洞察」' },
            { article: 'a12', page: 112, text: '但仍需注意調查時間、樣本數、研究方法與適用母體' },
          ],
        },
        {
          text: '第二種是模型估計：問題在模型熟悉的領域、但對不上既有問卷時，系統依過去資料估計回答分布。適合形成假設，但不能被描述成實際市場調查結果。',
          src: [
            { article: 'a12', page: 112, text: '第二種是「模型估計」' },
            { article: 'a12', page: 112, text: '這類結果適合用來形成假設或協助討論，但不能被描述成實際市場調查結果' },
          ],
        },
        {
          text: '第三種是情境模擬：涉及新品牌、新概念或尚未發生的事件時，結果只代表在這組條件下模型可能的反應，不能當成市場已經發生的事實。',
          src: [
            { article: 'a12', page: 112, text: '第三種是「情境模擬」' },
            { article: 'a12', page: 112, text: '只代表「在這組條件下，模型可能如何反應」，不能被當成市場已經發生的事實' },
          ],
          quote: { article: 'a12', page: 112, text: '不是每一個問題都必須產生答案，有時候指出資料缺口，本身就是最有價值的答案。' },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'list',
        title: '三種情況，一定要搭配真人研究',
        items: [
          { title: '決策金額或風險高', desc: '例如新品上市、品牌重新定位', at: 1 },
          { title: '牽涉非理性情緒或文化脈絡', desc: '例如危機處理、敏感議題溝通', at: 1 },
          { title: 'CCS 完全沒有可參照的相近資料', desc: '全新品類或行為', at: 1 },
        ],
        source: '依據〈People Model〉紙本 p.113',
      },
      src: [{ article: 'a12', page: 113, text: '有明確的判斷原則，不是隨機的。三種情況我們會主動提醒' }],
      beats: [
        {
          text: '什麼時候要做真人研究有明確原則：決策金額或風險高、牽涉非理性情緒或文化脈絡，或 CCS 完全沒有可參照的資料。符合任一項，就搭配真人研究，用模擬做篩選、用真人做把關。',
          src: [
            { article: 'a12', page: 113, text: '一是決策金額或風險高，例如新品上市、品牌重新定位；二是牽涉非理性情緒或文化脈絡，例如危機處理、敏感議題溝通；三是 CCS 完全沒有可參照的相近資料' },
            { article: 'a12', page: 113, text: '用模擬做篩選，用真人做把關' },
          ],
        },
        {
          text: '它和尼爾森、益普索等研究公司是互補關係：一邊為特定題目重新採集一手真人資料，一邊即時讀懂 CCS 已累積的態度與動機，並能反覆深問「為什麼」。',
          src: [
            { article: 'a12', page: 114, text: '兩者是互補的關係' },
            { article: 'a12', page: 114, text: '尼爾森、益普索的強項是為特定題目重新採集一手真人資料' },
            { article: 'a12', page: 114, text: '且提供能反覆深問「為什麼」' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '高相關係數只能表示模擬與真人的變動趨勢相近，不能證明模型已理解人的心理機制。People Model 最適合被定位為協助提出假設、探索情境與加速決策的工具，而重大決策仍需要真實的人把關。',
        src: [
          { article: 'a12', page: 111, text: '模擬回答與真人回答之間的高相關係數，只能表示兩者變動趨勢相近，不能單獨證明模型已理解人的心理機制' },
          { article: 'a12', page: 104, text: '這不代表真人研究會消失，重大決策仍需要真實的人把關' },
        ],
      },
      quote: { article: 'a12', page: 111, text: 'People Model 最適合被定位為協助市場研究提出假設、探索情境與加速決策的「數位實驗場」，而不是取代真人調查的答案機器。' },
    },
  ],
  asksTitle: '帶走一個做法',
  asks: [
    { article: 'a12', page: 99, text: '對品牌來說，這意味著先模擬，再決策。把最昂貴的試錯，留在虛擬世界完成。' },
  ],
};
