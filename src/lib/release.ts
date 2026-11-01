// 正式版建置：Cloudflare Pages 建置時會設 CF_PAGES=1；本機要模擬正式版可用 RELEASE=1 npm run build。
// 正式版不顯示內部審稿狀態（「AI 初評通過・待人工校閱」），只在本機建置與開發時顯示，方便校閱。
export const RELEASE = process.env.CF_PAGES === '1' || process.env.RELEASE === '1';
