/**
 * Checks the contract in docs/seo.md against the pages the site actually
 * serves: one h1 each, no skipped heading levels, a title, a description, a
 * canonical, and the structured data each page type is supposed to carry.
 *
 *   node scripts/seo-check.mjs [baseUrl]
 *
 * Exits non-zero on any failure, so it can gate a deploy.
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = process.argv[2] ?? "http://localhost:3100";

/** path -> the JSON-LD types that page must carry. */
const PAGES = {
  "/": ["Person", "ProfessionalService", "WebSite", "FAQPage", "Service", "VideoObject"],
  "/articles/shigra-yatziva-matana-layeled": ["Article", "BreadcrumbList", "Person", "WebSite"],
  "/privacy": ["Person", "ProfessionalService", "WebSite"],
  "/accessibility": ["Person", "ProfessionalService", "WebSite"],
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
let failures = 0;

for (const [path, expected] of Object.entries(PAGES)) {
  const page = await browser.newPage();
  await page.goto(base + path, { waitUntil: "networkidle0" });

  const found = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? "",
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    types: [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
      const parsed = JSON.parse(s.textContent);
      return (parsed["@graph"] ?? [parsed]).map((node) => node["@type"]);
    }),
    headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      level: Number(h.tagName[1]),
      text: (h.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 60),
    })),
  }));

  const problems = [];
  const h1s = found.headings.filter((h) => h.level === 1);
  if (h1s.length !== 1) problems.push(`${h1s.length} h1 (צריך בדיוק אחד)`);

  let previous = 0;
  for (const heading of found.headings) {
    if (previous && heading.level > previous + 1) {
      problems.push(`קפיצה h${previous} -> h${heading.level} ב"${heading.text}"`);
    }
    previous = heading.level;
  }

  if (!found.title) problems.push("אין כותרת עמוד");
  if (!found.description) problems.push("אין meta description");
  if (!found.canonical) problems.push("אין canonical");
  for (const type of expected) {
    if (!found.types.includes(type)) problems.push(`חסר ${type} בנתונים המובנים`);
  }

  console.log(`\n${path}`);
  console.log(`  h1: ${h1s[0]?.text ?? "—"}`);
  console.log(`  ${found.headings.length} כותרות · ${found.types.length} טיפוסי schema`);
  if (problems.length) {
    failures += problems.length;
    for (const problem of problems) console.log(`  ✗ ${problem}`);
  } else {
    console.log("  ✓ תקין");
  }
  await page.close();
}

await browser.close();
console.log(`\n=== ${failures === 0 ? "הכול תקין" : `${failures} ליקויים`} ===`);
process.exit(failures === 0 ? 0 : 1);
