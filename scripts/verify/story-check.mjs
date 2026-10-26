// 故事頁一次檢查（docs/story-playbook.md §6）：逐字比對 → 作者 → lint → 型別（只看故事與元件）→ 建置與站內連結。
// 只印出 ✓／✗ 摘要與錯誤，省去翻長輸出。用法：npm run story:check
import { spawnSync } from 'node:child_process';

const run = (label, cmd, filter) => {
  const r = spawnSync(cmd, { shell: true, encoding: 'utf8' });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  const lines = filter ? out.split('\n').filter(filter) : out.split('\n').filter((l) => /✓|✗|error|Error/.test(l));
  console.log(`— ${label}`);
  lines.slice(0, 40).forEach((l) => console.log('  ' + l.trim()));
  return r.status === 0;
};

let ok = true;
ok = run('逐字比對', 'node scripts/verify/verify-quotes.mjs', (l) => /✓ 引文|✗|  ✗|不符|找不到|頁碼/.test(l)) && ok;
ok = run('作者比對', 'node scripts/verify/verify-meta.mjs') && ok;
ok = run('主文與說明框 lint', 'node scripts/verify/lint-stories.mjs', (l) => /✓|✗|：/.test(l)) && ok;
// 型別：環境缺 @types/node 與 d3 型別造成的錯誤（TS7xxx、TS2683、node:fs）不算
const tsBad = (l) => /src\/(data|lib\/story|components|scripts)/.test(l) && /error TS/.test(l) && !/TS7\d{3}|TS2683|TS2307|TS2580/.test(l);
const ts = spawnSync('npx tsc --noEmit -p .', { shell: true, encoding: 'utf8' });
const tsErr = `${ts.stdout}${ts.stderr}`.split('\n').filter(tsBad);
console.log(`— 型別檢查\n  ${tsErr.length ? `✗ ${tsErr.length} 項` : '✓ 故事與元件沒有型別錯誤'}`);
tsErr.slice(0, 20).forEach((l) => console.log('  ' + l.trim()));
ok = !tsErr.length && ok;
ok = run('建置與站內連結', 'npx astro build && node scripts/verify/check-links.mjs', (l) => /✓ 站內|✗|error|Error/.test(l)) && ok;
console.log(ok ? '\n✓ 全部通過' : '\n✗ 有項目未通過');
process.exit(ok ? 0 : 1);
