import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/content";
import { siteUrl } from "@/lib/site";

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
