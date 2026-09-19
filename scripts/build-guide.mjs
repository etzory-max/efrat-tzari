/**
 * Renders the lead-magnet guide to public/files/guide.pdf.
 *
 *   node scripts/build-guide.mjs [outputName]
 *
 * The copy is Efrat's, transcribed from her Word document and kept inline so
 * the PDF is reproducible; re-run whenever the wording changes.
 *
 * This is the site in print. It carries the same three fonts, the same four
 * text roles, the same terracotta rule under every heading and the same
 * hand-drawn illustrations, so a reader who came from the page recognises the
 * document as the same voice rather than as an attachment from somewhere else.
 *
 * The drawings are embedded as data URIs: the page is rendered from a string
 * with no base URL, so a relative src would resolve to nothing.
 *
 * Drives the locally installed Chrome, like the other dev scripts here.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const IMAGES = path.join(process.cwd(), "public", "images");
const OUT = path.join(process.cwd(), "public", "files", process.argv[2] ?? "guide.pdf");

/* The drawings carry a content hash in their filename, so they are looked up
   by stem rather than spelled out.

   They are also shrunk on the way in. At full size the six of them made a
   3MB PDF, and this document's whole job is to arrive in an inbox - 300px
   is more than the largest of them is printed at. */
const files = await readdir(IMAGES);
const art = async (stem, width = 300) => {
  const file = files.find((f) => f.startsWith(stem + ".") && f.endsWith(".png"));
  if (!file) throw new Error(`no drawing for ${stem}`);
  const data = await sharp(path.join(IMAGES, file))
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  return `data:image/png;base64,${data.toString("base64")}`;
};

const drawing = {
  familyHold: await art("art-family-hold", 420),
  collapse: await art("day-collapse", 200),
  help: await art("day-help", 200),
  motherWalk: await art("art-mother-walk", 200),
  morning: await art("day-morning", 200),
  pathHome: await art("art-path-home", 300),
};

/* The site's mark, redrawn as flat SVG so it prints crisp at any size. */
const logomark = (colour, size) => `<svg viewBox="0 0 100 100" width="${size}" height="${size}"
  fill="none" stroke="${colour}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="55" cy="50" r="34"/><circle cx="45" cy="50" r="34"/>
  <path d="M50 78c0-8-2-13 0-19" stroke-width="2.8"/>
  <path d="M50 59c-6-8-6-20 0-30 6 10 6 22 0 30z"/>
  <path d="M50 63c-8 0-15-5-17-13 8-2 15 4 17 13z"/>
  <path d="M50 65c8 0 15-5 17-13-8-2-15 4-17 13z"/>
</svg>`;

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

/** A numbered section heading with its drawing, matching the page's rhythm. */
const section = (n, title, src) => `<h2>
  <span class="h2-num">${n}</span>
  <span class="h2-text">${esc(title)}</span>
  ${src ? `<img class="h2-art" src="${src}" alt="">` : ""}
</h2>`;

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&family=Varela+Round&display=swap">
<style>
  /* The tokens are the site's, copied rather than imported so the document
     stays reproducible on its own. See app/globals.css. */
  :root {
    --cream-50:#f5f2ed; --cream-100:#ede9e2; --cream-200:#e2ddd3;
    --slate:#465b6d; --dark:#2c3238;
    --ink:#2c333a; --muted:#55606b;
    --accent:#d69a7e; --accent-ink:#9c4c2e; --accent-light:#f2d0bc;
  }
  @page { size: A4; margin: 15mm 14mm 16mm; }
  * { box-sizing: border-box; }

  /* Four roles, exactly as on the page: slate headings, muted body, ink for
     the one sentence that has to stop you, accent-ink for labels. */
  body { margin:0; font-family:"Rubik",sans-serif; font-size:10.5pt; line-height:1.75;
         color:var(--muted); }
  h1,h2,h3,h4 { margin:0; font-family:"Varela Round",sans-serif; font-weight:400;
                line-height:1.25; letter-spacing:-0.005em; }
  p { margin:0 0 8pt; }
  strong { font-weight:500; color:var(--ink); }

  /* ---------- cover ---------- */
  .cover { background:var(--slate); color:#fff; border-radius:12pt; padding:22pt 24pt 20pt;
           margin-bottom:16pt; position:relative; overflow:hidden; }
  .cover-top { display:flex; align-items:center; gap:9pt; margin-bottom:16pt; }
  .cover-top .name { font-family:"Varela Round",sans-serif; font-size:12pt; color:#fff; }
  .cover-top .tag { font-size:8.5pt; color:var(--accent-light); margin-top:1pt; }
  /* The eyebrow, rule and all — the quietest, most repeated mark on the site. */
  .eyebrow { display:flex; align-items:center; gap:7pt; font-family:"Varela Round",sans-serif;
             font-size:9pt; letter-spacing:.16em; color:var(--accent-light); margin-bottom:9pt; }
  .eyebrow::before { content:""; width:20pt; height:2px; background:var(--accent); flex:none; }
  .cover h1 { font-size:26pt; color:#fff; margin-bottom:9pt; max-width:78%; }
  .cover .sub { font-size:12pt; color:#fff; opacity:.92; margin:0; max-width:78%; }
  .cover .model { margin-top:16pt; padding-top:11pt; border-top:1px solid rgba(255,255,255,.28);
                  font-size:9.5pt; color:var(--accent-light); max-width:78%; }
  .cover-art { position:absolute; inset-inline-end:16pt; bottom:14pt; width:96pt; opacity:.9; }

  /* ---------- section headings ---------- */
  h2 { display:flex; align-items:center; gap:9pt; font-size:15pt; color:var(--slate);
       margin:20pt 0 9pt; padding-bottom:6pt; border-bottom:2px solid var(--accent);
       break-after:avoid; }
  .h2-num { font-size:19pt; color:var(--accent-ink); line-height:1; }
  .h2-text { flex:1; }
  .h2-art { height:40pt; width:auto; }
  h3 { font-size:11.5pt; color:var(--slate); margin:0 0 2pt; }

  .intro { background:var(--cream-50); border-radius:10pt; padding:13pt 15pt; margin-bottom:8pt; }
  .intro h3 { color:var(--accent-ink); font-size:11pt; margin-bottom:6pt; }

  /* The one sentence in ink, the way the page spends it. */
  .rule { background:var(--accent); color:var(--ink); border-radius:8pt; padding:10pt 14pt;
          font-size:11pt; margin:10pt 0; }

  ul { margin:0 0 8pt; padding-inline-start:14pt; }
  li { margin-bottom:4pt; }
  li::marker { color:var(--accent); }

  /* ---------- the four steps ---------- */
  .step { break-inside:avoid; display:grid; grid-template-columns:32pt 1fr; gap:12pt;
          border-top:1px solid var(--cream-200); padding:11pt 0; }
  .glyph { width:30pt; height:30pt; border-radius:50%; background:var(--accent); color:var(--ink);
           font-family:"Varela Round",sans-serif; font-size:15pt;
           display:flex; align-items:center; justify-content:center; }
  .tag { color:var(--accent-ink); font-size:9.5pt; letter-spacing:.06em; margin:0 0 5pt; }
  .lead { color:var(--ink); margin:0 0 3pt; }

  .tech { break-inside:avoid; border-top:1px solid var(--cream-200); padding:9pt 0; }

  table { width:100%; border-collapse:collapse; font-size:9.5pt; break-inside:avoid; }
  th,td { text-align:start; vertical-align:top; padding:8pt 9pt; border-bottom:1px solid var(--cream-200); }
  th { background:var(--cream-50); color:var(--slate); font-weight:400;
       font-family:"Varela Round",sans-serif; }
  .no { color:#6e1018; } .yes { color:#2f5d43; }

  .q { break-inside:avoid; margin-bottom:13pt; }
  .q p { margin:0 0 11pt; color:var(--ink); }
  .line { border-bottom:1px solid var(--cream-200); height:15pt; margin-bottom:8pt; }

  /* ---------- closing ---------- */
  .closing { break-inside:avoid; margin-top:22pt; background:var(--cream-50); border-radius:10pt;
             padding:16pt 18pt; display:grid; grid-template-columns:1fr 84pt;
             gap:14pt; align-items:center; }
  .closing h3 { font-size:13pt; color:var(--slate); margin-bottom:5pt; }
  .closing p { margin:0; }
  .closing a { color:var(--accent-ink); text-decoration:none; }
  .closing img { width:84pt; }

  footer { margin-top:16pt; border-top:1px solid var(--cream-200); padding-top:9pt;
           font-size:8.5pt; color:var(--muted); display:flex; align-items:center;
           justify-content:space-between; gap:10pt; }
  footer .mark { display:flex; align-items:center; gap:6pt; }
</style></head><body>

<div class="cover">
  <div class="cover-top">
    ${logomark("var(--accent-light)", 30)}
    <div>
      <div class="name">אפרת צרי</div>
      <div class="tag">הדרכת הורים לילדים על הרצף</div>
    </div>
  </div>
  <p class="eyebrow">מדריך פרקטי ומהיר להורים</p>
  <h1>מה עושים כשהעולם מסתכל?</h1>
  <p class="sub">כלים פרקטיים להתמודדות עם התפרצות אוטיסטית במרחב הציבורי</p>
  <p class="model">שיטת נמר״ה המשולבת — מעבר מיידי מלחץ לתפעול, הרגעת מערכת העצבים והחזרת השליטה</p>
  <img class="cover-art" src="${drawing.familyHold}" alt="">
</div>

<div class="intro">
  <h3>תדמיינו את הסיטואציה המוכרת הזו</h3>
  <p>אתם באמצע הסופרמרקט, בגינה הציבורית או בקניון. פתאום, ברגע אחד, עומס חושי או גירוי לא צפוי מציף את הילד. הוא צועק, נשכב על הרצפה או מגיב בעוצמה.</p>
  <p>תוך שניות אתם מרגישים את עיני הסביבה ננעצות בכם — מבטים שיפוטיים, הערות לא במקום, והלב שלכם מתחיל לדפוק על 200. בנקודה הזו התגובה הטבעית של כולנו היא לחץ, מבוכה או ניסיון נואש להסביר ולהרגיע. אבל הנה האמת הפיזיולוגית: בזמן התפרצות הילד לא חסר חינוך — הילד בהצפה נוירולוגית.</p>
  <p style="margin:0">המדריך הזה נכתב כדי לתת לכם ״שלט רחוק״ בזמן אמת. בלי תיאוריות ארוכות ובלי המצאות — רק צעדים פרקטיים, מהירים וחדים, שיגרמו לכם לפעול כמו העוגן שהילד שלכם צריך, ולצאת מכל משבר בביטחון וברוגע.</p>
</div>

${section(1, "מה קורה בגוף בזמן התפרצות", drawing.collapse)}
<p>בזמן התפרצות (Meltdown) המוח של הילד מציף את הגוף בהורמוני סטרס — קורטיזול ואדרנלין — ונכנס למצב הישרדות של Fight or Flight. חלק המוח האחראי על הקשבה, חשיבה לוגית והבנה, האונה המצחית, כבוי לחלוטין.</p>
<div class="rule"><strong>כלל ברזל יישומי:</strong> אפס הסברים בזמן אירוע. עוברים מ״זמן חינוך״ ל״זמן תפעול״.</div>

${section(2, "ארבעת הצעדים של מודל נמר״ה", drawing.familyHold)}
${steps.map((s) => `<div class="step">
  <div class="glyph">${esc(s.letter)}</div>
  <div>
    <h3>${esc(s.name)}</h3>
    <p class="tag">${esc(s.tagline)}</p>
    <p class="lead">${esc(s.lead)}</p>
    <ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  </div>
</div>`).join("")}

${section(3, "שליפת חירום: ארבע טכניקות להרגעה מהירה", drawing.help)}
${techniques.map(([t, d]) => `<div class="tech"><h3>${esc(t)}</h3><p style="margin:0">${esc(d)}</p></div>`).join("")}

${section(4, "טבלת שליפה מהירה", null)}
<table>
  <thead><tr><th style="width:24%">הסיטואציה</th><th style="width:38%" class="no">מה לא לעשות</th><th style="width:38%" class="yes">מה כן לעשות</th></tr></thead>
  <tbody>${table.map(([a, b, c]) => `<tr><td><strong>${esc(a)}</strong></td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("")}</tbody>
</table>

${section(5, "היום שאחרי", drawing.motherWalk)}
${afterwards.map(([t, d]) => `<div class="tech"><h3>${esc(t)}</h3><p style="margin:0">${esc(d)}</p></div>`).join("")}

${section(6, "כרטיסיית המוכנות האישית שלכם", drawing.morning)}
<p>למילוי בשגרה, כשהכול רגוע — כדי שיהיה מוכן לרגע שבו לא יהיה זמן לחשוב.</p>
${questions.map((q, i) => `<div class="q"><p>${i + 1}. ${esc(q)}</p><div class="line"></div><div class="line"></div></div>`).join("")}

<div class="closing">
  <div>
    <h3>ואם את רוצה לדבר על מה שקורה אצלכם בבית</h3>
    <p>הצעד הראשון הוא לא התחייבות. הוא שיחה.<br>
    <a href="https://efrat-tzari-one.vercel.app/#contact">efrat-tzari.co.il</a> · 052-6008172 · etzory@gmail.com</p>
  </div>
  <img src="${drawing.pathHome}" alt="">
</div>

<footer>
  <span class="mark">${logomark("var(--accent-ink)", 15)} מדריך נמר״ה · אפרת צרי</span>
  <span>הדרכת הורים לילדים על הרצף</span>
</footer>
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
