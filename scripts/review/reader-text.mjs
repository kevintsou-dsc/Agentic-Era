// 讀者看得到的文字：依頁面順序列出每篇故事的每一則文字，並標上類型與依據的原文。
// 給風格 lint、審稿文件（packet.mjs）、讀者盲評與 Jev 策展補充初評共用。只做解析，不呼叫任何 API。
//
// 類型（kind）：
//   main     主文：改寫原文，帶 src（段落、橫捲卡片、引言段、大數字說明）
//   one      一句話摘要
//   ask      帶走的問題（原文逐字）
//   curator  策展補充：圖表說明框（extra／centerExtra）、延伸區塊說明（more.text）——原文沒有
//   short    圖表與卡片短文字：標題、標籤、desc、kicker、眉標
//   quote    原文引言（逐字）
//   source   圖說出處、圖片授權
//
// 執行：node scripts/review/reader-text.mjs [aNN ...] → 寫出 content/review/units.json
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const DIR = join(ROOT, 'src/data/stories');
const SKIP_KEYS = new Set(['type', 'kind', 'layout', 'side', 'tone', 'url', 'href', 'id', 'status', 'chart', 'unit', 'prefix', 'sourceUrl', 'licenseUrl', 'icon', 'art']);
const SOURCE_KEYS = new Set(['source', 'credit', 'license']);
const CURATOR_KEYS = new Set(['extra', 'centerExtra', 'dropNote', 'note', 'common']);
const isSrc = (o) => o && typeof o === 'object' && typeof o.article === 'string' && typeof o.page === 'number' && typeof o.text === 'string';

export const articles = () => {
  const j = JSON.parse(readFileSync(join(ROOT, 'content/articles.json'), 'utf8'));
  return Array.isArray(j) ? j : j.articles;
};

export async function loadStory(id) {
  const { story } = await import(pathToFileURL(join(DIR, `${id}.ts`)).href);
  return story;
}

export const storyIds = () => readdirSync(DIR).filter((x) => /^a\d\d\.ts$/.test(x)).map((x) => x.slice(0, 3)).sort();

/** 依頁面順序攤平一篇故事。每則：{ kind, key, path, text, src?, scene, heading } */
export function flatten(story) {
  const out = [];
  const push = (kind, key, path, text, ctx, src) => {
    if (typeof text !== 'string' || !text.trim()) return;
    out.push({ kind, key, path, text, scene: ctx.scene, heading: ctx.heading, ...(src ? { src } : {}) });
  };
  push('one', 'oneLiner', 'oneLiner', story.oneLiner, { scene: 0, heading: '一句話' });
  const walk = (o, path, key, ctx) => {
    if (o == null) return;
    if (typeof o === 'string') {
      if (SKIP_KEYS.has(key) || /^\/|^https?:/.test(o) || (key === 'src' && /\.\w{3,4}$/.test(o))) return;
      if (key === 'alt') return; // 圖片替代文字：讀者看不到，另行檢查
      const kind = SOURCE_KEYS.has(key) ? 'source' : CURATOR_KEYS.has(key) ? 'curator' : 'short';
      push(kind, key, path, o, ctx);
      return;
    }
    if (typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach((v, i) => walk(v, `${path}[${i}]`, key, ctx)); return; }
    if (isSrc(o)) { if (key === 'quote') push('quote', 'quote', path, o.text, ctx, [o]); return; }
    // 主文：text 旁邊帶 src 陣列
    // 依欄位在資料裡的順序走（與頁面上的順序一致：眉標、標題 → 內文 → 延伸）
    const isMain = typeof o.text === 'string' && Array.isArray(o.src);
    const isMore = key === 'more' && typeof o.text === 'string';
    if (isMain || isMore) {
      for (const [k, v] of Object.entries(o)) {
        if (k === 'src') continue;
        if (k === 'text') isMain ? push('main', key || 'text', `${path}.text`, o.text, ctx, o.src) : push('curator', 'more.text', `${path}.text`, o.text, ctx, isSrc(o.quote) ? [o.quote] : undefined); // 延伸說明的直接依據是同一區塊的原文引言
        else walk(v, `${path}.${k}`, k, ctx);
      }
      return;
    }
    for (const [k, v] of Object.entries(o)) {
      if (k === 'src' || k === 'figures') continue; // 出處比對用，不顯示
      walk(v, `${path}.${k}`, k, ctx);
    }
  };
  story.scenes.forEach((sc, i) => {
    const heading = sc.heading ?? sc.title ?? sc.graphic?.title ?? sc.graphic?.chart?.title ?? sc.eyebrow ?? sc.kind;
    walk(sc, `scenes[${i}]`, '', { scene: i + 1, heading });
  });
  (story.asks ?? []).forEach((a, i) => push('ask', 'asks', `asks[${i}]`, a.text, { scene: 99, heading: story.asksTitle ?? '帶走的問題' }, [a]));
  // 沒有自己出處的文字（策展補充、短文字），掛上同一幕主文的出處，供 Jev 與審稿文件對照原文
  const sceneSrc = new Map();
  for (const u of out) if (u.kind === 'main') sceneSrc.set(u.scene, [...(sceneSrc.get(u.scene) ?? []), ...u.src]);
  for (const u of out) if (!u.src && sceneSrc.has(u.scene)) u.sceneSrc = sceneSrc.get(u.scene);
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const only = new Set(process.argv.slice(2));
  const meta = new Map(articles().map((a) => [a.id, a]));
  const data = [];
  for (const id of storyIds().filter((x) => !only.size || only.has(x))) {
    const units = flatten(await loadStory(id));
    data.push({ id, slug: meta.get(id)?.slug, title: meta.get(id)?.title, units });
  }
  mkdirSync(join(ROOT, 'content/review'), { recursive: true });
  writeFileSync(join(ROOT, 'content/review/units.json'), JSON.stringify(data, null, 1));
  const count = {};
  data.forEach((s) => s.units.forEach((u) => { count[u.kind] = (count[u.kind] ?? 0) + 1; }));
  console.log(`${data.length} 篇`, count);
}
