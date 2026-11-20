// 故事的閱讀時間：主文、引言與橫向捲動卡片的字數合計，以每分鐘 450 字估算（與 content/articles.json 原文基準一致）。
import type { Story, Src } from './story';

export function storyChars(s: Story): number {
  let n = s.oneLiner.length;
  const q = (x?: Src) => (x ? x.text.length : 0);
  for (const sc of s.scenes) {
    if (sc.kind === 'graphic' || sc.kind === 'prose') n += sc.beats.reduce((t, b) => t + b.text.length + q(b.quote), 0);
    else if (sc.kind === 'hscroll') n += sc.intro.text.length + sc.panels.reduce((t, p) => t + p.text.length, 0);
    else if (sc.kind === 'quote') n += (sc.lead?.text.length ?? 0) + q(sc.quote);
    else if (sc.kind === 'bignum') n += sc.caption.text.length;
    else n += sc.text.length + (sc.lede?.text.length ?? 0);
  }
  return n + s.asks.reduce((t, a) => t + a.text.length, 0);
}

export const storyMinutes = (s: Story) => Math.max(1, Math.round(storyChars(s) / 450));
