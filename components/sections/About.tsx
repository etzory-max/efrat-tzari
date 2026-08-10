import Image from "next/image";
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
          <p className="absolute -bottom-5 end-6 flex size-24 flex-col items-center justify-center rounded-full bg-slate text-center text-white shadow-lg">
            <span className="text-xl font-medium">{data.badgeValue}</span>
            <span className="mt-0.5 text-[0.7rem] leading-tight">{data.badgeLabel}</span>
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

          <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Reveal renders the wrapper div itself — a <dl> may only contain
                dt, dd, and a single div around each pair. */}
            {data.stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={200 + index * 80}
                className="h-full rounded-2xl border border-cream-200 bg-white/70 px-6 py-5"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-medium text-slate">{stat.value}</span>
                  <span className="mt-1 block text-sm text-muted" aria-hidden="true">
                    {stat.label}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
