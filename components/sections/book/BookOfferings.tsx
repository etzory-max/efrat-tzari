import { Reveal } from "@/components/ui/Reveal";
import type { BookOfferings as BookOfferingsContent } from "@/content/book";

/**
 * The four things she does, beside having written the book.
 *
 * Plain cards, numbered the way the home page numbers its pillars: a reader
 * who arrived for the book is being told what else is on offer, not sold a
 * second time, so nothing here shouts.
 */
export function BookOfferings({ data }: { data: BookOfferingsContent }) {
  return (
    <section id="offerings" aria-labelledby="offerings-title" className="bg-cream-50 section">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="offerings-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-xl text-muted">{data.lead}</p>
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item, index) => (
            <li key={item.title}>
              <Reveal
                delay={index * 90}
                className="h-full rounded-3xl bg-white p-7 shadow-[0_1px_20px_rgba(44,50,56,0.06)]"
              >
                <span aria-hidden="true" className="mb-4 block h-0.5 w-7 bg-accent" />
                <h3 className="text-xl text-slate">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
