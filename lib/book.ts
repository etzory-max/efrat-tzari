import { cache } from "react";
import { sanityClient, urlFor } from "@/sanity/client";
import { sanityConfigured } from "@/sanity/env";
import { defaultBookPage, type BookPageContent } from "@/content/book";
import type { Img } from "@/content/types";

/**
 * The book page's content, one round trip, with the seed copy underneath.
 *
 * Same contract as lib/content.ts: a missing document, an empty field or a
 * Sanity outage all fall back to what content/book.ts says, so the page can
 * never render half-built.
 */

type SanityImage = { asset?: unknown; alt?: string } | null | undefined;

const toImg = (image: SanityImage, fallback: Img, width: number): Img => {
  if (!image?.asset) return fallback;
  const src = urlFor(image as never, width);
  return src ? { src, alt: image.alt ?? fallback.alt } : fallback;
};

const or = <T,>(value: T | null | undefined, fallback: T): T =>
  value === null || value === undefined || (Array.isArray(value) && value.length === 0)
    ? fallback
    : value;

const QUERY = /* groq */ `{
  "meta": *[_type == "bookMeta"][0] { title, description },
  "hero": *[_type == "bookHero"][0] {
    eyebrow, title, subtitle, buyLabel, buyHref, readLabel, readHref, cover
  },
  "story": *[_type == "bookStory"][0] {
    eyebrow, title, paragraphs, highlight, portrait, badgeValue, badgeLabel, points
  },
  "about": *[_type == "bookAbout"][0] { eyebrow, title, lead, paragraphs, bullets, cover },
  "chapter": *[_type == "bookChapter"][0] {
    eyebrow, title, lead, body, closer, ctaLabel, ctaHref
  },
  "purchase": *[_type == "bookPurchase"][0] {
    eyebrow, title, lead, price, formats, buyLabel, buyHref, note
  },
  "testimonials": *[_type == "bookTestimonials"][0] {
    eyebrow, title, items[] { quote, name, role }
  },
  "offerings": *[_type == "bookOfferings"][0] {
    eyebrow, title, lead, items[] { title, body }
  },
  "contact": *[_type == "bookContact"][0] { eyebrow, title, lead, consentLabel },
  "dedication": *[_type == "bookDedication"][0] { label, body }
}`;

export const getBookPage = cache(async function fetchBookPage(): Promise<BookPageContent> {
  if (!sanityConfigured || !sanityClient) return defaultBookPage;

  try {
    const data = await sanityClient.fetch<Record<string, never>>(
      QUERY,
      {},
      { next: { revalidate: 60, tags: ["content"] } },
    );
    return merge(data);
  } catch (error) {
    console.error("[book] Sanity fetch failed, serving seed content", error);
    return defaultBookPage;
  }
});

function merge(data: any): BookPageContent {
  const d = defaultBookPage;

  return {
    meta: {
      title: or(data?.meta?.title, d.meta.title),
      description: or(data?.meta?.description, d.meta.description),
    },

    hero: {
      eyebrow: or(data?.hero?.eyebrow, d.hero.eyebrow),
      title: or(data?.hero?.title, d.hero.title),
      subtitle: or(data?.hero?.subtitle, d.hero.subtitle),
      buyLabel: or(data?.hero?.buyLabel, d.hero.buyLabel),
      buyHref: or(data?.hero?.buyHref, d.hero.buyHref),
      readLabel: or(data?.hero?.readLabel, d.hero.readLabel),
      readHref: or(data?.hero?.readHref, d.hero.readHref),
      cover: toImg(data?.hero?.cover, d.hero.cover, 900),
    },

    story: {
      eyebrow: or(data?.story?.eyebrow, d.story.eyebrow),
      title: or(data?.story?.title, d.story.title),
      paragraphs: or(data?.story?.paragraphs, d.story.paragraphs),
      /* The Studio counts paragraphs from 1, the component from 0: asking an
         editor for "paragraph 0" would be a small cruelty. */
      highlight:
        typeof data?.story?.highlight === "number"
          ? data.story.highlight - 1
          : d.story.highlight,
      portrait: toImg(data?.story?.portrait, d.story.portrait, 1000),
      badgeValue: or(data?.story?.badgeValue, d.story.badgeValue),
      badgeLabel: or(data?.story?.badgeLabel, d.story.badgeLabel),
      points: or(data?.story?.points, d.story.points),
    },

    about: {
      eyebrow: or(data?.about?.eyebrow, d.about.eyebrow),
      title: or(data?.about?.title, d.about.title),
      lead: or(data?.about?.lead, d.about.lead),
      paragraphs: or(data?.about?.paragraphs, d.about.paragraphs),
      bullets: or(data?.about?.bullets, d.about.bullets),
      cover: toImg(data?.about?.cover, d.about.cover, 900),
    },

    chapter: {
      eyebrow: or(data?.chapter?.eyebrow, d.chapter.eyebrow),
      title: or(data?.chapter?.title, d.chapter.title),
      lead: or(data?.chapter?.lead, d.chapter.lead),
      body: or(data?.chapter?.body, d.chapter.body),
      closer: or(data?.chapter?.closer, d.chapter.closer),
      ctaLabel: or(data?.chapter?.ctaLabel, d.chapter.ctaLabel),
      ctaHref: or(data?.chapter?.ctaHref, d.chapter.ctaHref),
    },

    purchase: {
      eyebrow: or(data?.purchase?.eyebrow, d.purchase.eyebrow),
      title: or(data?.purchase?.title, d.purchase.title),
      lead: or(data?.purchase?.lead, d.purchase.lead),
      price: or(data?.purchase?.price, d.purchase.price),
      formats: or(data?.purchase?.formats, d.purchase.formats),
      buyLabel: or(data?.purchase?.buyLabel, d.purchase.buyLabel),
      buyHref: or(data?.purchase?.buyHref, d.purchase.buyHref),
      note: or(data?.purchase?.note, d.purchase.note),
    },

    testimonials: {
      eyebrow: or(data?.testimonials?.eyebrow, d.testimonials.eyebrow),
      title: or(data?.testimonials?.title, d.testimonials.title),
      items: or(data?.testimonials?.items, d.testimonials.items),
    },

    offerings: {
      eyebrow: or(data?.offerings?.eyebrow, d.offerings.eyebrow),
      title: or(data?.offerings?.title, d.offerings.title),
      lead: or(data?.offerings?.lead, d.offerings.lead),
      items: or(data?.offerings?.items, d.offerings.items),
    },

    contact: {
      eyebrow: or(data?.contact?.eyebrow, d.contact.eyebrow),
      title: or(data?.contact?.title, d.contact.title),
      lead: or(data?.contact?.lead, d.contact.lead),
      consentLabel: or(data?.contact?.consentLabel, d.contact.consentLabel),
    },

    dedication: {
      label: or(data?.dedication?.label, d.dedication.label),
      body: or(data?.dedication?.body, d.dedication.body),
    },
  };
}
