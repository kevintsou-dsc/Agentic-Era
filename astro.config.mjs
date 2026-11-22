import { defineConfig } from 'astro/config';

// 舊網址（紙本頁碼 /a/p96）→ 新網址：由 scripts/gen-redirects.mjs 產生 Cloudflare 的 _redirects（有無結尾斜線都 301）。
// 這裡不要再設 Astro 的 redirects：Cloudflare 部署時會自動加上 Astro 轉接器，把 redirects 接在 _redirects 後面，
// 同一路徑出現兩條規則，部署會被拒絕（Invalid _redirects configuration: Duplicate rule）。

// 正式網址：分享預覽（og:image、og:url）與 canonical 都要絕對網址。
// 網域確定後在 Cloudflare Pages 的環境變數設 SITE_URL；沒設時退用 Cloudflare 自動給的部署網址，本機則不輸出絕對網址。
// 後台填的值常帶空白、引號或漏了 https://：先整理再驗證；整理後仍不是合法網址就不用它（建置照跑、只警告），
// 不然 Astro 會在產生頁面時丟出 Invalid URL，整個部署失敗。
function siteFrom(raw) {
  let v = (raw ?? '').trim().replace(/^['"]|['"]$/g, '').trim();
  if (!v) return undefined;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    // 主機名稱至少要有一個點（例如 ttps://… 會被補成主機「ttps」，那不是網址）
    if (!u.hostname.includes('.')) throw new Error('no dot in host');
    return `${u.protocol}//${u.host}`;
  } catch {
    console.warn(`[astro.config] SITE_URL 不是合法網址，已略過：${JSON.stringify(raw)}`);
    return undefined;
  }
}
const site = siteFrom(process.env.SITE_URL) ?? siteFrom(process.env.CF_PAGES_URL);

export default defineConfig({
  output: 'static',
  site,
  // CSS 一律輸出成檔案，讓 CSP 可以用 style-src 'self'（不需要允許 inline <style>）
  build: { inlineStylesheets: 'never' },
  // assetsInlineLimit 0：小腳本也輸出成檔案，CSP 才能只用 script-src 'self'
  vite: { build: { sourcemap: false, assetsInlineLimit: 0 } },
});
