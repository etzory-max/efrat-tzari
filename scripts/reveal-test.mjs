/**
 * Verifies the scroll reveal in a real rendering browser:
 * items start hidden, appear as they scroll into view, and are ALWAYS visible
 * when motion is switched off or reduced.
 *   node scripts/reveal-test.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2] ?? "http://localhost:3000";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  protocolTimeout: 120000,
  args: ["--force-device-scale-factor=1"],
});

const counts = (page) =>
  page.evaluate(() => {
    const items = [...document.querySelectorAll("[data-reveal-item]")];
    return {
      total: items.length,
      revealed: items.filter((i) => i.hasAttribute("data-revealed")).length,
      visible: items.filter((i) => Number(getComputedStyle(i).opacity) > 0.99).length,
    };
  });

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    await new Promise((r) => setTimeout(r, 1200));
  });
}

// 1 — normal visit
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));
  console.log("1) בטעינה (בלי גלילה):", JSON.stringify(await counts(page)));
  await scrollThrough(page);
  console.log("   אחרי גלילה מלאה:   ", JSON.stringify(await counts(page)));
  await page.close();
}

// 2 — prefers-reduced-motion: nothing may ever be hidden
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(base, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 600));
  console.log("2) prefers-reduced-motion:", JSON.stringify(await counts(page)));
  await page.close();
}

// 3 — accessibility menu, "stop animations"
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle2" });
  await page.evaluate(() => (document.documentElement.dataset.a11yMotion = "off"));
  await new Promise((r) => setTimeout(r, 400));
  console.log("3) עצירת אנימציות:      ", JSON.stringify(await counts(page)));
  await page.close();
}

// 4 — no JavaScript at all
{
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle2" });
  console.log("4) בלי JavaScript:      ", JSON.stringify(await counts(page)));
  await page.close();
}

await browser.close();
