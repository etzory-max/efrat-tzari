"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { ArticlesSection } from "@/content/types";

/** See About: the band colour belongs to the page order, not the section. */
export function Articles({ data, tone = "deep" }: { data: ArticlesSection; tone?: "light" | "deep" }) {
  const railRef = useRef<HTMLUListElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    // In RTL the scroll axis is inverted; multiplying keeps "next" intuitive.
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section
      id="articles"
      aria-labelledby="articles-title"
      className={`${tone === "deep" ? "bg-cream-100" : "bg-cream-50"} section`}
    >
      <div className="shell">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 id="articles-title" className="mt-3 text-3xl text-slate md:text-5xl">
              {data.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="tap inline-flex items-center justify-center rounded-full border border-cream-200 bg-cream-50 text-slate transition-colors hover:border-slate"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
              <span className="sr-only">גלילת המאמרים אחורה</span>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="tap inline-flex items-center justify-center rounded-full border border-cream-200 bg-cream-50 text-slate transition-colors hover:border-slate"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
              <span className="sr-only">גלילת המאמרים קדימה</span>
            </button>
          </div>
        </Reveal>

        <ul
          ref={railRef}
          tabIndex={0}
          aria-label="רשימת מאמרים - ניתן לגלול לצדדים"
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        >
          {data.articles.map((article, index) => (
            <li
              key={article.slug}
              className="w-[min(20rem,80vw)] shrink-0 snap-start sm:w-[19rem]"
            >
              <Reveal delay={index * 90} className="h-full">
              <article className="group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(44,50,56,0.10)] focus-within:outline focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-slate">
                <div className="relative aspect-16/10">
                  <Image
                    src={article.image.src}
                    alt={article.image.alt}
                    fill
                    sizes="(max-width: 640px) 80vw, 320px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {/* The date and the reading time are kept in the data — they
                      feed the Article structured data — but they are not shown.
                      A date ages a piece that is not news. */}
                  <h3 className="text-xl text-slate transition-colors group-hover/card:text-accent-ink">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="outline-none after:absolute after:inset-0 after:content-['']"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-lg text-muted">{article.excerpt}</p>

                  {/* A quiet "there is more inside". Not a button — the whole
                      card is already the link — so it stays decorative and out
                      of the accessibility tree, and it leans in on hover
                      rather than announcing itself at rest. */}
                  <span
                    aria-hidden="true"
                    className="mt-auto flex items-center gap-2 pt-5 text-base text-accent-ink"
                  >
                    לקריאה
                    <ArrowLeft className="size-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover/card:-translate-x-1" />
                  </span>
                </div>
              </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
