import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { Hero as HeroContent } from "@/content/types";

/**
 * One photograph, one sentence.
 *
 * The copy sits on a cream card that overlaps the foot of the photo and melts
 * into the section below it. That is what lets the photo stay bright: white
 * text over an image needs a heavy scrim, which dulls the picture and weakens
 * the sentence at the same time. Here neither has to give anything up, and the
 * overlap does the work of pulling the eye onward.
 */
export function Hero({ data }: { data: HeroContent }) {
  return (
    <section aria-labelledby="hero-title" className="bg-cream-100">
      <div className="relative h-[42vh] min-h-[17rem] w-full overflow-hidden sm:h-[52vh] md:h-[64vh] md:min-h-[26rem]">
        <Image
          src={data.image.src}
          alt={data.image.alt}
          fill
          priority
          sizes="100vw"
          // A playroom photo is louder than the rest of the palette; easing the
          // saturation lets it sit with the cream instead of shouting over it.
          className="object-cover object-center saturate-[0.82]"
        />
        {/* A dark veil across the whole photo - it settles the picture and
            keeps it from competing with the card. The text sits on cream, so
            this is purely tonal, not a contrast device. */}
        <div aria-hidden="true" className="absolute inset-0 bg-dark/40" />
      </div>

      <div className="shell">
        <Reveal
          immediate
          className="relative z-10 -mt-12 max-w-2xl rounded-3xl bg-white p-7 shadow-[0_-12px_50px_rgba(44,50,56,0.13)] sm:p-9 md:-mt-40 md:p-12"
        >
          {data.eyebrow && <p className="eyebrow mb-4">{data.eyebrow}</p>}
          <h1
            id="hero-title"
            className="text-[1.9rem] leading-[1.15] text-slate sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {data.title}
          </h1>
          <p className="mt-5 text-lg text-muted md:text-xl">{data.subtitle}</p>
          {/* Wrapped rather than inline-spaced: on a phone the second action
              drops under the first instead of squeezing both. */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={data.ctaHref} className="btn btn-primary px-8 py-4 text-base">
              {data.ctaLabel}
            </Link>
            {data.ctaSecondaryLabel && data.ctaSecondaryHref && (
              <Link
                href={data.ctaSecondaryHref}
                className="btn border border-slate/35 px-7 py-4 text-base text-slate transition-colors hover:border-slate hover:bg-slate hover:text-white"
              >
                {data.ctaSecondaryLabel}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
