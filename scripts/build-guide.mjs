/**
 * Renders the lead-magnet guide to public/files/guide.pdf.
 *
 *   node scripts/build-guide.mjs
 *
 * The source is Efrat's Word document; the copy lives inline here so the PDF
 * is reproducible and stays on the site's palette. Re-run it whenever the
 * wording changes. Drives the locally installed Chrome, like the other dev
 * scripts in this folder.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = path.join(process.cwd(), "public", "files", "guide.pdf");

const steps = [
  {
    letter: "נ",
    name: "ניתוק",
    tagline: "מנתקים מגע מהסביבה ומההערות",
    lead: "מה עושים בשלוש השניות הראשונות?",
    items: [
      "מתעלמים לחלוטין ממבטים, משיפוטיות ומהערות של עוברי אורח.",
      "משפט דיבור פנימי להורה: ״אני לא נכשלת. הילד שלי בהצפה פיזיולוגית, ותפקידי היחיד הוא להיות העוגן שלו.״",
      "אם מישהו נפגע או מעורב: מסיטים מבט, אומרים בקצרה ״אני מטפלת בזה״, ומסתובבים בחזרה אל הילד.",
    ],
  },
  {
    letter: "מ",
    name: "מיקוד",
    tagline: "יורדים לגובה העיניים ומווסתים בתדר נמוך",
    lead: "מה עושים בפועל?",
    items: [
      "יורדים פיזית לגובה של הילד, לא עומדים מעליו.",
      "טון דיבור נמוך, שקט ואיטי מאוד — מילה עד שלוש בלבד: ״אני איתך״, ״אתה בטוח״.",
      "מנגישים כלי תחושתי מווסת מיד וללא שאלות: אוזניות, בקבוק מים, מגע עמוק.",
    ],
  },
  {
    letter: "ר",
    name: "ריפריימינג",
    tagline: "מפרשים את האירוע מחדש עבור הילד",
    lead: "איך מורידים את האשמה?",
    items: [
      "משקפים לו את מה שקרה ללא שיפוט: ״היה פה המון רעש, נבהלת, זה באמת מעייף.״",
      "תפעול מהיר: אם המקום מציף — עוזבים מיד. מניחים את הסלסילה ויוצאים לאוויר הפתוח. הקניות יחכו.",
    ],
  },
  {
    letter: "ה",
    name: "הפרדה",
    tagline: "מפרידים לחלוטין בין תפעול לחינוך",
    lead: "מה זוכרים ברגע הזה?",
    items: [
      "עכשיו לא מחנכים. לא מבקשים סליחה ליד כולם, לא מסבירים מה לא היה בסדר.",
      "כל הלקחים והשיחות יחכו לזמן שקט בבית, כשהדופק של שניכם ירד לטווח נורמלי.",
    ],
  },
];

const techniques = [
  ["ויסות שמיעתי מיידי", "אוזניות מנטרלות רעש, או ״רעש חום״ בטלפון, להורדה מהירה של העוררות החושית."],
  ["מגע בלחץ עמוק", "חיבוק מהדק מאחור, אם הילד מאפשר, או לחיצות קצביות ואיטיות על הכתפיים."],
  ["איפוס תחושתי", "שתיית מים קרים מקש, או שטיפת פנים וידיים במים קרים להפעלת עצב הוואגוס."],
  ["פריקת מתח בתנועה", "קפיצות קלות משותפות במקום, או ניעור של כפות הידיים לפריקת האדרנלין."],
];

const table = [
  ["מבטים והערות מהסביבה", "להתנצל, להסביר לזרים או להתעצבן.", "להסתובב בגב לסביבה, להתמקד ב-100% בילד."],
  ["תקשורת בזמן הצפה", "לשאול ״למה עשית את זה?״ ולהטיף מוסר.", "מילים ספורות בטון שקט: ״אני איתך, אתה בטוח.״"],
  ["סביבה עמוסה ורועשת", "להישאר במקום ולנסות ״לנצח״ את הסיטואציה.", "לנשום, להניח את הקניות ולצאת מיד לאוויר."],
  ["לאחר נסיגת הגל", "לחפור על האירוע מיד כשנרגע במעט.", "לתת זמן להחלמה נוירולוגית, ורק אז לעבד."],
];

const afterwards = [
  ["מתן זמן להחלמה נוירולוגית", "מערכת העצבים צריכה זמן לחזור לאיזון. תנו לילד ולעצמכם שקט בלי להעלות את הנושא ב-12 השעות הקרובות."],
  ["שיחת תיווך קצרה במוח חושב", "כשהילד נינוח, שקפו בקצרה: ״אתמול בסופר היה המון רעש. בפעם הבאה נלבש אוזניות לפני שנכנסים.״"],
  ["פורקים עומס מההורה", "קחו שלוש דקות לכתוב לעצמכם: מה הרגשתם, ומה עבד. כתיבה קצרה מורידה את הסטרס ומכינה לפעם הבאה."],
  ["ערכת חירום קבועה בתיק", "אוזניות, בקבוק מים עם קש, חפץ תחושתי מווסת ומשקפי שמש — תיק שמוכן מראש ליציאות."],
];

const questions = [
  "מהם הסימנים הפיזיים המוקדמים שמראים לי שהילד שלי מתחיל להצטבר לקראת הצפה?",
  "אילו שני אביזרים מווסתים יהיו תמיד בתיק היציאה שלנו מהבית?",
  "מהו משפט הדיבור הפנימי שלי שיזכיר לי לנתק מגע משיפוטיות של עוברי אורח?",
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap">
<style>
  @page { size: A4; margin: 16mm 15mm 18mm; }
  * { box-sizing: border-box; }
  body { margin:0; font-family:"Heebo",sans-serif; font-size:10.5pt; line-height:1.75; color:#2c333a; }
  h1,h2,h3 { margin:0; font-weight:500; line-height:1.3; }
  p { margin:0 0 8pt; }
  /* No negative margins to bleed past @page — in print they clip the text
     against the sheet edge instead of extending the block. */
  .cover { background:#465b6d; color:#fff; border-radius:8pt; padding:20pt 22pt; margin-bottom:14pt; }
  .cover .kicker { font-size:9.5pt; letter-spacing:.14em; color:#f2d0bc; margin-bottom:10pt; }
  .cover h1 { font-size:24pt; margin-bottom:8pt; }
  .cover .sub { font-size:12pt; color:#ffffff; opacity:.9; margin:0; }
  .cover .model { margin-top:14pt; padding-top:10pt; border-top:1px solid rgba(255,255,255,.3); font-size:10pt; color:#f2d0bc; }
  h2 { font-size:14pt; color:#465b6d; margin:18pt 0 7pt; padding-bottom:5pt; border-bottom:2px solid #d69a7e; break-after:avoid; }
  h3 { font-size:11.5pt; color:#9c4c2e; margin:0 0 3pt; }
  .intro { background:#f5f2ed; border-radius:6pt; padding:11pt 13pt; margin-bottom:6pt; }
  .rule { background:#d69a7e; color:#2c333a; border-radius:6pt; padding:9pt 13pt; font-size:11pt; margin:9pt 0; }
  ul { margin:0 0 8pt; padding-inline-start:15pt; }
  li { margin-bottom:4pt; }
  .step { break-inside:avoid; display:grid; grid-template-columns:34pt 1fr; gap:11pt;
          border-top:1px solid #e2ddd3; padding:10pt 0; }
  .glyph { width:30pt; height:30pt; border-radius:50%; background:#d69a7e; color:#2c333a;
           font-size:15pt; font-weight:700; display:flex; align-items:center; justify-content:center; }
  .tag { color:#55606b; font-size:10pt; margin:0 0 5pt; }
  .lead { font-weight:500; margin:0 0 3pt; }
  .tech { break-inside:avoid; border-top:1px solid #e2ddd3; padding:8pt 0; }
  table { width:100%; border-collapse:collapse; font-size:9.5pt; break-inside:avoid; }
  th,td { text-align:start; vertical-align:top; padding:7pt 8pt; border-bottom:1px solid #e2ddd3; }
  th { background:#f5f2ed; color:#465b6d; font-weight:500; }
  .no { color:#6e1018; } .yes { color:#2f5d43; }
  .q { break-inside:avoid; margin-bottom:12pt; }
  .q p { margin:0 0 12pt; font-weight:500; }
  .line { border-bottom:1px solid #c9c2b6; height:14pt; margin-bottom:7pt; }
  footer { margin-top:18pt; border-top:1px solid #e2ddd3; padding-top:8pt;
           font-size:9pt; color:#55606b; display:flex; justify-content:space-between; }
</style></head><body>

<div class="cover">
  <p class="kicker">מדריך פרקטי ומהיר להורים</p>
  <h1>מה עושים כשהעולם מסתכל?</h1>
  <p class="sub">כלים פרקטיים להתמודדות עם התפרצות אוטיסטית במרחב הציבורי</p>
  <p class="model">שיטת נמר״ה המשולבת — מעבר מיידי מלחץ לתפעול, הרגעת מערכת העצבים והחזרת השליטה</p>
</div>

<div class="intro">
  <h3>תדמיינו את הסיטואציה המוכרת הזו</h3>
  <p>אתם באמצע הסופרמרקט, בגינה הציבורית או בקניון. פתאום, ברגע אחד, עומס חושי או גירוי לא צפוי מציף את הילד. הוא צועק, נשכב על הרצפה או מגיב בעוצמה.</p>
  <p>תוך שניות אתם מרגישים את עיני הסביבה ננעצות בכם — מבטים שיפוטיים, הערות לא במקום, והלב שלכם מתחיל לדפוק על 200. בנקודה הזו התגובה הטבעית של כולנו היא לחץ, מבוכה או ניסיון נואש להסביר ולהרגיע. אבל הנה האמת הפיזיולוגית: בזמן התפרצות הילד לא חסר חינוך — הילד בהצפה נוירולוגית.</p>
  <p style="margin:0">המדריך הזה נכתב כדי לתת לכם ״שלט רחוק״ בזמן אמת. בלי תיאוריות ארוכות ובלי המצאות — רק צעדים פרקטיים, מהירים וחדים, שיגרמו לכם לפעול כמו העוגן שהילד שלכם צריך, ולצאת מכל משבר בביטחון וברוגע.</p>
</div>

<h2>1 · מה קורה בגוף בזמן התפרצות</h2>
<p>בזמן התפרצות (Meltdown) המוח של הילד מציף את הגוף בהורמוני סטרס — קורטיזול ואדרנלין — ונכנס למצב הישרדות של Fight or Flight. חלק המוח האחראי על הקשבה, חשיבה לוגית והבנה, האונה המצחית, כבוי לחלוטין.</p>
<div class="rule"><strong>כלל ברזל יישומי:</strong> אפס הסברים בזמן אירוע. עוברים מ״זמן חינוך״ ל״זמן תפעול״.</div>

<h2>2 · ארבעת הצעדים של מודל נמר״ה</h2>
${steps.map((s) => `<div class="step">
  <div class="glyph">${esc(s.letter)}</div>
  <div>
    <h3>${esc(s.name)}</h3>
    <p class="tag">${esc(s.tagline)}</p>
    <p class="lead">${esc(s.lead)}</p>
    <ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  </div>
</div>`).join("")}

<h2>3 · שליפת חירום: ארבע טכניקות להרגעה מהירה</h2>
${techniques.map(([t, d]) => `<div class="tech"><h3>${esc(t)}</h3><p style="margin:0">${esc(d)}</p></div>`).join("")}

<h2>4 · טבלת שליפה מהירה</h2>
<table>
  <thead><tr><th style="width:24%">הסיטואציה</th><th style="width:38%" class="no">מה לא לעשות</th><th style="width:38%" class="yes">מה כן לעשות</th></tr></thead>
  <tbody>${table.map(([a, b, c]) => `<tr><td><strong>${esc(a)}</strong></td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("")}</tbody>
</table>

<h2>5 · היום שאחרי</h2>
${afterwards.map(([t, d]) => `<div class="tech"><h3>${esc(t)}</h3><p style="margin:0">${esc(d)}</p></div>`).join("")}

<h2>6 · כרטיסיית המוכנות האישית שלכם</h2>
<p>למילוי בשגרה, כשהכול רגוע — כדי שיהיה מוכן לרגע שבו לא יהיה זמן לחשוב.</p>
${questions.map((q, i) => `<div class="q"><p>${i + 1}. ${esc(q)}</p><div class="line"></div><div class="line"></div></div>`).join("")}

<footer><span>מדריך נמר״ה להתמודדות עם התפרצות במרחב הציבורי</span><span>אפרת צרי</span></footer>
</body></html>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle0" });
await page.evaluateHandle("document.fonts.ready");
await mkdir(path.dirname(OUT), { recursive: true });
const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
await writeFile(OUT, pdf);
await browser.close();
console.log(`wrote ${OUT} (${(pdf.length / 1024).toFixed(0)} KB)`);
