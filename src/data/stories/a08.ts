import type { Story } from '../../lib/story';

// 何華軒〈當注意力成為稀缺資源：娛樂與運動如何累積品牌心智資產？〉紙本 p.58–65
// 原刊圖表：圖1 魔女宅急便、圖2 憤怒鳥、圖3 Catchplay+ 短劇、圖4 啦啦隊、圖5 鑑定師（照片）；圖6 IP 生態系（d3 循環）
export const story: Story = {
  id: 'a08',
  status: 'judged',
  oneLiner: '品牌可以買到曝光，卻買不到記憶。娛樂與運動創造的共同記憶，才能把注意力變成品牌心智資產。',
  scenes: [
    {
      kind: 'graphic',
      graphic: {
        type: 'hbars',
        label: '平均停留在單一螢幕的時間',
        rows: [
          { label: '2004', value: 150, display: '約 150 秒', at: 1 },
          { label: '現在', value: 47, display: '約 47 秒', highlight: true, at: 2 },
        ],
        big: { from: '150', to: '47', unit: '秒', at: 3 },
        source: 'Gloria Mark（UC Irvine 資訊學系榮譽教授）研究，何華軒〈當注意力成為稀缺資源〉紙本 p.59',
      },
      src: [{ article: 'a08', page: 59, text: '平均停留在單一螢幕上的時間已從2004 的約 150 秒下降至約 47 秒' }],
      beats: [
        {
          text: 'UC Irvine 資訊學系榮譽教授 Gloria Mark 長期研究人與數位科技的互動，她發現 2004 年，人們平均在單一螢幕上停留約 150 秒。',
          src: [
            { article: 'a08', page: 59, text: '資訊學系榮譽教授' },
            { article: 'a08', page: 59, text: '平均停留在單一螢幕上的時間已從2004 的約 150 秒下降至約 47 秒' },
          ],
        },
        {
          text: '如今，人們平均停留在單一螢幕上的時間已下降到約 47 秒。從社群、串流、短影音到生成式 AI，每天都有大量內容在爭奪我們有限的時間與注意力。',
          src: [
            { article: 'a08', page: 59, text: '平均停留在單一螢幕上的時間已從2004 的約 150 秒下降至約 47 秒' },
            { article: 'a08', page: 59, text: '從社群平台、串流影音、短影音到生成式 AI，內容生產的門檻不斷降低' },
            { article: 'a08', page: 59, text: '每天都有大量內容，在爭奪我們有限的時間與注意力' },
          ],
        },
        {
          text: '但消費者並非失去了專注能力，而是對內容的選擇變得更加挑剔。品牌真正的挑戰，是如何在消費者短暫的注意力停留中，建立情感連結、留下品牌記憶。',
          src: [
            { article: 'a08', page: 59, text: '消費者並非失去了專注能力，而是對內容的選擇變得更加挑剔' },
            { article: 'a08', page: 59, text: '如何在消費者短暫的注意力停留中建立情感連結、留下品牌記憶' },
          ],
        },
      ],
    },
    {
      kind: 'prose',
      eyebrow: '為什麼是娛樂與運動',
      heading: '情緒價值，成為消費的核心驅動力',
      beats: [
        {
          text: '在注意力高度碎片化的環境下，人們越來越難被單純的產品資訊吸引，反而更願意為情緒價值買單；快樂、感動、陪伴、療癒與歸屬感，都成了驅動消費的因素。',
          src: [
            { article: 'a08', page: 59, text: '人們越來越難被單純的產品資訊吸引，反而更願意為情緒價值買單' },
            { article: 'a08', page: 59, text: '無論是快樂、感動、陪伴、療癒還是歸屬感，情緒價值正逐漸成為驅動消費決策的重要因素' },
          ],
        },
        {
          text: '這在 Gen Z 身上最明顯。成長於資訊爆炸與高度競爭的環境，他們發展出「與其一味追求成功，不如先照顧好自己的情緒狀態」的生活哲學；而這群約佔全球人口四分之一的世代，貢獻了近四成的消費影響力。',
          src: [
            { article: 'a08', page: 59, text: '與其一味追求成功，不如先照顧好自己的情緒狀態' },
            { article: 'a08', page: 59, text: 'Gen Z 約占全球人口四分之一，並貢獻近四成的消費影響力' },
          ],
        },
        {
          text: '對 Gen Z 來說，選擇品牌是在表達自己的價值觀、興趣圈層與身份認同，品牌是否參與文化，往往比產品本身更能影響他們的選擇。',
          src: [
            { article: 'a08', page: 60, text: '而是透過品牌表達自己的價值觀、興趣圈層與身份認同' },
            { article: 'a08', page: 60, text: '往往比產品本身更能影響他們的選擇' },
          ],
          quote: { article: 'a08', page: 60, text: '品牌競爭的核心也正從 Share of Voice（聲量占比）逐漸轉向 Share of Culture（文化占比），誰能夠進入文化討論，誰就更有機會進入消費者心中。' },
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '粉絲經濟的六個現場',
      intro: {
        text: '文化討論發生在六個現場，它們是文化佔比被重新分配的第一線，也是品牌累積共同記憶的入口。',
        src: [{ article: 'a08', page: 60, text: '以下六個現場是文化占比被重新分配的第一線，也是品牌累積共同記憶的六個入口' }],
      },
      panels: [
        {
          kicker: '現場 1', title: '二次元', figure: { value: '50.5 萬人次', label: '2026 台北國際動漫節' },
          text: '2026 年台北國際動漫節吸引超過 50.5 萬人次、創造約 2.5 億元商機。粉絲主動參與二創與應援，被納入其中的品牌，才真正進入這個生態。',
          src: [
            { article: 'a08', page: 60, text: '2026 年台北國際動漫節吸引超過 50.5 萬人次參與，創造約 2.5 億元商機' },
            { article: 'a08', page: 60, text: '被納入二創與應援的品牌，才真正進入了這個生態' },
          ],
          more: { title: '動漫節的數字', text: '展區營收與大師、聲優活動的參與人數，顯示動漫節的熱度不只在入場人次。', quote: { article: 'a08', page: 60, text: '其中，臺灣漫畫館營收突破 200 萬元，大師與聲優活動更吸引超過 2.8 萬人次參與' }, links: [{ url: 'https://m.my-formosa.com.tw/DOC_223557.htm', label: '動漫節報導', kind: 'web' }, { url: 'https://reading.udn.com/read/story/124410/9324082', label: '臺灣漫畫館報導', kind: 'web' }] },
        },
        {
          kicker: '現場 2', title: '周邊商品',
          text: '周邊商品已成為泛娛樂粉絲最共通的消費語言：過去是買商品送周邊，如今是為了周邊而購買商品。',
          src: [
            { article: 'a08', page: 60, text: '周邊商品正逐漸成為泛娛樂粉絲最共通的消費語言' },
            { article: 'a08', page: 60, text: '過去是買商品送周邊；如今則是為了周邊而購買商品' },
          ],
          more: { title: '一天賣出人民幣 300 萬元', text: '周邊不再是贈品，而是消費動機本身：演唱會快閃店的單日業績就是例子。', quote: { article: 'a08', page: 60, text: '五月天北京演唱會期間的相關快閃店，單日銷售額突破人民幣 300 萬元' } },
        },
        {
          kicker: '現場 3', title: '2.5 次元',
          image: { src: '/fig/a08/p61-1.webp', alt: '音樂劇《魔女宅急便》台北國家戲劇院演出海報', w: 1266, h: 298 },
          text: '《魔女宅急便》音樂劇首度來台、《神隱少女》舞台劇也將登台；當角色從平面走向真人，粉絲買單的，是一段能夠親身參與的世界觀體驗。',
          src: [
            { article: 'a08', page: 61, text: '日本經典 IP《魔女宅急便》音樂劇首度來台演出' },
            { article: 'a08', page: 61, text: '《神隱少女》舞台劇也將於年底登台' },
            { article: 'a08', page: 61, text: '粉絲買單的，是一段能夠親身參與的世界觀體驗' },
          ],
          more: {
            title: '案例：《魔女宅急便》音樂劇',
            image: { src: '/fig/a08/p61-1.webp', alt: '音樂劇《魔女宅急便》台北國家戲劇院演出海報', w: 1266, h: 298, caption: '經典動畫《魔女宅急便》改編為音樂劇，延伸至展演消費與體驗經濟', credit: '資料來源：牛耳藝術 MNA 售票網' },
            links: [{ url: 'https://ticket.mna.com.tw/UTK0201_?PRODUCT_ID=P1AH1R17', label: '牛耳藝術售票頁', kind: 'web' }],
          },
        },
        {
          kicker: '現場 4', title: '經典 IP',
          image: { src: '/fig/a08/p61-2.webp', alt: '《憤怒鳥》電影第三集宣傳圖', w: 1249, h: 1081 },
          text: '《憤怒鳥》宣布回歸、《亂馬½》推出重製版，眾多經典 IP 以不同形式重返大眾視野，帶來懷舊情懷與新鮮感兼具的雙重體驗。',
          src: [
            { article: 'a08', page: 61, text: '眾多經典 IP 以不同形式重返大眾視野，為消費者帶來懷舊情懷與新鮮感兼具的雙重體驗' },
            { article: 'a08', page: 61, text: '《憤怒鳥》3 正式宣布回歸' },
            { article: 'a08', page: 62, text: '《亂馬½》推出重製版' },
          ],
          more: {
            title: '案例：《憤怒鳥》電影版第三集',
            image: { src: '/fig/a08/p61-2.webp', alt: '《憤怒鳥》電影第三集宣傳圖', w: 1249, h: 1081, caption: '遊戲 IP《憤怒鳥》電影版出到第三套，對新一代觀眾來說，憤怒鳥已經是電影明星大於遊戲明星', credit: '資料來源：派拉蒙影業' },
            links: [{ url: 'https://www.ludens.com.tw/angry-birds-movie-3-release-up-2026-mrbeast-cast/', label: '《憤怒鳥3》報導', kind: 'web' }],
          },
        },
        {
          kicker: '現場 5', title: '短劇', figure: { value: '97%', label: 'Gen Z 三個月內看過短影音' },
          image: { src: '/fig/a08/p62-1.webp', alt: 'Catchplay+ 與 SLL 合作的直式短劇', w: 1270, h: 575 },
          text: '短影音完成用戶教育之後，市場轉向更完整的故事與長期的 IP 價值，短劇正快速成為下一個內容競爭的新戰場。',
          src: [
            { article: 'a08', page: 62, text: '過去三個月曾觀看短影音的 Z 世代高達97%' },
            { article: 'a08', page: 62, text: '短劇正快速成為下一個內容競爭的新戰場' },
          ],
          more: {
            title: '短劇的五大發展方向',
            image: { src: '/fig/a08/p62-1.webp', alt: 'Catchplay+ 與 SLL 合作的直式短劇', w: 1270, h: 575, caption: '台韓跨國合作不一定走大螢幕或電視劇，Catchplay+ 與韓國知名製作單位 SLL 直攻觀眾近期最愛的直式輕短劇', credit: '資料來源：截自 Catchplay+ 網站' },
            quote: { article: 'a08', page: 62, text: '首先，隨著市場競爭加劇，產業已由追求數量與上線速度，轉向內容品質與製作水準的全面提升，精品化成為市場共識。' },
            links: [{ url: 'https://report.twnic.tw/2025/', label: 'TWNIC 2025 台灣網路報告', kind: 'report' }],
          },
        },
        {
          kicker: '現場 6', title: '運動',
          image: { src: '/fig/a08/p63-1.webp', alt: '啦啦隊成員形象照', w: 518, h: 715 },
          text: '台灣棒球已從國際賽熱潮發展為全年性的運動娛樂，啦啦隊也逐漸成為獨立的娛樂 IP 與品牌合作的媒介。',
          src: [
            { article: 'a08', page: 63, text: '台灣棒球已從「國際賽熱潮」逐步發展為「全年性的運動娛樂」' },
            { article: 'a08', page: 63, text: '隨著啦啦隊逐漸發展為獨立的娛樂 IP' },
          ],
          more: {
            title: '案例：電通娛樂的啦啦隊經紀模式',
            image: { src: '/fig/a08/p63-1.webp', alt: '啦啦隊成員形象照', w: 518, h: 715, caption: '看準啦啦隊經濟快速崛起，電通娛樂攜手奧拉娛樂打造全新啦啦隊經紀模式，串聯人才經紀、品牌合作與娛樂內容資源', credit: '資料來源：電通娛樂' },
            links: [{ url: 'https://www.dentsu.com/tw/zh/news-releases/26-05-27-dentsu-se-korean-cheer-leaders', label: '電通新聞稿', kind: 'web' }],
          },
        },
      ],
      source: '整理：策展者｜依據 何華軒〈當注意力成為稀缺資源〉紙本 p.60–63',
    },
    {
      kind: 'prose',
      eyebrow: '從流量到轉換',
      heading: '原創娛樂 IP《鑑定師 The Inspector Global》',
      image: { src: '/fig/a08/p64-2.webp', alt: '2025 SHUHUA Talk Concert 主視覺：葉舒華手持放大鏡', w: 683, h: 535, caption: '透過原創娛樂 IP《鑑定師 The Inspector Global》，電通娛樂示範如何把線上粉絲熱情轉化為線下體驗與可衡量的商業成長', credit: '資料來源：截自鑑定師 FB 粉專 & YT 頻道' },
      beats: [
        {
          text: '許多品牌即使創造了大量線上觀看與社群互動，仍無法把數位聲量轉成線下參與與實際消費；對 Gen Z 而言，被動式廣告與折扣促銷，已不足以建立有意義的品牌連結。',
          src: [
            { article: 'a08', page: 64, text: '多數仍無法將數位聲量有效轉化為線下參與及實際消費' },
            { article: 'a08', page: 64, text: '對 Gen Z 而言，被動式廣告與折扣促銷已不足以建立有意義的品牌連結' },
          ],
        },
        {
          text: '2025 年，電通娛樂與韓國 The SMC Group 共同打造全球版原創娛樂 IP《The Inspector Global》，由來自台灣的 K-pop 偶像葉舒華主持，串聯 YouTube 節目、Shorts、Reels、Talk Concert 與周邊商品。',
          src: [
            { article: 'a08', page: 64, text: '2025 年電通娛樂攜手韓國 The SMCGroup，共同打造全球版原創娛樂 IP' },
            { article: 'a08', page: 64, text: '節目由來自台灣、享譽全球的 K-pop 偶像葉舒華(Shuhua) 擔任主持' },
            { article: 'a08', page: 64, text: '包含 YouTube 節目、Shorts、Reels、Talk Concert、周邊商品等' },
          ],
        },
        {
          text: '這是一條完整的 Content-to-Commerce 消費者旅程：從線上內容互動、社群擴散，一路走到線下體驗與實際購買，把 Attention 轉化為 Action。',
          src: [
            { article: 'a08', page: 64, text: '打造完整的 Content-to-Commerce 消費旅程' },
            { article: 'a08', page: 64, text: '真正將 Attention轉化為 Action' },
          ],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'flowloop',
          title: 'IP × 娛樂 × 體驗 × 商業：粉絲經濟的生態系',
          center: 'IP',
          centerExtra: 'IP（Intellectual Property）在行銷語境裡泛指角色、作品、偶像、賽事等能被反覆使用的內容資產。它的價值在於「可延伸」：同一個 IP 可以拍成影劇、辦成展覽、做成周邊，每一次延伸都在加深粉絲的情感，也替下一次延伸累積需求。',
          nodes: [
            { label: '娛樂', sub: 'ENTERTAINMENT', desc: '多元娛樂內容建立粉絲情感連結', extra: '娛樂是生態系的入口，負責讓人第一次喜歡上這個 IP。對品牌來說，與其自己從零做內容，更常見的做法是贊助、置入或與既有作品合作，借用已經存在的情感連結。' },
            { label: '體驗', sub: 'EXPERIENCE', desc: '沉浸式體驗提升粉絲熱度與忠誠度', extra: '體驗把「看過」變成「參與過」。快閃店、主題展與實境活動提供可拍照、可分享的現場，粉絲付出時間與交通成本到場，本身就會加深投入感，也自然產生社群素材。' },
            { label: '粉絲社群', sub: 'COMMUNITY', desc: '粉絲口碑傳播，社群擴大影響', extra: 'UGC（使用者生成內容）與二次創作包括粉絲的開箱、心得、同人圖與短影音。它們讓 IP 在官方沒有投放的時候也持續被看見，而且來自粉絲的推薦，通常比品牌自己說更有說服力。' },
            { label: '商業', sub: 'COMMERCE', desc: '多元變現模式擴大 IP 商業版圖', extra: '商業是讓循環能長久運轉的燃料：周邊、授權與聯名帶來的營收，再投回內容與體驗。關鍵在於商品要延續 IP 的故事與情感，若只是貼上角色圖案，粉絲很快就會感到被收割。' },
          ],
        },
        source: '圖：IP × 娛樂 × 體驗 × 商業｜資料來源 電通娛樂／製圖，何華軒〈當注意力成為稀缺資源〉紙本 p.65。滑過節點看說明。',
      },
      src: [{ article: 'a08', page: 65, text: '未來品牌競爭的關鍵，是透過 IP、娛樂、運動與體驗持續累積共同記憶，最終沉澱為長期的品牌心智資產' }],
      figures: [
        { article: 'a08', page: 65, text: '多元娛樂內容建立粉絲情感連結' },
        { article: 'a08', page: 65, text: '沉浸式體驗提升粉絲熱度與忠誠度' },
        { article: 'a08', page: 65, text: '激發 UGC 與二次創作' },
        { article: 'a08', page: 65, text: '多元變現模式擴大 IP 商業版圖' },
      ],
      beats: [
        {
          text: '未來的機會是一張生態系：以 IP 為核心，娛樂、體驗、粉絲社群與商業四個面向相互驅動，形成閉環。',
          src: [{ article: 'a08', page: 65, text: '四大面向相互驅動，形成 IP 生態系閉環' }],
        },
        {
          text: '娛樂內容（影視、音樂、遊戲、偶像與演唱會）先建立粉絲的情感連結，線上互動、主題展覽與快閃活動等沉浸式體驗，再提升熱度與忠誠度。',
          src: [
            { article: 'a08', page: 65, text: '影視、音樂、遊戲；偶像、演唱會、活動' },
            { article: 'a08', page: 65, text: '線上互動、沉浸體驗；主題展覽、快閃活動' },
            { article: 'a08', page: 65, text: '多元娛樂內容建立粉絲情感連結' },
            { article: 'a08', page: 65, text: '沉浸式體驗提升粉絲熱度與忠誠度' },
          ],
        },
        {
          text: '粉絲社群透過口碑傳播與社群活動，激發 UGC 與二次創作，把影響力擴散出去，也建立長期的社群關係。',
          src: [
            { article: 'a08', page: 65, text: '社群經營、用戶互動；UGC 內容、社群活動；建立長期的社群關係' },
            { article: 'a08', page: 65, text: '粉絲口碑傳播' },
            { article: 'a08', page: 65, text: '激發 UGC 與二次創作' },
          ],
        },
        {
          text: '商業端則透過周邊商品、授權合作、電商零售與 IP 聯名多元變現，讓情感價值與商業價值形成正向循環。',
          src: [
            { article: 'a08', page: 65, text: '多元變現模式擴大 IP 商業版圖' },
            { article: 'a08', page: 65, text: '周邊商品、授權合作；電商零售、IP 聯名；實現商業價值' },
            { article: 'a08', page: 65, text: '周邊商品、授權合作；電商零售、IP 聯名；實現商業價值' },
            { article: 'a08', page: 65, text: '打造粉絲經濟新生態，創造情感價值與商業價值的正向循環' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '當 AI 能大量生成內容、演算法持續分配流量，真實感與情感溫度反而成為最珍貴的價值。娛樂與運動之所以重要，正是因為它們能夠將 Attention 轉化為 Memory。',
        src: [
          { article: 'a08', page: 64, text: '當 AI 能大量生成內容、演算法持續分配流量，真實感與情感溫度反而成為最珍貴的價值' },
          { article: 'a08', page: 65, text: '娛樂與運動之所以重要，正是因為它們能夠將 Attention 轉化為 Memory' },
        ],
      },
      quote: { article: 'a08', page: 65, text: '品牌可以購買曝光，卻無法購買記憶' },
    },
  ],
  asksTitle: '帶走這兩句',
  asks: [
    { article: 'a08', page: 65, text: '真正影響消費決策的，不是品牌被看見多少次，而是是否出現在那些值得被記住的重要時刻。' },
    { article: 'a08', page: 65, text: '未來真正的機會，不在於賣商品，而在於打造「IP × 娛樂 × 體驗 × 商業」整合生態。' },
  ],
};
