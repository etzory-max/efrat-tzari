import { Heart, Leaf, Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { ApproachSection } from "@/content/types";

const icons = { heart: Heart, star: Star, leaf: Leaf } as const;

export function Approach({ data }: { data: ApproachSection }) {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="on-accent bg-accent py-20 md:py-28"
    >
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="approach-title" className="mt-3 text-3xl text-ink md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-lg text-ink">{data.lead}</p>
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {data.cards.map((card, index) => {
            const Icon = icons[card.icon];
            return (
              <li key={card.title}>
                <Reveal
                  delay={index * 110}
                  className="h-full rounded-2xl bg-white p-6 transition-shadow duration-300 hover:shadow-[0_10px_34px_rgba(44,50,56,0.14)] lg:p-8"
                >
                  <Icon className="size-10 text-accent-ink" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-5 text-xl text-slate">{card.title}</h3>
                  <p className="mt-3 text-muted">{card.body}</p>
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
      </div>
    </section>
  );
}
