import { Heart, Leaf, Quote, Star } from "lucide-react";
import type { ApproachSection } from "@/content/types";

const icons = { heart: Heart, star: Star, leaf: Leaf } as const;

export function Approach({ data }: { data: ApproachSection }) {
  return (
    <section id="approach" aria-labelledby="approach-title" className="bg-cream-100 py-20 md:py-28">
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="approach-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-lg text-muted">{data.lead}</p>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {data.cards.map((card) => {
            const Icon = icons[card.icon];
            return (
              <li
                key={card.title}
                className="rounded-2xl border border-cream-200 bg-cream-50 p-6 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(44,50,56,0.08)] lg:p-8"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-slate/10 text-slate">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl text-slate">{card.title}</h3>
                <p className="mt-3 text-muted">{card.body}</p>
              </li>
            );
          })}
        </ul>

        <figure className="on-dark mt-14 rounded-3xl bg-dark px-8 py-12 text-center md:px-16">
          <Quote className="mx-auto size-8 text-sage" aria-hidden="true" />
          <blockquote className="mt-5 text-xl leading-relaxed text-on-dark md:text-2xl">
            <p>{data.quote}</p>
          </blockquote>
          <figcaption className="mt-5 text-sm text-on-dark-muted">— {data.quoteAuthor}</figcaption>
        </figure>
      </div>
    </section>
  );
}
