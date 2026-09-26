"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { proseInChapter } from "@/components/ui/PortableProse";
import { Reveal } from "@/components/ui/Reveal";
import type { BookChapter as BookChapterContent } from "@/content/book";

/**
 * The first chapter, given away - but not poured down the page.
 *
 * At full length the story was several screens of scrolling before a reader
 * reached anything else, which buries every section under it. So the card
 * opens at about a screenful, fades out at the fold, and continues in place
 * when asked. Nothing is hidden behind a form: the whole text is in the page
 * either way, and the button only decides how much of it is tall.
 *
 * Collapsing scrolls back to the section's own top, because the button that
 * was under your thumb is otherwise a thousand words further down.
 */
export function BookChapter({ data }: { data: BookChapterContent }) {
  const [open, setOpen] = useState(false);
  const section = useRef<HTMLElement>(null);

  const toggle = () => {
    setOpen((was) => {
      if (was) section.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return !was;
    });
  };

  return (
    <section
      ref={section}
      id="chapter"
      aria-labelledby="chapter-title"
      className="bg-cream-100 section scroll-mt-28"
    >
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
            like one. The story is set in the book face at a longer line
            height than the site's own copy - the heading above it stays in
            the site's type, so the change of face is where the website ends
            and the book begins. */}
        <Reveal
          delay={120}
          className="mt-10 rounded-3xl bg-white p-7 font-[family-name:var(--font-book)] text-lg leading-[1.95] text-ink sm:p-10 md:p-12 md:text-[1.2rem]"
        >
          <div
            id="chapter-text"
            className={`relative overflow-hidden transition-[max-height] duration-500 ease-out ${
              open ? "max-h-none" : "max-h-[30rem] md:max-h-[34rem]"
            }`}
          >
            <PortableText value={data.body} components={proseInChapter} />

            {/* The line that ends the excerpt is part of the excerpt: same
                paper, same face, set apart only by size and a rule. */}
            <p className="mt-10 border-t border-cream-200 pt-7 text-center text-base text-muted">
              {data.closer}
            </p>

            {/* The fade says "there is more" without a line across the text.
                White, because it sits on the paper and not on the band. */}
            {!open && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent"
              />
            )}
          </div>

          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="chapter-text"
            className="btn mt-6 w-full border border-slate/30 px-6 py-3.5 font-sans text-base text-slate transition-colors hover:border-slate hover:bg-slate hover:text-white"
          >
            {open ? "לסגור את הפרק" : "להמשיך לקרוא"}
            <ChevronDown
              aria-hidden="true"
              className={`ms-2 size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* Centred under the story rather than ranged to the edge: after a
              column of prose there is no margin for it to belong to. */}
          <p className="mt-8 text-center">
            <Link href={data.ctaHref} className="btn btn-primary px-8 py-4 font-sans text-base">
              {data.ctaLabel}
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
