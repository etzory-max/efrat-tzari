/**
 * The wording of the messages the site sends.
 *
 * Here rather than inside the server action so Efrat can edit it in the
 * Studio: it is the first thing a new reader gets from her, and it should not
 * need a developer to change a sentence in it. These are the fallbacks - the
 * seed the CMS starts from, and what is served if Sanity is unreachable.
 *
 * `{שם}` in the heading is replaced with the name the reader typed.
 */
export type GuideEmailCopy = {
  subject: string;
  /** The line the inbox shows next to the subject, before opening. */
  preheader: string;
  eyebrow: string;
  heading: string;
  lead: string;
  body: string;
  bullets: string[];
  closing: string;
  ctaLabel: string;
  /** The small print: why this arrived, and what is not kept. */
  note: string;
};

export const guideEmail: GuideEmailCopy = {
  subject: "מדריך נמר״ה — מה עושים כשהעולם מסתכל",
  preheader: "המדריך מצורף כאן, ואפשר פשוט להשיב לי על המייל הזה.",
  eyebrow: "מתנה",
  heading: "{שם}, המדריך מצורף",
  lead: "ארבעת הצעדים של נמר״ה, לרגע שבו הילד מוצף באמצע הסופר או הקניון.",
  body: "אין בו תיאוריה ואין בו הקדמות — יש בו מה לעשות בשלוש השניות הראשונות, ומה לעשות ביום שאחרי.",
  bullets: [
    "ארבעת הצעדים, צעד אחר צעד",
    "טבלת שליפה מהירה: מה לא לעשות ומה כן",
    "ארבע טכניקות גוף להרגעה תוך שניות",
    "כרטיסיית מוכנות למילוי בשגרה, לפני שהיא נדרשת",
  ],
  closing:
    "קריאה נעימה. אם משהו בו מעלה אצלך שאלה — אפשר פשוט להשיב למייל הזה, אני קוראת הכול.",
  ctaLabel: "דברי איתי",
  note: "קיבלת את ההודעה הזו כי ביקשת את המדריך באתר. הכתובת שלך לא נשמרה ברשימת תפוצה ולא יישלח אלייך דיוור נוסף.",
};
