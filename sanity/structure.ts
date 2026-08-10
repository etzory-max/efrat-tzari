import type { StructureResolver } from "sanity/structure";

const singletons: { type: string; title: string }[] = [
  { type: "siteSettings", title: "הגדרות אתר" },
  { type: "about", title: "אודות" },
  { type: "approach", title: "הורות מותאמת" },
  { type: "sectionCopy", title: "כותרות סקשנים" },
];

const collections: { type: string; title: string }[] = [
  { type: "heroSlide", title: "שקופיות ראש העמוד" },
  { type: "service", title: "שירותים" },
  { type: "article", title: "מאמרים" },
  { type: "faqItem", title: "שאלות נפוצות" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("תוכן האתר")
    .items([
      ...singletons.map((item) =>
        S.listItem()
          .title(item.title)
          .id(item.type)
          .child(S.document().schemaType(item.type).documentId(item.type).title(item.title)),
      ),
      S.divider(),
      ...collections.map((item) =>
        S.listItem()
          .title(item.title)
          .id(item.type)
          .child(S.documentTypeList(item.type).title(item.title)),
      ),
    ]);
