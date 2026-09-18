import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { FaqSection } from "@/content/types";

/** See About: the band colour belongs to the page order, not the section. */
export function Faq({
  data,
  tone = "light",
  art = "pair",
}: {
  data: FaqSection;
  tone?: "light" | "deep";
  /** "pair" mirrors a drawing on each side; "single" keeps only one. */
  art?: "pair" | "single";
}) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className={`relative overflow-hidden ${tone === "deep" ? "bg-cream-100" : "bg-cream-50"} section`}
    >
      <div className="shell relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="faq-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-xl text-muted">{data.lead}</p>
        </Reveal>

        {/* Native <details> keeps every answer in the HTML - good for screen
            readers, and it is what Google and the AI crawlers actually read. */}
        <div className="relative mx-auto mt-12 max-w-3xl">
          {/* Both figures hang off the question column itself, not off the
              viewport — same gap on each side, one tied to the first question
              and one to the last, so the pair reads as a mirrored frame.
              Decorative. */}
          <Image
            src="/images/art-kid-blocks.png"
            alt=""
            width={900}
            height={782}
            sizes="140px"
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-[calc(100%+2.5rem)] hidden h-24 w-auto xl:block"
          />
          <Image
            src="/images/art-kid-ball.png"
            alt=""
            width={689}
            height={900}
            sizes="140px"
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-0 left-[calc(100%+2.5rem)] h-28 w-auto ${art === "pair" ? "hidden xl:block" : "hidden"}`}
          />

          <div className="space-y-3">
          {data.items.map((item, index) => (
            <Reveal key={item.question} delay={index * 70}>
            <details
              name="faq"
              open={index === 0}
              className="group rounded-2xl border border-cream-200 bg-white/70 px-6 open:bg-white"
            >
              <summary className="tap flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-start text-lg font-medium text-slate md:text-xl">
                <span>{item.question}</span>
                <ChevronDown
                  className="size-5 shrink-0 text-accent-ink transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="border-t border-accent/60 py-5 text-lg leading-relaxed text-muted">
                {item.answer}
              </p>
            </details>
            </Reveal>
          ))}
          </div>

          {/* No room beside the column on a phone, so the same two figures
              sit under it instead - same sizes as the strip further up. */}
          <div
            aria-hidden="true"
            className="mt-12 flex items-end justify-center gap-8 xl:hidden"
          >
            <Image
              src="/images/art-kid-blocks.png"
              alt=""
              width={900}
              height={782}
              sizes="120px"
              className="h-14 w-auto"
            />
            {art === "pair" && (
              <Image
                src="/images/art-kid-ball.png"
                alt=""
                width={689}
                height={900}
                sizes="100px"
                className="h-16 w-auto"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
