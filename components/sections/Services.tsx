import Image from "next/image";
import { ArrowLeft, BookOpen, Check, Mic, Users } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { Service, ServicesSection } from "@/content/types";
import { proseInCard, proseInCardOnDark } from "@/components/ui/PortableProse";
import { Reveal } from "@/components/ui/Reveal";

const icons = { users: Users, mic: Mic, book: BookOpen } as const;

function ServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.icon];
  const dark = service.variant === "dark";

  return (
    <article
      id={service.id}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 ${
        dark
          ? "on-dark bg-slate text-on-dark"
          : "border border-cream-200 bg-cream-100 text-ink"
      }`}
    >
      {dark && (
        /* Decorative, and it steps aside when the long copy opens — the
           has-[details[open]] selector does it without a line of JS. */
        <Image
          src="/images/art-kids-table.png"
          alt=""
          width={900}
          height={735}
          sizes="260px"
          className="pointer-events-none absolute bottom-4 end-6 hidden h-36 w-auto opacity-70 transition-[opacity,transform] duration-500 ease-[var(--ease-soft)] group-has-[details[open]]:translate-y-6 group-has-[details[open]]:opacity-0 lg:block"
        />
      )}
      {/* Same terracotta plate on the slate card as on the light ones. */}
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent text-ink">
        <Icon className="size-6" aria-hidden="true" />
      </span>

      <p className={`mt-6 text-xs tracking-[0.18em] ${dark ? "text-accent-light" : "text-accent-ink"}`}>
        {service.kicker}
      </p>
      <h3 className={`mt-2 text-2xl ${dark ? "text-white" : "text-slate"}`}>{service.title}</h3>
      <p className={`mt-4 ${dark ? "text-white/90" : "text-muted"}`}>{service.body}</p>

      {service.bullets.length > 0 && (
        <ul className="mt-6 space-y-3">
          {service.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <Check
                className={`mt-1 size-4 shrink-0 ${dark ? "text-accent-light" : "text-accent-ink"}`}
                aria-hidden="true"
              />
              <span className={dark ? "text-white/90" : "text-muted"}>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      <details className="group/more mt-auto pt-8">
        <summary
          className={`tap inline-flex cursor-pointer list-none items-center gap-2 text-sm font-medium transition-colors ${
            dark ? "text-white hover:text-accent-light" : "text-accent-ink hover:text-ink"
          }`}
        >
          <span className="group-open/more:hidden">{service.moreLabel}</span>
          <span className="hidden group-open/more:inline">להצגה מצומצמת</span>
          <ArrowLeft
            className="size-4 transition-transform duration-300 group-open/more:rotate-90"
            aria-hidden="true"
          />
        </summary>
        <div
          className={`mt-5 border-t pt-5 ${
            dark ? "border-white/20 text-white/90" : "border-accent/60 text-muted"
          }`}
        >
          <PortableText value={service.details} components={dark ? proseInCardOnDark : proseInCard} />
        </div>
      </details>
    </article>
  );
}

export function Services({ data }: { data: ServicesSection }) {
  const [primary, ...secondary] = data.services;

  return (
    <section id="services" aria-labelledby="services-title" className="bg-cream-50 py-20 md:py-28">
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="services-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal className="lg:order-2">
            <ServiceCard service={primary} />
          </Reveal>
          <div className="flex flex-col gap-6 lg:order-1">
            {secondary.map((service, index) => (
              <Reveal key={service.id} delay={120 + index * 110} className="flex-1">
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
