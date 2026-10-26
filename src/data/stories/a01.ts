import type { Story } from '../../lib/story';

// 唐心慧〈AI for Growth：看懂世界，加速成長〉紙本 p.6–11
// 原刊沒有圖表（p.11 圖片為作者簽名，不使用）：三種選擇 → hscroll；三個挑戰 → 清單；兩個隱憂 → 清單
export const story: Story = {
  id: 'a01',
  status: 'judged',
  oneLiner: 'AI 改變的是技術和做法，不變的是經營的本質：為客戶創造價值、靠人才驅動成長、用信任贏得品牌。',
  scenes: [
    {
      kind: 'prose',
      eyebrow: '開場',
      heading: '談到 AI，為什麼總是這麼興奮？',
      beats: [
        {
          text: '唐心慧坦言，自己談到 AI 總是很興奮。不是因為沒有擔憂，而是她看到消費者與市場都在快速變化，人和 AI 協作共同決策的時代已經來了。',
          src: [
            { article: 'a01', page: 7, text: '你為什麼談到 AI 總是這麼興奮？' },
            { article: 'a01', page: 7, text: '這不是因為我沒有擔憂' },
            { article: 'a01', page: 7, text: '意識到人和 AI 協作共同決策的時代已經來了' },
          ],
        },
        {
          text: '和客戶聊到 AI，會遇到兩種心情。一邊是焦慮：變化太快，等待的成本變得最貴，CEO 都在問要從哪開始；知道變化在發生，和真的能跟上變化，是兩回事。',
          src: [
            { article: 'a01', page: 7, text: '一邊，是焦慮。AI 變化太快了，市場反應也變快了，等待的成本變得最貴' },
            { article: 'a01', page: 7, text: '知道變化在發生，和真的能跟上變化，是兩回事' },
          ],
        },
        {
          text: '另一邊是機會：敢用 AI 改造決策方式的品牌，已經在市場上拉開距離。',
          src: [{ article: 'a01', page: 7, text: '那些敢用 AI 改造決策方式的品牌，在市場上已經開始拉開距離' }],
          quote: { article: 'a01', page: 7, text: '他們不是靠 AI 變得更快，而是靠 AI 變得更懂人。這才是真正贏的方式。' },
        },
        {
          text: '但有一件事沒有變：為客戶創造價值、靠人才驅動成長、用信任贏得品牌。難的是，多數企業還沒想清楚，要怎麼守住這些不變的東西，同時做出改變。',
          src: [
            { article: 'a01', page: 7, text: '不變的是經營的本質—為客戶創造價值、靠人才驅動成長、用信任贏得品牌' },
            { article: 'a01', page: 7, text: '大多數企業還沒想清楚，AI 時代要怎麼守住這些不變的東西，同時做出改變' },
          ],
        },
      ],
    },
    {
      kind: 'hscroll',
      title: '面對 AI，企業有三種選擇',
      intro: {
        text: '面對 AI，企業其實有三種選擇。差別不在誰的計畫更聰明，而在誰的學習循環更快。',
        src: [
          { article: 'a01', page: 7, text: '其實面對 AI 企業有三種選擇' },
          { article: 'a01', page: 7, text: '競爭優勢不在計劃更聰明，而在學習循環更快' },
        ],
      },
      panels: [
        {
          kicker: '第一類', title: '先知先覺：快速學習',
          text: '沒有人能完美預測未來，只能不斷從做中學。他們很快把新產品推進市場、看反應、學習調整，再推下一個；也把行銷當成要保護的成長引擎，而不是可以隨意砍除的支出。',
          src: [
            { article: 'a01', page: 7, text: '沒有人能完美預測未來，只有不斷從做中學習' },
            { article: 'a01', page: 7, text: '所以他們很快就推新產品進市場、看反應、學習調整、再推下一個' },
            { article: 'a01', page: 8, text: '他們深諳行銷不應該被視為可以隨意砍除的裁量支出，而應該被保護為成長的引擎' },
          ],
          more: {
            title: '景氣不好時，反而加倍下注',
            quote: { article: 'a01', page: 8, text: '那些敢在景氣不佳時逆勢維持甚至增加廣告投資的品牌，往往在景氣回升後獲得更高的獲利和聲量佔比。' },
          },
        },
        {
          kicker: '第二類', title: '後知後覺：謹慎等待',
          text: '他們等市場信號更明確、計畫更周全、看到成功案例，用等待換一份確定性；但這個時代，市場不會等。對資源有限的中小企業與新創，起點可以是一個成本可控的小範圍學習循環。',
          src: [
            { article: 'a01', page: 8, text: '他們用等待，換一份確定性。但問題是，在這個時代，市場不會等' },
            { article: 'a01', page: 8, text: '對這些企業來說，起點不必是大規模投入，而是找一個成本可控的小範圍，先做出第一個能驗證的學習循環，再逐步擴大' },
          ],
          more: {
            title: '不是不想快，是沒本錢賭錯',
            quote: { article: 'a01', page: 8, text: '「後知後覺」有時不完全是意願問題，很多時候是資源問題。對於資源有限的中小企業和新創，不是不想快，而是沒有本錢賭錯。' },
          },
        },
        {
          kicker: '第三類', title: '不知不覺：不做選擇',
          text: '他們根本沒意識到消費者變了，員工也變了。這類企業一定會被淘汰，因為在他們還沒發現時，競爭對手已經動起來了。',
          src: [
            { article: 'a01', page: 8, text: '他們根本沒意識到消費者變了，員工也變了。這類企業一定會被淘汰' },
            { article: 'a01', page: 8, text: '因為他們還沒發現時，競爭對手已經動起來了' },
          ],
        },
      ],
      source: '整理：策展者｜依據 唐心慧〈AI for Growth〉紙本 p.7–8',
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        title: '三個挑戰，對應企業成長的三個維度',
        items: [
          { title: '效率 vs 價值', desc: 'Business Growth：用速度換來更準的判斷', at: 2 },
          { title: '創意 vs 創新', desc: 'People Growth：從有創意走向能創新', at: 3 },
          { title: '人 vs AI', desc: 'Organization Growth：人與 AI 的新分工與信任', at: 4 },
        ],
        source: '整理：策展者｜依據 唐心慧〈AI for Growth〉紙本 p.8–10',
      },
      src: [{ article: 'a01', page: 8, text: '而這三個挑戰，正好對應企業成長的三個維度' }],
      figures: [
        { article: 'a01', page: 9, text: '效率 vs 價值 (Business Growth)' },
        { article: 'a01', page: 9, text: '創意 vs 創新 (People Growth)' },
        { article: 'a01', page: 10, text: '人 vs AI (Organization Growth)' },
      ],
      beats: [
        {
          text: '唐心慧發現，AI 時代的企業主面臨三個挑戰：效率與價值、創意與創新、人與 AI，正好對應 Business、People 與 Organization 三個成長維度。',
          src: [
            { article: 'a01', page: 8, text: '我發現 AI 時代的企業主也面臨三個挑戰。而這三個挑戰，正好對應企業成長的三個維度' },
            { article: 'a01', page: 9, text: '效率 vs 價值 (Business Growth)' },
            { article: 'a01', page: 9, text: '創意 vs 創新 (People Growth)' },
            { article: 'a01', page: 10, text: '人 vs AI (Organization Growth)' },
          ],
        },
        {
          text: '第一個挑戰是效率與價值。AI 讓一切變快，但效率不是目的，價值才是；用省成本的角度看 AI，頂多省下一點錢，用創造價值的角度，才可能贏得整個市場。',
          src: [
            { article: 'a01', page: 9, text: '但效率不是目的，價值才是' },
            { article: 'a01', page: 9, text: '用「省成本」的角度看 AI，頂多省下一點錢；用「創造價值」的角度，才可能贏得整個市場' },
          ],
          more: {
            title: '預測是起點，不是終點',
            quote: { article: 'a01', page: 9, text: '真正有膽識的企業，是把預測當作起點，而不是終點，用預測決定往哪個方向跑得快一點，再用行動去驗證、去修正。' },
          },
        },
        {
          text: '第二個挑戰是創意與創新。光有創意已經不夠，員工要學會用 AI 快速驗證想法，把創意變成一次次的模擬實驗，讓創新真正發生。',
          src: [
            { article: 'a01', page: 9, text: '光有創意已經不夠了，創意必須被轉化成創新' },
            { article: 'a01', page: 9, text: '員工要學會用 AI 快速驗證想法，把創意變成一次次的模擬實驗' },
          ],
          more: {
            title: '同一個 AI，兩種用法',
            quote: { article: 'a01', page: 9, text: '一個人偶爾讓它改改文案、問幾個問題；另一個人把自己的資料、經驗、工作步驟和驗收標準全都接進去，讓 AI 每天替自己完成一段工作。' },
          },
        },
        {
          text: '第三個挑戰是人與 AI。她的答案是：AI 改變的是分工，沒改變的是判斷；把人解放出來，去建立信任、做出有溫度的決策，並在不確定中承擔責任。',
          src: [
            { article: 'a01', page: 10, text: '我的答案是：AI 改變的是分工；沒改變的是判斷' },
            { article: 'a01', page: 10, text: '去做 AI 做不到的事，建立信任、做出有溫度的決策、在不確定中承擔責任' },
          ],
          quote: { article: 'a01', page: 10, text: '人的角色不是消失，而是升級。' },
        },
      ],
    },
    {
      kind: 'statement',
      eyebrow: '走在前頭的企業',
      text: 'AI 正在變成每家公司都要有的一層能力',
      lede: {
        text: '這很像當年的網路，起初是新行業，後來各行各業都數位化了。走在前頭的企業，用速度與判斷力交付價值、讓員工從創意走向創新，也讓人與 AI 找到新的分工與信任。',
        src: [
          { article: 'a01', page: 10, text: 'AI 正在變成每家公司都要有的一層能力。這很像當年的網路' },
          { article: 'a01', page: 10, text: '他們在 Business Growth 中學會用速度與判斷力交付價值，在 People Growth 中學會讓員工從創意走向創新，在 Organization Growth 中學會讓人與 AI 找到新的分工與信任' },
        ],
      },
    },
    {
      kind: 'graphic',
      side: 'right',
      graphic: {
        type: 'list',
        title: '興奮之外，兩個必須警覺的隱憂',
        items: [
          {
            title: '資料安全', desc: '消費者資料、企業機密與決策邏輯，都在被大量餵給系統', at: 1,
            more: {
              title: '具體要做什麼？',
              quote: { article: 'a01', page: 10, text: '具體而言，這代表企業需要清楚界定哪些資料可以進入 AI 系統、由誰核准、如何稽核，並建立定期的第三方資安檢視機制，這才是決策速度能不能被信任的基礎。' },
            },
          },
          { title: 'AI 成癮', desc: '太方便，反而讓人漸漸失去自己判斷的能力和意願', at: 2 },
        ],
        source: '整理：策展者｜依據 唐心慧〈AI for Growth〉紙本 p.10',
      },
      src: [{ article: 'a01', page: 10, text: '我也想誠實地說出兩個隱憂' }],
      beats: [
        {
          text: '但興奮不能取代警覺。第一個隱憂是資料安全：沒有清楚的資料治理和安全防線，一次做中學的教訓，可能就是一次無法挽回的信任崩塌。',
          src: [
            { article: 'a01', page: 10, text: '但興奮，不能取代警覺' },
            { article: 'a01', page: 10, text: '如果沒有清楚的資料治理和安全防線，一次做中學的教訓，可能就是一次無法挽回的信任崩塌' },
          ],
        },
        {
          text: '第二個隱憂是 AI 成癮：當每個人都習慣把思考外包給 AI，久而久之，人的角色也會逐漸消失。速度與警覺，本是同一件事的兩面。',
          src: [
            { article: 'a01', page: 10, text: '組織裡如果每個人都習慣把思考外包給 AI，久而久之人的角色也會逐漸消失' },
            { article: 'a01', page: 10, text: '速度與警覺，本是同一件事的兩面' },
          ],
        },
      ],
    },
    {
      kind: 'quote',
      lead: {
        text: '回頭看，她談 AI 之所以興奮，是因為 AI 改變的其實不是世界，而是我們理解世界的方式。Modern marketing 正站在時代的轉折點上：Idea-led、AI-powered、Value-driven。',
        src: [
          { article: 'a01', page: 10, text: 'AI 改變的其實不是世界，是我們理解世界的方式' },
          { article: 'a01', page: 10, text: 'Modern marketing 正站在時代的轉折點上，Idea-led、AI-powered、Value-driven' },
        ],
      },
      quote: { article: 'a01', page: 11, text: '真正的競爭優勢，永遠來自企業如何善用科技，結合人的智慧與價值，為客戶與社會創造更大的影響。' },
    },
  ],
  asksTitle: '帶走兩個問題',
  asks: [
    { article: 'a01', page: 9, text: '在自己的工作裡，我到底是執行動作的人，還是定義任務，能給出判斷的人？' },
    { article: 'a01', page: 7, text: '大多數企業還沒想清楚，AI 時代要怎麼守住這些不變的東西，同時做出改變' },
  ],
};
