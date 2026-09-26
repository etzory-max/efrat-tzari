import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { drawings } from "@/components/art/drawings";
import type { BookHero as BookHeroContent } from "@/content/book";

/**
 * The opening is the voice, not the object.
 *
 * Leading with the cover sold the book to someone who had not yet been given
 * a reason to want it. A few sentences and one of the site's own drawings
 * open instead, and the cover waits for "על הספר", where it is the subject
 * rather than the greeting.
 *
 * Text right, drawing left - and on a phone the text comes first and the
 * drawing lands under it, so the reading leads into the picture.
 */
export function BookHero({ data }: { data: BookHeroContent }) {
  const art = drawings["art-mother-walk"];

  return (
    <section
      aria-labelledby="book-hero-title"
      className="bg-cream-100 pt-12 pb-16 md:pt-20 md:pb-24"
    >
      <div className="shell grid items-center gap-10 lg:grid-cols-[1fr_0.75fr] lg:gap-16">
        <Reveal immediate>
          <h1 id="book-hero-title" className="text-slate">
            <span className="eyebrow mb-4">{data.eyebrow}</span>
            <span className="block text-[2rem] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl">
              {data.title}
            </span>
          </h1>
          {/* Three sentences, each its own paragraph with air around it. Set
              as one block with line breaks they read as a stanza that has to
              be taken in at once; apart, each lands before the next arrives. */}
          <div className="mt-6 max-w-xl space-y-4 text-lg text-muted md:text-xl">
            {data.subtitle.split("\n").map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={data.ctaHref} className="btn btn-primary px-8 py-4 text-base">
              {data.ctaLabel}
            </Link>
            <Link
              href={data.ctaSecondaryHref}
              className="btn border border-slate/35 px-7 py-4 text-base text-slate transition-colors hover:border-slate hover:bg-slate hover:text-white"
            >
              {data.ctaSecondaryLabel}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120} className="mx-auto w-full max-w-xs lg:max-w-sm">
          <Image
            src={art.src}
            alt=""
            width={art.width}
            height={art.height}
            priority
            aria-hidden="true"
            sizes="(min-width: 1024px) 22rem, 60vw"
            className="mx-auto h-auto w-56 sm:w-64 lg:w-full"
          />
        </Reveal>
      </div>
    </section>
  );
}
