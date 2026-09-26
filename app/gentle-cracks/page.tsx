import type { Metadata } from "next";
import { getBookPage } from "@/lib/book";
import { getContent, getSiteSettings } from "@/lib/content";
import { BookHero } from "@/components/sections/book/BookHero";
import { BookAbout } from "@/components/sections/book/BookAbout";
import { BookChapter } from "@/components/sections/book/BookChapter";
import { BookPurchase } from "@/components/sections/book/BookPurchase";
import { BookOfferings } from "@/components/sections/book/BookOfferings";
import { BookDedication } from "@/components/sections/book/BookDedication";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Media } from "@/components/sections/Media";
import { BookContact } from "@/components/sections/book/BookContact";
import { BookJsonLd } from "@/components/seo/JsonLd";

/**
 * The book's own page.
 *
 * Nothing in the site's menu points here: it is a page to be linked to
 * directly, by a publisher, an interviewer or a post. It shares the shell,
 * the palette and half the sections with the home page, and tells a
 * different story with them - the personal one, ending at the book.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { meta, about } = await getBookPage();

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: "/gentle-cracks" },
    openGraph: {
      type: "book",
      title: meta.title,
      description: meta.description,
      url: "/gentle-cracks",
      images: [{ url: about.cover.src, alt: about.cover.alt }],
    },
  };
}

export default async function BookPage() {
  const [book, content, settings] = await Promise.all([
    getBookPage(),
    getContent(),
    getSiteSettings(),
  ]);

  return (
    <>
      <BookHero data={book.hero} />
      {/* The story before the object: who is writing, and out of what. */}
      <About data={book.story} tone="deep" />
      <BookAbout data={book.about} />
      <BookChapter data={book.chapter} />
      <BookPurchase data={book.purchase} />
      <Testimonials data={book.testimonials} surface="wash" />
      <BookOfferings data={book.offerings} />
      {/* The same press items as the home page - one list, maintained once. */}
      <Media data={content.media} tone="light" />
      <BookContact data={book.contact} settings={settings} />
      <BookDedication data={book.dedication} />

      <BookJsonLd
        book={{
          title: book.about.title,
          subtitle: book.hero.subtitle,
          blurb: book.about.lead,
          cover: book.about.cover,
          buyLabel: book.purchase.buyLabel,
          buyHref: book.purchase.buyHref,
        }}
      />
    </>
  );
}
