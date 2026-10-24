import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // CSS 一律輸出成檔案，讓 CSP 可以用 style-src 'self'（不需要允許 inline <style>）
  build: { inlineStylesheets: 'never' },
  // assetsInlineLimit 0：小腳本也輸出成檔案，CSP 才能只用 script-src 'self'
  vite: { build: { sourcemap: false, assetsInlineLimit: 0 } },
});
