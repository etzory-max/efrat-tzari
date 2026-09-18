"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

export default defineConfig({
  basePath: "/studio",
  title: "אפרת צרי — ניהול תוכן",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // Singletons are created once from the structure list; hide them from
    // the global "create new" menu so Efrat cannot end up with duplicates.
    // Only the four real collections — services, media, articles and
    // questions — are things there can legitimately be another of.
    newDocumentOptions: (prev) =>
      prev.filter((item) =>
        ["service", "mediaItem", "article", "faqItem"].includes(item.templateId ?? ""),
      ),
  },
});
