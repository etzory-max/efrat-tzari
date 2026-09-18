import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { TwoChildren } from "@/components/art/Illustrations";
import type { Testimonial, TestimonialsSection } from "@/content/types";

/**
 * Three voices on one thread.
 *
 * The line with its nodes is the day-timeline from "אם זה הבית שלך" turned on
 * its side — the same device, saying that these are three women at different
 * points of one path. No cards and no initials in discs: a letter in a circle
 * stands in for a profile photograph we do not have, and it was most of what
 * made the first attempt look like every services site.
 *
 * Wide: quotes alternate above and below a horizontal line, with the drawing
 * in the gap over the middle node.
 * Narrow: the same line stands up and runs down the centre. Deliberately not
 * the edge-hung list that "אם זה הבית שלך" uses, so the two sections read as
 * relatives rather than as copies. True left/right alternation was the first
 * idea and does not survive a 375px screen — half a phone is about 140px, and
 * a long Hebrew quote in that column becomes a thin tower.
 *
 * `surface` is on trial; once one is chosen the others come out.
 */
export type TestimonialsSurface = "plain" | "panel" | "wash" | "single";

/**
 * A wash that is strongest at the start corner and fades before the far edge.
 * It is anchored at the top so the tint is gone by the lower third, which is
 * where the attribution line sits — muted grey on a terracotta wash this strong
 * would drop under 4.5:1, and on the bare cream it stays at 5.3:1.
 */
const washPanel =
  "rounded-3xl bg-[radial-gradient(88%_72%_at_10%_0%,rgba(214,154,126,0.46)_0%,rgba(214,154,126,0.24)_42%,rgba(214,154,126,0.07)_70%,rgba(214,154,126,0)_88%)] px-6 py-10 md:px-12 md:py-14";

function Quote({
  item,
  highlight = false,
}: {
  item: Testimonial;
  highlight?: boolean;
}) {
  return (
    <figure className={highlight ? "rounded-2xl bg-accent/25 p-6" : undefined}>
      <blockquote className="text-lg leading-relaxed text-muted">
        <p>{item.quote}</p>
      </blockquote>
      <figcaption className="mt-4 text-base text-muted">
        <span className="text-slate">{item.name}</span>
        {item.role && <span>{` · ${item.role}`}</span>}
      </figcaption>
    </figure>
  );
}

export function Testimonials({
  data,
  tone = "deep",
  surface = "plain",
  sectionId = "testimonials",
  art = "table",
}: {
  data: TestimonialsSection;
  tone?: "light" | "deep";
  surface?: TestimonialsSurface;
  sectionId?: string;
  art?: "table" | "pair";
}) {
  const [first, second, third] = data.items;
  const headingId = `${sectionId}-title`;

  /** Option 1: one wide tinted field holding the whole composition. */
  const field = surface === "panel" ? "rounded-[2rem] bg-accent/14 px-6 py-12 md:px-12 md:py-16" : "";
  /** Option 2: a soft wash behind each quote that fades out instead of boxing it. */
  const perQuote = surface === "wash" ? washPanel : "";
  /** Option 3: colour lands on the short quote alone. */
  const single = surface === "single";

  const drawing = (size: string) =>
    art === "pair" ? (
      <TwoChildren className={`w-auto text-ink/70 ${size}`} />
    ) : (
      /* A family holding one another, not the two children at a table that
         used to sit here - that drawing also opens the lead service card one
         section up, and three parents' voices deserve their own image rather
         than a second showing of somebody else's. */
      <Image
        src="/images/art-family-hold.png"
        alt=""
        width={900}
        height={739}
        sizes="260px"
        aria-hidden="true"
        className={`w-auto ${size}`}
      />
    );

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={`${tone === "deep" ? "bg-cream-100" : "bg-cream-50"} section`}
    >
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id={headingId} className="mt-3 text-3xl text-balance text-slate md:text-4xl">
            {data.title}
          </h2>
        </Reveal>

        <div className={`mt-14 ${field}`}>
          {/* ---------- wide: the thread runs across ---------- */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 items-end gap-x-10 lg:gap-x-14">
              <Reveal className={perQuote}>
                {first && <Quote item={first} />}
              </Reveal>
              <Reveal delay={90} className="flex justify-center">
                {drawing("h-24 lg:h-28")}
              </Reveal>
              <Reveal delay={180} className={single ? "" : perQuote}>
                {third && <Quote item={third} highlight={single} />}
              </Reveal>
            </div>

            <div aria-hidden="true" className="relative my-9 h-3">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-accent/55" />
              <div className="absolute inset-0 grid grid-cols-3">
                {data.items.slice(0, 3).map((item) => (
                  <span
                    key={item.name}
                    className="size-3 self-center justify-self-center rounded-full bg-accent"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 items-start gap-x-10 lg:gap-x-14">
              <div />
              <Reveal delay={120} className={perQuote}>
                {second && <Quote item={second} />}
              </Reveal>
              <div />
            </div>
          </div>

          {/* ---------- narrow: the same thread, stood up the centre ---------- */}
          <ol className="mx-auto max-w-lg md:hidden">
            {data.items.map((item, index) => (
              <li key={item.name}>
                <Reveal delay={index * 90} className="flex flex-col items-center text-center">
                  <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-accent" />
                  {/* The gap under the node is wider than the one above it, so
                      the dot reads as sitting on the thread rather than stuck
                      to the top edge of the quote that follows. The spacing is
                      a margin and not padding — padding would land inside the
                      wash and the panel would still start at the dot. */}
                  <div className={`mt-9 w-full ${single && index === 2 ? "" : perQuote}`}>
                    <Quote item={item} highlight={single && index === 2} />
                  </div>
                  {index < data.items.length - 1 && (
                    <span aria-hidden="true" className="mt-10 h-14 w-px bg-accent/40" />
                  )}
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex justify-center md:hidden">{drawing("h-20")}</div>
        </div>
      </div>
    </section>
  );
}
