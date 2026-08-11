import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { FaqSection } from "@/content/types";

export function Faq({ data }: { data: FaqSection }) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-cream-50 py-20 md:py-28"
    >
      {/* Off balance on purpose — one high on the right, one low on the left,
          so they frame the column without boxing it in. Decorative. */}
      <Image
        src="/images/art-kid-blocks.png"
        alt=""
        width={900}
        height={742}
        sizes="180px"
        aria-hidden="true"
        className="pointer-events-none absolute top-56 right-48 hidden h-32 w-auto opacity-80 xl:block"
      />
      <Image
        src="/images/art-kid-ball.png"
        alt=""
        width={691}
        height={900}
        sizes="150px"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-28 left-48 hidden h-36 w-auto opacity-80 xl:block"
      />

      <div className="shell relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="faq-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-lg text-muted">{data.lead}</p>
        </Reveal>

        {/* Native <details> keeps every answer in the HTML — good for screen
            readers, and it is what Google and the AI crawlers actually read. */}
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {data.items.map((item, index) => (
            <Reveal key={item.question} delay={index * 70}>
            <details
              name="faq"
              open={index === 0}
              className="group rounded-2xl border border-cream-200 bg-white/70 px-6 open:bg-white"
            >
              <summary className="tap flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-start text-base font-medium text-ink md:text-lg">
                <span>{item.question}</span>
                <ChevronDown
                  className="size-5 shrink-0 text-accent-ink transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="border-t border-accent/60 py-5 leading-relaxed text-muted">
                {item.answer}
              </p>
            </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
