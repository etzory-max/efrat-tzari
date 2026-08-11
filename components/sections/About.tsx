import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { AboutSection } from "@/content/types";

export function About({ data }: { data: AboutSection }) {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-cream-50 py-20 md:py-28">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Portrait first, so in RTL it lands on the right — as in the demo. */}
        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
            <Image
              src={data.portrait.src}
              alt={data.portrait.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          {/* The slate disc reads better over a photo than a coral one would,
              so the accent comes in on the number instead of the plain white. */}
          <p className="absolute -bottom-5 end-6 flex size-24 flex-col items-center justify-center rounded-full bg-slate text-center shadow-lg">
            <span className="text-2xl font-medium text-accent-light">{data.badgeValue}</span>
            <span className="mt-0.5 text-[0.7rem] leading-tight text-white">{data.badgeLabel}</span>
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="about-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>

          <div className="mt-6 space-y-5 text-lg text-muted">
            {data.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-10 space-y-4 border-t border-cream-200 pt-8">
            {data.points.map((point, index) => (
              <li key={point}>
                <Reveal delay={200 + index * 80} className="flex items-start gap-3">
                  <Check className="mt-1 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <span className="text-lg text-ink">{point}</span>
                </Reveal>
              </li>
            ))}
          </ul>

          {data.book && (
            <div className="mt-10 border-t border-cream-200 pt-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <Image
                  src={data.book.cover.src}
                  alt={data.book.cover.alt}
                  width={120}
                  height={224}
                  sizes="120px"
                  className="h-auto w-[7.5rem] shrink-0 self-start"
                />
                <div>
                  <p className="eyebrow">הספר</p>
                  <h3 className="mt-2 text-xl text-slate">
                    {data.book.title}
                    <span className="mt-1 block text-base text-muted">{data.book.subtitle}</span>
                  </h3>
                  <p className="mt-3 text-muted">{data.book.blurb}</p>
                  <a
                    href={data.book.buyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap mt-4 inline-flex items-center text-sm font-medium text-accent-ink underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    {data.book.buyLabel}
                    <span className="sr-only"> (נפתח בחלון חדש)</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
