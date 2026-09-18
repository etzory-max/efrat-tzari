import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { ApproachSection } from "@/content/types";

/**
 * `numbered` is for copy whose heading claims an order ("three pillars, in
 * this order"). It switches the list to an <ol> as well as drawing the
 * figures, so the sequence is carried by the markup and not only by the ink.
 */
export function Approach({
  data,
  numbered = false,
  tone = "deep",
  figures = true,
}: {
  data: ApproachSection;
  numbered?: boolean;
  /** See the note on About: the band colour belongs to the page order. */
  tone?: "light" | "deep";
  /** The drawing under the quote. Off where the page needs its art elsewhere. */
  figures?: boolean;
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
          {/* pre-line, so a break typed in the Studio is a break on the page.
              This lead is two sentences that work better apart. */}
          <p className="mt-5 text-xl whitespace-pre-line text-muted">{data.lead}</p>
        </Reveal>

        <List className="mt-14 grid gap-6 md:grid-cols-3">
          {data.cards.map((card, index) => (
            <li key={card.title}>
              {/* Colour lives in the block, not the section behind it.
                  Everything on it is ink - slate would be 2.9:1 here. */}
              <Reveal
                delay={index * 110}
                className="on-accent h-full rounded-2xl bg-accent p-6 transition-shadow duration-300 hover:shadow-[0_10px_34px_rgba(44,50,56,0.16)] lg:p-8"
              >
                {/* The number and the heading are one unit now. They were a
                    figure in one corner and a heading four lines below it,
                    with an icon between them, and neither carried the card.
                    Set side by side on a shared baseline, with a rule under
                    the pair, the step announces itself once.

                    The icons are gone from here. Three marks - icon, number,
                    heading - were competing inside a card small enough for
                    one, and the drawing is now doing its work at the foot of
                    the section instead. */}
                <div className="flex items-baseline gap-4">
                  {numbered && (
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-5xl leading-none text-white lg:text-6xl"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                  {/* Ink, not white: white on this terracotta is 2.4:1, which
                      fails AA and is what made the headings read as faint.
                      Varela Round ships a single weight, so the hierarchy
                      between heading and body has to come from size. */}
                  <h3 className="text-2xl text-ink">{card.title}</h3>
                </div>
                <span aria-hidden="true" className="mt-5 block h-px bg-ink/20" />
                <p className="mt-5 text-lg text-ink">{card.body}</p>
              </Reveal>
            </li>
          ))}
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

        {figures && (
          /* One drawing instead of the row of three. The three were children
             at play - true of the practice, but not of what this section
             argues, which is that the home is something you hold and tend.
             In normal flow rather than pinned to the section's floor: pinned,
             it forces a bottom padding tall enough to clear it, which made
             this the widest join on the page by a long way. */
          <Reveal delay={120} className="mt-16 flex justify-center">
            <Image
              src="/images/art-hands-home.png"
              alt=""
              width={874}
              height={900}
              sizes="300px"
              aria-hidden="true"
              className="h-40 w-auto select-none md:h-56"
            />
          </Reveal>
        )}

      </div>
    </section>
  );
}
