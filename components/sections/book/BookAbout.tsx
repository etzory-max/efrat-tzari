import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { BookAbout as BookAboutContent } from "@/content/book";

/**
 * What the book is, beside a cover big enough to read the title off.
 *
 * The list borrows the About section's checks rather than inventing a second
 * way to say "here is what is inside" - the same page should not have two.
 */
export function BookAbout({ data }: { data: BookAboutContent }) {
  return (
    <section id="book" aria-labelledby="book-title" className="bg-cream-50 section">
      <div className="shell grid items-start gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
        <Reveal className="mx-auto w-full max-w-sm lg:sticky lg:top-28">
          <Image
            src={data.cover.src}
            alt={data.cover.alt}
            width={439}
            height={799}
            sizes="(min-width: 1024px) 24rem, 80vw"
            className="mx-auto h-auto w-full drop-shadow-[0_18px_40px_rgba(44,50,56,0.22)]"
          />
        </Reveal>

        <Reveal delay={120}>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="book-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-xl text-muted">{data.lead}</p>

          <div className="mt-6 space-y-5 text-lg text-muted">
            {data.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {data.bullets.length > 0 && (
            <ul className="mt-10 space-y-4 border-t border-cream-200 pt-8">
              {data.bullets.map((bullet, index) => (
                <li key={bullet}>
                  <Reveal delay={200 + index * 80} className="flex items-start gap-3">
                    <Check className="mt-1 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                    <span className="text-lg text-muted">{bullet}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
