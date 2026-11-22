// 建置前產生靜態輔助檔：
// 1. public/_redirects：舊網址（/a/p96、/a/<slug>/full、/story/<slug>/full）→ 新網址 301（去重以避免 Cloudflare 拒絕重複規則）。
// 2. public/robots.txt、public/sitemap.xml：搜尋引擎索引。
// 3. public/llms.txt：AI／機器可讀全書結構與 22 篇摘要索引。
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const legacy = JSON.parse(readFileSync(join(root, 'content/legacy-slugs.json'), 'utf8'));
const { articles } = JSON.parse(readFileSync(join(root, 'content/articles.json'), 'utf8'));

function baseFrom(raw) {
  let v = (raw ?? '').trim().replace(/^['"]|['"]$/g, '').trim();
  if (!v) return 'https://agentic-era.kevin-tsou.workers.dev';
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    if (!u.hostname.includes('.')) throw new Error('invalid');
    return `${u.protocol}//${u.host}`;
  } catch {
    return 'https://agentic-era.kevin-tsou.workers.dev';
  }
}
const site = baseFrom(process.env.SITE_URL || process.env.CF_PAGES_URL);

// 1. _redirects（用 Map 去重來源路徑）
const rules = new Map();
const addRule = (from, to) => {
  if (!rules.has(from)) rules.set(from, `${from} ${to} 301`);
};
for (const [o, n] of Object.entries(legacy)) {
  for (const s of ['', '/']) {
    addRule(`/a/${o}${s}`, `/story/${n}/`);
    addRule(`/a/${o}/full${s}`, `/story/${n}/original/`);
  }
}
for (const a of articles) {
  const n = a.slug;
  for (const s of ['', '/']) {
    addRule(`/a/${n}${s}`, `/story/${n}/`);
    addRule(`/a/${n}/full${s}`, `/story/${n}/original/`);
    addRule(`/story/${n}/full${s}`, `/story/${n}/original/`);
  }
}
writeFileSync(join(root, 'public/_redirects'), ['# 由 scripts/gen-redirects.mjs 產生，請勿手改', ...rules.values()].join('\n') + '\n');

// 2. robots.txt
writeFileSync(join(root, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

// 3. sitemap.xml
const urls = ['/', '/about/', ...articles.flatMap((a) => [`/story/${a.slug}/`, `/story/${a.slug}/original/`])];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => `  <url><loc>${site}${u}</loc></url>`),
  '</urlset>',
].join('\n') + '\n';
writeFileSync(join(root, 'public/sitemap.xml'), sitemap);

// 4. llms.txt
const chNames = {
  intro: '序章（Intro）',
  people: '人（People）',
  model: '模型（Model）',
  ai: '行動（A.I / Actionable Insights）',
};
const llms = [
  '# 《決策智慧 2026：Agentic 時代，重塑品牌與人的真實距離》互動閱讀版',
  '',
  '> 電通行銷傳播集團（dentsu Taiwan）《決策智慧 2026》全書 22 篇數位策展閱讀站。全站採三層閱讀架構：全書地圖首頁（約 1 分鐘）→ 單篇捲動精華故事（每篇 3–12 分鐘）→ 逐頁校正全文與紙本印刷對照。所有引文與數據皆經自動化閘門逐字核對紙本頁碼。',
  '',
  `- 正式網站：${site}/`,
  `- 關於本作品與策展／資安方法：${site}/about/`,
  `- 網站地圖：${site}/sitemap.xml`,
  '',
  '## 全書 22 篇索引與核心一句話',
  '',
];

for (const ch of ['intro', 'people', 'model', 'ai']) {
  llms.push(`### ${chNames[ch]}`);
  for (const a of articles.filter((x) => x.chapter === ch)) {
    const { story } = await import(pathToFileURL(join(root, `src/data/stories/${a.id}.ts`)).href);
    const authors = a.authors.map((au) => au.name).join('、');
    const title = a.subtitle ? `${a.title}：${a.subtitle}` : a.title;
    llms.push(`- **${title}**（${authors}｜紙本 p.${a.pages[0]}–${a.pages[1]}）`);
    llms.push(`  - 核心一句話：${story.oneLiner}`);
    llms.push(`  - 精華故事：${site}/story/${a.slug}/`);
    llms.push(`  - 完整原文：${site}/story/${a.slug}/original/`);
  }
  llms.push('');
}
writeFileSync(join(root, 'public/llms.txt'), llms.join('\n'));
console.log(`_redirects：${rules.size} 條；robots.txt / sitemap.xml（${urls.length} 頁） / llms.txt 已產生`);
