/**
 * Dev-only screenshot helper. Drives the locally installed Chrome via CDP so
 * we can eyeball the build at several widths without shipping a browser.
 *
 *   node scripts/shots.mjs [baseUrl] [outDir]
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? "docs/shots";

const targets = [
  { name: "home-1440", url: "/", width: 1440, height: 1000, full: true },
  { name: "home-768", url: "/", width: 768, height: 1000, full: true },
  { name: "home-375", url: "/", width: 375, height: 812, full: true },
  { name: "article", url: "/articles/kshe-haahim-margishim-shenishkehu", width: 1440, height: 1000, full: true },
  { name: "privacy", url: "/privacy", width: 1440, height: 1000, full: true },
  { name: "accessibility", url: "/accessibility", width: 1440, height: 1000, full: true },
];

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  protocolTimeout: 120000,
  args: ["--force-device-scale-factor=1", "--hide-scrollbars"],
});

for (const target of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: target.width, height: target.height });
  await page.goto(base + target.url, { waitUntil: "networkidle2", timeout: 60000 });
  // Walk the page so lazy images actually load before the full-page capture.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 800));
  });
  const file = path.join(outDir, `${target.name}.png`);
  await page.screenshot({ path: file, fullPage: target.full });
  console.log(`✓ ${file}`);
  await page.close();
}

await browser.close();
