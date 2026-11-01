// 文字風格檢查（docs/text-review-plan.md §四 步驟 1）：只看策展者寫的、讀者看得到的文字
// （主文、一句話、策展補充、圖表與卡片短文字）；原文逐字引言、帶走的問題、圖說出處不檢查。
//   擋下：術語表 level=error 的詞（content/glossary.json）、中文旁的半形標點、中文與英數之間沒有空格
//   提示：單句超過 60 字、術語表 level=warn 的詞 → 寫入 docs/review/style-report.md
// 書名號《》、引號「」內的專有名詞（歌名、片名、原文說法）不檢查標點與空格。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles, flatten, loadStory, storyIds } from '../review/reader-text.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const { terms } = JSON.parse(readFileSync(join(ROOT, 'content/glossary.json'), 'utf8'));
const CJK = '\\u3400-\\u9fff';
const HALF = new RegExp(`[${CJK}][,;:?!()]|[,;:?!(][${CJK}]`);
const NOSPACE = new RegExp(`[${CJK}][A-Za-z0-9]|[A-Za-z0-9%][${CJK}]`);
const LONG = 60;
const CHECKED = new Set(['main', 'one', 'curator', 'short']);
const title = new Map(articles().map((a) => [a.id, a.title]));

const errors = [];
const warns = { long: [], term: [] };
for (const id of storyIds()) {
  const name = `${title.get(id) ?? id}（${id}）`;
  for (const u of flatten(await loadStory(id))) {
    if (!CHECKED.has(u.kind)) continue;
    const t = u.text.replace(/\*\*/g, '');
    const bare = t.replace(/「[^」]*」|《[^》]*》|〈[^〉]*〉/g, '「」');
    const at = `${name} ${u.path}`;
    const hit = (re) => bare.match(new RegExp(`.{0,6}${re.source}.{0,6}`))?.[0];
    if (HALF.test(bare)) errors.push(`${at}：中文旁用了半形標點「${hit(HALF)}」，改用全形`);
    if (NOSPACE.test(bare)) errors.push(`${at}：中文與英數之間要空一格「${hit(NOSPACE)}」`);
    for (const term of terms) {
      for (const bad of term.avoid) {
        if (!bare.includes(bad)) continue;
        const msg = `${at}：術語「${bad}」→「${term.use}」`;
        if (term.level === 'error') errors.push(msg); else warns.term.push({ id, name, term: term.use, bad, text: t });
      }
    }
    if (u.kind !== 'short') {
      for (const s of t.split(/(?<=[。！？；])/)) if (s.length > LONG) warns.long.push({ id, name, kind: u.kind, len: s.length, text: s });
    }
  }
}

// 提示寫成報告，不擋 build
const md = ['# 文字風格提示', '', '> 由 scripts/verify/lint-style.mjs 產生（npm run story:check 時更新）。不擋建置，審稿時逐條處理或註明保留。', ''];
md.push(`## 單句超過 ${LONG} 字（${warns.long.length} 句）`, '', '| 文章 | 類型 | 字數 | 句子 |', '|---|---|---:|---|');
warns.long.sort((a, b) => a.id.localeCompare(b.id) || b.len - a.len).forEach((w) => md.push(`| ${w.name} | ${w.kind} | ${w.len} | ${w.text.replace(/\|/g, '｜')} |`));
md.push('', `## 術語待定（${warns.term.length} 處，見 content/glossary.json 的 proposed）`, '', '| 文章 | 建議用 | 目前寫 | 句子 |', '|---|---|---|---|');
warns.term.forEach((w) => md.push(`| ${w.name} | ${w.term} | ${w.bad} | ${w.text.replace(/\|/g, '｜').slice(0, 80)} |`));
mkdirSync(join(ROOT, 'docs/review'), { recursive: true });
writeFileSync(join(ROOT, 'docs/review/style-report.md'), md.join('\n') + '\n');

if (errors.length) {
  console.error(`✗ 文字風格 ${errors.length} 項未通過`);
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log(`✓ 文字風格通過（提示：長句 ${warns.long.length}、術語待定 ${warns.term.length}，見 docs/review/style-report.md）`);
