"use client";

import { Download } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import type { Resource } from "@/content/types";

/**
 * The shelf under the guide: things a reader can simply take.
 *
 * The guide above this one is sent by email, because someone who types an
 * address is someone Efrat can help. These are not that - they open on the
 * click, with no form in the way, which is also what makes them worth
 * something in search: a file behind a door is a door, not a page.
 *
 * With one guide the whole section centres and the card is a wide, shallow
 * band; a lone tall card ranged to one edge read as something unfinished.
 * From two onwards it becomes an ordinary grid and the text goes back to the
 * margin, which is where a list belongs.
 */
export function GuideDownloads({ items }: { items: Resource[] }) {
  if (items.length === 0) return null;
  const alone = items.length === 1;

  return (
    <section
      id="downloads"
      aria-labelledby="downloads-title"
      className="bg-cream-50 pt-8 pb-12 md:pt-10 md:pb-16"
    >
      <div className="shell">
        <Reveal className={alone ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
          <h2 id="downloads-title" className="text-2xl text-slate md:text-3xl">
            מדריכים נוספים להורדה
          </h2>
          <p className="mt-2 text-lg text-muted">
            בלי להשאיר פרטים ובלי הרשמה. לוחצים, והמדריך נפתח.
          </p>
        </Reveal>

        <ul
          className={
            alone
              ? "mx-auto mt-6 max-w-3xl"
              : "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {items.map((item, index) => (
            <li key={item.slug}>
              <Reveal delay={index * 90} className="h-full">
                <a
                  href={`/guides/${item.slug}`}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("resource_download", { guide: item.slug })}
                  /* A row once there is width for one. On a phone three
                     things side by side left the description in a column
                     four words wide, so it stacks. */
                  className={`group flex h-full gap-4 rounded-2xl border border-cream-200 bg-white px-6 py-5 transition-colors hover:border-slate ${
                    alone ? "flex-col sm:flex-row sm:items-center sm:gap-5" : "flex-col"
                  }`}
                >
                  <Download
                    className="size-6 shrink-0 text-accent-ink sm:mt-0.5"
                    aria-hidden="true"
                  />
                  <span className={alone ? "flex-1 text-start" : ""}>
                    <span className="block text-xl text-slate">{item.title}</span>
                    <span className="mt-1 block leading-relaxed text-muted">
                      {item.description}
                    </span>
                  </span>
                  <span className="shrink-0 text-base text-accent-ink group-hover:underline">
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
