/**
 * Pushes the seed content from /content into Sanity, so Efrat opens the Studio
 * to a full site rather than an empty one.
 *
 *   1. copy .env.example -> .env.local and fill NEXT_PUBLIC_SANITY_PROJECT_ID
 *      plus SANITY_API_WRITE_TOKEN (Editor role)
 *   2. npm run seed
 *
 * Safe to re-run. Every document has a fixed _id, and by default one that
 * already exists is left exactly as it is — which matters now that Efrat is
 * editing in the Studio: a re-run to add new sections must not quietly undo
 * her afternoon. `npm run seed -- --replace` is the old behaviour, and it
 * overwrites everything.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";
import { defaultContent } from "../content/defaults.ts";
import { legalPages } from "../content/legal.ts";
import { site } from "../lib/site.ts";
import type { Img } from "../content/types.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "חסרים משתני סביבה. נדרשים NEXT_PUBLIC_SANITY_PROJECT_ID ו-SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01",
  useCdn: false,
});

/** Overwrite documents that already exist. Off unless asked for. */
const replace = process.argv.includes("--replace");

const uploaded = new Map<string, string>();

async function uploadImage(image: Img) {
  const cached = uploaded.get(image.src);
  if (cached) return { _type: "image", asset: { _type: "reference", _ref: cached }, alt: image.alt };

  const filePath = path.join(process.cwd(), "public", image.src);
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(image.src),
  });
  uploaded.set(image.src, asset._id);
  console.log(`  ↑ ${image.src}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt: image.alt };
}

async function run() {
  const c = defaultContent;
  const docs: Record<string, unknown>[] = [];

  /* The section headings used to live together in one "sectionCopy" document.
     They now sit on the sections themselves. If that old document is still in
     the dataset it is read first, so anything Efrat already rewrote there
     carries over instead of being reset to the seed copy. */
  const old = (await client
    .fetch<Record<string, string> | null>(`*[_id == "sectionCopy"][0]`)
    .catch(() => null)) ?? {};
  const kept = (value: string | undefined, fallback: string | undefined) => value || fallback;

  console.log("מעלה תמונות…");

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    name: site.name,
    tagline: site.tagline,
    phoneDisplay: site.phoneDisplay,
    phoneE164: site.phoneE164,
    email: site.email,
    whatsappNumber: site.whatsappNumber,
    whatsappMessage: site.whatsappMessage,
    instagram: site.social.instagram,
    linkedin: site.social.linkedin,
    footerLine: site.footerLine,
    footerNote: site.footerNote,
  });

  docs.push({
    _id: "hero",
    _type: "hero",
    eyebrow: c.hero.eyebrow,
    title: c.hero.title,
    subtitle: c.hero.subtitle,
    ctaLabel: c.hero.ctaLabel,
    ctaHref: c.hero.ctaHref,
    ctaSecondaryLabel: c.hero.ctaSecondaryLabel,
    ctaSecondaryHref: c.hero.ctaSecondaryHref,
    image: await uploadImage(c.hero.image),
  });

  if (c.recognise) {
    docs.push({
      _id: "recognise",
      _type: "recognise",
      eyebrow: c.recognise.eyebrow,
      title: c.recognise.title,
      lead: c.recognise.lead,
      timelineLabel: c.recognise.timelineLabel,
      items: c.recognise.items.map((item, index) => ({ _key: `moment${index}`, ...item })),
      closer: c.recognise.closer,
    });
  }

  docs.push({
    _id: "approach",
    _type: "approach",
    eyebrow: c.approach.eyebrow,
    title: c.approach.title,
    lead: c.approach.lead,
    cards: c.approach.cards.map((card, index) => ({ _key: `card${index}`, ...card })),
    quote: c.approach.quote,
    quoteAuthor: c.approach.quoteAuthor,
  });

  docs.push({
    _id: "about",
    _type: "about",
    eyebrow: c.about.eyebrow,
    title: c.about.title,
    paragraphs: c.about.paragraphs,
    portrait: await uploadImage(c.about.portrait),
    badgeValue: c.about.badgeValue,
    badgeLabel: c.about.badgeLabel,
    points: c.about.points,
  });

  docs.push({
    _id: "servicesSection",
    _type: "servicesSection",
    eyebrow: kept(old.servicesEyebrow, c.services.eyebrow),
    title: kept(old.servicesTitle, c.services.title),
    lead: c.services.lead,
  });

  c.services.services.forEach((service, index) => {
    docs.push({
      _id: service.id,
      _type: "service",
      slug: { _type: "slug", current: service.id },
      icon: service.icon,
      kicker: service.kicker,
      title: service.title,
      body: service.body,
      bullets: service.bullets,
      price: service.price,
      note: service.note,
      ctaLabel: service.ctaLabel,
      ctaHref: service.ctaHref,
      variant: service.variant,
      moreLabel: service.moreLabel,
      details: service.details,
      order: index + 1,
    });
  });

  if (c.testimonials) {
    docs.push({
      _id: "testimonials",
      _type: "testimonials",
      eyebrow: c.testimonials.eyebrow,
      title: c.testimonials.title,
      items: c.testimonials.items.map((item, index) => ({ _key: `voice${index}`, ...item })),
    });
  }

  docs.push({
    _id: "mediaSection",
    _type: "mediaSection",
    eyebrow: kept(old.mediaEyebrow, c.media.eyebrow),
    title: kept(old.mediaTitle, c.media.title),
    lead: kept(old.mediaLead, c.media.lead),
  });

  docs.push({
    _id: "articlesSection",
    _type: "articlesSection",
    eyebrow: kept(old.articlesEyebrow, c.articles.eyebrow),
    title: kept(old.articlesTitle, c.articles.title),
  });

  for (const article of c.articles.articles) {
    docs.push({
      _id: `article-${article.slug}`,
      _type: "article",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      date: article.date,
      excerpt: article.excerpt,
      image: await uploadImage(article.image),
      readingMinutes: article.readingMinutes,
      body: article.body,
    });
  }

  for (const [index, item] of c.media.items.entries()) {
    docs.push({
      _id: `mediaItem-${index + 1}`,
      _type: "mediaItem",
      kind: item.kind,
      title: item.title,
      outlet: item.outlet,
      date: item.date,
      summary: item.summary,
      poster: await uploadImage(item.poster),
      youtubeId: item.youtubeId,
      href: item.href,
      order: index + 1,
    });
  }

  docs.push({
    _id: "guide",
    _type: "guide",
    eyebrow: c.guide.eyebrow,
    title: c.guide.title,
    lead: c.guide.lead,
    bullets: c.guide.bullets,
    consentLabel: c.guide.consentLabel,
    submitLabel: c.guide.submitLabel,
  });

  docs.push({
    _id: "faqSection",
    _type: "faqSection",
    eyebrow: kept(old.faqEyebrow, c.faq.eyebrow),
    title: kept(old.faqTitle, c.faq.title),
    lead: kept(old.faqLead, c.faq.lead),
  });

  c.faq.items.forEach((item, index) => {
    docs.push({
      _id: `faqItem-${index + 1}`,
      _type: "faqItem",
      question: item.question,
      answer: item.answer,
      order: index + 1,
    });
  });

  if (c.notHere) {
    docs.push({
      _id: "notHere",
      _type: "notHere",
      eyebrow: c.notHere.eyebrow,
      title: c.notHere.title,
      items: c.notHere.items.map((item, index) => ({ _key: `not${index}`, ...item })),
    });
  }

  docs.push({
    _id: "contactSection",
    _type: "contactSection",
    eyebrow: kept(old.contactEyebrow, c.contact.eyebrow),
    title: kept(old.contactTitle, c.contact.title),
    lead: kept(old.contactLead, c.contact.lead),
    consentLabel: kept(old.consentLabel, c.contact.consentLabel),
  });

  for (const page of Object.values(legalPages)) {
    docs.push({
      _id: `legal-${page.slug}`,
      _type: "legalPage",
      slug: page.slug,
      title: page.title,
      updatedAt: page.updatedAt,
      intro: page.intro,
      body: page.body,
      description: page.description,
    });
  }

  console.log(
    replace
      ? `כותב ${docs.length} מסמכים ודורס תוכן קיים…`
      : `כותב ${docs.length} מסמכים — קיימים לא ייגעו…`,
  );
  const tx = docs.reduce(
    (transaction, doc) =>
      replace ? transaction.createOrReplace(doc as never) : transaction.createIfNotExists(doc as never),
    client.transaction(),
  );
  await tx.commit();

  // Its contents have been carried into the section documents above.
  await client.delete("sectionCopy").catch(() => {});

  console.log("הסתיים. אפשר להיכנס ל-/studio.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
