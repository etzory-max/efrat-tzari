import type { StructureResolver } from "sanity/structure";

const singletons: { type: string; title: string }[] = [
  { type: "siteSettings", title: "הגדרות אתר" },
  { type: "hero", title: "ראש העמוד" },
  { type: "about", title: "אודות" },
  { type: "approach", title: "הורות מותאמת" },
  { type: "sectionCopy", title: "כותרות סקשנים" },
];

const collections: { type: string; title: string }[] = [
  { type: "service", title: "שירותים" },
  { type: "article", title: "מאמרים" },
  { type: "mediaItem", title: "מדיה" },
  { type: "faqItem", title: "שאלות נפוצות" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    /* Sanity requires an id on every list, the root one included. Without it
       the Studio refuses to draw the sidebar at all and shows nothing but
       "`id` is required for lists". The list items below already carry theirs. */
    .id("root")
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
