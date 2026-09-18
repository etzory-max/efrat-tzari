import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { NotHereSection } from "@/content/types";

/**
 * The four things on offer here that are not.
 *
 * Set as a definition list — term on one side, the reasoning on the other,
 * hairlines between — because that is what the content is: a plain register of
 * what is and is not being sold, read just before the reader is asked to make
 * contact.
 *
 * `variant` exists only while the treatment is being chosen; once it is
 * settled the losing branches come out and this goes back to one set of
 * classes.
 */
export type NotHereVariant = "plain" | "dark" | "spine" | "chip";

const theme = {
  plain: {
    section: "bg-cream-100",
    title: "text-slate",
    rule: "border-cream-200",
    mark: "bg-accent",
    term: "text-2xl text-slate",
    termBox: "",
    body: "text-lg text-muted",
    onDark: false,
  },
  dark: {
    section: "bg-slate",
    title: "text-white",
    rule: "border-white/20",
    mark: "bg-accent",
    /**
     * The light terracotta, not the full one: full accent on slate is 2.99:1
     * and fails AA, while this reads just as terracotta at 4.9:1.
     */
    term: "text-2xl text-accent-light",
    termBox: "",
    /**
     * White rather than `on-dark-muted`. That muted tone is a warm beige built
     * for the near-black footer; against a blue-grey it reads as yellow.
     */
    body: "text-lg text-white/85",
    onDark: true,
  },
  spine: {
    section: "bg-cream-100",
    title: "text-slate",
    rule: "border-cream-200",
    mark: "bg-accent",
    term: "text-2xl text-ink",
    termBox: "self-start rounded-2xl bg-accent/20 px-5 py-4",
    body: "text-lg text-muted",
    onDark: false,
  },
  chip: {
    section: "bg-cream-100",
    title: "text-slate",
    rule: "border-cream-200",
    mark: "",
    term: "inline-block rounded-full bg-accent/25 px-4 py-1.5 text-2xl text-ink",
    termBox: "",
    body: "text-lg text-muted",
    onDark: false,
  },
} as const;

export function NotHere({
  data,
  variant = "plain",
  sectionId = "not-here",
  art = false,
}: {
  data: NotHereSection;
  variant?: NotHereVariant;
  sectionId?: string;
  /** A drawing under the list. The light variant, for the dark ground. */
  art?: boolean;
}) {
  const t = theme[variant];
  const last = data.items.length - 1;
  const headingId = `${sectionId}-title`;

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={`${t.section} ${t.onDark ? "on-dark" : ""} section`}
    >
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id={headingId} className={`mt-3 text-3xl text-balance md:text-4xl ${t.title}`}>
            {data.title}
          </h2>
        </Reveal>

        <dl className="mx-auto mt-14 max-w-4xl">
          {data.items.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 90}
              className={`grid gap-x-10 gap-y-3 border-t py-8 md:grid-cols-[minmax(0,15rem)_1fr] ${t.rule} ${
                index === last ? "border-b" : ""
              }`}
            >
              <dt className={t.termBox}>
                {t.mark && (
                  <span aria-hidden="true" className={`mb-3 block h-0.5 w-7 ${t.mark}`} />
                )}
                <span className={t.term}>{item.title}</span>
              </dt>
              <dd className={t.body}>{item.body}</dd>
            </Reveal>
          ))}
        </dl>

        {art && (
          <Reveal delay={180} className="mt-12 flex justify-center">
            <Image
              src={`/images/art-kid-blocks${t.onDark ? "-light" : ""}.png`}
              alt=""
              width={900}
              height={742}
              sizes="180px"
              aria-hidden="true"
              className="h-20 w-auto opacity-75 md:h-24"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}
