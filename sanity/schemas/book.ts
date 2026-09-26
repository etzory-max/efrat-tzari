import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * עמוד הספר — the documents behind /gentle-cracks.
 *
 * Each section of that page is one document, in scroll order, exactly like the
 * home page. They are prefixed `book` so the two pages can never be edited
 * into each other by accident, and so the sidebar can gather them into their
 * own folder.
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
  });

const heading = (eyebrow: string, { lead = false } = {}) => [
  defineField({ name: "eyebrow", title: "תווית קטנה", type: "string", initialValue: eyebrow }),
  defineField({ name: "title", title: "כותרת האזור", type: "text", rows: 2 }),
  ...(lead ? [defineField({ name: "lead", title: "פסקת פתיחה", type: "text", rows: 3 })] : []),
];

const lines = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    ...(description ? { description } : {}),
    type: "array",
    of: [defineArrayMember({ type: "text", rows: 4 })],
  });

const bookHero = defineType({
  name: "bookHero",
  title: "1. ראש העמוד",
  type: "document",
  fields: [
    ...heading("הספר"),
    defineField({ name: "subtitle", title: "פסקת הפתיחה", type: "text", rows: 4 }),
    defineField({ name: "ctaLabel", title: "כפתור ראשי", type: "string" }),
    defineField({
      name: "ctaHref",
      title: "קישור הכפתור הראשי",
      type: "string",
      description: "#book מוביל לאזור על הספר, #buy לאזור הרכישה.",
      initialValue: "#book",
    }),
    defineField({ name: "ctaSecondaryLabel", title: "כפתור משני", type: "string" }),
    defineField({
      name: "ctaSecondaryHref",
      title: "קישור הכפתור המשני",
      type: "string",
      initialValue: "#chapter",
    }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});

const bookStory = defineType({
  name: "bookStory",
  title: "2. הסיפור",
  type: "document",
  fields: [
    ...heading("הסיפור"),
    lines("paragraphs", "פסקאות", "כל פסקה בשדה נפרד."),
    defineField({
      name: "highlight",
      title: "איזו פסקה מודגשת כציטוט",
      type: "number",
      description: "1 לפסקה הראשונה, 2 לשנייה וכן הלאה. אפשר להשאיר ריק.",
      validation: (rule) => rule.min(1).integer(),
    }),
    accessibleImage("portrait", "תמונה"),
    defineField({ name: "badgeValue", title: "מספר בתגית", type: "string" }),
    defineField({ name: "badgeLabel", title: "טקסט בתגית", type: "string" }),
    lines("points", "ארבע נקודות קצרות"),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});

const bookAbout = defineType({
  name: "bookAbout",
  title: "3. על הספר",
  type: "document",
  fields: [
    ...heading("על הספר", { lead: true }),
    lines("paragraphs", "פסקאות"),
    lines("bullets", "מה יש בספר", "שורה לכל פריט."),
    accessibleImage("cover", "כריכת הספר"),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});

const bookChapter = defineType({
  name: "bookChapter",
  title: "4. הפרק הראשון",
  type: "document",
  fields: [
    ...heading("פרק ראשון, במתנה", { lead: true }),
    defineField({
      name: "body",
      title: "הפרק עצמו",
      description: "הטקסט המלא של הפרק, כפי שייקרא בעמוד.",
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
          lists: [{ title: "רשימה", value: "bullet" }],
          marks: {
            decorators: [
              { title: "הדגשה", value: "strong" },
              { title: "נטוי", value: "em" },
            ],
          },
        }),
      ],
    }),
    defineField({ name: "closer", title: "השורה שסוגרת את הפרק", type: "text", rows: 2 }),
    defineField({ name: "ctaLabel", title: "כפתור בסוף הפרק", type: "string" }),
    defineField({ name: "ctaHref", title: "קישור הכפתור", type: "string", initialValue: "#buy" }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});

const bookPurchase = defineType({
  name: "bookPurchase",
  title: "5. לרכישה",
  type: "document",
  fields: [
    ...heading("לרכישה", { lead: true }),
    defineField({ name: "price", title: "מחיר", type: "string" }),
    lines("formats", "מה כלול / פורמטים"),
    defineField({ name: "buyLabel", title: "כפתור הרכישה", type: "string" }),
    defineField({
      name: "buyHref",
      title: "הקישור לרכישה",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({ name: "note", title: "הערה קטנה מתחת לכפתור", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});

const bookTestimonials = defineType({
  name: "bookTestimonials",
  title: "6. המלצות",
  type: "document",
  fields: [
    ...heading("המלצות"),
    defineField({
      name: "items",
      title: "ההמלצות",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", title: "ההמלצה", type: "text", rows: 4 }),
            defineField({ name: "name", title: "שם", type: "string" }),
            defineField({ name: "role", title: "תיאור (לא חובה)", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "quote" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});

const bookOfferings = defineType({
  name: "bookOfferings",
  title: "7. מה אני עושה",
  type: "document",
  fields: [
    ...heading("מה אני עושה", { lead: true }),
    defineField({
      name: "items",
      title: "הפריטים",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "כותרת", type: "string" }),
            defineField({ name: "body", title: "תיאור", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});

const bookContact = defineType({
  name: "bookContact",
  title: "8. דברי איתי",
  type: "document",
  fields: [
    ...heading("דברי איתי", { lead: true }),
    defineField({ name: "consentLabel", title: "שורת האישור ליד תיבת הסימון", type: "string" }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});

const bookDedication = defineType({
  name: "bookDedication",
  title: "9. הקדשה",
  type: "document",
  fields: [
    defineField({ name: "label", title: "תווית קטנה", type: "string", initialValue: "הקדשה" }),
    defineField({ name: "body", title: "ההקדשה", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "body", subtitle: "label" } },
});

const bookMeta = defineType({
  name: "bookMeta",
  title: "כותרת ותיאור לגוגל",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "כותרת העמוד",
      type: "string",
      description: "מה שמופיע בלשונית הדפדפן ובתוצאות החיפוש.",
    }),
    defineField({
      name: "description",
      title: "תיאור לגוגל (meta description)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const bookSchemaTypes = [
  bookHero,
  bookStory,
  bookAbout,
  bookChapter,
  bookPurchase,
  bookTestimonials,
  bookOfferings,
  bookContact,
  bookDedication,
  bookMeta,
];
