import { getContent } from "@/lib/content";
import { site, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * A compact, answer-first summary for AI assistants. Same facts as the page
 * and the JSON-LD — one source (lib/site + the CMS), so nothing can drift.
 */
export async function GET() {
  const content = await getContent();

  const body = [
    `# ${site.name} - ${site.tagline}`,
    "",
    `> ${site.description}`,
    "",
    "## מי זו אפרת צרי",
    `${site.name} היא ${site.jobTitle} עם ניסיון של למעלה מ-10 שנים בליווי משפחות שיש בהן ילד על הרצף האוטיסטי. היא ליוותה למעלה מ-200 משפחות ומעבירה כ-50 הרצאות בשנה. השירות ניתן בעברית, בכל ${site.areaServed}, פנים אל פנים ובאונליין.`,
    "",
    "## שירותים",
    ...content.services.services.map(
      (service) => `- **${service.title}** (${service.kicker}): ${service.body}`,
    ),
    "",
    "## גישה",
    content.approach.lead,
    ...content.approach.cards.map((card) => `- **${card.title}**: ${card.body}`),
    "",
    "## שאלות ותשובות",
    ...content.faq.items.flatMap((item) => [`### ${item.question}`, item.answer, ""]),
    "## מאמרים",
    ...content.articles.articles.map(
      (article) => `- [${article.title}](${siteUrl}/articles/${article.slug}) - ${article.excerpt}`,
    ),
    "",
    "## יצירת קשר",
    `- טלפון: ${site.phoneDisplay} (${site.phoneE164})`,
    `- אימייל: ${site.email}`,
    `- שעות פעילות: ${site.hours}`,
    `- טופס יצירת קשר: ${siteUrl}/#contact`,
    "- שיחת ההיכרות הראשונה ללא עלות וללא התחייבות.",
    "",
    "## מדיניות",
    `- מדיניות פרטיות: ${siteUrl}/privacy`,
    `- הצהרת נגישות: ${siteUrl}/accessibility`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
