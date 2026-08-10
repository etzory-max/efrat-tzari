# אפרת צרי — המרחב שלך להורות מותאמת

וואן-פייג' לייעוץ הורים, בנוי מחדש מתוך [הדמו ב-Base44](https://efrat-parenting-space.base44.app/)
עם ניהול תוכן, נגישות AA, עמידה בתיקון 13 לחוק הגנת הפרטיות ואופטימיזציה למנועי חיפוש ו-AI.

**Next.js 16 (App Router) · React 19 · Tailwind v4 · Sanity v6 · TypeScript**

---

## הרצה מקומית

```bash
npm install
cp .env.example .env.local   # אפשר להשאיר ריק בשלב ראשון
npm run dev
```

האתר עולה ב-http://localhost:3000. כל עוד `NEXT_PUBLIC_SANITY_PROJECT_ID` ריק,
התוכן מוגש מתוך [`content/defaults.ts`](content/defaults.ts) — כך שהאתר תמיד עובד.

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | שרת פיתוח |
| `npm run build` / `npm start` | בילד ושרת פרודקשן |
| `npm run typecheck` | בדיקת טיפוסים |
| `npm run lint` | ESLint |
| `npm run seed` | דוחף את תוכן הדמו ל-Sanity |
| `node scripts/a11y.mjs` | סריקת axe-core על כל העמודים ובכל המצבים |
| `node scripts/shots.mjs` | צילומי מסך ל-`docs/shots` |
| `node scripts/form-test.mjs` | בדיקת קצה-לקצה של טופס יצירת הקשר |

> סקריפטי הבדיקה מריצים את Chrome המותקן במחשב דרך `puppeteer-core`
> (הנתיב מוגדר בראש כל סקריפט).

---

## חיבור ה-CMS

1. יוצרים פרויקט ב-[sanity.io](https://sanity.io) ומעתיקים את ה-Project ID.
2. ממלאים ב-`.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=<טוקן בהרשאת Editor>
   ```
3. `npm run seed` — מעלה את התמונות ויוצר את כל המסמכים.
4. נכנסים ל-`/studio` (מוגן בהתחברות של Sanity).
5. ב-Sanity → API → Webhooks מוסיפים `POST https://<domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
   כדי שעריכה תעלה לאוויר תוך שניות.

**מה נשלט מה-CMS:** הגדרות אתר, שקופיות ראש העמוד, אודות, הורות מותאמת, שירותים,
מאמרים, שאלות נפוצות וכותרות הסקשנים.
**מה לא:** מדיניות הפרטיות והצהרת הנגישות — מסמכים משפטיים שנשמרים בקוד
(`app/privacy`, `app/accessibility`) כדי שלא ישתנו בטעות.

כל שדה תמונה ב-Sanity דורש `alt` — הנגישות נאכפת כבר בעריכה.

---

## טופס יצירת הקשר

Server Action → [Resend](https://resend.com) → מייל לאפרת. **המידע לא נשמר בשום מאגר אצלנו** —
ההחלטה הזו מצמצמת דרמטית את החשיפה הרגולטורית.

```
RESEND_API_KEY=re_xxx
CONTACT_FROM_EMAIL=website@<דומיין מאומת ב-Resend>
CONTACT_TO_EMAIL=<תיבת המייל של אפרת>
```

הגנות: ולידציה ב-Zod, honeypot, בדיקת זמן מילוי, והגבלת 3 פניות לכל IP ב-10 דקות.
בלי משתני הסביבה האלה הטופס מציג הודעה מנומסת עם הטלפון והמייל במקום להיכשל.

---

## מה שונה מהדמו (במכוון)

| | דמו | כאן |
|---|---|---|
| ראש עמוד | שקוף מעל תמונת ההירו | פס לבן קבוע, לוגו מוגדל, תפריט קריא |
| פונט | Assistant לכותרות + Heebo לגוף | Heebo לאורך כל העמוד |
| טופס | רב-שלבי ("מה שמך?" → המשך) | טופס אחד גלוי עם כל השדות |
| ניגודיות | חלק מהטקסטים מתחת ל-4.5:1 | כל הפלטה עומדת ב-AA |
| מאמרים | כרטיסים בלבד | עמוד מלא לכל מאמר ב-`/articles/[slug]` |

---

## תוצאות בדיקה (בילד פרודקשן, מובייל)

| | |
|---|---|
| Lighthouse Performance | 95 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| axe-core (4 עמודים × 2 רוחבים + 3 מצבים אינטראקטיביים) | 0 ליקויים |
| LCP / TBT / CLS | 2.9s / 20ms / 0 |

---

## פריסה ל-Vercel

1. `vercel link` (או ייבוא הריפו דרך הממשק).
2. מעתיקים את כל משתני הסביבה מ-`.env.example` להגדרות הפרויקט.
3. `NEXT_PUBLIC_SITE_URL` חייב להיות הדומיין הסופי — ממנו נגזרים ה-canonical,
   ה-sitemap, ה-JSON-LD ו-`llms.txt`.
4. אחרי החיבור לדומיין: להגיש את `sitemap.xml` ב-Google Search Console.

---

## לפני עלייה לאוויר — מה חסר מאפרת

- [ ] לוגו באיכות גבוהה (SVG או PNG ≥1000px). כרגע הלוגו משוחזר כ-SVG ב-`components/brand/Logo.tsx`, והמקור מהדמו שמור ב-`public/images/logo-placeholder.jpg`.
- [ ] תמונות אמיתיות — פורטרט ושלוש תמונות הירו. הנוכחיות הן פלייסהולדרים מ-Unsplash.
- [ ] טלפון ומייל אמיתיים — כרגע `050-123-4567` ו-`efrat@example.com` ב-[`lib/site.ts`](lib/site.ts).
- [ ] קישורי אינסטגרם ופייסבוק (`site.social`) — כל עוד הם ריקים, האייקונים לא מוצגים.
- [ ] שם רכז/ת נגישות ודרכי פנייה — מופיעים בהצהרת הנגישות.
- [ ] אישור נוסח מדיניות הפרטיות והצהרת הנגישות מול הגורם המשפטי.
