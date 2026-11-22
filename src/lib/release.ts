// 正式版建置：Cloudflare Workers Builds 會設 WORKERS_CI=1（舊的 Pages 是 CF_PAGES=1）；本機要模擬正式版可用 RELEASE=1 npm run build。
// 正式版不顯示審稿徽章。
export const RELEASE = process.env.WORKERS_CI === '1' || process.env.CF_PAGES === '1' || process.env.RELEASE === '1';
