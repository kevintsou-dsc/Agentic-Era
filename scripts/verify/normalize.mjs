// 比對用的正規化：全形英數轉半形、統一引號與破折號、移除所有空白與換行。
export function normalize(s) {
  return s
    .normalize('NFKC')
    .replace(/[「『“"]/g, '「').replace(/[」』”"]/g, '」')
    .replace(/[—–－―‐-]+/g, '-')
    .replace(/[|｜]/g, '|')
    .replace(/\s+/g, '');
}
