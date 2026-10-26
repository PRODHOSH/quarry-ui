// Renders the documentation to public/quarry-ui-documentation.pdf.
// Start the site first (npm run dev, or npm run build && npm start), then:
//   BASE=http://localhost:3000 node scripts/make-docs-pdf.mjs
// Needs Playwright (npm i -D playwright).
import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 1400 } });
await page.goto(`${base}/thumb/docs-pdf`, { waitUntil: "networkidle", timeout: 120000 });
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ media: "print" });
await page.pdf({
  path: "public/quarry-ui-documentation.pdf",
  format: "A4",
  printBackground: true,
  margin: { top: "18mm", bottom: "20mm", left: "18mm", right: "18mm" },
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: `<div style="width:100%;font-family:Arial,sans-serif;font-size:8px;color:#737373;padding:0 18mm;display:flex;justify-content:space-between"><span>Quarry UI documentation</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
});
await browser.close();
console.log("wrote public/quarry-ui-documentation.pdf");
