import type { Story } from '../../lib/story';

// 鄭怡櫛、張家誠〈生成式體驗來臨，誰能掌握顧客的下一步？〉紙本 p.136–143
// 原刊圖表：圖1 決策地圖四個節點（layers）、表1 三個診斷問題（table，另列為帶走的問題）、圖2 CX 三階段（清單＋原圖細節卡）、
// 圖3 五大防禦支柱（清單）；文字數據：Gartner 消費者調查（長條）。p.137 插畫為裝飾，不使用
export const story: Story = {
  id: 'a15',
  status: 'judged',
  oneLiner: '顧客的下一步不再只由企業的流程決定；企業需要一張決策地圖，看見顧客在哪裡猶豫、需要什麼支援，並提供可信任的下一步。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '顧客不確定，下一步該怎麼做',
      beats: [
        {
          text: '旅客收到航班延誤通知時，不想研究票務規則，只想知道：「我還趕得上轉機嗎？不行的話，下一個可行選項是什麼？」準備買車的人更在意哪一台符合家庭、預算和保養成本，而不是從規格表開始。',
          src: [
            { article: 'a15', page: 137, text: '「我還趕得上轉機嗎？如果不行，下一個可行選項是什麼？」' },
            { article: 'a15', page: 137, text: '「不同車型差在哪？哪一台符合我的家庭、預算和保養成本？」' },
          ],
        },
        {
          text: '過去企業用顧客旅程地圖設計體驗，一步步找接觸點、降低摩擦。但當顧客先問 AI「哪個方案適合我」、搜尋結果被 AI 摘要重組，顧客的下一步就不再只由企業的預設流程決定。',
          src: [
            { article: 'a15', page: 137, text: '過去，企業採用顧客旅程地圖來設計體驗' },
            { article: 'a15', page: 137, text: '當顧客先問 AI「哪個方案適合我」、搜尋結果被 AI 摘要重組，顧客的下一步就不再只由企業的預設流程決定' },
          ],
        },
        {
          text: '企業因此還需要一張「決策地圖」：看見顧客在哪裡猶豫、需要什麼支援才能往前，把旅程中的關鍵猶豫節點放大。這也是「生成式體驗」開始重要的原因：它考驗的是情境改變時，企業能不能即時組合出合適的內容、比較方式或人工協助。',
          src: [
            { article: 'a15', page: 137, text: '也需要能夠看見顧客「在哪裡猶豫、需要什麼支援才能往前進」的決策地圖 (Decision Mapping)' },
            { article: 'a15', page: 137, text: '當顧客情境改變時，企業能不能即時組合出合適的內容、比較方式、服務流程或人工協助' },
          ],
          notes: [{ term: '生成式體驗', text: '原文是 Generative UX／Generative CX，看的是顧客情境改變時，企業能不能即時組合出合適的內容、比較方式、服務流程或人工協助（p.137）。決策地圖標出顧客在哪裡猶豫，生成式體驗就在這些地方即時給出支援。' }],
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '三個讓顧客卡住的決策斷點',
      intro: {
        text: '要讓生成式體驗發揮作用，企業得先看見顧客在哪些時刻做不出下一步的決定，也就是決策斷點。這些斷點表面上像網站、App 或客服問題，背後往往反映三個認知落差：假設顧客會照著旅程前進、把推薦當成決策支援、把導入 AI 功能視為體驗升級。',
        src: [
          { article: 'a15', page: 137, text: '這些斷點表面上像是網站、App、客服或門市問題' },
          { article: 'a15', page: 137, text: '過度假設顧客會照著旅程前進、把推薦當成決策支援、把導入 AI 功能視為體驗升級' },
        ],
      },
      panels: [
        {
          kicker: '斷點一', title: '企業設計的是旅程，顧客面對的是決策節點', figure: { value: '最多 −70%', label: 'ANA × 日立：航班異常時班表修訂審議時間' },
          text: '航空業是好例子：平常訂票看似線性，但只要遇到延誤或取消，旅程就瞬間破碎，旅客需要立刻知道還有哪些可行選項。美國航空用機器學習讓旅客自助查看改票選項；全日空與日立的 Operations Brain 系統則自動產生班表修正方案，審議時間最多縮短 70%。',
          src: [
            { article: 'a15', page: 137, text: '只要遇到延誤、取消、轉機時間縮短，旅程就會瞬間破碎' },
            { article: 'a15', page: 138, text: '美國航空 American Airlines 多年來以機器學習協助旅客在官方網站與 App 可以查看重新預訂選項' },
            { article: 'a15', page: 138, text: '將修訂審議時間最多縮短 70%' },
          ],
          more: {
            title: '從旅程地圖到決策地圖', text: '旅程地圖畫的是企業設計的流程；決策地圖則標出顧客在哪裡猶豫，再對上企業的支援機制。',
            quote: { article: 'a15', page: 138, text: '決策地圖主要是將顧客的「猶豫節點」對齊企業的「支援機制」。關注顧客在哪裡不確定、需要比較、需要保證或需要人工協助。' },
            links: [
              { url: 'https://news.aa.com/news/news-details/2025/Artificial-intelligence-at-American-CORP-OTH-01/default.aspx', label: 'American Airlines Newsroom', kind: 'web' },
              { url: 'https://www.anahd.co.jp/group/en/pr/202507/20250715-2.html', label: 'ANA × Hitachi 新聞稿', kind: 'web' },
            ],
          },
        },
        {
          kicker: '斷點二', title: '企業做的是個人化，顧客需要的是決策支援', figure: { value: '70.2%', label: 'Baymard：全球平均購物車放棄率' },
          text: '顧客猶豫時需要的往往不是更多選項，而是更清楚的比較與更可信的解釋。例如全球平均購物車放棄率約七成，近 1/5 顧客曾因流程太長或太複雜放棄結帳；這說明顧客常常不是沒有意願，而是缺少足夠信心。',
          src: [
            { article: 'a15', page: 138, text: '顧客猶豫時，需要的往往不是更多選項，而是更清楚的比較、更可信的解釋' },
            { article: 'a15', page: 138, text: '全球平均購物車放棄率約在七成 (70.2%) 上下' },
            { article: 'a15', page: 138, text: '這說明顧客常常不是沒有意願，而是缺少足夠信心' },
          ],
          more: {
            title: 'Amazon 與 momo 的做法',
            text: 'Amazon 的 AI 購物助理把商品資料、評論與規格整合成可對話的決策支援；momo 則推動商品資料治理，在規格之外補上應用場景與可解決的問題，讓 AI 能正確理解。',
            quote: { article: 'a15', page: 138, text: '在規格參數之外，補充應用場景、可解決的問題與使用效益，讓商品資訊能被 AI 正確理解與索引' },
            links: [
              { url: 'https://baymard.com/research/checkout-usability', label: 'Baymard Institute', kind: 'report' },
              { url: 'https://www.aboutamazon.com/news/retail/alexa-for-shopping-ai-assistant', label: 'Amazon Alexa for Shopping', kind: 'web' },
            ],
          },
        },
        {
          kicker: '斷點三', title: '企業導入的是 AI 功能，顧客在意服務能否延續',
          text: '客服機器人、AI 搜尋、推薦系統如果各自運作，顧客每換一個管道就要重新說明，甚至得到不一致的答案。AI Agent 更放大了這個老問題：當顧客改從外部 AI 助理出發，「跨觸點」就不只跨企業內部，還包含跨企業的代理界面。',
          src: [
            { article: 'a15', page: 139, text: '反而可能是每換一個管道就要重新說明、重新確認，甚至得到不一致的答案' },
            { article: 'a15', page: 139, text: '「跨觸點」就不只是跨企業內部，還包含跨企業的代理界面' },
          ],
          notes: [{ term: 'AI Agent', text: '能接下一項任務後，自行規劃步驟、查資料或使用工具把事情做完的 AI 程式，不只是一問一答。' }],
          more: {
            title: 'Mastercard：交易可以自動化，信任不能', text: '交易流程可以交給 AI 自動完成，但信任不會自動產生，得由企業在每個觸點持續建立。',
            quote: { article: 'a15', page: 139, text: '「You can automate commerce, but you can\'t automate trust.」' },
            links: [
              { url: 'https://www.mastercard.com/global/en/news-and-trends/stories/2025/2026-payment-trends.html', label: 'Mastercard 2026 Payment Trends', kind: 'report' },
              { url: 'https://www.jpmorgan.com/payments/newsroom/agentic-commerce-ai-future-shopping', label: 'J.P. Morgan Payments', kind: 'web' },
            ],
          },
        },
      ],
      source: '整理：策展者｜依據 鄭怡櫛、張家誠〈生成式體驗來臨〉紙本 p.137–139',
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'layers',
        to: '實踐決策地圖的四個關鍵節點',
        layers: [
          { title: '消除不確定感｜資訊層', desc: '顧客在哪裡開始迷惘？提供即時、透明的現況摘要', at: 1 },
          { title: '輔助決策比較｜評估層', desc: '顧客在哪裡陷入糾結？主動重組方案，提供下一個最佳選項', at: 2 },
          { title: '建立信任保證｜信任層', desc: '顧客在哪裡需要安全感？在關鍵點給予明確承諾或風險說明', at: 3 },
          { title: '無縫人機協同｜服務層', desc: '顧客何時需要有感溫度？AI 無法應對時，自動轉給真人', at: 4 },
        ],
        source: '圖：實踐決策地圖的關鍵節點｜資料來源 安索帕台灣／製圖，鄭怡櫛、張家誠〈生成式體驗來臨〉紙本 p.138',
      },
      src: [{ article: 'a15', page: 138, text: '實踐決策地圖的關鍵節點' }],
      figures: [
        { article: 'a15', page: 138, text: '消除不確定感(資訊層)' }, { article: 'a15', page: 138, text: '輔助決策比較(評估層)' },
        { article: 'a15', page: 138, text: '建立信任保證(信任層)' }, { article: 'a15', page: 138, text: '無縫人機協同(服務層)' },
      ],
      beats: [
        {
          text: '決策地圖的第一個節點在資訊層：找出顧客在哪裡開始迷惘，提供即時、透明的現況摘要，取代讓顧客跨平台搜尋。',
          src: [{ article: 'a15', page: 138, text: '顧客在哪裡開始迷惘? 提供即時、透明的現況摘要,取代讓顧客跨平台搜尋' }],
        },
        {
          text: '第二個節點在評估層：顧客陷入糾結時，主動重組複雜方案，提供客觀的下一個最佳選項。',
          src: [{ article: 'a15', page: 138, text: '顧客在哪裡陷入糾結? 主動重組複雜方案,提供客觀的下一個最佳選項' }],
        },
        {
          text: '第三個節點在信任層：在交易或變更的關鍵點，給予明確的承諾或風險說明，讓顧客有安全感。',
          src: [{ article: 'a15', page: 138, text: '顧客在哪裡需要安全感? 在交易或變更的關鍵點,給予明確的承諾或風險說明' }],
        },
        {
          text: '第四個節點在服務層：當 AI 無法應對異常場景時，自動把狀況說明派給真人服務，讓顧客在需要溫度時有人接手。',
          src: [{ article: 'a15', page: 138, text: '顧客何時需要有感溫度? 當AI無法應對異常場景時,自動派發狀況說明給真人服務' }],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'art',
        art: 'foundation',
        title: '生成式體驗的四個關鍵地基',
        source: '依據 鄭怡櫛、張家誠〈生成式體驗來臨〉紙本 p.140（房子與地基為策展的視覺比喻）',
      },
      src: [
        { article: 'a15', page: 140, text: '資料的透明度、流程的銜接力、規則的一致性，以及責任的可追蹤性' },
        // 地基浮窗「缺了這塊」的原文金句
        { article: 'a15', page: 139, text: 'AI 即使讀得到資料，也可能無法正確整理重點' },
        { article: 'a15', page: 139, text: '顧客感受到的仍可能是一段段無法銜接的服務' },
        { article: 'a15', page: 139, text: '每換一個管道就要重新說明、重新確認，甚至得到不一致的答案' },
        { article: 'a15', page: 142, text: '如果建議錯了，責任由誰承擔？' },
      ],
      beats: [
        {
          text: '生成式體驗不是要取代服務設計，而是讓過去難以規模化的服務理想變得可行：在對的時刻理解顧客情境、提供合適協助。例如顧客想買車時，它能依家庭成員、預算、通勤距離與保養成本整理比較方式，再引導預約試乘或轉接顧問。',
          src: [
            { article: 'a15', page: 139, text: '生成式體驗不是要取代服務設計，而是讓過去難以規模化的服務理想變得更可行' },
            { article: 'a15', page: 139, text: '能根據家庭成員、預算、通勤距離、保養成本與安全需求' },
            { article: 'a15', page: 140, text: '接著引導顧客預約試乘、估算貸款，或轉接顧問確認細節' },
          ],
        },
        {
          text: '但要做到這些，企業得先回頭檢查服務系統是否備妥四個地基：資料的透明度、流程的銜接力、規則的一致性與責任的可追蹤性。地基沒整理好，顧客反而越可能遇到不一致或無法執行的體驗災難。',
          src: [
            { article: 'a15', page: 140, text: '包含四個關鍵地基：資料的透明度、流程的銜接力、規則的一致性，以及責任的可追蹤性' },
            { article: 'a15', page: 140, text: '顧客反而越可能得到不一致或無法執行的體驗災難' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'table',
        title: '從三個核心問題開始評估',
        cols: ['診斷核心問題', '企業要直面的盲點', '可採取的第一步'],
        rows: [
          { icon: 'question', cells: ['體驗阻力診斷｜顧客為什麼猶豫？', '資訊不清、比較困難、信任不足、責任邊界模糊、流程太麻煩', '盤點 Net Promoter Score 淨推薦值開放式問題、客服客訴記錄、結帳放棄與退單原因'], at: 1 },
          { icon: 'blocks', cells: ['底層架構檢視｜為何無法延續服務？', '數據孤島（資料分散）、前後台流程無法銜接、權限不清、責任無法追蹤', '繪製跨通路服務藍圖、標出顧客猶豫斷線節點'], at: 2 },
          { icon: 'arrows', cells: ['決策輔助設計｜該提供的下一步？', '即時說明／比較、替代方案、人工確認、授權提醒、後續行動', '針對前三個流失率最高的猶豫節點，各設計小範圍 POC 概念試行方案'], at: 3 },
        ],
        source: '表1：欲啟動生成式體驗轉型，企業應從以上三個核心問題開始評估｜資料來源 安索帕台灣／製表，鄭怡櫛、張家誠〈生成式體驗來臨〉紙本 p.140',
      },
      src: [{ article: 'a15', page: 140, text: '表1：欲啟動生成式體驗轉型，企業應從以上三個核心問題開始評估' }],
      beats: [
        {
          text: '欲啟動生成式體驗轉型，可以先從三個核心問題評估。首先是體驗阻力診斷：顧客為什麼猶豫？常見盲點是資訊不清、比較困難、信任不足；第一步是盤點淨推薦值（NPS）調查的開放式回答、客服客訴、結帳放棄與退單原因。',
          src: [
            { article: 'a15', page: 140, text: '表1：欲啟動生成式體驗轉型，企業應從以上三個核心問題開始評估' },
            { article: 'a15', page: 140, text: '顧客為什麼猶豫？' },
            { article: 'a15', page: 140, text: '資訊不清、比較困難、信任不足、責任邊界模糊、流程太麻煩' },
            { article: 'a15', page: 140, text: '客服客訴記錄、結帳放棄與退單原因' },
          ],
        },
        {
          text: '其次是底層架構檢視：為何無法延續服務？企業要直面數據孤島（資料分散各處）、前後台流程無法銜接、權限不清與責任無法追蹤；第一步是繪製跨通路服務藍圖，標出顧客猶豫、斷線的節點。',
          src: [
            { article: 'a15', page: 140, text: '為何無法延續服務？' },
            { article: 'a15', page: 140, text: '數據孤島（資料分散）、前後台流程無法銜接、權限不清、責任無法追蹤' },
            { article: 'a15', page: 140, text: '繪製跨通路服務藍圖、標出顧客猶豫斷線節點' },
          ],
          notes: [{ term: '服務藍圖', text: '服務設計常用的流程圖，把顧客經歷的每個步驟，和背後員工、系統的作業對照畫在一起，用來找出斷點。' }],
        },
        {
          text: '最後是決策輔助設計：該提供的下一步是什麼？包括即時說明與比較、替代方案、人工確認、授權提醒與後續行動；第一步是針對流失率最高的三個猶豫節點，各設計小範圍的 POC（概念驗證）試行方案。',
          src: [
            { article: 'a15', page: 140, text: '該提供的下一步？' },
            { article: 'a15', page: 140, text: '即時說明/ 比較、替代方案、人工確認、授權提醒、後續行動' },
            { article: 'a15', page: 140, text: '針對前三個流失率最高的猶豫節點，各設計小範圍 POC 概念試行方案' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        layout: 'hanger',
        title: '顧客體驗三階段演進：從固定流程，走向依情境調整',
        items: [
          { title: 'Stage 1｜靜態顧客體驗 Static CX', desc: '破碎通路，被動回應', at: 1 },
          { title: 'Stage 2｜適應式顧客體驗 Adaptive CX', desc: '模組互動，情境引導', at: 2 },
          { title: 'Stage 3｜生成式顧客體驗 Generative CX', desc: '主動預測，即時數據', at: 3 },
        ],
        source: '圖：顧客體驗三階段演進歷程｜原圖以生成式 AI 工具輔助生成，概念與內容由作者規劃，鄭怡櫛、張家誠〈生成式體驗來臨〉紙本 p.141；衣架造型為策展的視覺比喻',
      },
      src: [{ article: 'a15', page: 141, text: '顧客體驗三階段演進歷程' }],
      figures: [
        { article: 'a15', page: 141, text: '破碎通路，被動回應' }, { article: 'a15', page: 141, text: '模組互動，情境引導' }, { article: 'a15', page: 141, text: '主動預測，即時數據' },
      ],
      beats: [
        {
          text: '靜態顧客體驗依靠固定內容、流程、介面與客服分類。它仍然必要，因為企業需要一致性與可管理性，但它預設顧客會照著既定路徑前進。',
          src: [
            { article: 'a15', page: 140, text: '靜態顧客體驗 (Static CX) 依靠固定內容、固定流程、固定介面與固定客服分類' },
            { article: 'a15', page: 140, text: '但它預設顧客會照著既定路徑前進' },
          ],
        },
        {
          text: '適應式顧客體驗依當下行為、歷史資料與通路脈絡調整服務。例如顧客在 App 查過某個方案，進線客服時不必從頭說明；旅客遇到延誤時，系統主動提供改票選項。',
          src: [
            { article: 'a15', page: 140, text: '適應式顧客體驗 (Adaptive CX) 根據顧客當下行為、情境、歷史資料、風險狀態與通路脈絡' },
            { article: 'a15', page: 140, text: '調整內容、服務流程與下一步建議' },
            { article: 'a15', page: 140, text: '例如顧客在 App 查過某個方案，進線客服時不必重頭說明' },
            { article: 'a15', page: 141, text: '系統主動提供可行改票選項' },
          ],
        },
        {
          text: '生成式顧客體驗再往前一步：企業不再只準備固定頁面或流程，而是準備可被組合、調用與治理的體驗能力。重點不是介面被生成，而是「下一步行動」能被即時組合出來。換句話說，三種體驗不是互相取代，而是企業從穩定服務走向即時回應的不同程度。',
          src: [
            { article: 'a15', page: 141, text: '企業不再只是準備固定頁面或固定流程，而是準備可被組合、調用與治理的體驗能力' },
            { article: 'a15', page: 141, text: '更關鍵的不是介面被生成，而是「下一步行動」能被即時組合出來' },
            { article: 'a15', page: 142, text: '這三種體驗不是互相取代，而是企業從穩定服務走向即時回應的不同程度' },
          ],
          more: {
            title: '原圖：CX 演進歷程',
            image: { src: '/fig/a15/p141-1.webp', alt: 'CX 演進歷程插圖：渠道 → 個性化路徑 → 實時預測', w: 1423, h: 694, caption: '從分散的渠道、個性化路徑，到實時預測', credit: '原圖使用生成式 AI 工具輔助生成；概念與內容由作者規劃' },
            links: [{ url: 'https://www.nngroup.com/articles/ai-paradigm/', label: 'Jakob Nielsen：AI 帶來的介面典範轉移', kind: 'web' }],
          },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'bars',
        title: '體驗越順暢，信任越不能被省略',
        axis: '消費者比例（%）',
        bars: [
          { label: '不信任', sub: 'AI 搜尋結果的可靠與公正', value: 53, display: '53%', highlight: true, at: 1 },
          { label: '更挫折', sub: 'AI 摘要比傳統搜尋', value: 41, display: '41%', at: 1 },
          { label: '想自己控制', sub: 'AI 摘要是否開啟', value: 61, display: '61%', at: 2 },
        ],
        source: '資料來源 Gartner 2025 年消費者調查，鄭怡櫛、張家誠〈生成式體驗來臨〉紙本 p.142',
      },
      src: [{ article: 'a15', page: 142, text: 'Gartner 2025 年消費者調查' }],
      figures: [
        { article: 'a15', page: 142, text: '53% 消費者對 AI-powered search results 的可靠性與公正性缺乏信心' },
        { article: 'a15', page: 142, text: '41% 認為 AI 摘要讓搜尋過程比傳統搜尋更挫折' },
        { article: 'a15', page: 142, text: '61% 希望能自行控制 AI summaries 是否開啟' },
      ],
      beats: [
        {
          text: '體驗越順暢，顧客越可能看不見背後發生什麼：系統為什麼推薦這個、用了哪些資料、錯了誰負責？Gartner 調查中，53% 消費者對 AI 搜尋結果的可靠與公正缺乏信心，41% 覺得 AI 摘要更挫折。',
          src: [
            { article: 'a15', page: 142, text: '體驗變得越順暢，顧客也越可能看不見背後發生了什麼' },
            { article: 'a15', page: 142, text: '53% 消費者對 AI-powered search results 的可靠性與公正性缺乏信心，41% 認為 AI 摘要讓搜尋過程比傳統搜尋更挫折' },
          ],
          more: {
            title: 'Gartner 調查', text: '原文引用的 Gartner 2025 年 9 月調查新聞稿，主題是消費者對 AI 搜尋結果的信任。文中 53%、41% 兩個數字出自這份調查。',
            links: [{ url: 'https://www.gartner.com/en/newsroom/press-releases/2025-09-03-gartner-survey-finds-53-percent-of-consumers-distrust-ai-powered-search-results', label: 'Gartner 新聞稿', kind: 'report' }],
          },
        },
        {
          text: '同時有 61% 希望能自行控制 AI 摘要是否開啟。正因為體驗越順暢，顧客越看不見背後發生什麼，付款確認、資料授權、改票條件提醒這些看似多出來的步驟，反而是建立信任的關鍵節點。',
          src: [
            { article: 'a15', page: 142, text: '61% 希望能自行控制 AI summaries 是否開啟' },
            { article: 'a15', page: 142, text: '付款確認、資料授權、醫療或金融建議來源、航班改票條件提醒，反而是建立信任的關鍵節點' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'art',
        art: 'pillars',
        title: '讓自動化落地：信任與安全感設計的五大防禦支柱',
        source: '圖3：信任與安全感設計的五大防禦支柱（依原圖重製）｜資料來源 安索帕台灣／製圖，鄭怡櫛、張家誠〈生成式體驗來臨〉紙本 p.142',
      },
      src: [{ article: 'a15', page: 142, text: '信任與安全感設計的五大防禦支柱' }],
      figures: [
        { article: 'a15', page: 142, text: '可信度標示' }, { article: 'a15', page: 142, text: '確認步驟' },
        { article: 'a15', page: 136, text: '真人介入觸發機制Escalation' }, { article: 'a15', page: 142, text: '資料授權' }, { article: 'a15', page: 142, text: '軌跡稽核紀錄' },
      ],
      beats: [
        {
          text: '服務越自動化，越需要用「看得懂、能確認、可選擇」三大原則建立數位信任。這三大原則落到實作，可拆成五大防禦支柱：透明度、控制權、安全網、隱私力與治理力，以下逐一舉例。',
          src: [
            { article: 'a15', page: 142, text: '當服務越趨向自動化，企業越需要透過「看得懂、能確認、可選擇」的三大原則建立數位信任' },
            { article: 'a15', page: 136, text: '透明度' }, { article: 'a15', page: 136, text: '控制權' }, { article: 'a15', page: 136, text: '安全網' },
            { article: 'a15', page: 136, text: '隱私力' }, { article: 'a15', page: 136, text: '治理力' },
          ],
        },
        {
          text: '例如透明度：在 AI 建議旁註明資料來源、更新時間與信心程度，答案的基礎透明，顧客才敢依循行動；控制權：付款、改票、簽約等高風險動作要設計顯著的確認按鈕與一鍵取消。',
          src: [
            { article: 'a15', page: 142, text: '在 AI 建議旁明確註明資料來源、更新時間、演算法信心程度。唯有讓答案的基礎透明，顧客才敢依循行動' },
            { article: 'a15', page: 142, text: '針對付款、改票、簽約等高風險或關鍵變更動作，必須設計顯著的確認按鈕，並提供一鍵取消、快速修改的彈性回溯路徑' },
          ],
        },
        {
          text: '安全網：當 AI 無法判斷、顧客明確表示不滿，或交易金額與敏感度超過門檻時，主動轉真人引導；隱私力：在設計初期就把個資法與 GDPR 規範納入系統架構；治理力：建立完整的互動日誌，作為異常發生時釐清責任的依據。',
          src: [
            { article: 'a15', page: 142, text: '當 AI 無法判斷、顧客明確表示不滿，或交易金額/敏感度超過門檻時，主動轉真人引導' },
            { article: 'a15', page: 142, text: '必須在設計初期將個資法、GDPR 規範架構化' },
            { article: 'a15', page: 142, text: '建立完整的互動日誌（Log），所有軌跡皆須可追溯、可回溯，作為異常發生時釐清責任的商務依據' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '顧客可能更少照著企業設計好的流程走，卻更期待企業在當下提供往前的下一步。因此企業要從旅程地圖走向決策地圖，從個人化推薦走向決策支援，從單點 AI 功能走向可以跨場景延續、可被治理的服務能力。',
        src: [{ article: 'a15', page: 143, text: '從旅程地圖走向決策地圖，從個人化推薦走向決策支援，從單點 AI 功能走向可以跨場景延續、可被治理的服務能力' }],
      },
      quote: { article: 'a15', page: 143, text: '未來勝出的企業，不一定是最早做出生成式介面的，而是最能把資料、內容、流程、服務規則與責任分工整理好，在顧客猶豫的時刻，提供一個可信、清楚、能被理解，也能被執行的下一步。' },
    },
  ],
  asksTitle: '啟動生成式體驗轉型前，先做三項診斷',
  asksLabels: ['體驗阻力診斷', '底層架構檢視', '決策輔助設計'],
  asks: [
    { article: 'a15', page: 140, text: '顧客為什麼猶豫？' },
    { article: 'a15', page: 140, text: '為何無法延續服務？' },
    { article: 'a15', page: 140, text: '該提供的下一步？' },
  ],
};
