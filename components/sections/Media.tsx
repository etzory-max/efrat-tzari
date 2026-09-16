"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, FileText, Headphones, Play, X } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { MediaItem, MediaSection } from "@/content/types";

const tags = {
  video: { label: "וידאו", Icon: Play },
  podcast: { label: "פודקאסט", Icon: Headphones },
  press: { label: "כתבה", Icon: FileText },
} as const;

/**
 * The poster is ours and the iframe only exists while the lightbox is open,
 * so a visit that never presses play never touches YouTube. Once they do
 * press it, they get the real player at a real size - full controls, volume,
 * quality, fullscreen - instead of a card-sized window.
 */
function Lightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-60 flex items-center justify-center bg-dark/90 p-4 md:p-10"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-5xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="tap absolute -top-12 end-0 inline-flex items-center gap-2 rounded-xl text-base text-on-dark"
        >
          סגירה
          <X className="size-5" aria-hidden="true" />
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0&hl=he&controls=1&modestbranding=1`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function Poster({ item, onPlay }: { item: MediaItem; onPlay: () => void }) {
  return (
    <button type="button" onClick={onPlay} className="group/play absolute inset-0 size-full cursor-pointer">
      <Image
        src={item.poster.src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 380px"
        className="object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-dark/35 transition-colors group-hover/play:bg-dark/20"
      />
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-accent text-ink shadow-lg transition-transform duration-300 group-hover/play:scale-110">
          {/* Pointing the way the page reads. */}
          <Play className="size-7 -translate-x-0.5 -scale-x-100 fill-current" />
        </span>
      </span>
      <span className="sr-only">{`הפעלת ${item.title} (הסרטון נטען מיוטיוב)`}</span>
    </button>
  );
}

function Card({
  item,
  delay,
  onPlay,
}: {
  item: MediaItem;
  delay: number;
  onPlay: () => void;
}) {
  const { label, Icon } = tags[item.kind];
  const isPress = item.kind === "press";

  return (
    <Reveal delay={delay} className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-cream-50 shadow-[0_2px_20px_rgba(44,50,56,0.06)]">
        <div className="relative aspect-16/9 bg-dark">
          {isPress ? (
            <Image
              src={item.poster.src}
              alt={item.poster.alt}
              fill
              sizes="(max-width: 768px) 100vw, 380px"
              className="object-cover opacity-90"
            />
          ) : (
            <Poster item={item} onPlay={onPlay} />
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="flex items-center gap-2 text-base tracking-[0.12em] text-accent-ink">
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </p>
          <h3 className="mt-3 text-lg text-slate">{item.title}</h3>
          {/* Guarded: an empty outlet would otherwise leave a blank line
              between the title and the summary. */}
          {item.outlet && <p className="mt-1 text-base text-muted">{item.outlet}</p>}
          {/* The summary carries the content in text, so a scanned PDF is
              never the only way to get at it. */}
          <p className="mt-3 text-base text-muted">{item.summary}</p>

          {isPress && item.href && (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tap mt-auto inline-flex items-center gap-2 pt-5 text-base font-medium text-accent-ink transition-colors hover:text-ink"
            >
              לקריאת הכתבה
              <span className="sr-only">(נפתח באתר החיצוני, בחלון חדש)</span>
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

/** See About: the band colour belongs to the page order, not the section. */
export function Media({ data, tone = "deep" }: { data: MediaSection; tone?: "light" | "deep" }) {
  const [active, setActive] = useState<MediaItem | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setActive(null);
    // Back to the poster they came from, not the top of the page.
    triggerRef.current?.focus();
  }, []);

  return (
    <section
      id="media"
      aria-labelledby="media-title"
      className={`${tone === "deep" ? "bg-cream-100" : "bg-cream-50"} section`}
    >
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="media-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-lg text-muted">{data.lead}</p>
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, index) => (
            <li key={item.title}>
              <Card
                item={item}
                delay={index * 100}
                onPlay={() => {
                  triggerRef.current = document.activeElement as HTMLElement;
                  setActive(item);
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      {active?.youtubeId && <Lightbox item={active} onClose={close} />}
    </section>
  );
}
