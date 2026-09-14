import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { HouseholdRhythm, ShiftOfView, SteadyAnchor } from "@/components/art/ApproachIcons";
import type { ApproachSection } from "@/content/types";

/* The drawn line icons, in their white variant — the cards are terracotta. */
const icons = {
  heart: { src: "/images/icon-whole-child-light.png", w: 754, h: 715 },
  star: { src: "/images/icon-home-tools-light.png", w: 788, h: 811 },
  leaf: { src: "/images/icon-continuous-light.png", w: 919, h: 792 },
} as const;

/* Drawn inline instead, so they inherit the card's text colour. */
const drawn = {
  shift: ShiftOfView,
  household: HouseholdRhythm,
  anchor: SteadyAnchor,
} as const;

/**
 * `numbered` is for copy whose heading claims an order ("three pillars, in
 * this order"). It switches the list to an <ol> as well as drawing the
 * figures, so the sequence is carried by the markup and not only by the ink.
 */
export function Approach({
  data,
  numbered = false,
  tone = "deep",
}: {
  data: ApproachSection;
  numbered?: boolean;
  /** See the note on About: the band colour belongs to the page order. */
  tone?: "light" | "deep";
}) {
  const List = numbered ? "ol" : "ul";

  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className={`overflow-hidden ${tone === "deep" ? "bg-cream-100" : "bg-cream-50"} section`}
    >
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="approach-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-lg text-muted">{data.lead}</p>
        </Reveal>

        <List className="mt-14 grid gap-6 md:grid-cols-3">
          {data.cards.map((card, index) => {
            const Drawn = drawn[card.icon as keyof typeof drawn];
            const icon = icons[card.icon as keyof typeof icons];
            return (
              <li key={card.title}>
                {/* Colour lives in the block, not the section behind it.
                    Everything on it is ink - slate would be 2.9:1 here. */}
                <Reveal
                  delay={index * 110}
                  className="on-accent h-full rounded-2xl bg-accent p-6 transition-shadow duration-300 hover:shadow-[0_10px_34px_rgba(44,50,56,0.16)] lg:p-8"
                >
                  {/* The figure sits opposite the icon rather than over the
                      heading — it marks the step without taking the weight
                      that belongs to the words. */}
                  <div className="flex items-start justify-between gap-4">
                    {Drawn ? (
                      <Drawn className="h-14 w-auto text-white" />
                    ) : (
                      <Image
                        src={icon.src}
                        alt=""
                        width={icon.w}
                        height={icon.h}
                        sizes="72px"
                        aria-hidden="true"
                        className="h-14 w-auto"
                      />
                    )}
                    {numbered && (
                      <span aria-hidden="true" className="text-4xl leading-none text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  {/* Ink, not white: white on this terracotta is 2.4:1, which
                      fails AA and is what made the headings read as faint.
                      Varela Round ships a single weight, so the hierarchy
                      between heading and body has to come from size. */}
                  <h3 className="mt-5 text-2xl text-ink">{card.title}</h3>
                  <p className="mt-3 text-ink">{card.body}</p>
                </Reveal>
              </li>
            );
          })}
        </List>

        {/* Slate, not the near-black - that tone is now the footer's alone. */}
        <Reveal className="mt-14">
          <figure className="on-dark rounded-3xl bg-slate px-8 py-12 text-center md:px-16">
            <Quote className="mx-auto size-8 text-accent-light" aria-hidden="true" />
            <blockquote className="mt-5 text-xl leading-relaxed text-white md:text-2xl">
              <p>{data.quote}</p>
            </blockquote>
            {/* The quote is hers and the page is hers — the attribution only
                earns its line when the words come from someone else. */}
            {data.quoteAuthor && (
              <figcaption className="mt-5 text-base text-accent-light">- {data.quoteAuthor}</figcaption>
            )}
          </figure>
        </Reveal>

        {/* In normal flow rather than pinned to the section's floor. Pinned,
            they forced a bottom padding tall enough to clear them, which made
            this the widest join on the page by a long way — 323px against 224
            everywhere else. In flow they take exactly the room they occupy and
            the section keeps the shared rhythm. */}
        <div
          aria-hidden="true"
          className="mt-16 flex select-none items-end justify-center gap-5 opacity-80 md:gap-10"
        >
          {[
            { src: "/images/art-kid-ball.png", w: 691, h: 900, cls: "h-16 w-auto md:h-28" },
            { src: "/images/art-kid-blocks.png", w: 900, h: 742, cls: "h-14 w-auto md:h-24" },
            { src: "/images/art-kids-table.png", w: 900, h: 735, cls: "h-14 w-auto md:h-24" },
          ].map((art) => (
            <Image
              key={art.src}
              src={art.src}
              alt=""
              width={art.w}
              height={art.h}
              sizes="(max-width: 768px) 30vw, 300px"
              className={`block ${art.cls}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
