// 策展文字的極簡標記：只支援 **粗體**。先跳脫 HTML，再把 **x** 換成 <b>x</b>，可安全用在 set:html。
export function rich(s: string): string {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}
