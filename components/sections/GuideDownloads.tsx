"use client";

import { Download } from "lucide-react";
import { AnchorMark } from "@/components/art/AnchorMark";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import type { Resource } from "@/content/types";

/**
 * The shelf under the guide: things a reader can simply take.
 *
 * The guide above is sent by email, because someone who types an address is
 * someone Efrat can help. These are not that - they open on the click, with
 * no form in the way, which is also what makes them worth something in
 * search: a file behind a door is a door, not a page.
 *
 * With one guide on the shelf the section is that guide: its name is the
 * heading, the drawn anchor sits over it, and the card under it carries only
 * what the guide is and the button that opens it - saying the name twice, as
 * heading and card title, said it once too often. From the second guide on,
 * the heading becomes the generic one and each card carries its own name.
 * The anchor goes with that switch: it belongs to this guide, not to a shelf.
 */
export function GuideDownloads({ items }: { items: Resource[] }) {
  if (items.length === 0) return null;
  const alone = items.length === 1;

  return (
    /* Pulled up by about a third of the guide section's own bottom padding -
       enough to close the band of empty cream the two paddings made between
       them, not so much that the shelf sits on the section above it. */
    <section
      id="downloads"
      aria-labelledby="downloads-title"
      className="-mt-5 bg-cream-50 pb-12 md:-mt-7 md:pb-16"
    >
      <div className="shell">
        <Reveal className={alone ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
          {alone && <AnchorMark className="mx-auto mb-3 size-14 text-accent md:size-16" />}
          <h2 id="downloads-title" className="text-2xl text-slate md:text-3xl">
            {alone ? items[0].title : "מדריכים נוספים להורדה"}
          </h2>
          <p className="mt-2 text-lg text-muted">
            בלי להשאיר פרטים ובלי הרשמה. לוחצים, והמדריך נפתח.
          </p>
        </Reveal>

        <ul
          className={
            alone ? "mx-auto mt-7 max-w-3xl" : "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {items.map((item, index) => (
            <li key={item.slug} className="h-full">
              <Reveal delay={index * 90} className="h-full">
                <a
                  href={`/guides/${item.slug}`}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("resource_download", { guide: item.slug })}
                  className={`group flex h-full flex-col gap-5 rounded-2xl border border-cream-200 bg-white p-6 text-start transition-colors hover:border-slate md:p-7 ${
                    alone ? "sm:flex-row sm:items-center sm:gap-8" : ""
                  }`}
                >
                  <span className="flex-1">
                    {!alone && (
                      <span className="mb-2 block text-xl text-slate md:text-2xl">{item.title}</span>
                    )}
                    <span className="block text-lg leading-relaxed text-muted">
                      {item.description}
                    </span>
                  </span>

                  {/* A button, not a word floating at the edge: it is the
                      only thing on the card anyone is meant to press. */}
                  <span
                    className={`btn btn-primary shrink-0 gap-2 px-6 py-3 text-base ${
                      alone ? "" : "mt-auto w-full"
                    }`}
                  >
                    <Download className="size-5" aria-hidden="true" />
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
