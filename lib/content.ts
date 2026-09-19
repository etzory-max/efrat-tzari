import { cache } from "react";
import { sanityClient, urlFor } from "@/sanity/client";
import { sanityConfigured } from "@/sanity/env";
import { defaultContent } from "@/content/defaults";
import { guideEmail, type GuideEmailCopy } from "@/content/emails";
import { legalPages, type LegalDoc } from "@/content/legal";
import { site, whatsappHref } from "@/lib/site";
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

/**
 * One round trip for the whole page. The section headings now live on the
 * section documents themselves rather than in a single shared "copy" document,
 * so each one is fetched beside the items it introduces.
 */
const QUERY = /* groq */ `{
  "hero": *[_type == "hero"][0] {
    eyebrow, title, subtitle, ctaLabel, ctaHref, ctaSecondaryLabel, ctaSecondaryHref, image
  },
  "recognise": *[_type == "recognise"][0] {
    eyebrow, title, lead, timelineLabel, items[] { time, title, body }, closer
  },
  "approach": *[_type == "approach"][0] {
    eyebrow, title, lead, cards[] { icon, title, body }, quote, quoteAuthor
  },
  "about": *[_type == "about"][0] {
    eyebrow, title, paragraphs, highlight, portrait, badgeValue, badgeLabel, points
  },
  "servicesCopy": *[_type == "servicesSection"][0] { eyebrow, title, lead, ctaTitle, ctaLabel, ctaHref },
  "services": *[_type == "service"] | order(order asc) {
    "id": slug.current, icon, kicker, title, body, bullets,
    price, note, ctaLabel, ctaHref, variant, moreLabel, details
  },
  "testimonials": *[_type == "testimonials"][0] {
    eyebrow, title, items[] { quote, name, role }
  },
  "mediaCopy": *[_type == "mediaSection"][0] { eyebrow, title, lead },
  "media": *[_type == "mediaItem"] | order(order asc) {
    kind, title, outlet, date, summary, poster, youtubeId, href
  },
  "articlesCopy": *[_type == "articlesSection"][0] { eyebrow, title },
  "articles": *[_type == "article"] | order(date desc) {
    "slug": slug.current, title, date, excerpt, image, readingMinutes, body
  },
  "guide": *[_type == "guide"][0] {
    eyebrow, title, lead, bullets, consentLabel, submitLabel
  },
  "faqCopy": *[_type == "faqSection"][0] { eyebrow, title, lead },
  "faq": *[_type == "faqItem"] | order(order asc) { question, answer },
  "notHere": *[_type == "notHere"][0] { eyebrow, title, items[] { title, body } },
  "contact": *[_type == "contactSection"][0] { eyebrow, title, lead, consentLabel }
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

  const hero = data?.hero
    ? {
        eyebrow: or(data.hero.eyebrow, d.hero.eyebrow),
        title: or(data.hero.title, d.hero.title),
        subtitle: or(data.hero.subtitle, d.hero.subtitle),
        ctaLabel: or(data.hero.ctaLabel, d.hero.ctaLabel),
        ctaHref: or(data.hero.ctaHref, d.hero.ctaHref),
        ctaSecondaryLabel: or(data.hero.ctaSecondaryLabel, d.hero.ctaSecondaryLabel),
        ctaSecondaryHref: or(data.hero.ctaSecondaryHref, d.hero.ctaSecondaryHref),
        image: toImg(data.hero.image, d.hero.image, 1920),
      }
    : d.hero;

  const recognise = data?.recognise
    ? {
        eyebrow: or(data.recognise.eyebrow, d.recognise!.eyebrow),
        title: or(data.recognise.title, d.recognise!.title),
        lead: or(data.recognise.lead, d.recognise!.lead),
        timelineLabel: or(data.recognise.timelineLabel, d.recognise!.timelineLabel),
        items: or(data.recognise.items, d.recognise!.items),
        closer: or(data.recognise.closer, d.recognise!.closer),
      }
    : d.recognise;

  const about = data?.about
    ? {
        eyebrow: or(data.about.eyebrow, d.about.eyebrow),
        title: or(data.about.title, d.about.title),
        paragraphs: or(data.about.paragraphs, d.about.paragraphs),
        /* The Studio counts from 1, the array from 0. */
        highlight:
          typeof data.about.highlight === "number" ? data.about.highlight - 1 : d.about.highlight,
        portrait: toImg(data.about.portrait, d.about.portrait, 1000),
        badgeValue: or(data.about.badgeValue, d.about.badgeValue),
        badgeLabel: or(data.about.badgeLabel, d.about.badgeLabel),
        points: or(data.about.points, d.about.points),
        book: d.about.book,
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

  const servicesCopy = data?.servicesCopy ?? {};
  const services = or(data?.services, null)
    ? {
        eyebrow: or(servicesCopy.eyebrow, d.services.eyebrow),
        title: or(servicesCopy.title, d.services.title),
        lead: or(servicesCopy.lead, d.services.lead),
        ctaTitle: or(servicesCopy.ctaTitle, d.services.ctaTitle),
        ctaLabel: or(servicesCopy.ctaLabel, d.services.ctaLabel),
        ctaHref: or(servicesCopy.ctaHref, d.services.ctaHref),
        services: data.services.map((service: any) => ({
          id: or(service.id, "service"),
          icon: or(service.icon, "users"),
          kicker: or(service.kicker, ""),
          title: or(service.title, ""),
          body: or(service.body, ""),
          bullets: or(service.bullets, []),
          price: service.price ?? undefined,
          note: service.note ?? undefined,
          ctaLabel: service.ctaLabel ?? undefined,
          ctaHref: service.ctaHref ?? undefined,
          variant: or(service.variant, "light"),
          moreLabel: or(service.moreLabel, "קראי עוד"),
          details: or(service.details, []),
        })),
      }
    : d.services;

  const testimonials = data?.testimonials
    ? {
        eyebrow: or(data.testimonials.eyebrow, d.testimonials!.eyebrow),
        title: or(data.testimonials.title, d.testimonials!.title),
        items: or(data.testimonials.items, d.testimonials!.items),
      }
    : d.testimonials;

  const mediaCopy = data?.mediaCopy ?? {};
  const media = or(data?.media, null)
    ? {
        eyebrow: or(mediaCopy.eyebrow, d.media.eyebrow),
        title: or(mediaCopy.title, d.media.title),
        lead: or(mediaCopy.lead, d.media.lead),
        items: data.media.map((item: any, index: number) => ({
          kind: or(item.kind, "video"),
          title: or(item.title, ""),
          outlet: or(item.outlet, ""),
          date: item.date ?? undefined,
          summary: or(item.summary, ""),
          poster: toImg(item.poster, d.media.items[index]?.poster ?? d.media.items[0].poster, 900),
          youtubeId: item.youtubeId ?? undefined,
          href: item.href ?? undefined,
        })),
      }
    : d.media;

  const articlesCopy = data?.articlesCopy ?? {};
  const articles = or(data?.articles, null)
    ? {
        eyebrow: or(articlesCopy.eyebrow, d.articles.eyebrow),
        title: or(articlesCopy.title, d.articles.title),
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

  const guide = data?.guide
    ? {
        eyebrow: or(data.guide.eyebrow, d.guide.eyebrow),
        title: or(data.guide.title, d.guide.title),
        lead: or(data.guide.lead, d.guide.lead),
        bullets: or(data.guide.bullets, d.guide.bullets),
        consentLabel: or(data.guide.consentLabel, d.guide.consentLabel),
        submitLabel: or(data.guide.submitLabel, d.guide.submitLabel),
      }
    : d.guide;

  const faqCopy = data?.faqCopy ?? {};
  const faq = or(data?.faq, null)
    ? {
        eyebrow: or(faqCopy.eyebrow, d.faq.eyebrow),
        title: or(faqCopy.title, d.faq.title),
        lead: or(faqCopy.lead, d.faq.lead),
        items: data.faq,
      }
    : d.faq;

  const notHere = data?.notHere
    ? {
        eyebrow: or(data.notHere.eyebrow, d.notHere!.eyebrow),
        title: or(data.notHere.title, d.notHere!.title),
        items: or(data.notHere.items, d.notHere!.items),
      }
    : d.notHere;

  const contactCopy = data?.contact ?? {};
  const contact = {
    eyebrow: or(contactCopy.eyebrow, d.contact.eyebrow),
    title: or(contactCopy.title, d.contact.title),
    lead: or(contactCopy.lead, d.contact.lead),
    consentLabel: or(contactCopy.consentLabel, d.contact.consentLabel),
  };

  return {
    hero,
    recognise,
    about,
    approach,
    services,
    testimonials,
    media,
    articles,
    guide,
    faq,
    notHere,
    contact,
  };
}

/**
 * The details the chrome renders: the logo wordmark, the footer and the
 * WhatsApp button.
 *
 * Deliberately not everything in lib/site.ts. The page title, robots.txt, the
 * sitemap, the manifest and the JSON-LD are all produced before there is a
 * request to fetch against, and the address the contact form posts to belongs
 * with the secrets, not in an editable field. Those stay in code; these are
 * the ones a visitor reads off the page.
 */
export type SiteSettings = {
  name: string;
  tagline: string;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  whatsappHref: string;
  instagram: string;
  linkedin: string;
  footerLine: string;
  footerNote: string;
};

/** Used when the CMS has nothing to say — and as the seed for the document. */
export const defaultSettings: SiteSettings = {
  name: site.name,
  tagline: site.tagline,
  phoneDisplay: site.phoneDisplay,
  phoneE164: site.phoneE164,
  email: site.email,
  whatsappHref,
  instagram: site.social.instagram,
  linkedin: site.social.linkedin,
  footerLine: site.footerLine,
  footerNote: site.footerNote,
};

export const getSiteSettings = cache(async function fetchSettings(): Promise<SiteSettings> {
  if (!sanityConfigured || !sanityClient) return defaultSettings;

  try {
    const s = await sanityClient.fetch<any>(
      /* groq */ `*[_type == "siteSettings"][0] {
        name, tagline, phoneDisplay, phoneE164, email,
        whatsappNumber, whatsappMessage, instagram, linkedin, footerLine, footerNote
      }`,
      {},
      { next: { revalidate: 60, tags: ["content"] } },
    );
    if (!s) return defaultSettings;

    const number = or(s.whatsappNumber, site.whatsappNumber);
    const message = or(s.whatsappMessage, site.whatsappMessage);

    return {
      name: or(s.name, defaultSettings.name),
      tagline: or(s.tagline, defaultSettings.tagline),
      phoneDisplay: or(s.phoneDisplay, defaultSettings.phoneDisplay),
      phoneE164: or(s.phoneE164, defaultSettings.phoneE164),
      email: or(s.email, defaultSettings.email),
      whatsappHref: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      instagram: or(s.instagram, defaultSettings.instagram),
      linkedin: or(s.linkedin, defaultSettings.linkedin),
      footerLine: or(s.footerLine, defaultSettings.footerLine),
      footerNote: or(s.footerNote, defaultSettings.footerNote),
    };
  } catch (error) {
    console.error("[content] Sanity settings fetch failed, serving code defaults", error);
    return defaultSettings;
  }
});

/**
 * The wording of the guide email. Efrat edits it in the Studio, so the server
 * action reads it rather than holding the sentences itself; content/emails.ts
 * is the fallback if Sanity is unreachable, and an email that fails to send
 * because a CMS was down would be the worst possible moment for it.
 */
export const getGuideEmail = cache(async function fetchGuideEmail(): Promise<GuideEmailCopy> {
  if (!sanityConfigured || !sanityClient) return guideEmail;
  try {
    const doc = await sanityClient.fetch<Partial<GuideEmailCopy> | null>(
      /* groq */ `*[_type == "guideEmail"][0] {
        subject, preheader, eyebrow, heading, lead, body, bullets, closing, ctaLabel, note
      }`,
      {},
      { next: { revalidate: 60, tags: ["content"] } },
    );
    if (!doc) return guideEmail;
    return {
      subject: or(doc.subject, guideEmail.subject),
      preheader: or(doc.preheader, guideEmail.preheader),
      eyebrow: or(doc.eyebrow, guideEmail.eyebrow),
      heading: or(doc.heading, guideEmail.heading),
      lead: or(doc.lead, guideEmail.lead),
      body: or(doc.body, guideEmail.body),
      bullets: or(doc.bullets, guideEmail.bullets),
      closing: or(doc.closing, guideEmail.closing),
      ctaLabel: or(doc.ctaLabel, guideEmail.ctaLabel),
      note: or(doc.note, guideEmail.note),
    };
  } catch (error) {
    console.error("[content] guide email fetch failed, serving seed copy", error);
    return guideEmail;
  }
});

/**
 * The privacy policy and the accessibility statement.
 *
 * Fetched separately rather than folded into the page query: they are their
 * own routes, and neither one should make the home page wait. The seed copy in
 * content/legal.ts is the fallback, so the site can never be served without a
 * privacy policy even if the CMS document is emptied or deleted.
 */
export const getLegalPage = cache(async function fetchLegalPage(
  slug: LegalDoc["slug"],
): Promise<LegalDoc> {
  const fallback = legalPages[slug];
  if (!sanityConfigured || !sanityClient) return fallback;

  try {
    const doc = await sanityClient.fetch<Partial<LegalDoc> | null>(
      /* groq */ `*[_type == "legalPage" && slug == $slug][0] {
        slug, title, updatedAt, intro, body, description
      }`,
      { slug },
      { next: { revalidate: 60, tags: ["content"] } },
    );
    if (!doc) return fallback;

    return {
      slug,
      title: or(doc.title, fallback.title),
      description: or(doc.description, fallback.description),
      updatedAt: or(doc.updatedAt, fallback.updatedAt),
      intro: or(doc.intro, fallback.intro),
      body: or(doc.body, fallback.body),
    };
  } catch (error) {
    console.error("[content] Sanity legal page fetch failed, serving seed copy", error);
    return fallback;
  }
});
