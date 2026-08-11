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

const richText = (name: string, title: string) =>
  defineField({
    name,
    title,
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

const siteSettings = defineType({
  name: "siteSettings",
  title: "הגדרות אתר",
  type: "document",
  fields: [
    defineField({ name: "name", title: "שם", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "טאגליין", type: "string" }),
    defineField({ name: "description", title: "תיאור לגוגל (meta description)", type: "text", rows: 3 }),
    accessibleImage("logo", "לוגו"),
    defineField({ name: "phoneDisplay", title: "טלפון (לתצוגה)", type: "string" }),
    defineField({ name: "phoneE164", title: "טלפון (בפורמט בינלאומי)", type: "string" }),
    defineField({ name: "email", title: "אימייל", type: "string" }),
    defineField({ name: "whatsappNumber", title: "מספר וואטסאפ", type: "string" }),
    defineField({ name: "hours", title: "שעות פעילות", type: "string" }),
    defineField({ name: "instagram", title: "אינסטגרם", type: "url" }),
    defineField({ name: "facebook", title: "פייסבוק", type: "url" }),
  ],
  preview: { select: { title: "name" } },
});

const heroSlide = defineType({
  name: "heroSlide",
  title: "שקופית בראש העמוד",
  type: "document",
  fields: [
    defineField({ name: "title", title: "כותרת", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "כותרת משנה", type: "text", rows: 2 }),
    defineField({ name: "ctaLabel", title: "טקסט הכפתור", type: "string" }),
    defineField({ name: "ctaHref", title: "יעד הכפתור", type: "string", initialValue: "#contact" }),
    accessibleImage(),
    defineField({ name: "order", title: "סדר", type: "number", initialValue: 1 }),
  ],
  orderings: [{ title: "סדר", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", media: "image" } },
});

const about = defineType({
  name: "about",
  title: "אודות",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "תווית", type: "string", initialValue: "אודות" }),
    defineField({ name: "title", title: "כותרת", type: "string" }),
    defineField({
      name: "paragraphs",
      title: "פסקאות",
      type: "array",
      of: [defineArrayMember({ type: "text" })],
    }),
    accessibleImage("portrait", "תמונת פורטרט"),
    defineField({ name: "badgeValue", title: "באדג' — מספר", type: "string" }),
    defineField({ name: "badgeLabel", title: "באדג' — תיאור", type: "string" }),
    defineField({
      name: "stats",
      title: "נתונים",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "ערך", type: "string" }),
            defineField({ name: "label", title: "תיאור", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (r) => r.max(4),
    }),
  ],
  preview: { select: { title: "title" } },
});

const approach = defineType({
  name: "approach",
  title: "הורות מותאמת",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "תווית", type: "string" }),
    defineField({ name: "title", title: "כותרת", type: "string" }),
    defineField({ name: "lead", title: "פסקת פתיחה", type: "text", rows: 3 }),
    defineField({
      name: "cards",
      title: "כרטיסים",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "אייקון",
              type: "string",
              options: {
                list: [
                  { title: "לב", value: "heart" },
                  { title: "כוכב", value: "star" },
                  { title: "עלה", value: "leaf" },
                ],
              },
              initialValue: "heart",
            }),
            defineField({ name: "title", title: "כותרת", type: "string" }),
            defineField({ name: "body", title: "טקסט", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (r) => r.max(3),
    }),
    defineField({ name: "quote", title: "ציטוט", type: "text", rows: 3 }),
    defineField({ name: "quoteAuthor", title: "מקור הציטוט", type: "string" }),
  ],
  preview: { select: { title: "title" } },
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
      description: 'משמש לקישור מהתפריט (למשל service-family).',
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
      name: "variant",
      title: "סגנון כרטיס",
      type: "string",
      options: {
        list: [
          { title: "כהה (מודגש)", value: "dark" },
          { title: "בהיר", value: "light" },
        ],
      },
      initialValue: "light",
    }),
    defineField({ name: "moreLabel", title: "טקסט 'קראי עוד'", type: "string", initialValue: "קראי עוד" }),
    richText("details", "תוכן מורחב"),
    defineField({ name: "order", title: "סדר", type: "number", initialValue: 1 }),
  ],
  orderings: [{ title: "סדר", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "kicker" } },
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
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "תאריך פרסום", type: "date", validation: (r) => r.required() }),
    defineField({
      name: "excerpt",
      title: "תקציר",
      type: "text",
      rows: 3,
      description: "מוצג בכרטיס ובתוצאות החיפוש. עד 160 תווים.",
      validation: (r) => r.max(180),
    }),
    accessibleImage(),
    defineField({ name: "readingMinutes", title: "דקות קריאה", type: "number", initialValue: 5 }),
    richText("body", "גוף המאמר"),
  ],
  orderings: [{ title: "חדש לישן", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "image" } },
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

const sectionCopy = defineType({
  name: "sectionCopy",
  title: "כותרות סקשנים",
  type: "document",
  fields: [
    defineField({ name: "servicesEyebrow", title: "שירותים — תווית", type: "string" }),
    defineField({ name: "servicesTitle", title: "שירותים — כותרת", type: "string" }),
    defineField({ name: "articlesEyebrow", title: "מאמרים — תווית", type: "string" }),
    defineField({ name: "articlesTitle", title: "מאמרים — כותרת", type: "string" }),
    defineField({ name: "faqEyebrow", title: "שאלות — תווית", type: "string" }),
    defineField({ name: "faqTitle", title: "שאלות — כותרת", type: "string" }),
    defineField({ name: "faqLead", title: "שאלות — פסקת פתיחה", type: "text", rows: 2 }),
    defineField({ name: "contactEyebrow", title: "צור קשר — תווית", type: "string" }),
    defineField({ name: "contactTitle", title: "צור קשר — כותרת", type: "string" }),
    defineField({ name: "contactLead", title: "צור קשר — פסקת פתיחה", type: "text", rows: 3 }),
    defineField({ name: "consentLabel", title: "טקסט תיבת ההסכמה", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "כותרות סקשנים" }) },
});

/**
 * Note: מדיניות הפרטיות והצהרת הנגישות מנוהלות בקוד ולא ב-CMS — הן מסמכים
 * משפטיים שעריכה מקרית בהם עלולה ליצור אי-התאמה לרגולציה.
 */
export const schemaTypes = [
  siteSettings,
  heroSlide,
  about,
  approach,
  service,
  article,
  faqItem,
  sectionCopy,
];
