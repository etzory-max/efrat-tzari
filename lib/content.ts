import { cache } from "react";
import { sanityClient, urlFor } from "@/sanity/client";
import { sanityConfigured } from "@/sanity/env";
import { defaultContent } from "@/content/defaults";
import type { Article, Img, SiteContent } from "@/content/types";

type SanityImage = { asset?: unknown; alt?: string } | null | undefined;

const toImg = (image: SanityImage, fallback: Img, width: number): Img => {
  if (!image?.asset) return fallback;
  const src = urlFor(image as never, width);
  return src ? { src, alt: image.alt ?? fallback.alt } : fallback;
};

/** Anything the editor left empty falls back to the seed copy. */
const or = <T,>(value: T | null | undefined, fallback: T): T =>
  value === null || value === undefined || (Array.isArray(value) && value.length === 0)
    ? fallback
    : value;

const QUERY = /* groq */ `{
  "hero": *[_type == "heroSlide"] | order(order asc) {
    title, subtitle, ctaLabel, ctaHref, image
  },
  "about": *[_type == "about"][0] {
    eyebrow, title, paragraphs, portrait, badgeValue, badgeLabel, stats[] { value, label }
  },
  "approach": *[_type == "approach"][0] {
    eyebrow, title, lead, cards[] { icon, title, body }, quote, quoteAuthor
  },
  "services": *[_type == "service"] | order(order asc) {
    "id": slug.current, icon, kicker, title, body, bullets, variant, moreLabel, details
  },
  "articles": *[_type == "article"] | order(date desc) {
    "slug": slug.current, title, date, excerpt, image, readingMinutes, body
  },
  "faq": *[_type == "faqItem"] | order(order asc) { question, answer },
  "copy": *[_type == "sectionCopy"][0]
}`;

/**
 * Memoised per request only — a module-level cache would survive
 * revalidateTag() and the site would never pick up CMS edits.
 */
export const getContent = cache(async function fetchContent(): Promise<SiteContent> {
  if (!sanityConfigured || !sanityClient) return defaultContent;

  try {
    const data = await sanityClient.fetch<Record<string, never>>(
      QUERY,
      {},
      { next: { revalidate: 60, tags: ["content"] } },
    );
    return mergeContent(data);
  } catch (error) {
    // A CMS outage should never take the site down.
    console.error("[content] Sanity fetch failed, serving seed content", error);
    return defaultContent;
  }
});

export async function getArticles(): Promise<Article[]> {
  return (await getContent()).articles.articles;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((article) => article.slug === slug);
}

function mergeContent(data: any): SiteContent {
  const d = defaultContent;
  const copy = data?.copy ?? {};

  const hero = or(data?.hero, null)
    ? data.hero.map((slide: any, index: number) => ({
        title: or(slide.title, d.hero[index]?.title ?? ""),
        subtitle: or(slide.subtitle, d.hero[index]?.subtitle ?? ""),
        ctaLabel: or(slide.ctaLabel, "קראי עוד"),
        ctaHref: or(slide.ctaHref, "/#contact"),
        image: toImg(slide.image, d.hero[index]?.image ?? d.hero[0].image, 1920),
      }))
    : d.hero;

  const about = data?.about
    ? {
        eyebrow: or(data.about.eyebrow, d.about.eyebrow),
        title: or(data.about.title, d.about.title),
        paragraphs: or(data.about.paragraphs, d.about.paragraphs),
        portrait: toImg(data.about.portrait, d.about.portrait, 1000),
        badgeValue: or(data.about.badgeValue, d.about.badgeValue),
        badgeLabel: or(data.about.badgeLabel, d.about.badgeLabel),
        stats: or(data.about.stats, d.about.stats),
      }
    : d.about;

  const approach = data?.approach
    ? {
        eyebrow: or(data.approach.eyebrow, d.approach.eyebrow),
        title: or(data.approach.title, d.approach.title),
        lead: or(data.approach.lead, d.approach.lead),
        cards: or(data.approach.cards, d.approach.cards),
        quote: or(data.approach.quote, d.approach.quote),
        quoteAuthor: or(data.approach.quoteAuthor, d.approach.quoteAuthor),
      }
    : d.approach;

  const services = or(data?.services, null)
    ? {
        eyebrow: or(copy.servicesEyebrow, d.services.eyebrow),
        title: or(copy.servicesTitle, d.services.title),
        services: data.services.map((service: any) => ({
          id: or(service.id, "service"),
          icon: or(service.icon, "users"),
          kicker: or(service.kicker, ""),
          title: or(service.title, ""),
          body: or(service.body, ""),
          bullets: or(service.bullets, []),
          variant: or(service.variant, "light"),
          moreLabel: or(service.moreLabel, "קראי עוד"),
          details: or(service.details, []),
        })),
      }
    : d.services;

  const articles = or(data?.articles, null)
    ? {
        eyebrow: or(copy.articlesEyebrow, d.articles.eyebrow),
        title: or(copy.articlesTitle, d.articles.title),
        articles: data.articles.map((article: any, index: number) => ({
          slug: article.slug,
          title: article.title,
          date: article.date,
          excerpt: or(article.excerpt, ""),
          image: toImg(article.image, d.articles.articles[index]?.image ?? d.articles.articles[0].image, 1200),
          readingMinutes: or(article.readingMinutes, 5),
          body: or(article.body, []),
        })),
      }
    : d.articles;

  const faq = or(data?.faq, null)
    ? {
        eyebrow: or(copy.faqEyebrow, d.faq.eyebrow),
        title: or(copy.faqTitle, d.faq.title),
        lead: or(copy.faqLead, d.faq.lead),
        items: data.faq,
      }
    : d.faq;

  const contact = {
    eyebrow: or(copy.contactEyebrow, d.contact.eyebrow),
    title: or(copy.contactTitle, d.contact.title),
    lead: or(copy.contactLead, d.contact.lead),
    consentLabel: or(copy.consentLabel, d.contact.consentLabel),
  };

  return { hero, about, approach, services, articles, faq, contact };
}
