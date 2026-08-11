/**
 * Checks that the menu works from every page, not just the home page —
 * clicking "אודות" on /accessibility must land on the home page at #about.
 *   node scripts/nav-test.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2] ?? "http://localhost:3000";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  protocolTimeout: 120000,
});

const cases = [
  { from: "/accessibility", link: "אודות", expectHash: "#about" },
  { from: "/privacy", link: "מאמרים", expectHash: "#articles" },
  { from: "/articles/kshe-haahim-margishim-shenishkehu", link: "צור קשר", expectHash: "#contact" },
  { from: "/", link: "הרצאות", expectHash: "#service-lectures" },
];

let failures = 0;

for (const testCase of cases) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base + testCase.from, { waitUntil: "networkidle2" });

  await page.evaluate((label) => {
    const link = [...document.querySelectorAll("header nav a")].find(
      (a) => a.textContent.trim() === label,
    );
    if (!link) throw new Error(`link not found: ${label}`);
    link.click();
  }, testCase.link);

  await new Promise((r) => setTimeout(r, 3200));

  const result = await page.evaluate((hash) => {
    const target = document.querySelector(hash);
    return {
      path: location.pathname,
      hash: location.hash,
      targetExists: !!target,
      // The section should now be at or near the top of the viewport.
      targetTop: target ? Math.round(target.getBoundingClientRect().top) : null,
      scrollY: Math.round(window.scrollY),
    };
  }, testCase.expectHash);

  const ok =
    result.path === "/" &&
    result.hash === testCase.expectHash &&
    result.targetExists &&
    Math.abs(result.targetTop) < 160;

  if (!ok) failures += 1;
  console.log(
    `${ok ? "✓" : "✗"} ${testCase.from} → "${testCase.link}"  ${JSON.stringify(result)}`,
  );
  await page.close();
}

await browser.close();
console.log(failures === 0 ? "\nכל הקישורים עובדים" : `\n${failures} קישורים נכשלו`);
process.exit(failures ? 1 : 0);
