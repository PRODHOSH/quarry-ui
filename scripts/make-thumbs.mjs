// Renders a still image of every component and template into public/thumbs.
// Build and start the site first (npm run build && npm start), then:
//   BASE=http://localhost:3000 node scripts/make-thumbs.mjs [name]
// Needs Playwright (npm i -D playwright). Convert the png files to webp afterwards.
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const base = process.env.BASE ?? "http://localhost:3000";
const only = process.argv[2];
const items = JSON.parse(readFileSync("registry.json", "utf8")).items.filter((i) => !only || i.name === only);
mkdirSync("public/thumbs", { recursive: true });

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const queue = [...items];
async function worker() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  while (queue.length) {
    const it = queue.shift();
    const tpl = it.categories[0] === "templates";
    await page.goto(tpl ? `${base}${it.meta.preview}` : `${base}/thumb/${it.name}`, { waitUntil: "load", timeout: 90000 });
    await page.waitForTimeout(tpl ? 2200 : 2000);
    await page.screenshot({ path: `public/thumbs/${it.name}.png`, clip: tpl ? undefined : { x: 0, y: 0, width: 900, height: 563 } });
    console.log("done", it.name);
  }
  await page.close();
}
await Promise.all([worker(), worker(), worker(), worker()]);
await browser.close();
