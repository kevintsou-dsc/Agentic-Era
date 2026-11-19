// 襯線顯示字（docs/design-review/p1-02-ruling.md D1）要涵蓋的字：
//   display（900）：文章標題、首頁大標、首頁區塊標題（.h2）、章節中文名、敘事段標題（.prose-h）、陳述句（.statement）
//   text（700）：所有原文引言（.quote，含延伸區塊與橫捲卡片裡的）、帶走的問題（.asks）、首頁核心命題
// 兩組都固定加上可列印 ASCII 與常用全形標點。scripts/fonts/fonts.py 依此子集；check-fonts 依此比對涵蓋。
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { articles, flatten, loadStory, storyIds } from '../review/reader-text.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const BASE = [...Array(95)].map((_, i) => String.fromCharCode(32 + i)).join('') + '，。、：；？！「」『』（）《》〈〉…—–·％';
// 首頁 Hero 的大標寫死在 Hero.astro：直接從原始檔取出，改字時不會漏
const HERO = readFileSync(join(ROOT, 'src/components/home/Hero.astro'), 'utf8').match(/<h1 class="[^"]*serif[^"]*">([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, '') ?? '';
if (!HERO) throw new Error('display-chars：在 Hero.astro 找不到襯線大標');
// 首頁區塊標題（.h2）與章節中文名（章節標題）也用襯線 900（layout-token-audit 第 2 步）
// 首頁全書地圖（FaceMap.astro）的區塊標題，以及畫面左上角的「已上色 n／22」（scripts/facemap.ts）
const HOME = ['src/pages/index.astro', 'src/components/home/FaceMap.astro'].map((f) => readFileSync(join(ROOT, f), 'utf8')).join(' ');
const H2 = [...HOME.matchAll(/<h2 [^>]*class="h2[^"]*">([\s\S]*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, '')).join('') + '已上色／';
if (H2.length <= 4) throw new Error('display-chars：在首頁找不到 .h2 區塊標題');

export async function collect() {
  const display = new Set(BASE + HERO + H2), text = new Set(BASE);
  const add = (set, t) => { for (const c of (t ?? '').replace(/\*\*/g, '')) set.add(c); };
  // articles.ts 會匯入 JSON，Node 直接載入需要 import 屬性：改從原始檔取章節中文名
  for (const m of readFileSync(join(ROOT, 'src/lib/articles.ts'), 'utf8').matchAll(/\bzh: '([^']+)'/g)) add(display, m[1]);
  for (const a of articles()) add(display, a.title);
  const { CORE_QUESTION } = await import(pathToFileURL(join(ROOT, 'src/data/home.ts')).href);
  add(text, CORE_QUESTION.text);
  for (const id of storyIds()) {
    const s = await loadStory(id);
    for (const sc of s.scenes) {
      if (sc.kind === 'prose') add(display, sc.heading);
      if (sc.kind === 'statement') add(display, sc.text);
    }
    for (const u of flatten(s)) if (u.kind === 'quote' || u.kind === 'ask') add(text, u.text);
  }
  return { display, text };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { display, text } = await collect();
  process.stdout.write(JSON.stringify({ display: [...display].sort().join(''), text: [...text].sort().join('') }));
}
