import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { Service, ServicesSection } from "@/content/types";
import { proseInCard } from "@/components/ui/PortableProse";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Same arrangement as before — the wide service on one side, the two shorter
 * ones stacked on the other — but the filled panels are gone. Partial rules
 * do the dividing instead, so the section reads as open rather than as three
 * sealed boxes on an otherwise airy page.
 */
/* The lead service gets colour without getting a box: a wash that is
   strongest behind the heading and fades out before it reaches an edge.
   Presence, but no rectangle to close the section back up. */
const wash =
  "rounded-3xl p-8 lg:p-10 bg-[radial-gradient(70%_58%_at_8%_100%,rgba(214,154,126,0)_0%,rgba(214,154,126,0.06)_30%,rgba(214,154,126,0.28)_72%)]";

function ServiceCard({ service }: { service: Service }) {
  const primary = service.variant === "dark";

  const tone = {
    kicker: "text-accent-ink",
    title: "text-slate",
    body: "text-muted",
    mark: "text-accent-ink",
    more: "text-accent-ink hover:text-ink",
    rule: "border-accent/50",
  };

  return (
    <article
      id={service.id}
      className={`group relative flex h-full flex-col ${primary ? wash : ""}`}
    >
      {primary && (
        /* Decorative, and it steps aside when the long copy opens — the
           has-[details[open]] selector does it without a line of JS. */
        <Image
          src="/images/art-kids-table.png"
          alt=""
          width={900}
          height={735}
          sizes="260px"
          aria-hidden="true"
          className="pointer-events-none order-last mt-8 h-14 w-auto self-end opacity-80 transition-[opacity,transform] duration-500 ease-[var(--ease-soft)] group-has-[details[open]]:translate-y-6 group-has-[details[open]]:opacity-0 lg:absolute lg:bottom-2 lg:end-0 lg:order-none lg:mt-0 lg:h-24"
        />
      )}

      <p className={`text-base tracking-[0.12em] ${tone.kicker}`}>{service.kicker}</p>
      <h3 className={`mt-2 text-2xl ${tone.title}`}>{service.title}</h3>
      <p className={`mt-4 text-lg ${tone.body}`}>{service.body}</p>

      {service.bullets.length > 0 && (
        <ul className="mt-6 space-y-3">
          {service.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <Check className={`mt-1 size-4 shrink-0 ${tone.mark}`} aria-hidden="true" />
              <span className={tone.body}>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Follows the copy. It used to be pushed to the card's floor so it
          would clear the illustration, but the illustration sits on the
          opposite edge — and with a short lead card that push opened a hole
          between the sentence and its own call to action. */}
      <div className="pt-7">
        {service.price && <p className={`text-base ${tone.title}`}>{service.price}</p>}
        {service.note && <p className="mt-1.5 text-base text-muted">{service.note}</p>}
        {service.ctaLabel && service.ctaHref && (
          <Link
            href={service.ctaHref}
            className={`tap mt-4 inline-flex items-center gap-2 text-base font-medium transition-colors ${tone.more}`}
          >
            {service.ctaLabel}
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* The expander only exists where there is long-form copy behind it. */}
      {service.details.length > 0 && (
        <details className="group/more pt-8">
          <summary className={`tap inline-flex cursor-pointer list-none items-center gap-2 text-base font-medium transition-colors ${tone.more}`}>
            <span className="group-open/more:hidden">{service.moreLabel}</span>
            <span className="hidden group-open/more:inline">להצגה מצומצמת</span>
            <ArrowLeft
              className="size-4 transition-transform duration-300 group-open/more:rotate-90"
              aria-hidden="true"
            />
          </summary>
          <div className={`mt-5 border-t pt-5 ${tone.rule} ${tone.body}`}>
            <PortableText value={service.details} components={proseInCard} />
          </div>
        </details>
      )}
    </article>
  );
}

export function Services({ data }: { data: ServicesSection }) {
  const [primary, ...secondary] = data.services;

  return (
    <section id="services" aria-labelledby="services-title" className="bg-cream-50 section">
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="services-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          {data.lead && <p className="mt-5 text-xl text-muted">{data.lead}</p>}
        </Reveal>

        <div className="relative mt-14 grid gap-12 lg:grid-cols-2 lg:gap-x-16">
          {/* Inset at both ends, so the rule marks the split without closing it. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-[10%] left-1/2 hidden w-px -translate-x-1/2 bg-accent/60 lg:block"
          />

          <Reveal className="lg:order-1">
            <ServiceCard service={primary} />
          </Reveal>

          {/* With a single offer on this side there is nothing to stretch
              against, so it sits centred rather than stranded at the top. */}
          <div className="flex flex-col gap-12 lg:order-2 lg:justify-center">
            {secondary.map((service, index) => (
              <Reveal
                key={service.id}
                delay={120 + index * 110}
                className={secondary.length > 1 ? "flex-1" : ""}
              >
                {/* Stops around 60% - a mark, not a lid. */}
                {index > 0 && (
                  <span aria-hidden="true" className="mb-12 block h-px w-3/5 bg-accent/60" />
                )}
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* The section ends on a decision, not on a second card.
            Both offers carry their own link, but a reader who has not chosen
            between them has nowhere to go from here - and the only other way
            on is the form at the very bottom of the page.

            One line and one button, nothing under it: the sentence already
            says the step is small, and a reassurance line beneath the button
            would say it twice. */}
        {data.ctaTitle && (
          <Reveal delay={240} className="mt-16 text-center">
            <p className="mx-auto max-w-2xl text-2xl text-balance text-ink md:text-3xl">
              {data.ctaTitle}
            </p>
            {data.ctaLabel && (
              <Link
                href={data.ctaHref ?? "/#contact"}
                className="btn btn-primary mt-7 px-8 py-4 text-base"
              >
                {data.ctaLabel}
              </Link>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
