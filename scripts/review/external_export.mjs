// 外部 LLM 審稿：把盲讀分數偏低的文章與泡泡匯出成可直接貼給其他模型的 prompt 檔。
// 改完的結果放回 content/review/external/<批次>/returns/，再用 external_import.py 匯入。
//
// 選文章：修改後盲讀（after；試跑兩篇也用 after）全篇平均分 < --mean（預設 4.0），
//         或兩位讀者都卡住的泡泡 ≥ --both（預設 10）。加 --all 匯出全部 22 篇。
// 選泡泡：兩位讀者都卡住，或任一讀者給 3 分以下且列入卡住。
// --no-cap：不設全篇 25% 增幅上限（只留每則 140 字），prompt 改成「盡量精簡」，匯入時也不擋增幅。
// 用法：node scripts/review/external_export.mjs <批次名> [--mean 4.0] [--both 10] [--all] [--only a01,a07] [--no-cap]
// 產出 content/review/external/<批次>/：
//   README.md                      使用說明與文章清單
//   prompt-<aNN>-<短名>.md          每篇一份，完整貼給外部模型
//   manifest.json                  匯出當下每則泡泡的原句，匯入時用來檢查是否已被改動
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const CMP = join(ROOT, 'content/review/compression');
const args = process.argv.slice(2);
const batch = args[0];
if (!batch || batch.startsWith('--')) { console.error('用法：node scripts/review/external_export.mjs <批次名> [--mean 4.0] [--both 10] [--all] [--only a01,a07]'); process.exit(1); }
const opt = (k, d) => { const i = args.indexOf(k); return i > 0 ? args[i + 1] : d; };
const MEAN = Number(opt('--mean', 4.0));
const BOTH = Number(opt('--both', 10));
const ALL = args.includes('--all');
const NOCAP = args.includes('--no-cap');
const ONLY = opt('--only', '')?.split(',').filter(Boolean) ?? [];
const OUT = join(ROOT, 'content/review/external', batch);

const SLUGS = {
  a01: 'ai-for-growth', a02: 'agentic-era', a03: 'power-of-real', a04: 'agents-of-growth', a05: 'growth-architect',
  a06: 'trust', a07: 'make-them-want-to-buy', a08: 'attention-is-scarce', a09: 'algorithm-or-people', a10: 'buy-attention',
  a11: 'shared-memory', a12: 'people-model', a13: 'rebuild-sov', a14: 'judgment', a15: 'generative-experience',
  a16: 'cultural-undercurrents', a17: 'why-customers-stop', a18: 'agent-experience', a19: 'geo', a20: 'beyond-ai-slop',
  a21: 'beyond-efficiency', a22: 'ai-agent-journey',
};
const json = (p) => JSON.parse(readFileSync(p, 'utf8'));
const clen = (s) => s.replace(/[\s，。、；：！？「」（）《》…—\-|]/g, '').length;
const glossary = json(join(ROOT, 'content/glossary.json')).terms.filter((t) => t.level === 'error');

function article(aid) {
  const slug = SLUGS[aid];
  const cur = json(join(CMP, `${slug}.current.units.json`));
  const after = json(join(CMP, `${slug}.after.units.json`)).units;
  const before = json(join(CMP, `${slug}.before.units.json`)).units;
  const readers = readdirSync(join(CMP, 'blind')).filter((f) => f.startsWith(`${slug}.after.`)).map((f) => json(join(CMP, 'blind', f)));
  const editsF = join(CMP, 'edits', `${slug}.json`);
  const prior = existsSync(editsF) ? json(editsF).edits : [];
  const all = readers.flatMap((r) => r.bubbles.map((b) => b.score));
  const mean = all.reduce((a, b) => a + b, 0) / all.length;
  const picked = [];
  for (const u of cur.units) {
    const scores = readers.map((r) => r.bubbles.find((b) => b.id === u.id)?.score ?? null);
    const stuck = readers.flatMap((r) => r.stuck.filter((s) => s.id === u.id).map((s) => ({ persona: r.persona, ...s })));
    const both = new Set(stuck.map((s) => s.persona)).size >= 2;
    const low = stuck.length && Math.min(...scores.filter((x) => x != null)) <= 3;
    if (!both && !low) continue;
    const a = after.find((x) => x.id === u.id);
    const p = prior.find((x) => x.id === u.id);
    picked.push({ ...u, scores, stuck, both, changedSinceRead: a?.text !== u.text,
      prior: p ? { verdict: p.verdict, reason: p.reason } : null });
  }
  const mainBefore = before.filter((u) => u.id !== 'ONE').reduce((a, u) => a + clen(u.text), 0);
  const mainNow = cur.units.filter((u) => u.id !== 'ONE').reduce((a, u) => a + clen(u.text), 0);
  return { aid, slug, title: cur.title, mean, readers: readers.length, both: picked.filter((p) => p.both).length,
    picked, headroom: Math.floor(mainBefore * 1.25) - mainNow, mainBefore, mainNow,
    reader: readFileSync(join(CMP, `${slug}.current.reader.md`), 'utf8') };
}

const TYPES = { S1: '少了主詞或對象', S2: '推論跳步', S3: '指稱懸空（這、此、該）', S4: '術語沒交代', S5: '壓成口號、名詞堆疊', S6: '和上一則接不起來', S7: '缺轉折或連接詞' };
const PERSONA = { newbie: '行銷新手 AE', engineer: '非行銷背景的工程師' };

function prompt(a) {
  const L = [];
  L.push(`# 審稿任務：〈${a.title}〉主文泡泡的通順度修改`, '');
  L.push('## 你的角色與任務', '');
  L.push('你是中文編輯。下面這篇是把一篇紙本行銷專文改寫成「捲動式網頁文章」的版本：每一則〔M01〕〔M02〕…是一個「主文泡泡」，是原文段落的濃縮；〔ONE〕是一句話摘要。');
  L.push('我們請了兩位沒讀過原文的讀者盲讀：一位是**行銷新手 AE**（懂基本行銷名詞，不熟 AI 與產業術語），一位是**非行銷背景的工程師**（對行銷陌生，習慣讀邏輯清楚的文件）。他們在「要修改的泡泡」那一節列出的泡泡上讀不順。');
  L.push('', '請逐則判斷並修改，讓沒讀過原文的讀者讀得懂、接得上前後文，同時**不改變原文的意思**。', '');
  L.push('## 規則（請嚴格遵守）', '');
  L.push('1. **只補回原文裡有、但泡泡省掉的那一環**：主詞、條件、因果、轉折詞、一個例子、一句定義。每則都附了出處所在的原文段落，請以原文為準，盡量沿用原文的說法。');
  L.push('2. **不能說得比原文強**：');
  L.push('   - 不加原文沒有的主張、結論、數字、例子、因果。');
  L.push('   - 原文的「或許」「可能」「往往」「逐漸」「未來」等保留語氣要保留。');
  L.push('   - 作者的主張不要寫成事實，也不要寫成「從案例歸納出的結論」。');
  L.push('   - 不要推定原文沒寫的身分或隸屬關係（例如作者屬於哪個團隊）。');
  L.push('3. **作者自己的概念詞**（例如「信任庫」「決策語境」「溫度與情境」）維持原文說法，不替作者具體化或下定義。');
  L.push('4. **術語**：第一次出現的核心術語，只用一句白話或括號裡幾個字帶過，不展開。');
  L.push('5. **篇幅**：');
  L.push('   - 每則改完不超過 **140 字**（含標點）。');
  if (NOCAP) L.push('   - 全篇沒有總字數上限，但請只補必要的那一環，不要擴寫；能一句解決就不要兩句。');
  else L.push(`   - 這篇全部修改加起來，主文最多再增加 **${Math.max(a.headroom, 0)} 字**（不算空白與標點）。${a.headroom < 60 ? '這篇剩下的空間很少，請優先用換詞、調語序、補連接詞解決，或在同一則裡刪掉較次要的細節換取空間。' : ''}`);
  L.push('   - 能用換詞、調語序解決的，就不要加句子。');
  L.push('6. **用字規範**：');
  L.push('   - 繁體中文，中文旁用全形標點（，。：；「」？！），不要用半形 , ; : ? ! ( )。');
  L.push('   - 中文與英文字母、數字之間留一個半形空格（例：「12 年」「AI 投放」）。');
  L.push('   - 不用「他」「她」「他們」「她們」指人：改用名字、職稱、「作者」或重組句子。');
  L.push('   - 不要用半形單引號 \' 或反斜線 \\。');
  for (const t of glossary) L.push(`   - 寫「${t.use}」，不寫${t.avoid.map((x) => `「${x}」`).join('、')}。`);
  L.push('7. **不改的情況**：如果原文本來就這麼寫、泡泡已經忠於原文，或讀者的困惑來自讀者背景（例如原文本身就沒給更多資訊），請判 `keep` 並說明理由。不要為了改而改。');
  L.push('8. 只改「要修改的泡泡」列出的編號。若為了銜接（S6）必須改相鄰的一則，可以另列一筆，用那一則的編號；它的 `old` 請從全文那一節一字不差地抄。');
  L.push('');
  L.push('## 讀者回報的症狀代號', '');
  for (const [k, v] of Object.entries(TYPES)) L.push(`- ${k}：${v}`);
  L.push('');
  L.push('## 要修改的泡泡', '');
  for (const p of a.picked) {
    L.push(`### ${p.id}${p.both ? '（兩位讀者都卡住）' : ''}`, '');
    L.push(`- 所在段落：${p.heading}`);
    L.push(`- 讀者分數（5 分制）：${p.scores.map((s) => s ?? '—').join('、')}`);
    L.push(`- 目前字數：${p.text.length}`);
    if (p.changedSinceRead) L.push('- 注意：讀者讀過之後，這則又小改過；下面的回報針對的是舊版。');
    if (p.prior && p.prior.verdict !== 'fix') L.push(`- 上一輪編輯判定不改，理由：${p.prior.reason}`);
    L.push('', '**目前句子（old）**：', '', '```text', p.text, '```', '');
    L.push('**讀者回報**：', '');
    for (const s of p.stuck) L.push(`- ${PERSONA[s.persona] ?? s.persona}〔${s.types.join(' ')}〕卡在「${s.quote}」：${s.why}　讀者的理解：${s.paraphrase}`);
    L.push('', '**出處所在的原文段落**：', '');
    for (const s of p.source) L.push(`> p.${s.page}：${s.text}`, '');
    if (!p.source.length) L.push('（這則沒有對應的原文段落，例如一句話摘要；請依全文判斷。）', '');
  }
  L.push('## 輸出格式', '');
  L.push('只輸出一個 JSON（放在 ```json 區塊裡），不要其他說明文字。每個「要修改的泡泡」都要有一筆：');
  L.push('', '```json');
  L.push(JSON.stringify({ article: a.aid, edits: [
    { id: 'M03', action: 'rewrite', old: '目前句子，一字不差', new: '修改後的句子', symptoms: 'S2 S7', page: 118, reason: '讀者卡在哪；依原文補回什麼' },
    { id: 'M07', action: 'keep', old: '目前句子，一字不差', new: '', symptoms: 'S4', page: 120, reason: '為什麼不改' },
  ] }, null, 1));
  L.push('```', '');
  L.push('- `action`：`rewrite` 或 `keep`。');
  L.push('- `old`：必須和「目前句子」一字不差。');
  L.push('- `page`：依據的原文頁碼。');
  L.push('- `reason`：要寫依據原文哪一頁補回了什麼。', '');
  L.push('## 全文（讀者看到的版本，供判斷前後文）', '');
  L.push('格式說明：`##` 是每一幕的標題；`- ` 開頭的是圖表或卡片上的短文字；`［圖表說明］` 是滑過圖表時跳出的說明；`［延伸］` 是可以點開的延伸說明；`>` 是原文引言。', '');
  L.push('````markdown', a.reader.trim(), '````');
  return L.join('\n') + '\n';
}

const list = Object.keys(SLUGS).map(article);
const chosen = list.filter((a) => a.picked.length && (ONLY.length ? ONLY.includes(a.aid) : ALL || a.mean < MEAN || a.both >= BOTH));
mkdirSync(join(OUT, 'returns'), { recursive: true });
const manifest = { batch, exported: new Date().toISOString(), cap: !NOCAP, articles: {} };
for (const a of chosen) {
  const f = `prompt-${a.aid}-${a.slug}.md`;
  writeFileSync(join(OUT, f), prompt(a));
  manifest.articles[a.aid] = { slug: a.slug, title: a.title, file: f, headroom: a.headroom, main_before: a.mainBefore, main_now: a.mainNow,
    bubbles: Object.fromEntries(a.picked.map((p) => [p.id, { path: p.path, text: p.text }])) };
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));

const R = [];
R.push(`# 外部 LLM 審稿：${batch}`, '');
R.push(`匯出時間：${manifest.exported}。產生方式：\`node scripts/review/external_export.mjs ${args.join(' ')}\``, '');
R.push('## 怎麼用', '');
R.push('1. 把一份 `prompt-*.md` 的**完整內容**貼給外部模型（ChatGPT、Gemini 等），一篇開一個新對話。');
R.push('2. 模型會回一個 ```json 區塊。把回覆存成 `returns/<aNN>.json`（例如 `returns/a07.json`）。整段回覆含說明文字也可以存成 `returns/<aNN>.md`，匯入時會自動抓第一個 json 區塊。');
R.push('3. 檢查（不改檔）：`python -I -X utf8 scripts/review/external_import.py ' + batch + '`');
R.push('4. 確認後套用：`python -I -X utf8 scripts/review/external_import.py ' + batch + ' --apply`，再跑 `npm run story:check`。');
R.push('', '選文章的條件：修改後盲讀全篇平均分 < ' + MEAN + '，或兩位讀者都卡住的泡泡 ≥ ' + BOTH + (ALL ? '（本批加了 --all，全部匯出）' : '') + '。' + (NOCAP ? '本批不設全篇 25% 增幅上限（--no-cap），只限每則 140 字。' : '') + '選泡泡：兩位讀者都卡住，或任一讀者給 3 分以下且列入卡住。', '');
R.push('| 文章 | 檔案 | 盲讀平均分 | 要改的泡泡 | 兩位都卡 | 25% 上限內還能增加的字數 |', '|---|---|---|---|---|---|');
for (const a of chosen.sort((x, y) => x.mean - y.mean)) R.push(`| 〈${a.title}〉${a.aid} | \`${manifest.articles[a.aid].file}\` | ${a.mean.toFixed(2)} | ${a.picked.length} | ${a.both} | ${Math.max(a.headroom, 0)} |`);
const skipped = list.filter((a) => !chosen.includes(a));
if (skipped.length) R.push('', '沒匯出：' + skipped.map((a) => `〈${a.title}〉${a.aid}（${a.mean.toFixed(2)}，兩位都卡 ${a.both}）`).join('、'));
writeFileSync(join(OUT, 'README.md'), R.join('\n') + '\n');
console.log(`${batch}：${chosen.length} 篇、${chosen.reduce((s, a) => s + a.picked.length, 0)} 則 → content/review/external/${batch}/`);
for (const a of chosen) console.log(`  ${a.aid} ${a.slug.padEnd(24)} 平均 ${a.mean.toFixed(2)}  泡泡 ${String(a.picked.length).padStart(2)}  兩位都卡 ${String(a.both).padStart(2)}  可增 ${a.headroom} 字`);
