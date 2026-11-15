import type { Story } from '../../lib/story';

// 張詠琦、蔡孟軒、楊至靜〈AI Agent 走進消費旅程：保健、美妝與零售如何把 AI 變成行動能力〉紙本 p.188–195
// 原刊圖片：圖1 Walmart Sparky（四張，逐段切換）、圖2 Olive Young（細節卡）、圖3 Thorne（細節卡）；
// 表：四層權限框架（d3 光譜＋案例標記）；文字數據：Olive Young 轉換率、Thorne 消費者調查（長條）；四個共同變化（hscroll）
export const story: Story = {
  id: 'a22',
  status: 'judged',
  oneLiner: '該問的不是要不要導入 AI Agent，而是哪些任務可以交給 AI、可以授權到哪一層級（觀察理解、推薦、決策或行動）。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '顧客問完問題，品牌沒有下一步',
      beats: [
        {
          text: '消費者愈來愈少用品牌熟悉的方式表達需求，他們會說「最近常熬夜，想找適合長期補充的營養品」，或直接請購物助理「替八個人的聚會準備食物與用品」。這些提問同時包含目的、限制、偏好與情境。',
          src: [
            { article: 'a22', page: 189, text: '今日的消費者愈來愈少用品牌熟悉的方式表達需求' },
            { article: 'a22', page: 189, text: '「最近常熬夜，想找適合長期補充的營養品」' },
            { article: 'a22', page: 189, text: '這些提問同時包含目的、限制、偏好與情境' },
          ],
        },
        {
          text: '面對這類提問，品牌的商品、會員資料與專業知識卻分散在電商、CRM、客服與門市系統中；行銷團隊能快速產出內容，卻未必能把內容、推薦、服務與交易連成一條路徑。內容產出早已不是瓶頸，卡住的是這幾段之間沒有人接手：顧客問完問題，品牌沒有下一步。',
          src: [
            { article: 'a22', page: 189, text: '這些資源往往分散在電商、CRM、客服、門市與內部系統中' },
            { article: 'a22', page: 189, text: '內容產出早已不是瓶頸。卡住的是內容、推薦與交易之間沒有人接手：顧客問完問題，品牌沒有下一步' },
          ],
        },
        {
          text: '對行銷而言，模型的選擇不是決定因素，重點是自主程度：系統被允許讀寫哪些系統，以及沒有人介入時能連續走幾步。只能產出推薦文案的 AI，和能更新購物車、觸發 CRM 的 AI，差別就在這裡。企業要盤點的，是哪些任務可以在清楚的權限下交給 AI 代表品牌推進。',
          src: [
            { article: 'a22', page: 189, text: '對行銷實務而言，模型的選擇不是決定因素，重點是自主程度' },
            { article: 'a22', page: 189, text: '這套系統被允許讀寫哪些系統，以及在沒有人介入的情況下能連續走幾步' },
            { article: 'a22', page: 189, text: '是消費旅程中有哪些任務可以在清楚的權限下，交給 AI 代表品牌往前推進' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'images',
        images: [
          { src: '/fig/a22/p190-1.webp', alt: 'Walmart app 中的 AI 購物助理 Sparky 畫面（一）', w: 629, h: 352, caption: 'Sparky 對話畫面（1／4）', credit: '資料來源：截自 Walmart 官網', at: 1 },
          { src: '/fig/a22/p190-2.webp', alt: 'Walmart app 中的 AI 購物助理 Sparky 畫面（二）', w: 629, h: 355, caption: 'Sparky 對話畫面（2／4）', credit: '資料來源：截自 Walmart 官網', at: 2 },
          { src: '/fig/a22/p190-3.webp', alt: 'Walmart app 中的 AI 購物助理 Sparky 畫面（三）', w: 629, h: 352, caption: 'Sparky 對話畫面（3／4）', credit: '資料來源：截自 Walmart 官網', at: 3 },
          { src: '/fig/a22/p190-4.webp', alt: 'Walmart app 中的 AI 購物助理 Sparky 畫面（四）', w: 629, h: 352, caption: 'Sparky 對話畫面（4／4）', credit: '資料來源：截自 Walmart 官網', at: 4 },
        ],
        source: '圖1：Walmart 的 AI Agent Sparky 從認知需求、評論搜索適當推薦，到延伸導購｜資料來源 截自 Walmart 官網，〈AI Agent 走進消費旅程〉紙本 p.190',
      },
      src: [{ article: 'a22', page: 190, text: '被 Walmart 用於服務顧客的 AI agent Sparky 一路從認知需求、評論搜索適當推薦，到延伸導購' }],
      beats: [
        {
          text: '零售的 Agentic AI（能接著採取行動的 AI）發展最快，因為任務清楚、資料充足、結果容易衡量。例如消費者輸入「替八人晚餐聚會準備食物」，系統要理解人數、預算、品類搭配、庫存與配送，單靠關鍵字很難完成。',
          src: [
            { article: 'a22', page: 189, text: '零售的 Agentic AI 發展最快，原因在於任務清楚、資料充足，行動結果也容易衡量' },
            { article: 'a22', page: 189, text: '系統需要理解人數、預算、品類搭配、庫存與配送，單靠關鍵字很難完成' },
          ],
        },
        {
          text: 'Walmart app 內建的智慧購物助理 Sparky，先統整評論、比較選項、回答問題，再依場合提出跨品類建議，能力也擴展到備餐規劃、個人化補貨與自動重新購買。',
          src: [{ article: 'a22', page: 189, text: '先統整商品評論、比較選項、回答問題，再依場合提出跨品類建議；後續能力擴展到備餐規劃、個人化補貨、自動重新購買與店內體驗' }],
        },
        {
          text: 'Walmart 公開資料指出，Sparky 的週活躍用戶在 2026 年第一季較前一季成長逾一倍，使用者的平均訂單金額約比未使用者高 35%。由此看來，對話式導購已開始連接可觀察的交易行為，而非只停在互動與流量指標。',
          src: [
            { article: 'a22', page: 190, text: 'Sparky 的週活躍用戶在 2026 年第一季較前一季成長逾一倍，使用者平均訂單金額約比未使用者高 35%' },
            { article: 'a22', page: 190, text: '對話式導購已開始連接可觀察的交易行為' },
          ],
          more: {
            title: 'Walmart 財報電話會議', text: 'Walmart 2026 財年第四季財報電話會議逐字稿（PDF，英文）。文中 Sparky 週活躍用戶成長逾一倍、使用者平均訂單金額高約 35% 的數字出自這份資料。',
            links: [{ url: 'https://corporate.walmart.com/content/dam/corporate/documents/newsroom/2026/02/19/walmart-releases-q4-fy26-earnings/q4-fy26-earnings-call-transcript.pdf', label: 'Walmart Q4 FY26 Earnings Call', kind: 'report' }],
          },
        },
        {
          text: 'Sparky 也在測試「贊助提問」：消費者討論能量飲料時，系統可能顯示由廣告主贊助的「比較含糖量」提問，回答後再接商品廣告。廣告因此有機會前移到比較商品的階段，品牌能否被看見，也愈來愈取決於產品資料能不能被 AI 理解，以及在某個任務下是否被納入候選答案。',
          src: [
            { article: 'a22', page: 190, text: 'Sparky 正測試「贊助提問」的商務功能 (Sponsored Prompt)' },
            { article: 'a22', page: 190, text: '也取決於產品資料能否被 AI 理解' },
            { article: 'a22', page: 190, text: '品牌爭取的將是在某個任務與限制下，產品有沒有被 Agent 納入候選答案' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'bars',
        title: 'Olive Young：做過膚質檢定的人，更有把握下單',
        axis: '最終購買轉換率（%）',
        bars: [
          { label: '未使用', value: 53, display: '53%', at: 2 },
          {
            label: '使用膚質檢定', value: 73, display: '73%', highlight: true, at: 2,
            more: {
              title: '門市檢測與店內導航',
              image: { src: '/fig/a22/p192-1.webp', alt: 'Olive Young 門市的膚質檢測與產品推薦畫面', w: 818, h: 712, caption: '消費者可自助或在門市人員協助下完成檢測，獲得個人專屬推薦與店內產品地圖指引', credit: '資料來源：Olive Young 官網' },
            },
          },
        ],
        source: '資料來源 CJ Olive Young，〈AI Agent 走進消費旅程〉紙本 p.191',
      },
      src: [{ article: 'a22', page: 191, text: '使用膚質檢定的消費者，最終購買轉換率為 73%，高於未使用者的 53%' }],
      figures: [{ article: 'a22', page: 191, text: '最終購買轉換率為 73%，高於未使用者的 53%' }],
      beats: [
        {
          text: '美妝的難題則在個人差異：膚質、膚色、季節與生活環境都會改變答案，大量 SKU 又讓人搜尋疲勞。韓國美妝零售巨頭 Olive Young 服務來自 189 個國家的消費者，要維持一致體驗原本得靠大量門市人員，於是導入 AI Agent 協助門市人員服務。',
          src: [
            { article: 'a22', page: 191, text: '美妝產業的難題則來自個人差異，膚質、膚色、季節、生活環境與使用偏好會改變每個人的答案' },
            { article: 'a22', page: 191, text: '韓國最大美妝零售巨頭 Olive Young 服務來自 189 個國家的消費者與觀光客' },
          ],
        },
        {
          text: 'Olive Young 在診斷與比較階段導入膚質檢定、顏色推薦與髮質檢測：機器依檢測數據判定膚質、推薦品類，處理可標準化的感知與比對；店員把時間放在解釋與建立信任。使用膚質檢定的消費者，購買轉換率 73%，高於未使用者的 53%。',
          src: [
            { article: 'a22', page: 191, text: '並在前兩段導入膚質檢定、顏色推薦與髮質檢測' },
            { article: 'a22', page: 191, text: '這套流程讓機器處理可標準化的感知與比對工作，也讓店員把時間放在解釋、建議與建立信任' },
            { article: 'a22', page: 191, text: '使用膚質檢定的消費者，最終購買轉換率為 73%，高於未使用者的 53%' },
          ],
        },
        {
          text: '下一步是購買後的持續陪伴：在顧客同意下串聯檢測、購買與使用紀錄，Agent 可以推算產品何時用完、在回購點前備好購物車，或在換季時提出保養調整建議。',
          src: [
            { article: 'a22', page: 191, text: '將從購買前的診斷與推薦，延伸到購買後的持續陪伴' },
            { article: 'a22', page: 191, text: '依上次檢測與用量推算產品耗盡的時間，在回購點前備好購物車' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'bars',
        title: '保健品：消費者早就在找個人化指引',
        axis: '受訪者比例（%）',
        bars: [
          { label: '覺得資訊矛盾', sub: '網路上的補充品資訊彼此矛盾', value: 57, display: '57%', at: 1 },
          { label: '想要個人化指引', value: 61, display: '61%', highlight: true, at: 1 },
          { label: '問過 AI', sub: '過去一個月用 AI 或 ChatGPT 尋求健康建議', value: 43, display: '43%', at: 1 },
        ],
        source: '資料來源 Thorne 委託第三方消費者調查，〈AI Agent 走進消費旅程〉紙本 p.192',
      },
      src: [{ article: 'a22', page: 192, text: '根據美國醫療級保健品牌 Thorne 委託第三方進行的消費者調查' }],
      figures: [{ article: 'a22', page: 192, text: '57% 的受訪者認為網路上的補充品資訊彼此矛盾，61% 希望獲得個人化指引，另有 43% 在過去一個月曾使用 AI 或 ChatGPT 尋求健康建議' }],
      beats: [
        {
          text: '保健品需求愈個人化，資訊風險也愈高。Thorne 委託的調查中，57% 認為網路上的補充品資訊彼此矛盾，61% 希望獲得個人化指引，43% 過去一個月用過 AI 尋求健康建議。',
          src: [
            { article: 'a22', page: 192, text: '消費需求愈來愈個人化，資訊風險也隨之升高' },
            { article: 'a22', page: 192, text: '57% 的受訪者認為網路上的補充品資訊彼此矛盾，61% 希望獲得個人化指引，另有 43% 在過去一個月曾使用 AI 或 ChatGPT 尋求健康建議' },
          ],
        },
        {
          text: 'Thorne 於 2026 年初推出 AI 健康顧問 Taia，知識基礎來自四十多年的臨床研究與專家知識。上線六個月處理超過 20 萬則訊息，94% 回饋為正面，使用者平均客單價也高出約 8%。',
          src: [
            { article: 'a22', page: 192, text: 'Thorne 於 2026 年初推出生成式 AI 健康顧問 Taia，其知識基礎來自品牌累積四十多年的臨床研究、專家知識與教育內容' },
            { article: 'a22', page: 192, text: '上線六個月，Taia 累計處理超過 20 萬則訊息，提出逾 35 萬項建議；使用者回饋有 94% 為正面，使用 Taia 的顧客平均客單價也高出約 8%' },
          ],
          more: {
            title: 'Thorne 網站上的問答助手',
            image: { src: '/fig/a22/p193-1.webp', alt: 'Thorne 購物頁面旁的專屬 AI 問答助手', w: 1600, h: 827, caption: '購物頁面旁跟著專屬問答助手，回應來自品牌長久的臨床研究與專家知識', credit: '資料來源：截自 Thorne 網站' },
            links: [{ url: 'https://www.thorne.com/take-5-daily/article/the-wellness-confidence-gap-navigating-trust-truth-and-technology-in-wellness-decisions', label: 'Thorne 消費者調查', kind: 'report' }],
          },
        },
        {
          text: '德國品牌 BRAINEFFECT 則把對話嵌入購物：AI Agent 在 WhatsApp 裡多輪了解睡眠或專注需求，確認方案後直接發送已組好商品的一鍵購物車。黑色星期五期間，對話轉換率達 25%。',
          src: [
            { article: 'a22', page: 192, text: '把 WhatsApp 從單向訊息發送管道，轉化為能夠理解需求並推進購買的互動介面' },
            { article: 'a22', page: 192, text: '系統便直接發送包含專屬折扣、且已預先組好商品的 Shopify 一鍵購物車連結' },
            { article: 'a22', page: 192, text: '黑色星期五期間，其對話轉換率達到 25%' },
          ],
          notes: [{ term: '一鍵購物車', text: '一個已預先放好商品的購物車連結，顧客點開就能直接進入結帳，不必自己逐一挑選加入。' }],
          more: {
            title: 'BRAINEFFECT × charles 案例', text: '對話式商務平台 charles 發布的 BRAINEFFECT 成功案例，說明 WhatsApp 導購怎麼運作，以及黑色星期五 25% 對話轉換率的成效。',
            links: [{ url: 'https://www.hello-charles.com/en-gb/success/braineffect-black-friday', label: 'charles 成功案例', kind: 'web' }],
          },
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '從模型能力到企業能力：四項共同變化',
      intro: {
        text: '這些案例在 Agent 設計上的自主權並不平均，能力分散在一道光譜上，從只做推薦到直接接上交易都有。但它們都看到四項共同變化，以下逐一說明。',
        src: [
          { article: 'a22', page: 193, text: '以上產業案例在 Agent 的設計上，自主權並不平均，能力分散在光譜上' },
          { article: 'a22', page: 193, text: '第一個共同變化，從回答問題走向完成任務' },
          { article: 'a22', page: 193, text: '第二個共同變化，消費者開始把一部分決策委託出去' },
          { article: 'a22', page: 194, text: '第三個共同變化，是行銷的節奏可突破檔期的限制' },
          { article: 'a22', page: 194, text: '第四個共同變化，競爭優勢從模型轉向企業能力' },
        ],
      },
      panels: [
        {
          kicker: '變化一', title: '從回答問題，走向完成任務',
          text: '生成式 AI 可以回答「哪款適合我」；Agentic 流程則不停在回答，會繼續比較選項、提出建議、串接系統並推動購買。所以衡量方式也要改：除了互動量，還要追蹤任務完成率、轉換、客單價、人工升級率（轉給真人處理的比例）與錯誤率。',
          src: [
            { article: 'a22', page: 193, text: '第一個共同變化，從回答問題走向完成任務' },
            { article: 'a22', page: 193, text: '企業更應追蹤任務完成率、轉換、客單價、人工升級率、錯誤率與顧客滿意度' },
          ],
        },
        {
          kicker: '變化二', title: '消費者把一部分決策委託出去',
          text: '當消費者把資料整理、選項比較與部分決策交給 Agent，品牌就要同時服務兩個對象：做最終感受與判斷的人，以及替消費者整理資訊、篩選方案的 AI。因此產品資料、專業知識與可驗證證據，也成為品牌溝通的一部分。',
          src: [
            { article: 'a22', page: 193, text: '品牌同時要服務兩個對象：做最終感受與判斷的人，以及替他整理資訊、篩選方案的 AI' },
            { article: 'a22', page: 193, text: '這會讓產品資料、專業知識與可驗證證據，成為品牌溝通的一部分' },
          ],
        },
        {
          kicker: '變化三', title: '行銷節奏突破檔期限制',
          text: '傳統行銷以檔期與素材為節奏，Agent 則在每次提問、購買、使用與回購之間持續工作。但若沒有記憶、CRM 與交易資料，Agent 只能做一次性推薦；要在顧客同意下記住先前的互動、依新訊號調整下一步，才可能形成長期關係。',
          src: [
            { article: 'a22', page: 194, text: '傳統行銷以檔期與素材為節奏，Agent 則在每次提問、購買、使用與回購之間持續工作' },
            { article: 'a22', page: 194, text: '能在顧客同意下保留狀態、依新訊號調整下一步，才可能形成長期關係' },
          ],
        },
        {
          kicker: '變化四', title: '競爭優勢從模型轉向企業能力',
          text: '基礎模型的取得成本持續下降，難以複製的是乾淨的顧客資料、結構化商品資訊、即時庫存與交易連接，以及治理規則。Agent 會放大企業既有能力，也會放大混亂：商品屬性沒填齊，它就可能把不含該成分的品項推進購物籃。',
          src: [
            { article: 'a22', page: 194, text: '真正難以複製的是乾淨的顧客資料、結構化商品資訊、品牌專業知識、即時庫存與交易連接' },
            { article: 'a22', page: 194, text: '商品屬性沒填齊，Agent 就會把不含該成分的品項推進購物籃' },
          ],
          notes: [{ term: '結構化商品資訊', text: '把商品的成分、規格、價格與庫存等資料，依固定欄位與格式整理好，讓系統和 AI 能直接讀取比對。' }, { term: '治理規則', text: '指企業訂好的規則，決定 AI Agent 在什麼情況下只觀察、推薦、替人決策、直接行動，或轉交真人處理。' }],
        },
      ],
      source: '整理：策展者｜依據〈AI Agent 走進消費旅程〉紙本 p.193–194',
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'spectrum',
          title: '四層權限框架：自主程度不是越高越好',
          levelsAt: 1,
          levels: [
            { label: '觀察／理解', desc: '讀取、整理資料，辨識需求與情境', extra: '企業要確認：資料來源是否可靠、是否取得必要同意。這一層 Agent 只「看」不「動」，風險最低，也是多數品牌最適合起步的地方。' },
            { label: '推薦', desc: '比較與排序選項，提出商品或服務建議', extra: '企業要確認：推薦規則、知識來源與錯誤容忍度是否清楚。推薦錯了，顧客還能自己判斷，但品牌的專業形象會受影響。' },
            { label: '決策', desc: '依既定條件替使用者選擇下一步', extra: '企業要確認：決策是否可撤回、何時需要人工確認。例如自動挑好組合或改期，顧客要能清楚看見、隨時反悔。' },
            { label: '行動', desc: '建立購物車、觸發 CRM、預約、下單或履約', extra: '企業要確認：可執行範圍、金額上限、稽核與回復機制是否明確。這一層直接動到錢與系統，出錯的代價最高。' },
          ],
          markers: [
            { label: 'Olive Young', pos: 0.5, at: 2, extra: '膚質檢測與商品推薦，主要落在觀察與推薦之間；最後的建議與購買決定，仍由門市美容顧問與顧客完成。' },
            { label: 'Thorne', pos: 1, at: 2, extra: 'Taia 根據品牌知識庫提供補充品與生活型態建議，引導顧客探索產品，但不替顧客下單，停在推薦層。' },
            { label: 'BRAINEFFECT', pos: 2, at: 2, extra: '對話後直接送出預先組好、含專屬折扣的一鍵購物車，等於替顧客做好了組合選擇，再由顧客按下結帳。' },
            { label: 'Walmart', pos: 3, at: 2, extra: 'Sparky 從拆解任務、建立購物籃一路銜接結帳與履約，是四個案例中最接近「行動」層的一個。' },
          ],
        },
        source: '圖：策展者依原文表格與案例整理製圖（案例位置為原文描述的相對位置）｜〈AI Agent 走進消費旅程〉紙本 p.194–195',
      },
      src: [{ article: 'a22', page: 194, text: '從消費旅程來看，Agent 的權限可以分成四層' }],
      figures: [
        { article: 'a22', page: 194, text: '讀取、整理資料，辨識需求與情境' },
        { article: 'a22', page: 194, text: '比較與排序選項，提出商品、內容或服務建議' },
        { article: 'a22', page: 194, text: '依既定條件替使用者選擇下一步' },
        { article: 'a22', page: 194, text: '寫入系統、建立購物車、觸發 CRM、預約、下單或啟動履約' },
      ],
      beats: [
        {
          text: '導入 Agent 不需要一步到位。更實際的做法是先釐清任務需要哪一層權限，再依風險逐步開放：觀察理解、推薦、決策，最後才是寫入系統、建立購物車或下單的行動。',
          src: [
            { article: 'a22', page: 194, text: '企業導入 Agent 並不需要一步到位' },
            { article: 'a22', page: 194, text: '先釐清某項任務需要 Agent 擁有哪一層權限，再依風險逐步開放' },
          ],
        },
        {
          text: '放回上面的四層框架看四個案例：Olive Young 與 Thorne 主要在觀察理解與推薦層；BRAINEFFECT 已把推薦接到預先組好的購物車與交易；Walmart 則延伸到跨品類任務拆解、建立購物籃與履約。',
          src: [{ article: 'a22', page: 195, text: 'Olive Young 與 Thorne 主要位於「觀察／理解」與「推薦」層；BRAINEFFECT 已把推薦接到預先組好的購物車與交易；Walmart 則把 Agent 延伸到跨品類任務拆解、建立購物籃與履約' }],
        },
        {
          text: '這些差異不只是技術成熟度的高低，更反映不同產業對風險、責任與可逆性（出錯能否撤回）的選擇。錯誤成本低、容易撤回的工作可以提高自主程度；涉及健康、敏感資料或重大支出時，應保留人工確認。',
          src: [
            { article: 'a22', page: 195, text: '更反映不同產業對風險、責任與可逆性的選擇' },
            { article: 'a22', page: 195, text: '錯誤成本低、容易撤回的工作可以提高自主程度；涉及健康、敏感資料、重大支出或品牌聲譽時，應保留人工確認' },
          ],
          quote: { article: 'a22', page: 195, text: 'Agent 的成熟度不等於自主權越高越好。' },
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '所以企業不必先做「要不要導入」的二選一。更務實的起點，是找出顧客旅程中常發生、卡關多、要整合多項資訊且最後得採取下一步的任務，例如保健品的補貨提醒、美妝門市的診斷推薦、零售的聚會採買。目標清楚、資料可得、風險可控又能衡量的，值得優先投入。',
        src: [
          { article: 'a22', page: 195, text: '是找出顧客旅程中高頻、高摩擦、需要整合多項資訊，且最後必須採取下一步的任務' },
          { article: 'a22', page: 195, text: '會是那些目標清楚、資料可得、風險可控、能被衡量，並且確實能替顧客減少決策摩擦的任務' },
        ],
      },
      quote: { article: 'a22', page: 195, text: '權限與治理設計得多清楚，決定了品牌能把多少任務真的交給 Agent。' },
    },
  ],
  asksTitle: '導入 AI Agent 前，先回答四個問題',
  asks: [
    { article: 'a22', page: 195, text: '哪一個消費旅程中的摩擦值得先被解決？' },
    { article: 'a22', page: 195, text: 'Agent 可以使用哪些資料？' },
    { article: 'a22', page: 195, text: 'Agent 可以做到哪一層？' },
    { article: 'a22', page: 195, text: '誰對 Agent 的輸出與行動負責？' },
  ],
};
