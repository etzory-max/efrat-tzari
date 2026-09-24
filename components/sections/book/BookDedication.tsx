import { Reveal } from "@/components/ui/Reveal";
import { drawings } from "@/components/art/drawings";
import Image from "next/image";
import type { BookDedication as BookDedicationContent } from "@/content/book";

/**
 * For her sister.
 *
 * The last thing on the page and the quietest: small type, centred, on the
 * page's own cream rather than a band of its own. A dedication that shouted
 * would stop being one.
 */
export function BookDedication({ data }: { data: BookDedicationContent }) {
  const art = drawings["art-family-hold"];

  return (
    <section aria-labelledby="dedication-label" className="bg-cream-100 py-16 md:py-20">
      <Reveal className="shell max-w-xl text-center">
        <Image
          src={art.src}
          alt=""
          width={art.width}
          height={art.height}
          sizes="112px"
          aria-hidden="true"
          className="mx-auto mb-6 h-auto w-28"
        />
        <p id="dedication-label" className="eyebrow justify-center">
          {data.label}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-balance text-muted md:text-xl">
          {data.body}
        </p>
      </Reveal>
    </section>
  );
}
