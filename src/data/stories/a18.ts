import type { Story } from '../../lib/story';

// 王姿喨、詹佳穎、黃靖婷〈體驗這件事，我們一直只問了一半〉紙本 p.160–166
// 原刊沒有圖表：體驗主體擴張 UX → TX → AX（d3 同心圓）、退換貨 Agent 作者經驗（分格插畫）、
// 六個 AX 信任模式（清單）、四堵牆（hscroll）；治理三問作為帶走的問題
export const story: Story = {
  id: 'a18',
  status: 'judged',
  oneLiner: 'AI Agent 正壓縮顧客旅程、改寫品牌被選擇的方式；從 UX 到 AX，能讓人與 AI 都信任的品牌才會勝出。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '深夜裡的核對',
      beats: [
        {
          text: '晚上八點，理財顧問 Wendy 第四次把 AI Agent 剛產出的客戶資產配置報告，重新拉開 Excel 手動核對。這套 Agent 能在幾秒內彙整股票、基金與保單，上線三個月使用率卻遠低於預期。',
          src: [
            { article: 'a18', page: 161, text: '這是她今天第四次，把 AI Agent 剛剛吐出來的客戶資產配置報告，重新拉開 Excel 手動核對一遍' },
            { article: 'a18', page: 161, text: '但上線三個月後，使用率遠低於預期' },
          ],
        },
        {
          text: '問題出在它從不告訴顧問自己在做什麼：有沒有存取到最新資料、有沒有漏掉某個帳戶。它像一個悶著頭做事、從不回報進度的新人，動作再快，也沒人敢把重要的事交給它。',
          src: [
            { article: 'a18', page: 161, text: '有沒有存取到最新資料、有沒有漏掉某個帳戶、現在看到的是不是舊版本' },
            { article: 'a18', page: 161, text: '它像一個悶著頭做事、從不回報進度的新人，動作再快，也沒有人敢把重要的事交給它' },
          ],
        },
        {
          text: '問題不在 Agent 的運算能力，而在它從沒被設計成「值得被信任的工作對象」。這就是 Agent Experience（AX）要談的，而它牽動的，還有每一個正在把決策交給 AI 的顧客。',
          src: [
            { article: 'a18', page: 161, text: '問題不在 Agent 的運算能力，而在於它從來沒有被設計成「一個值得被信任的工作對象」' },
            { article: 'a18', page: 161, text: '還有每一個正在把決策交給 AI 的顧客' },
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
          kind: 'rings',
          title: '體驗的主體，一直在擴張',
          center: '體驗',
          grow: true,
          rings: [
            { label: 'UX', sub: '真實的人類消費者', desc: '從 1990 年代起，UX 的主角一直是拿著手機、坐在電腦前的消費者', extra: 'UX（使用者體驗）關心人怎麼看懂畫面、完成操作。三十年來的方法論，都假設螢幕前是一個有情緒、會猶豫的人。' },
            { label: 'TX', sub: '加上員工與決策者', desc: 'Gartner 的 Total Experience：CX、UX 與 EX 是相互牽連的生態系', extra: 'TX（整體體驗）把員工體驗也納進來：客服人員查資料很痛苦，電話那頭的顧客就不會有好體驗。但這一圈的主體仍然都是人。' },
            { label: 'AX', sub: '加上 AI Agent', desc: '讓 Agent 在互動時也有順暢、可預測、可信賴的體驗', extra: 'AX（Agent 體驗）的「使用者」是軟體：它沒有視覺和情緒，卻有決策權。好體驗的標準從好看、直覺，換成穩定、可驗證、可追溯。' },
          ],
        },
        source: '圖：策展者依原文整理製圖｜王姿喨、詹佳穎、黃靖婷〈體驗這件事，我們一直只問了一半〉紙本 p.161–162、166',
      },
      src: [{ article: 'a18', page: 166, text: '從 UX 到 Total Experience (TX)，體驗的邊界擴張了一次。從 TX 到 AX，它正在再擴張一次' }],
      beats: [
        {
          text: '在企業現場，討論的焦點永遠是那個拿著手機、坐在電腦前的消費者。從 1990 年代 Donald Norman 確立概念起，UX 從未被質疑過：體驗的主體，一直只有真實的人類消費者。',
          src: [
            { article: 'a18', page: 161, text: '討論的焦點，永遠是那個拿著手機、坐在電腦前的消費者' },
            { article: 'a18', page: 161, text: '從 1990 年代 Donald Norman 在蘋果確立概念' },
            { article: 'a18', page: 161, text: '答案一直只有一個：真實的人類消費者' },
          ],
        },
        {
          text: 'Gartner 在 2022 年提出 Total Experience 框架，把 CX、UX 與員工體驗 EX 視為相互牽連的生態系。Forrester 研究也發現，員工體驗好的企業，年均股票回報比同業高出 2.3% 至 3.8%。',
          src: [
            { article: 'a18', page: 161, text: 'Gartner 在 2022 年提出的 Total Experience (TX) 框架，是第一個系統性擴展「體驗主體」的戰略模型' },
            { article: 'a18', page: 162, text: '擁有高品質員工體驗的企業，年均股票回報比同業高出 2.3% 至 3.8%' },
          ],
        },
        {
          text: '但 TX 的主體仍然只有人。2025 年，Netlify 執行長 Mathias Biilmann 提出 Agent Experience：當 AI Agent 成為使用產品的主體之一，它在互動時也需要順暢、可預測、可信賴的體驗。',
          src: [
            { article: 'a18', page: 162, text: '但這三者加在一起，仍然只涉及一種主體，人類' },
            { article: 'a18', page: 162, text: '2025 年 1 月，雲端託管大廠 Netlify 執行長 Mathias Biilmann 提出了一個概念' },
            { article: 'a18', page: 162, text: '讓 Agent 在互動時也能有順暢、可預測、可信賴的體驗' },
          ],
          more: {
            title: '延伸閱讀：Introducing AX', text: 'Netlify 執行長 Mathias Biilmann 提出 Agent Experience（AX）的原始文章〈Introducing AX: Why Agent Experience Matters〉，也是本文 AX 一詞的出處。',
            links: [{ url: 'https://biilmann.blog/articles/introducing-ax/', label: 'Mathias Biilmann 部落格', kind: 'web' }],
          },
        },
        {
          text: '麥肯錫 2025 年的報告顯示，88% 的受訪企業已在至少一項功能中定期使用 AI，但只有約三分之一開始規模化。現在做的設計決策，將決定未來十年的基準線。',
          src: [
            { article: 'a18', page: 162, text: '88% 的受訪企業已在至少一項商業功能中定期使用 AI，但只有約三分之一開始規模化' },
            { article: 'a18', page: 162, text: '自己現在做的設計決策，將決定日後的基準線' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'art',
        art: 'journey-compress',
        title: '顧客旅程正在被壓縮',
        source: '依據 王姿喨、詹佳穎、黃靖婷〈體驗這件事，我們一直只問了一半〉紙本 p.162',
      },
      src: [{ article: 'a18', page: 162, text: '這就是顧客旅程壓縮 (Journey Compression)' }],
      beats: [
        {
          text: '過去二十年的顧客體驗建立在「人主動操作」上：有需求就搜尋、看到廣告就點擊、遇到問題就問客服。企業在顧客發出明確訊號後才回應，這是指令回應式體驗。',
          src: [
            { article: 'a18', page: 162, text: '過去二十年，顧客體驗建立在「人主動操作」的邏輯上' },
            { article: 'a18', page: 162, text: '這是一種指令回應式體驗 (Request-Based Experience)' },
          ],
        },
        {
          text: 'AI Agent 正把體驗推向代理協作式：它理解目標、判斷情境、整理選項，在授權範圍內協助完成任務。Chatbot 解決的是回答問題的效率，Agent 改變的是任務本身如何被執行。',
          src: [
            { article: 'a18', page: 162, text: 'Agent 不只是等待指令，而是理解目標、判斷情境、整理選項，並在授權範圍內協助完成任務' },
            { article: 'a18', page: 162, text: 'Chatbot 解決的是回答問題的效率，Agent 改變的是任務本身如何被執行' },
          ],
        },
        {
          text: '過去買旅遊產品要逐一比較航班、飯店、評論與保險；現在顧客只要說出預算、日期與偏好，Agent 就先整理出幾套方案。當 Agent 只呈現三個選項而不是三十個，品牌如何被理解、排序與信任，就是新的競爭場。',
          src: [
            { article: 'a18', page: 162, text: '顧客可能只需要說出預算、日期與偏好，Agent 就能先整理出幾套可執行方案' },
            { article: 'a18', page: 162, text: '當 Agent 可能只向顧客呈現三個選項而不是三十個，品牌如何被理解、被排序、被信任，將成為新的競爭場' },
          ],
        },
      ],
    },
    {
      kind: 'statement',
      eyebrow: '從需求捕捉到需求預測',
      text: '在顧客開口之前，就先理解他的狀態',
      lede: {
        text: 'AI 讓企業能理解還沒說出口的訊號：反覆查看某類商品、購買週期接近、在流程中停留過久。但同一種預測能力，可以拿來更早打擾顧客，也可以讓 Agent 懂得什麼時候該提醒、什麼時候該沉默。',
        src: [
          { article: 'a18', page: 163, text: '反覆查看某類商品、購買週期接近、在流程中停留過久' },
          { article: 'a18', page: 163, text: '同一種預測能力，可以拿來更早打擾顧客，也可以讓 Agent 懂得節制——知道什麼時候該提醒、什麼時候該協助、什麼時候該沉默' },
        ],
      },
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        title: 'AX 的六個核心信任模式',
        items: [
          { title: '意圖預覽', at: 1 },
          { title: '自主性調節', at: 1 },
          { title: '信心訊號', at: 1 },
          { title: '可解釋推理', at: 1 },
          { title: '行動稽核', at: 1 },
          { title: '升級路徑', at: 1 },
        ],
        source: '依據 王姿喨、詹佳穎、黃靖婷〈體驗這件事，我們一直只問了一半〉紙本 p.164（Pixelmojo 歸納）',
      },
      src: [{ article: 'a18', page: 164, text: '意圖預覽、自主性調節、信心訊號、可解釋推理、行動稽核、以及升級路徑' }],
      beats: [
        {
          text: 'UX 的訓練核心是同理心，但 Agent 沒有情緒，不會因為頁面好看而多停留；它會因為 API 回應不穩而中斷任務。Nielsen Norman Group 直言，2026 年信任將是 AI 體驗最核心的設計問題。',
          src: [
            { article: 'a18', page: 163, text: 'Agent 沒有情緒，不會因為頁面好看而多停留。但它會因為 API 回應不穩定而中斷任務' },
            { article: 'a18', page: 163, text: '2026 年，信任將是 AI 體驗最核心的設計問題' },
          ],
          more: {
            title: 'NN/g State of UX 2026', text: 'Nielsen Norman Group 的年度報告〈State of UX 2026〉。文中「2026 年信任將是 AI 體驗最核心的設計問題」的判斷出自這份報告。',
            links: [{ url: 'https://www.nngroup.com/articles/state-of-ux-2026/', label: 'Nielsen Norman Group', kind: 'report' }],
          },
        },
        {
          text: '信任的建立有兩層。設計層有六個 AX 信任模式：意圖預覽、自主性調節、信心訊號、可解釋推理、行動稽核與升級路徑；治理層則要先回答 AI 知道我什麼、可以替我做什麼、做錯了誰負責。',
          src: [
            { article: 'a18', page: 164, text: '一層是設計層：AI 新創公司 Pixelmojo 歸納出六個 AX 核心信任模式' },
            { article: 'a18', page: 164, text: 'AI 知道我什麼？AI 可以替我做什麼？AI 做錯了誰負責？' },
          ],
        },
        {
          text: '低風險任務如查詢訂單可以高度自動化，高風險任務如金融交易、醫療建議則需要明確確認與人工支援。顧客不授權，功能再多的 Agent 也動不了。',
          src: [
            { article: 'a18', page: 164, text: '低風險任務可以高度自動化，例如查詢訂單、安排提醒；高風險任務則需要明確確認與人工支援' },
            { article: 'a18', page: 164, text: '顧客不授權，功能再多的 Agent 也動不了' },
          ],
          quote: { article: 'a18', page: 164, text: '信任是 Agent Experience 能否運作的基礎設施。' },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'art',
        art: 'escalation',
        title: '作者團隊的經驗：一個沒有升級路徑的退換貨 Agent',
        source: '插畫：策展者繪製｜依據 王姿喨、詹佳穎、黃靖婷〈體驗這件事，我們一直只問了一半〉紙本 p.164 電商客戶導入經驗',
      },
      src: [{ article: 'a18', page: 164, text: '我們在一個電商客戶的 AI 客服 Agent 導入過程中親身見證了它的重量' }],
      beats: [
        {
          text: '六個信任模式中的「升級路徑」有多重要，作者團隊在一個電商客戶的退換貨 Agent 上親身見證：初版設計裡沒有清晰的升級路徑，遇到複雜案例時，Agent 不知道何時該停下來。',
          src: [
            { article: 'a18', page: 164, text: '最後一個信任模式，升級路徑，我們在一個電商客戶的 AI 客服 Agent 導入過程中親身見證了它的重量' },
            { article: 'a18', page: 164, text: '那是一個處理退換貨的 Agent，初版設計裡沒有清晰的升級路徑' },
            { article: 'a18', page: 164, text: '商品瑕疵、超過鑑賞期兩天、又碰上跨境退貨的物流特例' },
          ],
        },
        {
          text: 'Agent 沒有停下來，先引用一般政策，發現不適用又改口引用瑕疵品條款，兩次回覆前後矛盾。',
          src: [{ article: 'a18', page: 164, text: 'Agent 沒有停下來，繼續嘗試給答案，先引用一般政策，發現不適用後又改口引用瑕疵品條款，兩次回覆前後矛盾' }],
        },
        {
          text: '前後兩個答案讓顧客更困惑，他打出「所以到底可以退還是不可以」，語氣已經明顯不耐。',
          src: [{ article: 'a18', page: 164, text: '顧客打出「所以到底可以退還是不可以」，語氣已經明顯不耐' }],
        },
        {
          text: '後來加入門檻：一旦涉及兩項以上政策交叉判斷，Agent 主動停下，請同仁協助確認，並把三個衝突點整理成摘要轉接。改版後，這類案例的顧客滿意度不再斷崖式下滑。',
          src: [
            { article: 'a18', page: 164, text: '一旦案例涉及兩項以上政策交叉判斷，Agent 主動停下' },
            { article: 'a18', page: 164, text: '並把三個衝突點整理成摘要即時轉接' },
            { article: 'a18', page: 164, text: '這類複雜案例的顧客滿意度不再斷崖式下滑' },
          ],
          quote: { article: 'a18', page: 164, text: 'Agent 的限制，是設計出來的，不是缺陷。' },
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '從 UX 跨越到 AX，有四堵牆必須翻越',
      intro: {
        text: 'AX 不是舊酒裝新瓶：UX 的失敗發生在人看不懂畫面的那一刻，AX 的失敗發生在另一套系統沒有能力表達自己狀態的那一刻。好看、直覺的評分表，得換成穩定性、可驗證性、可追溯性。',
        src: [
          { article: 'a18', page: 164, text: 'UX 的失敗，發生在「人看不懂畫面」的那一刻；AX 的失敗，發生在「另一套系統沒有能力表達自己的狀態」的那一刻' },
          { article: 'a18', page: 165, text: '得換成穩定性、可驗證性、可追溯性這組新標準' },
        ],
      },
      panels: [
        {
          kicker: '第一堵牆', title: '從設計介面，到設計工作條件',
          text: '對 Agent 來說，介面幾乎不存在；它的工作條件是任務指令的精確度、資料存取的邊界與錯誤回饋機制。早期成功案例的共同點，不是挑了最聰明的模型，而是挑了最清晰的工作流程。',
          src: [
            { article: 'a18', page: 165, text: 'Agent 的工作條件是另一套語言：任務指令的精確度、資料存取的邊界、錯誤發生時的回饋機制' },
            { article: 'a18', page: 165, text: '共同特徵不是挑了最聰明的模型，而是挑了最清晰的工作流程去執行' },
          ],
        },
        {
          kicker: '第二堵牆', title: '從單一使用者，到多主體協同',
          text: '協同不只發生在 Agent 之間，也在顧客端與員工端之間。前台 Agent 再聰明，如果後台資料分散、流程斷裂、員工無法接手，顧客感受到的仍是不連貫的體驗。',
          src: [
            { article: 'a18', page: 165, text: '不只發生在多個 Agent 之間，也發生在顧客端與員工端之間' },
            { article: 'a18', page: 165, text: '如果前台 Agent 很聰明，但後台資料分散、流程斷裂、員工無法接手，顧客最終感受到的仍是不連貫的體驗' },
          ],
        },
        {
          kicker: '第三堵牆', title: '從單次會話，到持續關係',
          text: 'UX 優化單次會話，AX 優化持續的關係。設計師必須思考記憶架構：Agent 該記住什麼、記多久，什麼情況下記憶反而帶來偏誤而需要被重置。',
          src: [
            { article: 'a18', page: 165, text: '傳統 UX 優化的是單次會話，AX 優化的是持續的關係' },
            { article: 'a18', page: 165, text: 'Agent 應該記住什麼、記多久、什麼情況下記憶反而會帶來偏誤而需要被重置' },
          ],
        },
        {
          kicker: '第四堵牆', title: '從以人為中心，到以信任為中心',
          text: '對人類，信任靠一致的視覺語言建立；對 Agent，信任靠穩定的 API 回應與可驗證的資料格式。要讓人信任 AI，得先讓人看懂它知道什麼、被允許做什麼、實際做了什麼。',
          src: [
            { article: 'a18', page: 165, text: '對人類，信任靠一致的視覺語言建立；對 Agent，信任靠穩定的 API 回應、可驗證的資料格式建立' },
            { article: 'a18', page: 165, text: '得先讓人看懂它知道什麼、被允許做什麼、實際做了什麼' },
          ],
          more: {
            title: '世界經濟論壇：為 AI Agent 設計信任', text: '世界經濟論壇 2026 年 2 月的文章〈How to Design for Trust in the Age of AI Agents〉，是原文在第四堵牆「以信任為中心」附註的參考來源，延伸談 AI Agent 時代怎麼設計信任。',
            links: [{ url: 'https://www.weforum.org/stories/2026/02/how-to-design-for-trust-in-the-age-of-ai-agents', label: 'World Economic Forum', kind: 'web' }],
          },
        },
      ],
      source: '整理：策展者｜依據 王姿喨、詹佳穎、黃靖婷〈體驗這件事，我們一直只問了一半〉紙本 p.165',
    },
    {
      kind: 'quote',
      lead: {
        text: '未來品牌競爭不只是顧客喜不喜歡你，也包括 AI 能不能正確理解你、代表顧客選擇你。品牌的每一個承諾、條款、評價與回應速度，都可能成為 AI 判斷的一部分。',
        src: [
          { article: 'a18', page: 166, text: '也包括「AI 能不能正確理解你、判斷你、代表顧客選擇你」' },
          { article: 'a18', page: 166, text: '品牌的每一個承諾、條款、評價與回應速度，都可能成為 AI 判斷的一部分' },
        ],
      },
      quote: { article: 'a18', page: 166, text: '如果品牌只為人眼設計，卻忽視了這個正在崛起的非人類決策中介，過去所謂的「體驗設計」，其實只完成了它該完成任務的一半。' },
    },
  ],
  asksTitle: '把任務交給 AI 之前，先回答三個問題',
  asks: [
    { article: 'a18', page: 164, text: 'AI 知道我什麼？' },
    { article: 'a18', page: 164, text: 'AI 可以替我做什麼？' },
    { article: 'a18', page: 164, text: 'AI 做錯了誰負責？' },
  ],
};
