/**
 * Capture a single viewport-sized region:
 *   node scripts/crop.mjs <url> <scrollY> <out> [width] [height]
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [url, y = "0", out = "docs/shots/crop.png", width = "1440", height = "900"] =
  process.argv.slice(2);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  protocolTimeout: 120000,
  args: ["--force-device-scale-factor=1", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: Number(width), height: Number(height) });
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
await page.evaluate(async (target) => {
  window.scrollTo(0, target);
  await new Promise((r) => setTimeout(r, 1200));
}, Number(y));
await page.screenshot({ path: out });
console.log(`✓ ${out}`);
await browser.close();
