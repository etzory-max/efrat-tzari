/**
 * End-to-end check of the contact form: validation errors, honeypot, and a
 * valid submission. node scripts/form-test.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2] ?? "http://localhost:3001";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  protocolTimeout: 120000,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });

const status = () =>
  page.$eval('form [role="status"]', (el) => el.textContent?.trim() ?? "");
const fieldErrors = () =>
  page.$$eval('form [id$="-error"]', (els) => els.map((e) => `${e.id}: ${e.textContent}`));

async function submit() {
  await page.click('form button[type="submit"]');
  await page.waitForFunction(
    () => document.querySelector('form [role="status"]')?.textContent?.trim(),
    { timeout: 20000 },
  );
  await new Promise((r) => setTimeout(r, 400));
}

await page.goto(`${base}/#contact`, { waitUntil: "networkidle2" });

console.log("1) שליחה ריקה");
await submit();
console.log("   status:", await status());
console.log("   errors:", await fieldErrors());
console.log(
  "   aria-invalid on name:",
  await page.$eval("#name", (el) => el.getAttribute("aria-invalid")),
);
console.log(
  "   focus moved to status:",
  await page.evaluate(() => document.activeElement?.getAttribute("role") === "status"),
);

console.log("\n2) טלפון לא תקין");
await page.type("#name", "דנה כהן");
await page.type("#phone", "123");
await page.type("#email", "not-an-email");
await submit();
console.log("   errors:", await fieldErrors());

console.log("\n3) שליחה תקינה (ללא הסכמה)");
await page.$eval("#phone", (el) => (el.value = ""));
await page.type("#phone", "0521234567");
await page.$eval("#email", (el) => (el.value = ""));
await page.type("#email", "dana@example.com");
await page.type("#message", "שלום, אשמח לשמוע על ליווי.");
await submit();
console.log("   errors:", await fieldErrors());

console.log("\n4) שליחה תקינה עם הסכמה");
await page.click("#consent");
await submit();
console.log("   status:", await status());

console.log("\n5) הני-פוט (בוט)");
await page.evaluate(() => {
  document.querySelector("#website").value = "http://spam.example";
  document.querySelector('input[name="startedAt"]').value = String(Date.now() - 60000);
});
await submit();
console.log("   status:", await status());

await browser.close();
