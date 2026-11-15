// 繳交前閘門（npm run verify:release）：22 篇都要有故事且 reviewed: true，全文都要列入 FULLTEXT_REVIEWED。
// 開發期間不跑；只在凍結 release 前執行。
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const { articles } = JSON.parse(readFileSync(join(root, 'content', 'articles.json'), 'utf8'));
const reviewedFull = readFileSync(join(root, 'src', 'lib', 'fulltext.ts'), 'utf8').match(/FULLTEXT_REVIEWED = new Set<string>\(\[([^\]]*)\]\)/)?.[1] ?? '';

const problems = [];
for (const a of articles) {
  const f = join(root, 'src', 'data', 'stories', `${a.id}.ts`);
  if (!existsSync(f)) problems.push(`${a.id} ${a.title}：還沒有精華故事`);
  else if (!/status:\s*'reviewed'/.test(readFileSync(f, 'utf8'))) problems.push(`${a.id} ${a.title}：故事尚未人工校閱`);
  if (!reviewedFull.includes(`'${a.id}'`)) problems.push(`${a.id} ${a.title}：全文尚未完成校稿（見 docs/review/fulltext-proofread.md）`);
}
// 分享預覽與 canonical 需要絕對網址：正式建置要設 SITE_URL（Cloudflare Pages 環境變數）
if (!process.env.SITE_URL) problems.push('沒有設定 SITE_URL：分享預覽圖與 canonical 會退用部署網址或相對路徑');
// 襯線顯示字子集要涵蓋所有顯示文字（修稿期間只提示，繳交前擋下）
const fonts = spawnSync('node scripts/verify/check-fonts.mjs --strict', { shell: true, encoding: 'utf8', cwd: root });
if (fonts.status !== 0) problems.push(...fonts.stdout.trim().split('
'));
if (problems.length) {
  console.error(`✗ 尚不能繳交，還有 ${problems.length} 項：`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('✓ 22 篇故事已人工審定、全文已完成校稿，可以凍結 release');
