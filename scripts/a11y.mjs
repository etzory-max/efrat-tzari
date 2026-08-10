/**
 * Runs axe-core over every page at desktop and mobile widths.
 *   node scripts/a11y.mjs [baseUrl]
 * Exits non-zero when any WCAG 2.2 A/AA violation is found.
 */
import { readFile } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2] ?? "http://localhost:3000";

const pages = [
  "/",
  "/articles/kshe-haahim-margishim-shenishkehu",
  "/privacy",
  "/accessibility",
];
const widths = [1440, 375];

const axeSource = await readFile("node_modules/axe-core/axe.min.js", "utf8");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  protocolTimeout: 180000,
  args: ["--force-device-scale-factor=1"],
});

let total = 0;

async function audit(page, label) {
  await page.evaluate(axeSource);
  const results = await page.evaluate(async () =>
    // @ts-expect-error injected at runtime
    window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    }),
  );
  total += results.violations.length;
  console.log(`\n${label} — ${results.violations.length} violations`);
  for (const violation of results.violations) {
    console.log(`  [${violation.impact}] ${violation.id}: ${violation.help}`);
    for (const node of violation.nodes.slice(0, 3)) {
      console.log(`      ${node.target.join(" ")}`);
      console.log(`      ${node.failureSummary?.split("\n").join(" | ")}`);
    }
  }
}

// Interactive states axe cannot reach on its own.
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 60000 });

  await page.click('button[aria-controls="mobile-nav"]');
  await new Promise((r) => setTimeout(r, 400));
  await audit(page, "/ @ 375px — תפריט מובייל פתוח");

  await page.keyboard.press("Escape");
  await page.click('button[aria-controls="a11y-panel"]');
  await new Promise((r) => setTimeout(r, 400));
  await audit(page, "/ @ 375px — תפריט נגישות פתוח");

  // High-contrast mode must clear AA too.
  await page.evaluate(() => {
    document.documentElement.dataset.a11yContrast = "on";
    document.documentElement.dataset.a11yText = "xl";
  });
  await new Promise((r) => setTimeout(r, 300));
  await audit(page, "/ @ 375px — ניגודיות גבוהה + טקסט גדול");
  await page.close();
}

for (const width of widths) {
  for (const route of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: width === 375 ? 812 : 1000 });
    await page.goto(base + route, { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(async () => {
      // Open every disclosure so collapsed content is audited too.
      document.querySelectorAll("details").forEach((d) => (d.open = true));
      await new Promise((r) => setTimeout(r, 400));
    });
    await page.evaluate(axeSource);

    const results = await page.evaluate(async () =>
      // @ts-expect-error injected at runtime
      window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
      }),
    );

    const violations = results.violations;
    total += violations.length;
    console.log(`\n${route} @ ${width}px — ${violations.length} violations`);
    for (const violation of violations) {
      console.log(`  [${violation.impact}] ${violation.id}: ${violation.help}`);
      for (const node of violation.nodes.slice(0, 3)) {
        console.log(`      ${node.target.join(" ")}`);
        console.log(`      ${node.failureSummary?.split("\n").join(" | ")}`);
      }
    }
    await page.close();
  }
}

await browser.close();
console.log(`\n=== סה"כ ${total} ליקויים ===`);
process.exit(total > 0 ? 1 : 0);
