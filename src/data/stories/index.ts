import type { Story } from '../../lib/story';

const modules = import.meta.glob<{ story: Story }>('./a*.ts', { eager: true });

/** 已寫好的故事。開發期間未審定的故事也會上線，但頁面會標示「草稿」；
 *  繳交前由 scripts/verify/verify-release.mjs 要求全部 reviewed: true。 */
export const STORIES: Record<string, Story> = Object.fromEntries(
  Object.values(modules).map((m) => [m.story.id, m.story]),
);
