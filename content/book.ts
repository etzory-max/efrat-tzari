import type { PortableTextBlock } from "@portabletext/react";
import type { AboutSection, ContactSection, Img, TestimonialsSection } from "@/content/types";
import { md } from "@/content/portable";

/**
 * The book page - /gentle-cracks.
 *
 * A second front door, not a second site: same palette, same type, same
 * sections where a section already says the right thing. It stands on its own
 * (nothing in the main menu points at it) so it can be handed to a publisher,
 * an interviewer or a reader who only ever came for the book.
 *
 * Every string here is placeholder copy, in Hebrew so the lines break the way
 * real lines will. It is all editable in the Studio under "עמוד הספר" - what
 * the editor leaves empty falls back to what is written below.
 */

const LOREM =
  "לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית. סת אלמנקום ניסי נון ניבאה. דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק.";

const LOREM_SHORT =
  "סת אלמנקום ניסי נון ניבאה, דס איאקוליס וולופטה דיאם. לורם איפסום דולור סיט אמט.";

/* Each paragraph opens on different words. Two identical strings in one list
   would collide on the key the sections derive from their own text, which is
   a console error the placeholder should not be teaching anyone to expect. */
const LOREM_2 =
  "קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק. לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית סת אלמנקום ניסי נון ניבאה דס איאקוליס.";

const LOREM_3 =
  "וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו. דס איאקוליס וולופטה דיאם, סת אלמנקום ניסי נון ניבאה לורם איפסום דולור סיט אמט קונסקטורר אדיפיסינג.";

/**
 * The opening: a few sentences in her voice, and the way on to the book.
 * No cover here - it belongs to "על הספר", where it is the subject.
 */
export type BookHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
};

/** The book itself, at the size it deserves. */
export type BookAbout = {
  eyebrow: string;
  title: string;
  lead: string;
  paragraphs: string[];
  bullets: string[];
  cover: Img;
};

/** The first chapter, given away in full and read on the page. */
export type BookChapter = {
  eyebrow: string;
  title: string;
  lead: string;
  /** The chapter as the reader will meet it - headings, paragraphs, quotes. */
  body: PortableTextBlock[];
  /** The line under the text, on the way to buying the rest. */
  closer: string;
  ctaLabel: string;
  ctaHref: string;
};

export type BookPurchase = {
  eyebrow: string;
  title: string;
  lead: string;
  price?: string;
  /** Hardcover, digital, signed - whatever is actually on offer. */
  formats: string[];
  buyLabel: string;
  buyHref: string;
  note?: string;
};

/** One thing Efrat does, beside the book. */
export type BookOffering = { title: string; body: string };

export type BookOfferings = {
  eyebrow: string;
  title: string;
  lead: string;
  items: BookOffering[];
};

/** For her sister. Quiet, and the last thing on the page. */
export type BookDedication = { label: string; body: string };

export type BookPageContent = {
  /** What Google and a shared link show. Separate from the site's own. */
  meta: { title: string; description: string };
  hero: BookHero;
  story: AboutSection;
  about: BookAbout;
  chapter: BookChapter;
  purchase: BookPurchase;
  testimonials: TestimonialsSection;
  offerings: BookOfferings;
  contact: ContactSection;
  dedication: BookDedication;
};

const cover: Img = {
  src: "/images/book-cover.png",
  alt: "כריכת הספר",
};

export const defaultBookPage: BookPageContent = {
  meta: {
    title: "שברים עדינים — הספר",
    description:
      "אוסף סיפורים קצרים מאת אפרת צרי, על מה שאבד, מה שנמצא ומה שביניהם. נכתב מתוך שנה של אובדן, ומתוך בית שבו שתי בנות על הרצף.",
  },

  hero: {
    eyebrow: "הספר",
    title: "שברים עדינים",
    /* Sentence per line, and the line breaks are the content: each one is a
       thing that happened, and reading them as one paragraph would blur them
       back together. Rendered with whitespace-pre-line, like the home page's
       two other leads. */
    subtitle: [
      "בתוך שנה אחת איבדתי את אחותי ואת העבודה.",
      "נשארתי מול בית שבו שתי בנות על הרצף, ומול חלל שלא ידעתי מה עושים איתו.",
      "התחלתי לכתוב, ומזה יצא ספר.",
    ].join("\n"),
    ctaLabel: "על הספר",
    ctaHref: "#book",
    ctaSecondaryLabel: "לקריאת הסיפור הראשון",
    ctaSecondaryHref: "#chapter",
  },

  /* The personal story, in the shape the About section already knows: a
     portrait, paragraphs, one of them pulled out as a quote, and four short
     statements beside it. It ends where the book begins. */
  story: {
    eyebrow: "הסיפור",
    title: "הדרך שהובילה לספר",
    paragraphs: [
      "אני אפרת צרי, אם יחידנית לתאומות בנות 13. שתיהן על הרצף, וכל אחת מהן חיה בעולם אחר: צרכים אחרים, קשיים אחרים, רגישויות אחרות. אחת מהן אובחנה רק בגיל 11, וכמעט במקרה — בנות יודעות ליצור קשר עין, לחקות ולהסתדר, ולכן פחות חושדים בהן.",
      "לפני זה הייתי מנהלת שיווק בהייטק. הוויתור על הקריירה לא היה החלטה שקיבלתי אלא תוצאה: אי אפשר להחזיק משרה שדורשת זמינות מלאה כשטלפון אחד מבית הספר מחזיר אותך הביתה באמצע היום, והוא מגיע הרבה.",
      "ואז, בתוך זמן קצר, אחותי נפטרה מסרטן והעבודה נגמרה. נשארתי לעמוד בתוך חלל גדול מאוד, עם שתי בנות שצריכות אותי שלמה.",
      "דווקא שם התחלתי לכתוב. לא על עצב, אלא על אנשים שיוצאים מהמקומות הנמוכים ביותר אל נקודת אור.",
      "הסיפורים נכתבו בין הדברים — בלילות, בהמתנות, אחרי ימים שבהם הכול התפרק ובכל זאת קמנו בבוקר. מהם נולד הספר הזה.",
    ],
    highlight: 3,
    portrait: { src: "/images/efrat-portrait.jpg", alt: "אפרת צרי" },
    badgeValue: "2025",
    badgeLabel: "יצא לאור",
    points: [
      "אם יחידנית לתאומות בנות 13",
      "שתיהן על הרצף, כל אחת בעולם אחר",
      "מנהלת שיווק בהייטק לשעבר",
      "מדריכת הורים מוסמכת",
    ],
  },

  about: {
    eyebrow: "על הספר",
    title: "סיפורים על מה שאבד, מה שנמצא ומה שביניהם",
    lead: "״שברים עדינים״ הוא אוסף סיפורים קצרים. הוא נכתב מתוך תקופה של משבר, ועוסק בדיוק במה שבא אחריו: איך ממשיכים לתפקד כשמשהו נשבר, ומה מחזיק אנשים זה לזה כשאין על מה להישען.",
    paragraphs: [
      "כל סיפור עומד בפני עצמו ואפשר לקרוא אותו בערב אחד. אין כאן עלילה שצריך לזכור מאיפה היא התחילה, ואין דמות שצריך ללוות מאתיים עמודים. יש אנשים ברגע אחד של חייהם, ברגע שבו משהו זז.",
      "חלק מהסיפורים שואבים מהבית שלי — מהרגעים עם הבנות, מהמערכת שפספסה אותן, מהימים שבהם התפרקתי וקמתי. אחרים הם של אנשים אחרים לגמרי. המשותף לכולם הוא הכיוון שאליו הם הולכים.",
    ],
    bullets: [
      "אוסף סיפורים קצרים, כל אחד עומד בפני עצמו",
      "נכתב מתוך השנה עצמה, ולא ממרחק של עשור",
      "רגעים אמיתיים מבית שבו שתי בנות על הרצף",
      "לא ספר של עצב — ספר על היכולת להמשיך",
    ],
    cover,
  },

  chapter: {
    eyebrow: "במתנה",
    title: "הסיפור הראשון, לקריאה כאן",
    lead: "הסיפור שפותח את הספר, במלואו. בלי טופס, בלי הרשמה ובלי להוריד כלום.",
    body: md(`לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית. סת אלמנקום ניסי נון ניבאה. דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק.

## לורם איפסום דולור סיט

קונסקטורר אדיפיסינג אלית. סת אלמנקום ניסי נון ניבאה, דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק. לורם איפסום דולור סיט אמט.

> לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית.

סת אלמנקום ניסי נון ניבאה. דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק.

## קונסקטורר אדיפיסינג אלית

לורם איפסום דולור סיט אמט. סת אלמנקום ניסי נון ניבאה, דס איאקוליס וולופטה דיאם וסטיבולום אט דולור. קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק, לורם איפסום דולור סיט אמט קונסקטורר אדיפיסינג אלית.`),
    closer: "כאן נגמר הסיפור הראשון. השאר מחכים בספר.",
    ctaLabel: "לרכישת הספר",
    ctaHref: "#buy",
  },

  purchase: {
    eyebrow: "לרכישה",
    title: "להזמין את הספר",
    lead: "הספר נשלח אליכם בדואר. אפשר לבקש הקדשה אישית, ואפשר להזמין כמה עותקים — הוא עושה מתנה טובה למי שעובר תקופה.",
    price: "₪00",
    formats: [
      "עותק מודפס, נשלח בדואר",
      "אפשר לבקש הקדשה בכתב ידה של אפרת",
      "הזמנה של כמה עותקים — כותבים לי ונסדר",
    ],
    buyLabel: "לרכישת הספר",
    buyHref: "#contact",
    note: "לשאלות על משלוח, הקדשה או הזמנה מרובה — אפשר לכתוב לי ישירות.",
  },

  testimonials: {
    eyebrow: "המלצות",
    title: "מה אומרים על הספר",
    items: [
      { quote: LOREM, name: "לורם איפסום" },
      { quote: LOREM_SHORT, name: "קונסקטורר" },
      { quote: LOREM_2, name: "אדיפיסינג אלית" },
    ],
  },

  offerings: {
    eyebrow: "מה אני עושה",
    title: "מלבד הכתיבה",
    lead: "הכול נשען על אותו שילוב: ניסיון ניהולי ושיווקי מהייטק, ובית שמלמד כל יום איך מנהלים מציאות שמשתנה בלי הודעה מראש.",
    items: [
      {
        title: "ליווי שיווקי",
        body: "מיצוב, מסר ותוכן לעסקים קטנים וליוצרים עצמאיים. איך להגיד בפשטות מה אתם עושים, ולמי זה משנה.",
      },
      {
        title: "ייעוץ לקמפיין הדסטארט",
        body: "ליווי לקמפיין מימון המונים: מה לכתוב בעמוד, איך לתמחר תגמולים, ואיך בונים את השבוע הראשון — זה שמכריע את כל השאר.",
      },
      {
        title: "הדרכת הורים",
        body: "ליווי אישי להורים לילדים על הרצף. לא פרוטוקול לילד, אלא דרך לנהל את היום שלכם בבית ומול המערכת.",
      },
      {
        title: "הרצאה",
        body: "ערב אחד על מה שקורה מאחורי הדלת של משפחה על הרצף, ועל איך ממשיכים. לקהילות, לצוותים חינוכיים ולארגונים.",
      },
    ],
  },

  contact: {
    eyebrow: "דברי איתי",
    title: "רוצה לשאול משהו?",
    lead: "על הספר, על הזמנה, על הרצאה או על ליווי. אפשר גם רק להגיד שמשהו בסיפורים נגע — אני קוראת הכול ועונה בעצמי.",
    consentLabel: "קראתי את מדיניות הפרטיות ואני מאשרת יצירת קשר",
  },

  dedication: {
    label: "הקדשה",
    body: "לאחותי, שאיננה כאן כדי לקרוא אותו.",
  },
};
