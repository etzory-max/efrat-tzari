import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Alt text is required on every image. Accessibility is enforced at the point
 * of authoring, not just in the templates.
 */
const accessibleImage = (name = "image", title = "תמונה") =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "טקסט חלופי (alt)",
        type: "string",
        description: "תיאור קצר של התמונה לקוראי מסך. חובה.",
        validation: (rule) => rule.required().min(4).max(140),
      }),
    ],
    validation: (rule) => rule.required(),
  });

const richText = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    ...(description ? { description } : {}),
    type: "array",
    of: [
      defineArrayMember({
        type: "block",
        styles: [
          { title: "פסקה", value: "normal" },
          { title: "כותרת משנה", value: "h2" },
          { title: "כותרת קטנה", value: "h3" },
          { title: "ציטוט", value: "blockquote" },
        ],
        lists: [
          { title: "רשימה", value: "bullet" },
          { title: "רשימה ממוספרת", value: "number" },
        ],
        marks: {
          decorators: [
            { title: "הדגשה", value: "strong" },
            { title: "נטוי", value: "em" },
          ],
        },
      }),
    ],
  });

/**
 * Every section on the page opens the same way — a small label, a heading and
 * sometimes a standfirst — so the three fields are defined once and spread in.
 */
const heading = (eyebrow: string, { lead = false } = {}) => [
  defineField({ name: "eyebrow", title: "תווית קטנה", type: "string", initialValue: eyebrow }),
  defineField({ name: "title", title: "כותרת האזור", type: "text", rows: 2 }),
  ...(lead ? [defineField({ name: "lead", title: "פסקת פתיחה", type: "text", rows: 3 })] : []),
];

/* ==================================================================== *
 * 1. הגדרות ופרטי קשר
 * ==================================================================== */

/**
 * Only fields the site actually renders. A CMS field that changes nothing is
 * worse than a missing one — it invites an edit and then quietly ignores it,
 * which is how the old logo/hours/facebook fields sat here.
 *
 * The same details are also written into lib/site.ts, which is what feeds the
 * page <title>, robots.txt, the structured data Google reads and the address
 * the contact form posts to. Those are read before there is a request to fetch
 * with, so they cannot come from here. Changing a phone number means changing
 * it in both places — say the word and I will do the code side.
 */
const siteSettings = defineType({
  name: "siteSettings",
  title: "הגדרות ופרטי קשר",
  type: "document",
  groups: [
    { name: "identity", title: "שם ותיאור", default: true },
    { name: "contact", title: "פרטי קשר" },
    { name: "footer", title: "תחתית העמוד" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "שם",
      type: "string",
      group: "identity",
      description: "מופיע בלוגו בראש העמוד ובתחתית.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "שורת הזיהוי שמתחת לשם",
      type: "string",
      group: "identity",
    }),
    defineField({ name: "phoneDisplay", title: "טלפון (לתצוגה)", type: "string", group: "contact" }),
    defineField({
      name: "phoneE164",
      title: "טלפון (בפורמט בינלאומי)",
      type: "string",
      group: "contact",
      description: "מה שקורה בלחיצה על מספר הטלפון. למשל +972526008172.",
    }),
    defineField({ name: "email", title: "אימייל", type: "string", group: "contact" }),
    defineField({
      name: "whatsappNumber",
      title: "מספר וואטסאפ",
      type: "string",
      group: "contact",
      description: "ספרות בלבד, עם קידומת המדינה ובלי אפס. למשל 972526008172.",
    }),
    defineField({
      name: "whatsappMessage",
      title: "ההודעה שמוכנה מראש בוואטסאפ",
      type: "string",
      group: "contact",
    }),
    defineField({ name: "instagram", title: "אינסטגרם", type: "url", group: "contact" }),
    defineField({ name: "linkedin", title: "לינקדאין", type: "url", group: "contact" }),
    defineField({
      name: "footerLine",
      title: "המשפט בתחתית העמוד",
      type: "text",
      rows: 3,
      group: "footer",
    }),
    defineField({
      name: "footerNote",
      title: "הערת לשון הפנייה",
      type: "string",
      group: "footer",
      description: "השורה הקטנה ליד שורת זכויות היוצרים.",
    }),
  ],
  preview: { prepare: () => ({ title: "הגדרות ופרטי קשר" }) },
});

/* ==================================================================== *
 * 2. האזורים בעמוד הבית, לפי סדר הגלילה
 * ==================================================================== */

const hero = defineType({
  name: "hero",
  title: "ראש העמוד",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "שורת מיצוב (מעל הכותרת)", type: "string" }),
    defineField({ name: "title", title: "כותרת ראשית", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "פסקת הפתיחה", type: "text", rows: 4 }),
    defineField({ name: "ctaLabel", title: "כפתור ראשי — טקסט", type: "string" }),
    defineField({ name: "ctaHref", title: "כפתור ראשי — יעד", type: "string", initialValue: "/#contact" }),
    defineField({ name: "ctaSecondaryLabel", title: "כפתור משני — טקסט", type: "string" }),
    defineField({
      name: "ctaSecondaryHref",
      title: "כפתור משני — יעד",
      type: "string",
      initialValue: "/#approach",
    }),
    accessibleImage(),
  ],
  preview: { select: { title: "title", media: "image" } },
});

const recognise = defineType({
  name: "recognise",
  title: "אם זה הבית שלך",
  type: "document",
  fields: [
    ...heading("אם זה הבית שלך", { lead: true }),
    defineField({
      name: "timelineLabel",
      title: "כותרת הציר",
      type: "string",
      initialValue: "יום אחד בבית שלך",
    }),
    defineField({
      name: "items",
      title: "תחנות היום",
      description: "ארבע תחנות. הסדר כאן הוא הסדר על הציר.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "time",
              title: "שלב ביום",
              type: "string",
              description: 'למשל "שבע בבוקר" או "ברקע, תמיד".',
            }),
            defineField({ name: "title", title: "כותרת", type: "string" }),
            defineField({ name: "body", title: "טקסט", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "time" } },
        }),
      ],
      validation: (r) => r.max(5),
    }),
    defineField({
      name: "closer",
      title: "משפט הסגירה",
      type: "text",
      rows: 3,
      description: "השורה שמתחת לאיור, שעוברת מההזדהות אל ההצעה.",
    }),
  ],
  preview: { prepare: () => ({ title: "אם זה הבית שלך" }) },
});

const approach = defineType({
  name: "approach",
  title: "איך זה עובד",
  type: "document",
  fields: [
    ...heading("איך זה עובד", { lead: true }),
    defineField({
      name: "cards",
      title: "שלושת השלבים",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "איור",
              type: "string",
              options: {
                list: [
                  { title: "עין בתוך קשת — שינוי נקודת מבט", value: "shift" },
                  { title: "בית ושעון — שגרת הבית", value: "household" },
                  { title: "עוגן — רגע המשבר", value: "anchor" },
                  { title: "לב", value: "heart" },
                  { title: "כוכב", value: "star" },
                  { title: "עלה", value: "leaf" },
                ],
              },
              initialValue: "shift",
            }),
            defineField({ name: "title", title: "כותרת", type: "string" }),
            defineField({ name: "body", title: "טקסט", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (r) => r.max(3),
    }),
    defineField({ name: "quote", title: "ציטוט", type: "text", rows: 3 }),
    defineField({ name: "quoteAuthor", title: "מקור הציטוט", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "איך זה עובד" }) },
});

const about = defineType({
  name: "about",
  title: "מי אני",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "תווית קטנה", type: "string", initialValue: "מי אני" }),
    defineField({ name: "title", title: "כותרת האזור", type: "text", rows: 2 }),
    defineField({
      name: "paragraphs",
      title: "פסקאות",
      type: "array",
      of: [defineArrayMember({ type: "text" })],
    }),
    defineField({
      name: "highlight",
      title: "איזו פסקה להדגיש",
      type: "number",
      description:
        "מספר הפסקה שתוצג גדולה יותר ועם קו טרקוטה בצד. 1 היא הראשונה. ריק — ואף פסקה לא תודגש.",
      validation: (r) => r.min(1).max(12),
    }),
    accessibleImage("portrait", "תמונת פורטרט"),
    defineField({ name: "badgeValue", title: "באדג' — מספר", type: "string" }),
    defineField({ name: "badgeLabel", title: "באדג' — תיאור", type: "string" }),
    defineField({
      name: "points",
      title: "נקודות",
      description: "אמירות קצרות מתחת לפסקאות. אפשר להשאיר ריק — האזור פשוט לא יציג אותן.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.max(4),
    }),
  ],
  preview: { prepare: () => ({ title: "מי אני" }) },
});

const servicesSection = defineType({
  name: "servicesSection",
  title: "מה אפשר — כותרת האזור",
  type: "document",
  fields: [
    ...heading("מה אפשר", { lead: true }),
    defineField({
      name: "ctaTitle",
      title: "המשפט שסוגר את האזור",
      type: "text",
      rows: 2,
      description: "מופיע גדול מתחת לשני הכרטיסים. ריק — והשורה והכפתור לא יוצגו.",
    }),
    defineField({ name: "ctaLabel", title: "כפתור — טקסט", type: "string" }),
    defineField({ name: "ctaHref", title: "כפתור — יעד", type: "string", initialValue: "/#contact" }),
  ],
  preview: { prepare: () => ({ title: "מה אפשר — כותרת האזור" }) },
});

const service = defineType({
  name: "service",
  title: "שירות",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "מזהה עוגן",
      type: "slug",
      options: { source: "title" },
      description: "משמש לקישור מהתפריט (למשל service-family).",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      title: "אייקון",
      type: "string",
      options: {
        list: [
          { title: "משפחה", value: "users" },
          { title: "מיקרופון", value: "mic" },
          { title: "ספר", value: "book" },
        ],
      },
      initialValue: "users",
    }),
    defineField({ name: "kicker", title: "תווית", type: "string" }),
    defineField({ name: "title", title: "כותרת", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "תיאור", type: "text", rows: 4 }),
    defineField({
      name: "bullets",
      title: "נקודות",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "price",
      title: "מחיר / איך מזמינים",
      type: "string",
      description: 'למשל "בהזמנה אליכם, או כרטיס למפגש פתוח ב־199 ₪".',
    }),
    defineField({
      name: "note",
      title: "שורת תנאים",
      type: "string",
      description: "שורה קטנה מתחת למחיר. אפשר להשאיר ריק.",
    }),
    defineField({ name: "ctaLabel", title: "קישור פעולה — טקסט", type: "string" }),
    defineField({ name: "ctaHref", title: "קישור פעולה — יעד", type: "string", initialValue: "/#contact" }),
    defineField({
      name: "variant",
      title: "סגנון כרטיס",
      type: "string",
      options: {
        list: [
          { title: "כהה (הכרטיס המרכזי)", value: "dark" },
          { title: "בהיר", value: "light" },
        ],
      },
      initialValue: "light",
    }),
    defineField({ name: "moreLabel", title: "טקסט 'קראי עוד'", type: "string", initialValue: "קראי עוד" }),
    richText("details", "תוכן מורחב", "נפתח בלחיצה על 'קראי עוד'. ריק — והקישור לא יופיע."),
    defineField({
      name: "order",
      title: "סדר",
      type: "number",
      description: "1 הוא הראשון מימין.",
      initialValue: 1,
    }),
  ],
  orderings: [{ title: "סדר", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "kicker" } },
});

const testimonials = defineType({
  name: "testimonials",
  title: "המלצות",
  type: "document",
  fields: [
    ...heading("המלצות"),
    defineField({
      name: "items",
      title: "ההמלצות",
      description: "העיצוב בנוי סביב שלוש. הראשונה והשלישית מופיעות מעל הקו, השנייה מתחתיו.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "הציטוט",
              type: "text",
              rows: 5,
              validation: (r) => r.required(),
            }),
            defineField({
              name: "name",
              title: "חתימה",
              type: "string",
              description: 'שם או ראשי תיבות, למשל "רחלי" או "א׳".',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "role",
              title: "תיאור",
              type: "string",
              description: 'למשל "אמא במשפחה שליוויתי". אפשר להשאיר ריק.',
            }),
          ],
          preview: { select: { title: "name", subtitle: "quote" } },
        }),
      ],
      validation: (r) => r.max(3),
    }),
  ],
  preview: { prepare: () => ({ title: "המלצות" }) },
});

const mediaSection = defineType({
  name: "mediaSection",
  title: "בתקשורת — כותרת האזור",
  type: "document",
  fields: heading("בתקשורת", { lead: true }),
  preview: { prepare: () => ({ title: "בתקשורת — כותרת האזור" }) },
});

const mediaItem = defineType({
  name: "mediaItem",
  title: "פריט מדיה",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "סוג",
      type: "string",
      options: {
        list: [
          { title: "וידאו", value: "video" },
          { title: "פודקאסט", value: "podcast" },
          { title: "כתבה", value: "press" },
        ],
        layout: "radio",
      },
      initialValue: "video",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "כותרת", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "outlet",
      title: "אמצעי / תוכנית",
      type: "string",
      description: "ריק — והשורה הזו פשוט לא תוצג.",
    }),
    defineField({
      name: "date",
      title: "תאריך",
      type: "date",
      description: "לא מוצג בעמוד, אבל גוגל קורא אותו.",
    }),
    defineField({
      name: "summary",
      title: "תקציר",
      type: "text",
      rows: 3,
      description:
        "חובה. זה מה שקורא מסך מקבל, ומה שמחליף כתבה סרוקה שאי אפשר לקרוא ממנה טקסט.",
      validation: (r) => r.required().max(320),
    }),
    accessibleImage("poster", "תמונת תצוגה"),
    defineField({
      name: "youtubeId",
      title: "מזהה סרטון ביוטיוב",
      type: "string",
      description: "רק המזהה, למשל 1Jyky8kOxuU. רלוונטי לווידאו ולפודקאסט.",
    }),
    defineField({
      name: "href",
      title: "קישור לקובץ או לעמוד",
      type: "string",
      description: "רלוונטי לכתבה. נפתח בלשונית חדשה.",
    }),
    defineField({ name: "order", title: "סדר", type: "number", initialValue: 1 }),
  ],
  orderings: [{ title: "סדר", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "outlet", media: "poster" } },
});

const articlesSection = defineType({
  name: "articlesSection",
  title: "מאמרים — כותרת האזור",
  type: "document",
  fields: heading("מאמרים"),
  preview: { prepare: () => ({ title: "מאמרים — כותרת האזור" }) },
});

const article = defineType({
  name: "article",
  title: "מאמר",
  type: "document",
  fields: [
    defineField({ name: "title", title: "כותרת", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "כתובת (slug)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "מרכיב את כתובת המאמר. שינוי שלו שובר קישורים קיימים.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "תאריך פרסום", type: "date", validation: (r) => r.required() }),
    defineField({
      name: "excerpt",
      title: "תקציר",
      type: "text",
      rows: 3,
      description: "מוצג בכרטיס ובתוצאות החיפוש. עד 180 תווים.",
      validation: (r) => r.max(180),
    }),
    accessibleImage(),
    defineField({ name: "readingMinutes", title: "דקות קריאה", type: "number", initialValue: 5 }),
    richText("body", "גוף המאמר"),
  ],
  orderings: [{ title: "חדש לישן", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "image" } },
});

const guide = defineType({
  name: "guide",
  title: "המדריך במתנה",
  type: "document",
  fields: [
    ...heading("מתנה", { lead: true }),
    defineField({
      name: "bullets",
      title: "מה יש במדריך",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "consentLabel", title: "טקסט תיבת ההסכמה", type: "string" }),
    defineField({ name: "submitLabel", title: "טקסט הכפתור", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "המדריך במתנה" }) },
});

const faqSection = defineType({
  name: "faqSection",
  title: "שאלות נפוצות — כותרת האזור",
  type: "document",
  fields: heading("שאלות נפוצות", { lead: true }),
  preview: { prepare: () => ({ title: "שאלות נפוצות — כותרת האזור" }) },
});

const faqItem = defineType({
  name: "faqItem",
  title: "שאלה נפוצה",
  type: "document",
  fields: [
    defineField({ name: "question", title: "שאלה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "תשובה", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({ name: "order", title: "סדר", type: "number", initialValue: 1 }),
  ],
  orderings: [{ title: "סדר", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question" } },
});

const notHere = defineType({
  name: "notHere",
  title: "מה שלא תמצאי כאן",
  type: "document",
  fields: [
    ...heading("לפני שנמשיך"),
    defineField({
      name: "items",
      title: "מה שלא מוצע כאן",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "כותרת", type: "string" }),
            defineField({ name: "body", title: "הסבר", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "מה שלא תמצאי כאן" }) },
});

const contactSection = defineType({
  name: "contactSection",
  title: "דברי איתי",
  type: "document",
  fields: [
    ...heading("דברי איתי", { lead: true }),
    defineField({
      name: "consentLabel",
      title: "טקסט תיבת ההסכמה",
      type: "string",
      description: "הקישור למדיניות הפרטיות נוסף אוטומטית בסוף השורה.",
    }),
  ],
  preview: { prepare: () => ({ title: "דברי איתי" }) },
});

/* ==================================================================== *
 * 3. המייל שנשלח עם המדריך
 * ==================================================================== */

/**
 * The first thing a new reader gets from Efrat, so the wording is hers to
 * change. The PDF itself is a file in the repository and is not edited here.
 */
const guideEmail = defineType({
  name: "guideEmail",
  title: "המייל של המדריך",
  type: "document",
  groups: [
    { name: "inbox", title: "מה רואים בתיבה", default: true },
    { name: "body", title: "גוף ההודעה" },
  ],
  fields: [
    defineField({
      name: "subject",
      title: "נושא ההודעה",
      type: "string",
      group: "inbox",
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: "preheader",
      title: "השורה שמופיעה ליד הנושא",
      type: "string",
      group: "inbox",
      description: "מה שנראה בתיבה עוד לפני שפותחים. משפט אחד קצר.",
      validation: (r) => r.max(120),
    }),
    defineField({ name: "eyebrow", title: "תווית קטנה", type: "string", group: "body" }),
    defineField({
      name: "heading",
      title: "כותרת ההודעה",
      type: "string",
      group: "body",
      description: "אפשר לכתוב {שם} ובמקומו ייכנס השם שהיא מילאה בטופס.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "lead", title: "משפט פתיחה", type: "text", rows: 2, group: "body" }),
    defineField({ name: "body", title: "פסקה", type: "text", rows: 3, group: "body" }),
    defineField({
      name: "bullets",
      title: "מה יש במדריך",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "body",
    }),
    defineField({ name: "closing", title: "משפט סיום", type: "text", rows: 3, group: "body" }),
    defineField({ name: "ctaLabel", title: "טקסט הכפתור", type: "string", group: "body" }),
    defineField({
      name: "note",
      title: "ההערה הקטנה בתחתית",
      type: "text",
      rows: 3,
      group: "body",
      description: "למה ההודעה הגיעה ומה לא נשמר. נדרש לפי חוק הגנת הפרטיות — לא למחוק.",
    }),
  ],
  preview: { prepare: () => ({ title: "המייל של המדריך" }) },
});

/* ==================================================================== *
 * 4. העמודים המשפטיים
 * ==================================================================== */

/**
 * These are editable, at Ilan's request, but not casually: the warning below
 * is the first thing in the form, and lib/../content/legal.ts stays behind
 * them as a fallback, so emptying a document here cannot leave the site
 * without a privacy policy.
 */
const legalPage = defineType({
  name: "legalPage",
  title: "עמוד משפטי",
  type: "document",
  fields: [
    defineField({
      name: "notice",
      title: "לפני שמשנים",
      type: "string",
      readOnly: true,
      initialValue:
        "העמודים האלה הם מסמכים משפטיים. שינוי שאינו תואם למה שהאתר באמת עושה עלול ליצור אי-התאמה לחוק.",
    }),
    defineField({
      name: "slug",
      title: "איזה עמוד",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "מדיניות פרטיות", value: "privacy" },
          { title: "הצהרת נגישות", value: "accessibility" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "כותרת העמוד", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "updatedAt",
      title: "עודכן לאחרונה",
      type: "date",
      description: "התאריך שמוצג בראש העמוד. יש לעדכן אותו בכל שינוי תוכן.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "פסקת פתיחה", type: "text", rows: 3 }),
    richText("body", "גוף המסמך", "כותרת משנה = סעיף. רשימה = תבליטים."),
    defineField({
      name: "description",
      title: "תיאור לגוגל (meta description)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: { select: { title: "title", subtitle: "updatedAt" } },
});

export const schemaTypes = [
  siteSettings,
  hero,
  recognise,
  approach,
  about,
  servicesSection,
  service,
  testimonials,
  mediaSection,
  mediaItem,
  articlesSection,
  article,
  guide,
  faqSection,
  faqItem,
  notHere,
  contactSection,
  guideEmail,
  legalPage,
];
