# העברה לחשבונות של אפרת

מסמך עבודה. מסמנים ✅ ככל שמתקדמים, ומוחקים אותו כשהכול עומד.

**כלל אחד:** אף שלב כאן לא דורש למסור סיסמה לאף אחד. כל התחברות היא דרך
"Continue with GitHub", וכל מפתח סודי מודבק ישירות בממשק של Vercel.

---

## 1 · גיטהאב — מעבירים את הריפו, לא את החשבון

- [ ] מ-`vercalitus`: <https://github.com/vercalitus/efrat-tzari/settings> → גוללים
      לתחתית, **Danger Zone** → `Transfer ownership` → היעד `etzory`
- [ ] אפרת מאשרת את ההעברה במייל שהיא מקבלת
- [ ] אני מעדכן את ה-remote המקומי לכתובת החדשה

ההיסטוריה, ה-issues וה-branches עוברים איתו. אין צורך ליצור ריפו חדש.

## 2 · Vercel — אפרת מתחברת דרך גיטהאב

- [ ] אפרת: <https://vercel.com> → **Continue with GitHub** (בלי סיסמה)
- [ ] `Add New → Project` → מייבאת את `efrat-tzari`
- [ ] מוודאים שה-Production Branch הוא `main`
- [ ] בסוף, אחרי שהחדש עובד: מוחקים את הפרויקט הישן מהחשבון של verca

## 3 · Sanity — פרויקט חדש על שמה

- [ ] אפרת: <https://sanity.io> → התחברות דרך גיטהאב → `Create new project`
- [ ] Dataset בשם `production`
- [ ] היא שולחת לי את ה-**Project ID** (הוא לא סוד, הוא יושב בקוד ממילא)
- [ ] היא יוצרת טוקן בהרשאת **Editor** ומדביקה אותו ב-Vercel כ-`SANITY_API_WRITE_TOKEN`
- [ ] אני מריץ `npm run seed` — מעלה את כל התוכן והתמונות לסטודיו
- [ ] אני מגדיר webhook שיעדכן את האתר תוך שניות אחרי עריכה

## 4 · Resend — כדי שהמדריך באמת יישלח

- [ ] אפרת: <https://resend.com> → חשבון על `etzory@gmail.com`
- [ ] מאמתת דומיין (או `onboarding@resend.dev` לבדיקה בלבד)
- [ ] יוצרת API key ומדביקה אותו ב-Vercel כ-`RESEND_API_KEY`

עד שזה קיים, מי שממלאת את טופס המדריך מקבלת הודעה מנומסת עם הטלפון והמייל
של אפרת במקום כישלון — אבל לא את הקובץ.

---

## משתני הסביבה ב-Vercel

| משתנה | מה זה | מי נותן |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | הדומיין הסופי. ממנו נגזרים canonical, sitemap ו-JSON-LD | אחרי שיש דומיין |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` רק כשעולים לאוויר באמת | אנחנו |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | לא סוד | Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | — |
| `NEXT_PUBLIC_SANITY_API_VERSION` | תאריך גרסת ה-API | — |
| `SANITY_API_WRITE_TOKEN` | **סוד.** אפרת מדביקה בעצמה | Sanity |
| `SANITY_REVALIDATE_SECRET` | **סוד.** מחרוזת אקראית שאנחנו ממציאים | אנחנו |
| `RESEND_API_KEY` | **סוד.** אפרת מדביקה בעצמה | Resend |
| `CONTACT_FROM_EMAIL` | כתובת השולח, בדומיין מאומת | Resend |
| `CONTACT_TO_EMAIL` | לאן מגיעות הפניות מהטופס | אפרת |

---

## מה עוד חסר לפני עלייה לאוויר

- [ ] לוגו באיכות גבוהה
- [ ] צילומים אמיתיים — פורטרט, ראש העמוד, והפאנל של המדריך
- [ ] אישור החתימות של שתי ההמלצות שאין להן שם
- [ ] אימות העובדות ב"מי אני" — כמה מהתאומות על הרצף
- [ ] אישור משפטי למדיניות הפרטיות ולהצהרת הנגישות
- [ ] למחוק את `app/options/` — עמוד ההשוואה של אפשרויות העיצוב
- [ ] להחליט אם הספר חוזר לאתר
