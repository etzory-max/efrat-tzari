import { defaultContent } from "./defaults";
import type { SiteContent } from "./types";

/**
 * The working draft served at /draft.
 *
 * Structure and look stay exactly as the live site; only the copy moves over
 * from the newer positioning page. Sections migrate one at a time — anything
 * not listed here still renders the live wording, so the two pages can be read
 * side by side and the difference is always deliberate.
 *
 * Temporary. Once the copy is settled it folds into `defaults.ts` and this
 * file, along with `app/draft`, comes out.
 */
export const draftContent: SiteContent = {
  ...defaultContent,

  hero: {
    eyebrow: "הדרכת הורים לילדים על הרצף",
    title: "לחיות חיים מאפשרים, שמחים ומלאים",
    subtitle:
      "כשהאבחנה טורפת את כל הקלפים, את לא צריכה עוד פרוטוקול טיפולי לילד. חוקי המשחק משתנים, את צריכה למנכל את החיים שלכם מחדש. זה מה שאני מלמדת, וזה מה שמשנה את הבית.",
    ctaLabel: "דברי איתי",
    ctaHref: "/draft#contact",
    ctaSecondaryLabel: "איך זה עובד",
    ctaSecondaryHref: "/draft#approach",
    // Unchanged on purpose — the photograph stays.
    image: defaultContent.hero.image,
  },

  recognise: {
    eyebrow: "אם זה הבית שלך",
    title: "את לא צריכה עוד מישהו שיסביר לך מה זה אוטיזם. את חיה את זה.",
    lead: "את יודעת יותר על הילד שלך מכל מי שישב מולך בוועדה. מה שחסר לך זה לא ידע, זה יום שאפשר לחיות בו.",
    timelineLabel: "יום אחד בבית שלך",
    items: [
      {
        time: "שבע בבוקר",
        title: "הבוקר כבר גומר אותך",
        body: "עוד לפני שמונה עברת מלחמה על בגדים, על אוכל ועל לצאת מהדלת. כל השאר קורה כשאת כבר ריקה.",
      },
      {
        time: "ומשם, כל היום",
        title: "את מתרגמת כל היום",
        body: "לבית הספר, לוועדה, למשפחה, להורים אחרים, לילד. אין אף אחד שמתרגם בשבילך.",
      },
      {
        time: "ברקע, תמיד",
        title: "העזרה לא תמיד מגיעה",
        body: "לא כי לא אוהבים אותך. כי לכל אחד יש בדיוק כמה שיש לו. את למדת לא לסמוך על זה, וזה מעייף.",
      },
      {
        time: "ואז, בלי התראה",
        title: "תקלה קטנה מפילה יום שלם",
        body: "כי במערכת שאת מנהלת אין רזרבה. כל דבר שזז מוציא את היום מהמסלול.",
      },
    ],
    closer:
      "אמרו לך מה לעשות עם הילד ואפילו נתנו מתכונים וטיפים. אף אחד לא אמר לך איך לחיות עם זה, חיים שמחים ומלאים.",
  },

  approach: {
    eyebrow: "איך זה עובד",
    title: "שלושה עמודי תווך, ובסדר הזה",
    lead: "אין כאן שיטה שתשנה את הילד ואין כאן פרוטוקול. יש דרך להסתכל, דרך לנהל את השגרה, ומודל לרגע שבו השגרה מתפוצצת.",
    cards: [
      {
        icon: "shift",
        title: "הילד הוא לא כרטיס הביקור שלכם",
        body: "היציאה ממעגל האשמה, הבושה והמבטים השיפוטיים. הוא לא עושה דווקא והוא לא בא לבייש אותך, הוא פועל מהמקום שלו. ברגע שהפרשנות שלך משתנה, אותה סיטואציה בדיוק מפסיקה להיות מלחמה.",
      },
      {
        icon: "household",
        title: "ניהול המערכת, לא טיפול בילד",
        body: "בונים תשתית לניהול היום ולארגון הזמן המשפחתי, ומשנים את כללי השיח מולו. במקום מאבקי כוח מתמשכים, משנים גישה ליצירת סביבה מובנית, ברורה ורגועה. חוסן משפחתי נבנה בשגרה ולא בחירום.",
      },
      {
        icon: "anchor",
        title: "נמר״ה, ניהול משבר בזמן אמת",
        body: "רגעי הצפה תמיד יהיו. רגע האמת הוא לא רגע החינוך, הוא רגע ניהול המשבר. והקהל שמסביב הוא לא אויב, הוא בדיוק ההזדמנות שלך לשמש עוגן יציב עבור הילד. נמר״ה הוא המודל שפיתחתי לרגע הזה, ארבעה צעדים שאפשר להפעיל גם באמצע סופרמרקט. את מקבלת אותו במלואו בהרצאה.",
      },
    ],
    quote: "התגובה שלך היא הדבר היחיד שבאמת בידיים שלך. כל השאר הוא רעש רקע.",
    quoteAuthor: "",
  },

  about: {
    eyebrow: "מי אני",
    title: "אני אפרת, ואני חיה את זה מבפנים",
    paragraphs: [
      "אני אמא לתאומות ואחת מהן על הרצף. אני מנהלת בית שרוב האנשים לא מדמיינים איך נראה מבפנים, כל יום, כבר שנים. לא כרעיון ולא כתיאוריה. בפועל.",
      "לפני זה הייתי מנהלת שיווק בכירה בהייטק. את הכלים האנליטיים והניהוליים שעבדתי איתם הבאתי הביתה, למקום שבו הם באמת נבחנו, וזה בדיוק השילוב שאני מביאה אלייך. שטח אמיתי ועין של מנהלת.",
      "בשנים האלה ליוויתי הורים אחרים, וגיליתי שמה שיש לי לתת הוא לא עוד ידע. ידע יש היום בכל מקום. מה שיש לי זו גישה, והיא נבנתה בבית ולא רק בכיתה.",
      "אני לא מטפלת ואני לא מחליפה אף איש מקצוע. אני זו שמבינה אותך ומכירה לעומק, שיושבת איתך על היום עצמו, על מה שקורה בשבע בבוקר ובשבע בערב, ועוזרת לך לנהל אותו כך שיישאר בו מקום גם לך.",
      "אני עוזרת להורים שמגדלים ילדים על הרצף לחיות חיים מאפשרים, שמחים ומלאים.",
    ],
    portrait: defaultContent.about.portrait,
    badgeValue: defaultContent.about.badgeValue,
    badgeLabel: defaultContent.about.badgeLabel,
    /**
     * Empty, not carried over: the live bullets speak in the plural and lean
     * on years of experience, which is the claim these five paragraphs
     * deliberately replace.
     */
    points: [],
    // `book` omitted on purpose — the section drops it in the draft.
  },

  services: {
    eyebrow: "מה אפשר",
    title: "שתי דרכים להתחיל",
    lead: "שתיהן מתחילות באותו מקום, במה שקורה אצלכם בבית ביום רגיל. שתיהן קיימות גם פרונטלי וגם בזום.",
    /* The first entry is the lead card — the washed one, on the right. */
    services: [
      {
        id: "service-family",
        icon: "users",
        kicker: "דרך ראשונה",
        title: "ליווי אישי",
        body: "מפגשים אישיים לניהול שינוי בתוכך ובבית. יצירת חיים מלאים לצד האבחנה, ביחד כל המשפחה.",
        bullets: [],
        variant: "dark",
        moreLabel: "קראי עוד",
        details: [],
        note: "פרונטלי או בזום, מספר מקומות מצומצם בכל תקופה",
        ctaLabel: "השאירי פרטים ואחזור אלייך",
        ctaHref: "/draft#contact",
      },
      {
        id: "service-lectures",
        icon: "mic",
        kicker: "דרך שנייה",
        title: "הרצאה",
        body: "ערב אחד שאחריו את יוצאת אחרת. הרצאה שהיא הזדמנות להביט אחרת על החיים ולשנות גישה לחיים.",
        // Not in the source page — drawn from the lecture's own description.
        bullets: [
          "שלושה כלים מעשיים",
          "אפשר להפעיל כבר למחרת בבוקר",
          "חדר מלא הורים שמבינים אותך בלי שתסבירי מילה אחת",
        ],
        variant: "light",
        moreLabel: "קראי עוד",
        details: [],
        price: "בהזמנה אליכם, או כרטיס למפגש פתוח ב־199 ₪",
        ctaLabel: "לפרטים ולהרשמה",
        ctaHref: "/draft#contact",
      },
    ],
  },

  notHere: {
    eyebrow: "לפני שנמשיך",
    title: "מה שלא תמצאי כאן",
    items: [
      {
        title: "הבטחה שהילד ישתנה",
        body: "אני לא מבטיחה שיפור ולא התקדמות ולא ריפוי של הילד. ההבטחה שלי היא עלייך, על הגישה שלך ועל ההשפעה שלה על היום שלך, ובה אני יכולה לעמוד.",
      },
      {
        title: "שיטה שתיתן לך שליטה",
        body: "השוק הזה מוכר להורים שליטה, ובצדק הוא נמכר טוב, כי הורה מפוחד קונה כל דבר שמבטיח לו שליטה. זה גם מה שמשאיר אותו אשם כשזה לא עובד. אני מלמדת גישה שלא עוסקת בשליטה אלא בביטחון ביכולת שלך.",
      },
      {
        title: "תחליף לאיש מקצוע",
        body: "פסיכולוגים, מטפלים ומנתחי התנהגות עובדים עם הילד ועל התנהגויות ספציפיות. אני עובדת איתך, על התפקיד שלך כמנהלת הבית ועל היכולת שלך לבנות הורות מותאמת ומאפשרת. ובכל פעם שאזהה משהו שדורש יד מקצועית אגיד לך את זה.",
      },
      {
        title: "עוד מישהי שתגיד לך שאת לא מספיק",
        body: "את מחזיקה בית שרוב האנשים לא היו מחזיקים שבוע. לא באתי לתקן אותך.",
      },
    ],
  },

  guide: {
    eyebrow: "מתנה",
    title: "מה עושים כשהעולם מסתכל?",
    lead: "מדריך נמר״ה המלא, ארבעת הצעדים לרגע שבו הילד מוצף באמצע הסופר או הקניון. אין בו תיאוריה, יש בו מה לעשות בשלוש השניות הראשונות. ישלח אלייך למייל, בלי עלות ובלי התחייבות.",
    bullets: [
      "ארבעת הצעדים של נמר״ה, צעד אחר צעד",
      "טבלת שליפה מהירה: מה לא לעשות ומה כן",
      "ארבע טכניקות גוף להרגעה תוך שניות",
      "כרטיסיית מוכנות למילוי בשגרה, לפני שהיא נדרשת",
    ],
    consentLabel: "אני מאשרת שישלחו אליי את המדריך למייל",
    submitLabel: "שלחו לי את המדריך",
  },

  contact: {
    eyebrow: "דברי איתי",
    title: "אם קראת עד כאן, כנראה שהשינוי בוער בך",
    /**
     * Merged rather than taken whole: the source page says only "leave your
     * details and I'll get back to you", which drops the two facts that
     * actually lower the cost of pressing send.
     */
    lead: "השאירי פרטים ואחזור אלייך תוך 24 שעות, לשיחה ראשונה ללא עלות — כדי שנכיר ונבין יחד אם ואיך אני יכולה לעזור.",
    // Kept in full: required at the point of collection under תיקון 13, and
    // the source page carries no equivalent.
    consentLabel: defaultContent.contact.consentLabel,
  },
};
