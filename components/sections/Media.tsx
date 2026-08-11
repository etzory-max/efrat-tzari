"use client";

import Image from "next/image";
import { useState } from "react";
import { FileText, Headphones, Play } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { MediaItem, MediaSection } from "@/content/types";

const tags = {
  video: { label: "וידאו", Icon: Play },
  podcast: { label: "פודקאסט", Icon: Headphones },
  press: { label: "כתבה", Icon: FileText },
} as const;

/**
 * Click-to-load player. Embedding YouTube on page load would pull a third
 * party into every visit — slow, and it hands the visitor over before they
 * asked. The poster is ours; the iframe only appears once they press play.
 */
function Player({ item }: { item: MediaItem }) {
  const [playing, setPlaying] = useState(false);

  if (playing && item.youtubeId) {
    return (
      <iframe
        className="absolute inset-0 size-full"
        src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0&hl=he`}
        title={item.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group/play absolute inset-0 size-full cursor-pointer"
    >
      <Image
        src={item.poster.src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 380px"
        className="object-cover"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-dark/35 transition-colors group-hover/play:bg-dark/20" />
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-accent text-ink shadow-lg transition-transform duration-300 group-hover/play:scale-110">
          <Play className="size-7 translate-x-0.5 fill-current" />
        </span>
      </span>
      <span className="sr-only">{`הפעלת ${item.title} (הסרטון נטען מיוטיוב)`}</span>
    </button>
  );
}

function Card({ item, delay }: { item: MediaItem; delay: number }) {
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
            <Player item={item} />
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="flex items-center gap-2 text-xs tracking-[0.16em] text-accent-ink">
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </p>
          <h3 className="mt-3 text-lg text-slate">{item.title}</h3>
          <p className="mt-1 text-sm text-muted">{item.outlet}</p>
          {/* The summary carries the content in text, so a scanned PDF is
              never the only way to get at it. */}
          <p className="mt-3 text-sm text-muted">{item.summary}</p>

          {isPress && item.href && (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tap mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-accent-ink transition-colors hover:text-ink"
            >
              לקריאת הכתבה
              <span className="sr-only">(קובץ PDF, נפתח בחלון חדש)</span>
              <FileText className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export function Media({ data }: { data: MediaSection }) {
  return (
    <section id="media" aria-labelledby="media-title" className="bg-cream-100 py-20 md:py-28">
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
              <Card item={item} delay={index * 100} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
