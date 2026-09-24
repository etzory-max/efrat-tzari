import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { BookHero as BookHeroContent } from "@/content/book";

/**
 * The book, first thing.
 *
 * The home page opens on a photograph because the reader has to recognise
 * herself before anything is offered. Here she already knows what she came
 * for, so the object itself opens the page: the cover at a size worth
 * looking at, one sentence, and the two things she might do next.
 */
export function BookHero({ data }: { data: BookHeroContent }) {
  return (
    <section aria-labelledby="book-hero-title" className="bg-cream-100 pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="shell grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
        <Reveal immediate>
          <h1 id="book-hero-title" className="text-slate">
            <span className="eyebrow mb-4">{data.eyebrow}</span>
            <span className="block text-[2rem] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl">
              {data.title}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted md:text-xl">{data.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={data.buyHref} className="btn btn-primary px-8 py-4 text-base">
              {data.buyLabel}
            </Link>
            <Link
              href={data.readHref}
              className="btn border border-slate/35 px-7 py-4 text-base text-slate transition-colors hover:border-slate hover:bg-slate hover:text-white"
            >
              {data.readLabel}
            </Link>
          </div>
        </Reveal>

        {/* The cover is a physical object, so it gets a shadow and a slight
            lift rather than a frame - a rounded card around a printed cover
            would read as a second, competing edge. */}
        <Reveal delay={120} className="order-first mx-auto w-full max-w-xs lg:order-none lg:max-w-sm">
          <Image
            src={data.cover.src}
            alt={data.cover.alt}
            width={439}
            height={799}
            priority
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 70vw"
            className="mx-auto h-auto w-full max-w-[17rem] drop-shadow-[0_18px_40px_rgba(44,50,56,0.22)] lg:max-w-none"
          />
        </Reveal>
      </div>
    </section>
  );
}
