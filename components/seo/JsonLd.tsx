import { site, siteUrl } from "@/lib/site";
import type { Article, Book, FaqItem, MediaItem, Service } from "@/content/types";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Content is authored by us, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const PERSON_ID = `${siteUrl}/#person`;
const BUSINESS_ID = `${siteUrl}/#business`;
const WEBSITE_ID = `${siteUrl}/#website`;

/**
 * Site-wide graph: who Efrat is, what the practice is, and what the site is.
 * Rendered once in the root layout so every page carries it.
 */
export function OrganizationJsonLd() {
  const sameAs = [site.social.instagram, site.social.facebook].filter(Boolean);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": PERSON_ID,
            name: site.name,
            jobTitle: site.jobTitle,
            description: site.description,
            url: siteUrl,
            email: `mailto:${site.email}`,
            telephone: site.phoneE164,
            knowsLanguage: ["he"],
            knowsAbout: [
              "הורות מותאמת",
              "ילדים על הרצף האוטיסטי",
              "ייעוץ הורים",
              "ויסות רגשי",
              "שיתוף פעולה עם מערכת החינוך",
            ],
            ...(sameAs.length ? { sameAs } : {}),
          },
          {
            "@type": "ProfessionalService",
            "@id": BUSINESS_ID,
            name: site.legalName,
            description: site.description,
            url: siteUrl,
            telephone: site.phoneE164,
            email: `mailto:${site.email}`,
            founder: { "@id": PERSON_ID },
            areaServed: { "@type": "Country", name: site.areaServed },
            availableLanguage: "he",
            openingHoursSpecification: site.hoursSpec.map((spec) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: spec.days,
              opens: spec.opens,
              closes: spec.closes,
            })),
            ...(sameAs.length ? { sameAs } : {}),
          },
          {
            "@type": "WebSite",
            "@id": WEBSITE_ID,
            url: siteUrl,
            name: site.name,
            inLanguage: "he",
            publisher: { "@id": PERSON_ID },
          },
        ],
      }}
    />
  );
}

/** A published book is a strong entity signal for both Google and AI answers. */
export function BookJsonLd({ book }: { book: Book }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Book",
        name: book.title,
        alternativeHeadline: book.subtitle,
        description: book.blurb,
        inLanguage: "he",
        author: { "@id": PERSON_ID },
        image: `${siteUrl}${book.cover.src}`,
        ...(book.buyHref ? { offers: { "@type": "Offer", url: book.buyHref } } : {}),
      }}
    />
  );
}

export function MediaJsonLd({ items }: { items: MediaItem[] }) {
  const videos = items.filter((item) => item.youtubeId);
  if (videos.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": videos.map((item) => ({
          "@type": "VideoObject",
          name: item.title,
          description: item.summary,
          thumbnailUrl: `${siteUrl}${item.poster.src}`,
          embedUrl: `https://www.youtube.com/embed/${item.youtubeId}`,
          ...(item.date ? { uploadDate: item.date } : {}),
          publisher: { "@id": PERSON_ID },
        })),
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: "he",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

export function ServicesJsonLd({ services }: { services: Service[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": services.map((service) => ({
          "@type": "Service",
          name: service.title,
          serviceType: service.kicker,
          description: service.body,
          url: `${siteUrl}/#${service.id}`,
          provider: { "@id": PERSON_ID },
          areaServed: { "@type": "Country", name: site.areaServed },
        })),
      }}
    />
  );
}

export function ArticleJsonLd({ article }: { article: Article }) {
  const url = `${siteUrl}/articles/${article.slug}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            inLanguage: "he",
            datePublished: article.date,
            dateModified: article.date,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            image: [`${siteUrl}${article.image.src}`],
            author: { "@id": PERSON_ID },
            publisher: { "@id": PERSON_ID },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "דף הבית", item: siteUrl },
              { "@type": "ListItem", position: 2, name: "מאמרים", item: `${siteUrl}/#articles` },
              { "@type": "ListItem", position: 3, name: article.title, item: url },
            ],
          },
        ],
      }}
    />
  );
}
