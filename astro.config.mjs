import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

// 舊網址（紙本頁碼 /a/p96/）轉到新網址（英文短名 /story/people-model/），已分享出去的連結不會失效
const legacy = JSON.parse(readFileSync(new URL('./content/legacy-slugs.json', import.meta.url), 'utf8'));
const redirects = Object.fromEntries(Object.entries(legacy).flatMap(([o, n]) => [[`/a/${o}`, `/story/${n}/`], [`/a/${o}/full`, `/story/${n}/original/`]]));

export default defineConfig({
  output: 'static',
  redirects,
  // CSS 一律輸出成檔案，讓 CSP 可以用 style-src 'self'（不需要允許 inline <style>）
  build: { inlineStylesheets: 'never' },
  // assetsInlineLimit 0：小腳本也輸出成檔案，CSP 才能只用 script-src 'self'
  vite: { build: { sourcemap: false, assetsInlineLimit: 0 } },
});
