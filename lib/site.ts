/**
 * Single source of truth for NAP (name / address / phone) data.
 * The footer, the contact section, the JSON-LD and llms.txt all read from
 * here, so the details Google and the AI crawlers see can never drift.
 *
 * TODO(efrat): replace the placeholder phone/email/social with the real ones.
 */
export const site = {
  name: "אפרת צרי",
  legalName: "אפרת צרי - הורות מותאמת",
  tagline: "הדרכת הורים לילדים על הרצף",
  description:
    "אפרת צרי מלווה הורים לילדים על הרצף לחיות חיים מאפשרים, שמחים ומלאים. ליווי אישי והרצאות, ומודל נמר״ה לניהול משבר בזמן אמת.",
  jobTitle: "מדריכת הורים לילדים על הרצף",

  phoneDisplay: "052-6008172",
  phoneE164: "+972526008172",
  email: "etzory@gmail.com",
  whatsappNumber: "972526008172",
  whatsappMessage: "היי אפרת, הגעתי מהאתר ואשמח לשמוע פרטים על ליווי",
  hours: "ראשון–חמישי, 9:00–19:00",
  hoursSpec: [
    { days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "19:00" },
  ],
  areaServed: "ישראל",

  social: {
    instagram: "https://www.instagram.com/efrat.tzory/",
    linkedin: "https://www.linkedin.com/in/tzoryefrat/",
  },

  /** The sentence in the footer, and the note beside the copyright line. */
  footerLine: "אני עוזרת להורים שמגדלים ילדים על הרצף לחיות חיים מאפשרים, שמחים ומלאים.",
  footerNote: "האתר כתוב בלשון נקבה מטעמי נוחות, ופונה לשני המינים באותה מידה.",

  /** Contact for accessibility + privacy enquiries (required by both statements). */
  accessibilityContactName: "אפרת צרי",
  accessibilityContactEmail: "etzory@gmail.com",
  accessibilityStatementDate: "2026-08-10",
} as const;

const withScheme = (host?: string) =>
  host ? (host.startsWith("http") ? host : `https://${host}`) : "";

/** The live domain. Everything canonical - sitemap, JSON-LD, email links. */
const PRODUCTION = "https://tzory.com";

/**
 * The domain is known and permanent, so production states it rather than
 * reading it from an env var that has to be set correctly in a dashboard. It
 * was that indirection that had the guide email telling readers the site
 * lives at efrat-tzari-one.vercel.app. NEXT_PUBLIC_SITE_URL still overrides,
 * for the day the domain changes; preview deploys address themselves.
 *
 * `||` rather than `??` on purpose: an env var that exists but is empty must
 * fall through, otherwise `new URL("")` throws and the whole build dies.
 */
export const siteUrl = (
  withScheme(process.env.NEXT_PUBLIC_SITE_URL) ||
  (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
    ? withScheme(process.env.VERCEL_URL)
    : "") ||
  PRODUCTION
).replace(/\/$/, "");

/**
 * Crawlers are welcome on the real domain and nowhere else. Preview deploys
 * and the local server stay closed, so a half-finished draft can never be the
 * copy Google holds. NEXT_PUBLIC_ALLOW_INDEXING=false closes production too,
 * should it ever need to go quiet again.
 */
export const allowIndexing =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" ||
  (process.env.VERCEL_ENV === "production" &&
    process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false");

export const whatsappHref = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`;

export type NavItem = { label: string; href: string };

/**
 * Root-relative, not bare `#anchor` — otherwise the links do nothing on
 * /privacy, /accessibility or an article page, where the target section
 * simply is not in the document.
 */
export const navItems: NavItem[] = [
  { label: "אם זה הבית שלך", href: "/#recognise" },
  { label: "איך זה עובד", href: "/#approach" },
  { label: "מי אני", href: "/#about" },
  { label: "מה אפשר", href: "/#services" },
  { label: "המדריך", href: "/#guide" },
];

