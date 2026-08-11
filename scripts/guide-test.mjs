/**
 * End-to-end check of the guide form: validation, consent, honeypot.
 *   node scripts/guide-test.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2] ?? "http://localhost:3000";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  protocolTimeout: 120000,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
await page.goto(`${base}/#guide`, { waitUntil: "networkidle2" });

const status = () => page.$eval('#guide form [role="status"]', (el) => el.textContent?.trim() ?? "");
const errors = () =>
  page.$$eval('#guide form [id$="-error"]', (els) => els.map((e) => `${e.id}: ${e.textContent}`));

async function submit() {
  await page.click('#guide form button[type="submit"]');
  await page.waitForFunction(
    () => document.querySelector('#guide form [role="status"]')?.textContent?.trim(),
    { timeout: 20000 },
  );
  await new Promise((r) => setTimeout(r, 400));
}

console.log("1) שליחה ריקה");
await submit();
console.log("   errors:", await errors());

console.log("\n2) מייל לא תקין, בלי הסכמה");
await page.type("#guide-name", "דנה");
await page.type("#guide-email", "nope");
await submit();
console.log("   errors:", await errors());

console.log("\n3) תקין עם הסכמה");
await page.$eval("#guide-email", (el) => (el.value = ""));
await page.type("#guide-email", "dana@example.com");
await page.click("#guide-consent");
await submit();
console.log("   status:", await status());

console.log("\n4) הני-פוט");
await page.evaluate(() => {
  document.querySelector("#guide-website").value = "http://spam.example";
});
await submit();
console.log("   status:", await status());

await browser.close();
