"use client";

import { Download } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import type { Resource } from "@/content/types";

/**
 * The shelf under the guide: things a reader can simply take.
 *
 * The guide above this one is sent by email, because a reader who wants it
 * enough to type an address is someone Efrat can help. These are not that.
 * They open on the click, with no form in the way - which is also what makes
 * them worth anything to a search engine, since a file behind a door is a
 * door, not a page.
 *
 * It hides itself when the shelf is empty, so adding the second guide is one
 * document in the Studio and nothing here.
 */
export function GuideDownloads({ items }: { items: Resource[] }) {
  if (items.length === 0) return null;

  return (
    <section
      id="downloads"
      aria-labelledby="downloads-title"
      className="bg-cream-50 pt-14 pb-16 md:pt-16 md:pb-20"
    >
      <div className="shell">
        <Reveal className="max-w-2xl">
          <h2 id="downloads-title" className="text-2xl text-slate md:text-3xl">
            מדריכים נוספים להורדה
          </h2>
          <p className="mt-3 text-lg text-muted">
            בלי להשאיר פרטים ובלי הרשמה. לוחצים, והמדריך נפתח.
          </p>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.slug}>
              <Reveal delay={index * 90} className="h-full">
                <a
                  href={`/guides/${item.slug}`}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("resource_download", { guide: item.slug })}
                  className="flex h-full flex-col rounded-3xl border border-cream-200 bg-white p-6 transition-colors hover:border-slate"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="text-xl text-slate">{item.title}</span>
                    <Download className="mt-1 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  </span>
                  {item.meta && <span className="mt-1 text-sm text-muted">{item.meta}</span>}
                  <span className="mt-3 leading-relaxed text-muted">{item.description}</span>
                  <span className="mt-5 text-base text-accent-ink">
                    להורדה
                    <span className="sr-only"> של {item.title} (נפתח בלשונית חדשה)</span>
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
