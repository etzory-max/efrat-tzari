import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { proseInChapter } from "@/components/ui/PortableProse";
import { Reveal } from "@/components/ui/Reveal";
import type { BookChapter as BookChapterContent } from "@/content/book";

/**
 * The first chapter, given away.
 *
 * Not a download and not a form: the text is on the page, at article width
 * and article measure, so a reader can start reading in the second she
 * arrives. What convinces someone to buy a book is having read some of it.
 */
export function BookChapter({ data }: { data: BookChapterContent }) {
  return (
    <section id="chapter" aria-labelledby="chapter-title" className="bg-cream-100 section">
      <div className="shell max-w-3xl">
        <Reveal>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="chapter-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-xl text-muted">{data.lead}</p>
        </Reveal>

        {/* White paper under the text: at this length the cream band stops
            being a surface and starts being a page, and a page should look
            like one. */}
        <Reveal delay={120} className="mt-10 rounded-3xl bg-white p-7 text-lg text-muted sm:p-10 md:p-12">
          <PortableText value={data.body} components={proseInChapter} />

          <p className="mt-10 border-t border-cream-200 pt-8 text-xl text-ink">{data.closer}</p>
          <Link href={data.ctaHref} className="btn btn-primary mt-6 px-8 py-4 text-base">
            {data.ctaLabel}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
