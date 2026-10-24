import data from '../../content/articles.json';

export type Chapter = 'intro' | 'people' | 'model' | 'ai';
export type ThreadKey = 'trust' | 'judge' | 'agent' | 'memory';

export interface Author { name: string; en: string; title: string }
export interface Article {
  id: string;
  slug: string;
  chapter: Chapter;
  title: string;
  subtitle: string;
  kicker?: string;
  org?: string;
  pages: [number, number];
  minutes: number;
  threads: ThreadKey[];
  authors: Author[];
}
export interface Thread { key: ThreadKey; name: string; short: string }

export const ARTICLES = data.articles as Article[];
export const THREADS = data.threads as Thread[];

export const CHAPTERS: Record<Chapter, { name: string; zh: string; order: number }> = {
  intro: { name: 'Intro', zh: '序章', order: 0 },
  people: { name: 'People', zh: '人', order: 1 },
  model: { name: 'Model', zh: '模型', order: 2 },
  ai: { name: 'A.I', zh: '行動', order: 3 },
};
export const CHAPTER_ORDER: Chapter[] = ['intro', 'people', 'model', 'ai'];

export function article(id: string): Article {
  const a = ARTICLES.find((x) => x.id === id);
  if (!a) throw new Error(`unknown article ${id}`);
  return a;
}

export const fullTitle = (a: Article) => (a.subtitle ? `${a.title}：${a.subtitle}` : a.title);
export const authorNames = (a: Article) => a.authors.map((x) => x.name).join('、');
export const authorLine = (au: Author, a: Article) => `${a.org ? a.org + ' ' : ''}${au.title}　${au.name}${au.en ? ' ' + au.en : ''}`;
// 引用時的短出處：作者〈短標題〉
export const cite = (a: Article) => `${authorNames(a)}〈${a.title}〉`;

export const totalMinutes = ARTICLES.reduce((s, a) => s + a.minutes, 0);
export const totalAuthors = new Set(ARTICLES.flatMap((a) => a.authors.map((x) => x.name))).size;
