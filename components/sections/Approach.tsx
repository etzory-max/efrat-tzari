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
  sectionId = "approach",
}: {
  data: ApproachSection;
  numbered?: boolean;
  /** See the note on About: the band colour belongs to the page order. */
  tone?: "light" | "deep";
  /** The drawing under the quote. Off where the page needs its art elsewhere. */
  figures?: boolean;
  sectionId?: string;
}) {
  const List = numbered ? "ol" : "ul";
  const headingId = `${sectionId}-title`;

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={`overflow-hidden ${tone === "deep" ? "bg-cream-100" : "bg-cream-50"} section`}
    >
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id={headingId} className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          {/* pre-line, so a break typed in the Studio is a break on the page.
              This lead is two sentences that work better apart. */}
          <p className="mt-5 text-xl whitespace-pre-line text-muted">{data.lead}</p>
        </Reveal>

        {/* A pillar, not a card.

            The heading promises "three pillars, in this order" and the three
            filled blocks said neither pillar nor order - only that there were
            three of something. A tall rule beside each one is the shape the
            words describe, and it costs nothing: the page already spends
            terracotta on the services card and the testimonials wash, and
            three solid blocks here was the third helping.

            It also fixes the one thing axe kept flagging. The step numbers
            were white on terracotta at 2.4:1, kept deliberately because no
            light colour clears 3:1 on that fill. On the cream they are
            accent-ink at 5.4:1. */}
        <List className="mt-14 grid gap-10 md:grid-cols-3 md:gap-x-10">
          {data.cards.map((card, index) => (
            <li key={card.title} className="h-full">
              <Reveal delay={index * 110} className="flex h-full gap-5">
                {/* accent-ink, the same terracotta as the number beside it.
                    The site keeps two weights of the one colour - the light
                    one for shapes, the dark one for text - and a rule could
                    have taken either. Matching the number makes the pair read
                    as a single mark, and the light terracotta at 2.1:1 on this
                    cream was receding into it anyway. */}
                <span aria-hidden="true" className="w-1.5 shrink-0 rounded-full bg-accent-ink" />

                <div className="flex-1">
                  {/* The number and the heading are one unit, on a shared
                      baseline. They were a figure in one corner and a heading
                      four lines below it, and neither carried the step. */}
                  <div className="flex items-baseline gap-4">
                    {numbered && (
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-5xl leading-none text-accent-ink lg:text-6xl"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                    <h3 className="text-2xl text-slate">{card.title}</h3>
                  </div>
                  <span aria-hidden="true" className="mt-5 block h-px bg-cream-200" />
                  <p className="mt-5 text-lg text-muted">{card.body}</p>
                </div>
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
              width={900}
              height={785}
              sizes="300px"
              aria-hidden="true"
              className="h-28 w-auto select-none md:h-40"
            />
          </Reveal>
        )}

      </div>
    </section>
  );
}
