/**
 * Pushes the seed content from /content into Sanity, so Efrat opens the Studio
 * to a full site rather than an empty one.
 *
 *   1. copy .env.example -> .env.local and fill NEXT_PUBLIC_SANITY_PROJECT_ID
 *      plus SANITY_API_WRITE_TOKEN (Editor role)
 *   2. npm run seed
 *
 * Safe to re-run: every document has a fixed _id and is created-or-replaced.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";
import { defaultContent } from "../content/defaults.ts";
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

  console.log("מעלה תמונות…");

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    name: "אפרת צרי",
    tagline: "המרחב שלך להורות מותאמת",
    description:
      "אפרת צרי, יועצת משפחתית ומרצה, מלווה משפחות עם ילדים על הרצף האוטיסטי. ליווי משפחתי, הרצאות וסדנאות.",
    logo: await uploadImage({ src: "/images/logo-placeholder.jpg", alt: "הלוגו של אפרת צרי" }),
    phoneDisplay: "050-123-4567",
    phoneE164: "+972501234567",
    email: "efrat@example.com",
    whatsappNumber: "972501234567",
    hours: "ראשון–חמישי, 9:00–19:00",
  });

  docs.push({
    _id: "hero",
    _type: "hero",
    title: c.hero.title,
    subtitle: c.hero.subtitle,
    ctaLabel: c.hero.ctaLabel,
    ctaHref: c.hero.ctaHref,
    image: await uploadImage(c.hero.image),
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
    _id: "approach",
    _type: "approach",
    eyebrow: c.approach.eyebrow,
    title: c.approach.title,
    lead: c.approach.lead,
    cards: c.approach.cards.map((card, index) => ({ _key: `card${index}`, ...card })),
    quote: c.approach.quote,
    quoteAuthor: c.approach.quoteAuthor,
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
      variant: service.variant,
      moreLabel: service.moreLabel,
      details: service.details,
      order: index + 1,
    });
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

  c.faq.items.forEach((item, index) => {
    docs.push({
      _id: `faqItem-${index + 1}`,
      _type: "faqItem",
      question: item.question,
      answer: item.answer,
      order: index + 1,
    });
  });

  docs.push({
    _id: "sectionCopy",
    _type: "sectionCopy",
    servicesEyebrow: c.services.eyebrow,
    servicesTitle: c.services.title,
    mediaEyebrow: c.media.eyebrow,
    mediaTitle: c.media.title,
    mediaLead: c.media.lead,
    articlesEyebrow: c.articles.eyebrow,
    articlesTitle: c.articles.title,
    faqEyebrow: c.faq.eyebrow,
    faqTitle: c.faq.title,
    faqLead: c.faq.lead,
    contactEyebrow: c.contact.eyebrow,
    contactTitle: c.contact.title,
    contactLead: c.contact.lead,
    consentLabel: c.contact.consentLabel,
  });

  console.log(`כותב ${docs.length} מסמכים…`);
  const tx = docs.reduce((transaction, doc) => transaction.createOrReplace(doc as never), client.transaction());
  await tx.commit();
  console.log("הסתיים. אפשר להיכנס ל-/studio.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
