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

/** The opening: the book, and the one sentence that makes someone want it. */
export type BookHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  buyLabel: string;
  buyHref: string;
  readLabel: string;
  readHref: string;
  cover: Img;
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
    title: "הספר",
    description: LOREM_SHORT,
  },

  hero: {
    eyebrow: "הספר",
    title: "לורם איפסום דולור סיט אמט",
    subtitle:
      "קונסקטורר אדיפיסינג אלית. סת אלמנקום ניסי נון ניבאה, דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור.",
    buyLabel: "לרכישת הספר",
    buyHref: "#buy",
    readLabel: "לקריאת הפרק הראשון",
    readHref: "#chapter",
    cover,
  },

  /* The personal story, in the shape the About section already knows: a
     portrait, paragraphs, one of them pulled out as a quote, and four short
     statements beside it. The sister is named here, inside the story, and
     again at the foot of the page. */
  story: {
    eyebrow: "הסיפור",
    title: "לורם איפסום דולור סיט אמט קונסקטורר",
    paragraphs: [LOREM, LOREM_2, LOREM_SHORT, LOREM_3],
    highlight: 2,
    portrait: { src: "/images/efrat-portrait.jpg", alt: "אפרת צרי" },
    badgeValue: "2026",
    badgeLabel: "שנת הוצאה",
    points: [
      "לורם איפסום דולור סיט",
      "קונסקטורר אדיפיסינג אלית",
      "סת אלמנקום ניסי נון ניבאה",
      "דס איאקוליס וולופטה דיאם",
    ],
  },

  about: {
    eyebrow: "על הספר",
    title: "לורם איפסום דולור סיט אמט",
    lead: LOREM_SHORT,
    paragraphs: [LOREM, LOREM_2],
    bullets: [
      "לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג",
      "סת אלמנקום ניסי נון ניבאה",
      "דס איאקוליס וולופטה דיאם וסטיבולום",
      "קראס אגת לקטוס וואל אאוגו",
    ],
    cover,
  },

  chapter: {
    eyebrow: "פרק ראשון, במתנה",
    title: "לורם איפסום: הפרק הראשון",
    lead: "הפרק הראשון של הספר, לקריאה כאן בעמוד. בלי טופס ובלי הרשמה.",
    body: md(`לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית. סת אלמנקום ניסי נון ניבאה. דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק.

## לורם איפסום דולור סיט

קונסקטורר אדיפיסינג אלית. סת אלמנקום ניסי נון ניבאה, דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק. לורם איפסום דולור סיט אמט.

> לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית.

סת אלמנקום ניסי נון ניבאה. דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק.

## קונסקטורר אדיפיסינג אלית

לורם איפסום דולור סיט אמט. סת אלמנקום ניסי נון ניבאה, דס איאקוליס וולופטה דיאם וסטיבולום אט דולור. קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק, לורם איפסום דולור סיט אמט קונסקטורר אדיפיסינג אלית.

סת אלמנקום ניסי נון ניבאה. דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו.`),
    closer: "כאן נגמר הפרק הראשון. השאר מחכה בספר.",
    ctaLabel: "לרכישת הספר",
    ctaHref: "#buy",
  },

  purchase: {
    eyebrow: "לרכישה",
    title: "לורם איפסום דולור סיט אמט",
    lead: LOREM_SHORT,
    price: "₪00",
    formats: ["לורם איפסום", "קונסקטורר אדיפיסינג", "סת אלמנקום ניסי"],
    buyLabel: "לרכישת הספר",
    buyHref: "https://grow.business/",
    note: "התשלום מתבצע באתר מאובטח חיצוני.",
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
    title: "לורם איפסום דולור סיט אמט",
    lead: LOREM_SHORT,
    items: [
      { title: "ליווי שיווקי", body: LOREM_SHORT },
      { title: "ייעוץ להדסטארט", body: LOREM_2 },
      { title: "הדרכת הורים", body: LOREM_3 },
      { title: "הרצאה", body: LOREM_SHORT },
    ],
  },

  contact: {
    eyebrow: "דברי איתי",
    title: "לורם איפסום דולור סיט",
    lead: LOREM_SHORT,
    consentLabel: "קראתי את מדיניות הפרטיות ואני מאשרת יצירת קשר",
  },

  dedication: {
    label: "הקדשה",
    body: LOREM_SHORT,
  },
};
