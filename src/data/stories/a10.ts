import type { Story } from '../../lib/story';

// 徐莉媛〈別買曝光了，開始買注意力吧〉紙本 p.72–79
// 原刊圖表：圖1 Doom Loop（d3 循環）、圖2 AIDMA→AICAS（d3 階段）、圖3 媒體布局矩陣、圖4 自願 vs 被迫觀看、圖5 CeraVe（照片）
export const story: Story = {
  id: 'a10',
  status: 'draft',
  oneLiner: '曝光正在通膨、注意力正在升值。被看進去、被想起來、被帶進決策的曝光，才算數。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '報表越漂亮，品牌越萎縮？',
      beats: [
        {
          text: '報表上的曝光越買越多、單次成本越壓越低，可是一打開品牌市調，卻是知名度遇到瓶頸、指名度下滑，消費者描述品牌時，用的全是別人家的形容詞。',
          src: [
            { article: 'a10', page: 73, text: '報表上的數字越來越漂亮：曝光越買越多、單次成本越壓越低、效率年年進步' },
            { article: 'a10', page: 73, text: '可是一打開品牌市調，卻是另一個樣貌：知名度遇到瓶頸、指名度下滑' },
            { article: 'a10', page: 73, text: '消費者描述你的品牌時，用的全是別' },
          ],
          quote: { article: 'a10', page: 73, text: '昨天你一定滑過上百則內容，但如果我問你現在還記得幾支廣告，數得出來嗎？' },
        },
        {
          text: '徐莉媛認為，真正的問題不在執行，而是遊戲規則正在改變：生成式 AI 可以無限產內容，版位也可以無限切割，曝光正在通膨、注意力正在升值。',
          src: [
            { article: 'a10', page: 73, text: '真正的問題不在於執行，而是遊戲規則正在改變' },
            { article: 'a10', page: 73, text: '生成式 AI 可以無限產內容，版位也可以無限切割，曝光正在通膨、注意力正在升值' },
          ],
        },
        {
          text: '所以品牌要重新問的，不是「我出現了幾次」，而是有多少次真的被看進去、被想起來、被帶進決策。',
          src: [{ article: 'a10', page: 73, text: '品牌要重新問的不是「我出現了幾次」，而是「有多少次真的被看進去、被想起來、被帶進決策」' }],
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'flowloop',
          title: '廣告末日循環 The Doom Loop',
          center: '品牌',
          centerDetail: '循環每轉一圈，品牌就被消耗一點：預算沒少、聲量沒小，品牌卻在競品的雜訊裡一點一點變淡，消費者描述品牌時，用的全是別人家的形容詞。',
          centerPage: 73,
          shrink: true,
          nodes: [
            {
              label: '轉向成效型', sub: 'SHIFT BUDGETS', page: 73,
              desc: '把預算轉移到「成效型」格式（Shift budgets to “performance” formats）',
              detail: '為了交出能即時量化的成效，預算不斷流向短期、點擊與轉換。文中一家日系專櫃美妝品牌在 2023 年以前，就把近三成預算壓在轉換目標，純曝光只有兩成左右。',
            },
            {
              label: '效果停滯', sub: 'PLATEAUS', page: 73,
              desc: '廣告效果進入高原期／停滯（Advertising playback plateaus）',
              detail: '無盡的優化，有時反而稀釋了廣告本身的力量：曝光越買越多、單次成本越壓越低，打開品牌市調，卻是知名度遇到瓶頸、指名度下滑。',
            },
            {
              label: '錯誤優化', sub: 'FAULTY METRICS', page: 74,
              desc: '依據有缺陷的指標進行優化（Optimize against faulty metrics）',
              detail: '問題出在指標本身。dentsu 與 Lumen 的眼動研究發現，可視率與品牌回想幾乎沒有關係，更能預測回想的是平均觀看秒數；技術上完全達標的可視曝光，常常只是買到進入視野的門票。',
            },
          ],
        },
        source: '圖：廣告末日循環 The Doom Loop｜資料來源 WARC《The Multiplier Effect》(2025)，徐莉媛〈別買曝光了〉紙本 p.73。點節點看完整標籤。',
      },
      src: [{ article: 'a10', page: 73, text: '廣告惡性循環 The Doom Loop 指得是品牌投廣一再要求成效優化，品牌卻陷入萎縮的惡性循環' }],
      figures: [
        { article: 'a10', page: 73, text: '把預算轉移到「成效型」格式' },
        { article: 'a10', page: 73, text: '廣告效果進入高原期／停滯' },
        { article: 'a10', page: 73, text: '依據有缺陷的指標進行優化' },
      ],
      beats: [
        {
          text: '為了交出能即時量化的成效，品牌把預算一步步移向短期、點擊與轉換型的格式。',
          src: [{ article: 'a10', page: 73, text: '為了交出能即時量化的成效，預算不斷流向短期、點擊與轉換' }],
        },
        {
          text: '可是無盡的優化，有時反而稀釋了廣告本身的力量，也悄悄磨損了品牌，讓廣告效果進入高原期。',
          src: [
            { article: 'a10', page: 73, text: '無盡的優化，有時反而稀釋了廣告本身的力量，也悄悄磨損了品牌' },
            { article: 'a10', page: 73, text: '廣告效果進入高原期／停滯' },
          ],
        },
        {
          text: '於是品牌再依同一套有缺陷的指標繼續優化，陷入「成效越優化、品牌越萎縮」的惡性循環，WARC 稱之為 **The Doom Loop**。',
          src: [{ article: 'a10', page: 73, text: '陷入成效越優化、品牌越萎縮的惡性循環「The Doom Loop」' }],
        },
        {
          text: '預算沒少、聲量沒小，品牌卻在競品的雜訊裡一點一點變淡。作者因此主張，曝光不是不重要，而是必須被重新定義。',
          src: [
            { article: 'a10', page: 73, text: '預算沒少、聲量沒小，品牌卻在競品的雜訊裡一點一點變淡' },
            { article: 'a10', page: 73, text: '曝光不是不重要，而是必須被重新定義' },
          ],
          quote: { article: 'a10', page: 73, text: '有注意力品質的曝光，才有機會變成品牌資產；沒有被看進去的曝光，只是報表上的庫存。' },
        },
      ],
    },
    {
      kind: 'prose',
      eyebrow: '新的尺',
      heading: 'Viewability 是門票，**Attention** 才是資產',
      beats: [
        {
          text: 'dentsu 與 Lumen 的眼動研究發現，可視率與品牌回想之間幾乎沒有關係；真正更能預測回想的，是平均觀看秒數。廣告「出現在畫面上」與「被人看進去」，是兩回事。',
          src: [
            { article: 'a10', page: 74, text: '可視率(Viewability) 與品牌回想之間幾乎沒有關係；真正更能預測回想的，是平均觀看秒數' },
            { article: 'a10', page: 74, text: '廣告「出現在畫面上」與「被人看進去」，其實是兩回事' },
          ],
        },
        {
          text: '因此高 SOV 場域仍然重要，但 SOV 要換一種算法：不是聲量佔比，也不是畫面佔比，而是注意力佔比，看品牌能不能在夠乾淨、夠完整的環境裡，獨佔消費者一段專注的心思。',
          src: [
            { article: 'a10', page: 74, text: '不是傳統的聲量佔比，也不是畫面佔比，而是注意力佔比' },
            { article: 'a10', page: 74, text: '品牌要看的，是自己能不能在一個夠乾淨、夠完整的環境裡，獨佔消費者一段相對專注的心思' },
          ],
        },
        {
          text: '作者介紹了一把新的尺 APM：每千次曝光的注意力秒數。它把「有沒有看到」與「看了多久」放在同一個標準裡；秒數是門檻而非目標，用來排除不合格的曝光。',
          src: [
            { article: 'a10', page: 74, text: 'APM (Attention per Mille，每千次曝光的注意力秒數)' },
            { article: 'a10', page: 74, text: '秒數是門檻而非目標――它幫你排除不合格的曝光，而不是追求越長越好' },
          ],
          more: {
            title: 'APM 怎麼算？',
            quote: { article: 'a10', page: 79, text: 'APM（Attention per Mille，每千次曝光的注意力秒數）是數位廣告領域中新興的成效指標。它衡量廣告在每 1,000 次「實際被看見」的曝光中，累計吸引了多少秒數的使用者目光，用以量化廣告素材的品質與受眾的專注度。' },
          },
        },
      ],
    },
    {
      kind: 'bignum',
      prefix: '+',
      value: 20,
      unit: '% YOY',
      caption: {
        text: '台灣一家日系專櫃美妝品牌，過去把近三成預算壓在轉換目標；重新加重電視、CTV、OOH 等高注意力場域後，不只在轉型檔期拿下 YOY +20% 的短期業績，也在成長趨緩的專櫃美妝市場連續三年維持正成長。',
        src: [
          { article: 'a10', page: 74, text: '把近三成預算壓在轉換目標，純曝光只有兩成左右' },
          { article: 'a10', page: 74, text: '加重電視、CTV、OOH 等高 SOV 媒體比重' },
          { article: 'a10', page: 74, text: '結果不只在轉型檔期拿下 YOY +20% 的短期業績' },
          { article: 'a10', page: 75, text: '也在成長趨緩的專櫃美妝市場連續三年維持正成長' },
        ],
      },
      figure: { article: 'a10', page: 74, text: 'YOY +20%' },
      source: '案例：台灣某日系專櫃美妝品牌，徐莉媛〈別買曝光了〉紙本 p.74–75',
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'd3',
        chart: {
          kind: 'stages',
          title: '消費行為模型的三個時代演進',
          rows: [
            { era: '電商以前', model: 'AIDMA', at: 1, steps: [{ en: 'Attention', zh: '注意' }, { en: 'Interest', zh: '興趣' }, { en: 'Desire', zh: '慾望' }, { en: 'Memory', zh: '記憶' }, { en: 'Action', zh: '購買' }] },
            { era: '電商時代', model: 'AISAS', at: 1, steps: [{ en: 'Attention', zh: '注意' }, { en: 'Interest', zh: '興趣' }, { en: 'Search', zh: '搜尋' }, { en: 'Action', zh: '購買' }, { en: 'Share', zh: '分享' }] },
            {
              era: '生成式 AI 時代', model: 'AICAS', at: 2,
              steps: [
                { en: 'Ask', zh: '諮問', detail: '起點不再是被動接收的廣告，而是消費者主動發問：先問 AI「哪個品牌適合我」，不再自己慢慢翻找資訊（紙本 p.75）。' },
                { en: 'Interest', zh: '興趣' },
                { en: 'Confirm', zh: '確認', detail: '原圖標示為 Confirm, Check：消費者會再確認 AI 給的答案。品牌若沒有清楚、可信、可被引用的內容，可能在這之前就被排除在答案之外（紙本 p.75）。' },
                { en: 'Action', zh: '購買' },
                { en: 'Share', zh: '分享' },
              ],
            },
          ],
        },
        source: '圖：從 AIDMA 到 AISAS，再到 AICAS｜資料來源 日經 xTREND，徐莉媛〈別買曝光了〉紙本 p.75。每一列的第一格是旅程的起點。',
      },
      src: [{ article: 'a10', page: 75, text: '從 AIDMA 到 AISAS，再到 AICAS，其特點是以「諮問 ( 諮詢/ 提問)」為出發點' }],
      figures: [
        { article: 'a10', page: 75, text: '電商以前的時代AIDMA注意興趣AttentionInterest電商時代AISAS' },
        { article: 'a10', page: 75, text: '確認購買分享Conﬁrm, CheckActionShare' },
      ],
      beats: [
        {
          text: '如果 APM 讓我們看見廣告裡的注意力，AI 改變的就是廣告外的注意力：當 AI 開始整理資訊、生成摘要、推薦品牌，注意力的戰場已經從版位延伸到答案與推薦。',
          src: [
            { article: 'a10', page: 75, text: '如果 APM 幫我們看見「廣告裡的注意力」，那 AI正在改變的，就是「廣告外的注意力」' },
            { article: 'a10', page: 75, text: '注意力的戰場已經從版位延伸到答案與推薦' },
          ],
        },
        {
          text: '消費者旅程因此從 AISAS 往 AICAS 移動。AICAS 的起點不再是被動接收的 Attention，而是消費者主動發出的 Ask。',
          src: [{ article: 'a10', page: 75, text: 'AICAS 的起點不再是被動接收的 Attention，而是消費者主動發出的 Ask' }],
        },
        {
          text: '當消費者先問 AI「哪個品牌適合我」，品牌若沒有足夠清楚、可信、可被引用的內容，可能還沒進入比較，就已經被排除在答案之外。這對預算較小的品牌尤其重要。',
          src: [
            { article: 'a10', page: 75, text: '品牌若沒有足夠清楚、可信、可被引用的內容，就可能還沒進入比較，就已經被排除在答案之外' },
            { article: 'a10', page: 75, text: '這件事對預算規模較小的品牌尤其重要' },
          ],
          more: {
            title: '小品牌的另一種槓桿',
            quote: { article: 'a10', page: 75, text: '但社群口碑與 AI 摘要提供了另一種槓桿：靠網友自主擴散、靠 AI 主動引用，在消費者搜尋與評估的關鍵時刻，把品牌推進候選名單。' },
            links: [{ url: 'https://xtrend.nikkei.com/atcl/contents/18/01354/00006/', label: '日經 xTREND', kind: 'report' }],
          },
        },
      ],
    },
    {
      kind: 'graphic',
      graphic: {
        type: 'matrix',
        title: '先判斷決策情境，再決定主攻：品牌記憶、內容證據，或分眾收割',
        y: { label: '主張驗證門檻', high: '高（難證明）', low: '低（易證明）' },
        x: { label: '消費者問題一致性', left: '分歧', right: '一致' },
        quads: [
          { case: '需求分歧－主張難證明', name: 'TOM 先行', items: ['先建立品牌主敘事', '再分眾補證據', '避免品牌理解破碎'] },
          { case: '需求一致－主張難證明', name: '雙管齊下', items: ['廣告創造注意', '內容完成驗證', 'USP 與體驗證據同步推進'] },
          { case: '需求分歧－主張易證明', name: '各個擊破', items: ['拆解需求情境', '優先攻高商機場景', '測出最有效的轉換切角'] },
          { case: '需求一致－主張易證明', name: 'CEPs 先行', items: ['先讓內容成為答案', '再用媒體放大收割', 'FAQ／比較／實測先鋪'] },
        ],
        source: '圖：AI 影響消費者決策下的媒體布局矩陣｜筆者整理製圖，徐莉媛〈別買曝光了〉紙本 p.76｜點任一格看做法',
      },
      src: [{ article: 'a10', page: 76, text: '把這兩軸交叉，就能幫品牌判斷現在更適合主攻品牌記憶、內容證據，或分眾收割。' }],
      beats: [
        {
          text: '有限的注意力預算該押哪裡？作者用兩個問題判斷：消費者是不是都在問同一個問題，以及產品主張好不好被快速證明。需求分歧又難證明時，要先建立清楚的品牌主敘事。',
          src: [
            { article: 'a10', page: 76, text: '判斷的關鍵有兩個：「消費者問題一致性」與「主張驗證門檻」' },
            { article: 'a10', page: 77, text: '當需求分歧且主張難證明時，品牌需要先建立清楚的主敘事' },
          ],
          more: {
            title: '什麼是「主張驗證門檻」？',
            quote: { article: 'a10', page: 76, text: '主張驗證門檻，則是產品主張好不好被快速證明。「容量更大」「價格更低」很好驗證；但「質感更好」「更值得信任」就需要更多第三方背書、使用情境與體驗證據。' },
          },
        },
        {
          text: '需求一致但主張難證明時，就讓廣告負責創造注意、內容負責完成驗證，兩者雙管齊下。',
          src: [{ article: 'a10', page: 76, text: '廣告創造注意◆內容完成驗證' }],
        },
        {
          text: '需求分歧但主張容易證明時，就拆解需求情境，優先攻下高商機的場景，各個擊破。',
          src: [{ article: 'a10', page: 76, text: '拆解需求情境◆優先攻高商機場景' }],
        },
        {
          text: '需求一致、主張又容易證明時，品牌反而應該先讓內容成為 AI、搜尋與社群可以引用的答案。',
          src: [{ article: 'a10', page: 77, text: '品牌反而應該先讓內容成為 AI、搜尋與社群可以引用的答案' }],
        },
      ],
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'bars',
        title: '同樣的秒數，「自己選擇看」比「被迫看」值錢得多',
        axis: '自願性注意力相較強迫性注意力的品牌回想增幅（%）',
        bars: [
          { label: '注視 5–10 秒', value: 18, display: '+18%', at: 1 },
          { label: '注視 > 10 秒', value: 79, display: '+79%', highlight: true, at: 2 },
        ],
        source: '資料來源 dentsu Japan International Brands《Introducing the Attention Economy》眼動研究，徐莉媛〈別買曝光了〉紙本 p.77',
      },
      src: [{ article: 'a10', page: 77, text: '自願觀看 vs. 被迫觀看的品牌回想差異' }],
      figures: [
        { article: 'a10', page: 77, text: '+18%' },
        { article: 'a10', page: 77, text: '+79%' },
      ],
      beats: [
        {
          text: '當 AI 接手媒體的執行與優化，「把曝光買對、買便宜」很快會變成人人都會的基本功。媒體還能做出差異的，是設計那些消費者願意主動給出的注意力。',
          src: [
            { article: 'a10', page: 77, text: '「把曝光買對、買便宜」很快會變成人人都會的基本功' },
            { article: 'a10', page: 77, text: '設計那些消費者願意主動給出的注意力' },
          ],
        },
        {
          text: '日本電通的研究比較了同一則廣告：注意力是消費者自己選擇給的，品牌回想明顯較高。注視 5–10 秒時多出 18%，注視超過 10 秒時多出 **79%**。',
          src: [
            { article: 'a10', page: 77, text: '日本電通的研究曾做過一組對照：同樣一則廣告，當這份注意力是消費者「自己選擇」給的，品牌回想明顯高於被迫觀看' },
            { article: 'a10', page: 77, text: '+18%' },
            { article: 'a10', page: 77, text: '+79%' },
          ],
          more: {
            title: '強迫式格式為什麼反而吃虧？',
            quote: { article: 'a10', page: 77, text: '而強迫式格式，例如不可略過的影音廣告，雖然把人留在螢幕前，卻常常養出「負面注意力」――人是盯著螢幕沒錯，但他等的是 skip 鍵，不是你的品牌。' },
          },
          quote: { article: 'a10', page: 77, text: '版位可以買，但主動靠近、伸手拿、拍照分享、真的記住，買不到。' },
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '把媒體做成體驗：四個高注意力的現場',
      intro: {
        text: '自願的注意力，常出現在演算法管不到、但消費者願意停下來的地方。高注意力場域的價值，不只在專注，更在專注之上還能疊加信任與參與。',
        src: [
          { article: 'a10', page: 77, text: '自願的注意力，常常出現在演算法管不到、但消費者願意停下來的地方' },
          { article: 'a10', page: 78, text: '高注意力場域的價值，不只在專注，更在專注之上還能疊加信任與參與' },
        ],
      },
      panels: [
        {
          kicker: '戶外廣告', title: '路人真的會看', figure: { value: '54%', label: '路人至少注視過一次戶外廣告' },
          text: 'dentsu 與 JCDecaux、Ocean Outdoor 的研究發現，54% 的路人至少注視過一次戶外廣告；全動態數位戶外比靜態多觸及 20% 的人，貼近視線高度的候車亭，回想甚至贏過高掛的大看板。',
          src: [
            { article: 'a10', page: 77, text: '54% 的路人至少注視過一次戶外廣告物' },
            { article: 'a10', page: 77, text: '全動態的數位戶外，更比靜態多觸及 20% 的人、視線多停 10%' },
            { article: 'a10', page: 77, text: '貼近自然視線高度的候車亭廣告，因為更容易被反覆看到，品牌回想甚至贏過高掛的大型看板' },
          ],
        },
        {
          kicker: '捷運吊環', title: 'CeraVe 適樂膚', figure: { value: '2.4 萬篇', label: '單日社群討論' },
          image: { src: '/fig/a10/p78-1.webp', alt: '捷運車廂吊環上掛著 CeraVe 潔膚露體驗瓶，乘客伸手取下', w: 336, h: 460 },
          text: 'CeraVe 在淡水信義線把上萬份 30ml 潔膚露體驗瓶掛上車廂吊環，乘客抬頭看到、伸手帶走，再靠車廂裡的 QR Code 接到線上優惠。',
          src: [
            { article: 'a10', page: 78, text: '把上萬份 30ml 的潔膚露體驗瓶直接掛上車廂吊環' },
            { article: 'a10', page: 78, text: '再靠車廂裡的 QR Code 把人接到線上優惠' },
          ],
          more: {
            title: '案例：CeraVe 萬人夏季潔膚體驗行動',
            image: { src: '/fig/a10/p78-1.webp', alt: '捷運車廂吊環上掛著 CeraVe 潔膚露體驗瓶', w: 336, h: 460, caption: 'CeraVe 適樂膚單日引爆 2.4 萬篇社群討論，以破圈體驗創造有機聲量與品牌好感', credit: '資料來源：電通台灣' },
            quote: { article: 'a10', page: 78, text: '沒有人被逼著看任何東西，乘客卻自己湊上去、拍照、上傳，在Threads 上聊開了。品牌的記憶點，就這樣隨著一雙雙伸出去的手，被帶出了車廂。' },
          },
        },
        {
          kicker: '捷運通道', title: '外送平台互動優惠牆',
          text: '外送平台把捷運通道的牆面變成互動優惠牆，讓通勤族停下來、掃碼領折扣，把單向曝光翻成雙向參與。',
          src: [{ article: 'a10', page: 78, text: '外送平台把捷運通道的牆面變成互動優惠牆，讓通勤族停下來、掃碼領折扣，把單向曝光翻成雙向參與' }],
        },
        {
          kicker: 'Podcast', title: '美妝品牌的伴聽時光',
          text: '美妝品牌走進 Podcast，借主持人與聽眾長年累積的信任，在沒有視覺干擾的伴聽時光裡，好好把話講完。',
          src: [{ article: 'a10', page: 78, text: '美妝品牌走進 Podcast，借主持人與聽眾長年累積的信任' }],
        },
      ],
      source: '整理：策展者｜依據 徐莉媛〈別買曝光了〉紙本 p.77–78',
    },
    {
      kind: 'quote',
      lead: {
        text: '說到底，品牌與其在零碎的注意力裡多撿幾片碎片，不如找到消費者真正專注的那個當下，在對的場景遞上對的邀請；親身經歷過的時刻，演算法搶不走。',
        src: [
          { article: 'a10', page: 79, text: '與其在零碎注意力裡多撿幾片碎片，品牌不如找到消費者真正專注的那個當下，在對的場景遞上對的邀請' },
          { article: 'a10', page: 78, text: '而親身經歷過的，演算法搶不走' },
        ],
      },
      quote: { article: 'a10', page: 79, text: '現在真正稀缺的從來不是曝光，而是――在不被打斷的情況下，被記住。' },
    },
  ],
  asksTitle: '下次做媒體規劃前，先問自己三件事',
  asks: [
    { article: 'a10', page: 78, text: '你的儀表板上，有「記憶」這一欄嗎？' },
    { article: 'a10', page: 78, text: '你的 SOV，是聲量，還是注意力？' },
    { article: 'a10', page: 78, text: '你的媒體，有讓消費者願意參與嗎？' },
  ],
};
