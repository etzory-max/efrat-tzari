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

/**
 * `||` rather than `??` on purpose: an env var that exists but is empty must
 * fall through, otherwise `new URL("")` throws and the whole build dies.
 * Vercel's own host vars act as the safety net on preview deploys.
 */
export const siteUrl = (
  withScheme(process.env.NEXT_PUBLIC_SITE_URL) ||
  withScheme(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  withScheme(process.env.VERCEL_URL) ||
  "https://efrat-tzari.co.il"
).replace(/\/$/, "");

/**
 * Search engines are kept out until the real content is in place — a staging
 * site carrying a placeholder phone number must never get indexed.
 * Set NEXT_PUBLIC_ALLOW_INDEXING=true on the production domain at launch.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

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

