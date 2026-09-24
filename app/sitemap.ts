import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/content";
import { siteUrl } from "@/lib/site";

/* /gentle-cracks is deliberately absent while it carries placeholder copy:
   a page of lorem ipsum indexed under her name would be worse than no page
   at all. It goes in here, and loses the noindex in its own metadata, the
   day the real text lands. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const latest = articles[0]?.date ? new Date(articles[0].date) : new Date();

  return [
    { url: `${siteUrl}/`, lastModified: latest, changeFrequency: "monthly", priority: 1 },
    ...articles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    { url: `${siteUrl}/accessibility`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
