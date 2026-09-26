import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { BookPurchase as BookPurchaseContent } from "@/content/book";

/**
 * Where the money is spent.
 *
 * The slate band is the page's loudest surface and it is used once, here -
 * the section that asks for the decision should look different from the ones
 * that led up to it. The price is stated rather than hidden behind the click.
 */
export function BookPurchase({ data }: { data: BookPurchaseContent }) {
  return (
    <section id="buy" aria-labelledby="buy-title" className="on-dark bg-slate section text-on-dark">
      <div className="shell grid items-center gap-10 lg:grid-cols-[1fr_0.7fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="buy-title" className="mt-3 text-3xl text-white md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-on-dark-muted md:text-xl">{data.lead}</p>

          {data.formats.length > 0 && (
            <ul className="mt-8 space-y-3">
              {data.formats.map((format) => (
                <li key={format} className="flex items-start gap-3">
                  <Check className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-lg text-on-dark-muted">{format}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <Reveal delay={120} className="rounded-3xl bg-white/10 p-7 text-center sm:p-9">
          {data.price && (
            <p className="text-4xl text-white md:text-5xl">
              {data.price}
              <span className="sr-only"> מחיר הספר</span>
            </p>
          )}
          {/* An outbound payment page: new tab, and said out loud for anyone
              who cannot see the tab open. */}
          <a
            href={data.buyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-6 w-full px-8 py-4 text-base"
          >
            {data.buyLabel}
            <span className="sr-only"> (נפתח בחלון חדש)</span>
          </a>
          {data.note && <p className="mt-4 text-sm text-on-dark-muted">{data.note}</p>}
        </Reveal>
      </div>
    </section>
  );
}
