import type { StructureBuilder, StructureResolver } from "sanity/structure";

/**
 * The sidebar is the page, read top to bottom.
 *
 * Efrat does not think in document types — she thinks "the bit under the
 * photo". So the list mirrors the scroll order of the home page, and where a
 * section is a heading plus a list of items (services, media, articles,
 * questions) both live together inside that section's own folder instead of
 * being split between a "copy" document and a collection somewhere else.
 */

/** A section that is one document: open it and you are in the form. */
const single = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .id(type)
    .title(title)
    .child(S.document().schemaType(type).documentId(type).title(title));

/** A section that is a heading plus a list of items. */
const withItems = (
  S: StructureBuilder,
  {
    id,
    title,
    copyType,
    itemType,
    itemsTitle,
  }: { id: string; title: string; copyType: string; itemType: string; itemsTitle: string },
) =>
  S.listItem()
    .id(id)
    .title(title)
    .child(
      S.list()
        .id(`${id}-inner`)
        .title(title)
        .items([
          S.listItem()
            .id(copyType)
            .title("כותרת האזור")
            .child(S.document().schemaType(copyType).documentId(copyType).title("כותרת האזור")),
          S.divider(),
          S.listItem()
            .id(`${id}-items`)
            .title(itemsTitle)
            .child(S.documentTypeList(itemType).title(itemsTitle)),
        ]),
    );

/** The two legal documents, each pinned to a fixed id so they stay singletons. */
const legal = (S: StructureBuilder, slug: string, title: string) =>
  S.listItem()
    .id(`legal-${slug}`)
    .title(title)
    .child(
      S.document()
        .schemaType("legalPage")
        .documentId(`legal-${slug}`)
        .title(title),
    );

export const structure: StructureResolver = (S) =>
  S.list()
    /* Sanity requires an id on every list, the root one included. Without it
       the Studio refuses to draw the sidebar at all and shows nothing but
       "`id` is required for lists". The list items below already carry theirs. */
    .id("root")
    .title("תוכן האתר")
    .items([
      single(S, "hero", "1. ראש העמוד"),
      single(S, "recognise", "2. אם זה הבית שלך"),
      single(S, "approach", "3. איך זה עובד"),
      single(S, "about", "4. מי אני"),
      withItems(S, {
        id: "services",
        title: "5. מה אפשר",
        copyType: "servicesSection",
        itemType: "service",
        itemsTitle: "השירותים",
      }),
      single(S, "testimonials", "6. המלצות"),
      withItems(S, {
        id: "media",
        title: "7. בתקשורת",
        copyType: "mediaSection",
        itemType: "mediaItem",
        itemsTitle: "פריטי המדיה",
      }),
      withItems(S, {
        id: "articles",
        title: "8. מאמרים",
        copyType: "articlesSection",
        itemType: "article",
        itemsTitle: "המאמרים",
      }),
      single(S, "guide", "9. המדריך במתנה"),
      withItems(S, {
        id: "faq",
        title: "10. שאלות נפוצות",
        copyType: "faqSection",
        itemType: "faqItem",
        itemsTitle: "השאלות",
      }),
      single(S, "notHere", "11. מה שלא תמצאי כאן"),
      single(S, "contactSection", "12. דברי איתי"),

      S.divider(),
      single(S, "guideEmail", "המייל של המדריך"),

      S.divider(),
      S.listItem()
        .id("legal")
        .title("עמודים משפטיים")
        .child(
          S.list()
            .id("legal-inner")
            .title("עמודים משפטיים")
            .items([
              legal(S, "privacy", "מדיניות פרטיות"),
              legal(S, "accessibility", "הצהרת נגישות"),
            ]),
        ),

      S.divider(),
      single(S, "siteSettings", "הגדרות ופרטי קשר"),
    ]);
