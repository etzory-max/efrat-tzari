/**
 * Confirms the primary button really is coral at rest and slate on hover,
 * everywhere it appears, and that the focus ring stays visible on both fills.
 *   node scripts/button-test.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2] ?? "http://localhost:3000";

const ACCENT = "rgb(214, 154, 126)"; // --color-accent, terracotta
const SLATE = "rgb(70, 91, 109)";
const WHITE = "rgb(255, 255, 255)";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  protocolTimeout: 120000,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(base, { waitUntil: "networkidle2" });
await page.evaluate(async () => {
  const step = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 600));
});

const buttons = await page.$$(".btn-primary");
console.log(`נמצאו ${buttons.length} כפתורים ראשיים`);

let failures = 0;

for (const [index, button] of buttons.entries()) {
  const label = await button.evaluate((el) => el.textContent.trim().slice(0, 24));
  // The mobile drawer's CTA lives in a closed dialog — nothing to hover.
  const visible = await button.evaluate((el) => el.getClientRects().length > 0);
  if (!visible) {
    console.log(`· ${index + 1}. "${label}"  (מוסתר — תפריט מובייל סגור)`);
    continue;
  }

  const rest = await button.evaluate((el) => getComputedStyle(el).backgroundColor);

  // Park the button in the middle of the viewport and confirm nothing (the
  // sticky header, the hero scrim) sits on top before moving the pointer.
  const point = await button.evaluate((el) => {
    el.scrollIntoView({ block: "center", behavior: "instant" });
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const top = document.elementFromPoint(x, y);
    return { x, y, hittable: !!top && (top === el || el.contains(top)) };
  });
  await new Promise((r) => setTimeout(r, 250));
  if (!point.hittable) {
    console.log(`✗ ${index + 1}. "${label}"  משהו חוסם את הכפתור`);
    failures += 1;
    continue;
  }

  await page.mouse.move(point.x, point.y);
  await new Promise((r) => setTimeout(r, 500));
  const hover = await button.evaluate((el) => getComputedStyle(el).backgroundColor);

  // A button sitting on a slate card hovers to white instead — the usual
  // slate hover would make it disappear into its own background.
  const onSlate = await button.evaluate((el) => el.classList.contains("btn-on-slate"));
  const expected = onSlate ? WHITE : SLATE;
  const ok = rest === ACCENT && hover === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "✓" : "✗"} ${index + 1}. "${label}"  rest=${rest}  hover=${hover}`);

  // Park the pointer away so the next button starts from rest.
  await page.mouse.move(0, 0);
  await new Promise((r) => setTimeout(r, 300));
}

// Focus ring must be offset onto the page background, not swallowed by the fill.
const ring = await page.evaluate(() => {
  const btn = document.querySelector(".btn-primary");
  btn.focus();
  const s = getComputedStyle(btn);
  return { width: s.outlineWidth, offset: s.outlineOffset, color: s.outlineColor };
});
console.log(`\nטבעת פוקוס: ${JSON.stringify(ring)}`);

await browser.close();
console.log(failures === 0 ? "\nכל הכפתורים תקינים" : `\n${failures} כפתורים לא תקינים`);
process.exit(failures ? 1 : 0);
