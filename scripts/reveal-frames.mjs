/**
 * Captures the reveal mid-flight: scrolls a section into view and shoots a few
 * frames while the transition is running, so the motion can be eyeballed.
 *   node scripts/reveal-frames.mjs [baseUrl]
 */
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2] ?? "http://localhost:3001";
const outDir = "docs/shots/reveal";

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  protocolTimeout: 120000,
  args: ["--force-device-scale-factor=1", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(base, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 900));

// Jump so the "הורות מותאמת" cards enter the viewport, then sample the motion.
await page.evaluate(() => {
  const target = document.querySelector("#approach");
  window.scrollTo(0, (target?.getBoundingClientRect().top ?? 0) + window.scrollY - 120);
});

for (const ms of [60, 200, 400, 900]) {
  await new Promise((r) => setTimeout(r, ms === 60 ? 60 : 200));
  await page.screenshot({ path: `${outDir}/approach-${ms}ms.png` });
  console.log(`✓ ${outDir}/approach-${ms}ms.png`);
}

await browser.close();
