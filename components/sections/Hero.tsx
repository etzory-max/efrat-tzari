"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { HeroSlide } from "@/content/types";

const INTERVAL = 6500;

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [interacted, setInteracted] = useState(false);
  // The non-active slides are stacked at opacity 0, so the browser would fetch
  // all three up front and starve the LCP image. Mount them after load.
  const [mountRest, setMountRest] = useState(false);
  const regionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (document.readyState === "complete") {
      const timer = setTimeout(() => setMountRest(true), 0);
      return () => clearTimeout(timer);
    }
    const onLoad = () => setMountRest(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const count = slides.length;
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Auto-rotate, unless the user paused it, is interacting with the region,
  // or has asked for reduced motion.
  useEffect(() => {
    if (!playing || count < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || document.documentElement.dataset.a11yMotion === "off") return;

    const region = regionRef.current;
    let timer: ReturnType<typeof setInterval> | null = null;
    let hovered = false;

    const start = () => {
      if (timer || hovered) return;
      timer = setInterval(() => setIndex((value) => (value + 1) % count), INTERVAL);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const pause = () => {
      hovered = true;
      stop();
    };
    const resume = () => {
      hovered = false;
      start();
    };

    region?.addEventListener("mouseenter", pause);
    region?.addEventListener("mouseleave", resume);
    region?.addEventListener("focusin", pause);
    region?.addEventListener("focusout", resume);
    start();

    return () => {
      stop();
      region?.removeEventListener("mouseenter", pause);
      region?.removeEventListener("mouseleave", resume);
      region?.removeEventListener("focusin", pause);
      region?.removeEventListener("focusout", resume);
    };
  }, [playing, count]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    // In RTL, ArrowRight moves to the previous slide.
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setInteracted(true);
      go(index - 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setInteracted(true);
      go(index + 1);
    }
  };

  const active = slides[index];

  return (
    <section
      ref={regionRef}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="מסרים מרכזיים"
      className="on-dark relative isolate w-full overflow-hidden bg-dark"
      style={{ minHeight: "clamp(30rem, 78vh, 46rem)" }}
    >
      {slides.map((slide, slideIndex) =>
        slideIndex !== 0 && !mountRest && slideIndex !== index ? null : (
        <div
          key={slide.image.src + slideIndex}
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-700 ease-[var(--ease-soft)]"
          style={{ opacity: slideIndex === index ? 1 : 0 }}
        >
          <Image
            src={slide.image.src}
            alt=""
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        ),
      )}

      {/* Scrim: darkest under the copy (right, in RTL) so white text clears
          AA against any photo behind it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-l from-dark/85 via-dark/75 to-dark/45"
      />

      <div className="relative z-10 flex min-h-[inherit] items-center py-24">
        <div className="shell">
          <div
            aria-live={playing && !interacted ? "off" : "polite"}
            aria-atomic="true"
            className="max-w-2xl"
          >
            <p className="sr-only">{`שקופית ${index + 1} מתוך ${count}`}</p>
            {/* Above the fold, so this eases in on load rather than on scroll. */}
            <Reveal immediate>
              <h1 className="text-4xl leading-[1.15] text-white md:text-6xl">{active.title}</h1>
            </Reveal>
            <Reveal immediate delay={110}>
              <p className="mt-5 max-w-xl text-lg text-white/90 md:text-xl">{active.subtitle}</p>
            </Reveal>
            <Reveal immediate delay={220}>
              <Link
                href={active.ctaHref}
                className="btn btn-primary mt-8 px-8 py-4 text-base"
              >
                {active.ctaLabel}
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => {
              setInteracted(true);
              go(index - 1);
            }}
            className="tap absolute end-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white transition-colors hover:bg-white/45 sm:inline-flex"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
            <span className="sr-only">לשקופית הקודמת</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setInteracted(true);
              go(index + 1);
            }}
            className="tap absolute start-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white transition-colors hover:bg-white/45 sm:inline-flex"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
            <span className="sr-only">לשקופית הבאה</span>
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="tap inline-flex items-center justify-center rounded-full bg-white/25 text-white transition-colors hover:bg-white/45"
            >
              {playing ? (
                <Pause className="size-4" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {playing ? "עצירת החלפת שקופיות אוטומטית" : "הפעלת החלפת שקופיות אוטומטית"}
              </span>
            </button>

            <div className="flex items-center gap-2">
              {slides.map((slide, slideIndex) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => {
                    setInteracted(true);
                    go(slideIndex);
                  }}
                  aria-current={slideIndex === index ? "true" : undefined}
                  className="flex h-11 w-6 items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      slideIndex === index ? "w-6 bg-white" : "w-2 bg-white/60"
                    }`}
                  />
                  <span className="sr-only">{`מעבר לשקופית ${slideIndex + 1}: ${slide.title}`}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
