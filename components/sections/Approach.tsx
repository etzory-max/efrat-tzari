import { Heart, Leaf, Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { ApproachSection } from "@/content/types";

const icons = { heart: Heart, star: Star, leaf: Leaf } as const;

export function Approach({ data }: { data: ApproachSection }) {
  return (
    <section id="approach" aria-labelledby="approach-title" className="bg-cream-100 py-20 md:py-28">
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="approach-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-lg text-muted">{data.lead}</p>
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {data.cards.map((card, index) => {
            const Icon = icons[card.icon];
            return (
              <li key={card.title}>
                {/* Colour lives in the block, not the section behind it.
                    Everything on it is ink — slate would be 2.9:1 here. */}
                <Reveal
                  delay={index * 110}
                  className="on-accent h-full rounded-2xl bg-accent p-6 transition-shadow duration-300 hover:shadow-[0_10px_34px_rgba(44,50,56,0.16)] lg:p-8"
                >
                  <Icon className="size-10 text-white" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-5 text-xl text-white">{card.title}</h3>
                  <p className="mt-3 text-white">{card.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* Slate, not the near-black — that tone is now the footer's alone. */}
        <Reveal className="mt-14">
          <figure className="on-dark rounded-3xl bg-slate px-8 py-12 text-center md:px-16">
            <Quote className="mx-auto size-8 text-accent-light" aria-hidden="true" />
            <blockquote className="mt-5 text-xl leading-relaxed text-white md:text-2xl">
              <p>{data.quote}</p>
            </blockquote>
            <figcaption className="mt-5 text-sm text-accent-light">— {data.quoteAuthor}</figcaption>
          </figure>
        </Reveal>

        {/* TODO(efrat): a row of illustrations closes this section — the
            slot is ready, waiting on the real artwork. */}
      </div>
    </section>
  );
}
