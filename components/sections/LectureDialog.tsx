"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Headphones, Play, X } from "lucide-react";
import { drawings } from "@/components/art/drawings";
import { track } from "@/lib/analytics";
import type { LectureCopy } from "@/content/lecture";

/* The lightbox's own address. A path, not a hash: Instagram reads the "#" in
   tzory.com/#lecture as a hashtag and breaks the link. The hash still opens
   it, for links already out there. */
const PATH = "/lecture";
const HASH = "#lecture";

/* The lead card's terracotta, from Services: full behind the copy, spent
   before the far corner. One literal string, because Tailwind only sees
   classes written out whole. */
const wash =
  "bg-[radial-gradient(150%_120%_at_92%_-8%,rgba(214,154,126,1)_0%,rgba(214,154,126,1)_38%,rgba(214,154,126,0.7)_56%,rgba(214,154,126,0.32)_70%,rgba(214,154,126,0.08)_82%,rgba(214,154,126,0)_92%)]";

const mmss = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/**
 * Two minutes of the podcast, in place.
 *
 * Our poster first, and the YouTube player only once she presses play - the
 * same rule as the media section, so opening the lecture never loads
 * anything from YouTube on its own. The player is told where to start and
 * where to stop, so the cut is the cut and not the whole 43-minute episode.
 */
function Clip({ data }: { data: LectureCopy }) {
  const [playing, setPlaying] = useState(false);
  const length = mmss(data.clipEnd - data.clipStart);

  return (
    <section aria-labelledby="lecture-clip">
      <p className="eyebrow">{data.clipEyebrow}</p>
      <h3 id="lecture-clip" className="mt-3 text-2xl text-slate md:text-[1.7rem]">
        {data.clipTitle}
      </h3>
      <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-dark">
        {playing ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${data.clipYoutubeId}?start=${data.clipStart}&end=${data.clipEnd}&autoplay=1&rel=0&hl=he&modestbranding=1`}
            title={data.clipTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setPlaying(true);
              track("lecture_clip_play");
            }}
            className="group/play absolute inset-0 size-full cursor-pointer"
          >
            <Image
              src="/media/podcast-poster.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 640px, 100vw"
              className="object-cover"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-dark/40 transition-colors group-hover/play:bg-dark/25" />
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex size-16 items-center justify-center rounded-full bg-accent text-ink shadow-lg transition-transform duration-300 group-hover/play:scale-110">
                {/* Pointing the way the page reads. */}
                <Play className="size-7 -translate-x-0.5 -scale-x-100 fill-current" />
              </span>
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-dark/80 px-3 py-1 text-sm text-on-dark"
            >
              <Headphones className="size-4" />
              {length}
            </span>
            <span className="sr-only">{`הפעלת הקטע מהפודקאסט, ${length} דקות (נטען מיוטיוב)`}</span>
          </button>
        )}
      </div>
      <p className="mt-3 text-base text-muted">{data.clipNote}</p>
    </section>
  );
}

/**
 * Everything about the lecture, one click from its card.
 *
 * A native <dialog> opened with showModal(): the browser does the focus trap,
 * Escape, the inert page behind and the top layer, which no hand-rolled
 * overlay gets fully right. The copy is in the markup whether or not it is
 * open, so it is read by search engines with the rest of the page.
 *
 * tzory.com/lecture opens it directly - a link that can go in a campaign or
 * a post and land on the lecture rather than the top of the page. While it is
 * open the address bar shows that link, so copying it copies the clean one.
 */
export function LectureDialog({
  data,
  onAccent = false,
  startOpen = false,
}: {
  data: LectureCopy;
  onAccent?: boolean;
  /** Open on arrival: the page was reached at /lecture. */
  startOpen?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The clip is unmounted on close, so a closed dialog never keeps playing.
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setIsOpen(true);
    // The page behind stays put; a modal dialog does not stop it scrolling.
    document.documentElement.style.overflow = "hidden";
    if (window.location.pathname !== PATH || window.location.hash) {
      history.replaceState(null, "", PATH + window.location.search);
    }
    track("lecture_open");
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Every way out - the button, Escape, the backdrop, the call to action -
    // ends here, so the page is restored in one place.
    const onClose = () => {
      setIsOpen(false);
      document.documentElement.style.overflow = "";
      // Back to the home page's own address; she is still on it.
      if (window.location.pathname === PATH || window.location.hash === HASH) {
        history.replaceState(null, "", "/" + window.location.search);
      }
    };
    const fromHash = () => {
      if (window.location.hash === HASH) open();
    };

    dialog.addEventListener("close", onClose);
    window.addEventListener("hashchange", fromHash);
    if (startOpen) open();
    else fromHash();
    return () => {
      dialog.removeEventListener("close", onClose);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [open, startOpen]);

  const art = drawings["art-two-women"];

  return (
    <>
      {/* A real button, not a line of small text: it is the way into the
          longest and most persuasive copy on the page. */}
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className={`btn ${onAccent ? "btn-on-accent" : "btn-primary"} cursor-pointer gap-2 px-7 py-3.5 text-base`}
      >
        {data.openLabel}
        <ArrowLeft className="size-4" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="lecture-title"
        /* A click that lands on the dialog itself, and not on the panel
           inside it, can only be a click on the backdrop. */
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-dark/75 backdrop:backdrop-blur-[2px] md:m-auto md:h-auto md:max-h-[90dvh] md:max-w-3xl md:rounded-3xl"
      >
        <div className="flex h-full flex-col bg-cream-50 md:max-h-[90dvh]">
          {/* Outside the scrolling area, so it never scrolls out of reach. */}
          <button
            type="button"
            onClick={close}
            className="absolute top-3 end-3 z-10 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white md:top-4 md:end-4"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">סגירה</span>
          </button>

          {/* Focusable, so the copy can be scrolled from the keyboard as well:
              arrow keys need something to act on. */}
          <div
            tabIndex={0}
            role="region"
            aria-label="פרטי ההרצאה"
            className="flex-1 overflow-y-auto overscroll-contain focus-visible:outline-offset-[-3px]"
          >
            {/* The opening, on the lead card's terracotta, with Efrat on stage
                beside it. On a phone the photo comes first, full width - a
                face before a headline. */}
            <header
              className={`on-accent flex flex-col gap-8 md:flex-row md:items-center md:gap-10 md:px-12 md:pt-14 md:pb-12 ${wash}`}
            >
              <div className="order-last px-6 md:order-none md:flex-1 md:px-0">
                <p className="eyebrow">{data.eyebrow}</p>
                <h2 id="lecture-title" className="mt-3 text-3xl text-ink md:text-[2.4rem]">
                  {data.title}
                </h2>
                <p className="mt-4 text-xl text-ink">{data.subtitle}</p>
                <p className="mt-3 text-base text-ink">{data.audience}</p>
              </div>
              <div className="relative h-80 w-full shrink-0 overflow-hidden md:h-auto md:w-56 md:rounded-2xl md:shadow-lg md:aspect-[3/4]">
                <Image
                  src={data.photo.src}
                  alt={data.photo.alt}
                  fill
                  sizes="(min-width: 768px) 224px, 100vw"
                  className="object-cover object-[50%_22%]"
                />
              </div>
            </header>

            <div className="space-y-14 px-6 py-12 md:px-12">
              {/* The story, stopped where the room picks it up. */}
              <section aria-labelledby="lecture-story">
                <h3 id="lecture-story" className="eyebrow">
                  {data.storyTitle}
                </h3>
                <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
                  {data.story.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <p className="mt-6 border-s-2 border-accent ps-5 font-display text-2xl text-ink md:text-3xl">
                  {data.storyLine}
                </p>
              </section>

              {/* Right after her words on the page, her voice. */}
              {isOpen && data.clipYoutubeId && <Clip data={data} />}

              <section aria-labelledby="lecture-recognise">
                <h3 id="lecture-recognise" className="text-2xl text-slate md:text-[1.7rem]">
                  {data.recogniseTitle}
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {data.recogniseLines.map((line) => (
                    <li key={line} className="flex items-start gap-4 text-lg text-muted">
                      <span aria-hidden="true" className="mt-[0.85em] h-0.5 w-4 shrink-0 bg-accent" />
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 rounded-2xl bg-cream-100 px-6 py-5 text-lg text-ink">
                  {data.recogniseCloser}
                </p>
              </section>

              <section aria-labelledby="lecture-takeaways">
                <h3 id="lecture-takeaways" className="text-2xl text-slate md:text-[1.7rem]">
                  {data.takeawaysTitle}
                </h3>
                <p className="mt-2 text-lg text-muted">{data.takeawaysLead}</p>
                <ol className="mt-6">
                  {data.takeaways.map((item, index) => (
                    <li
                      key={item.title}
                      className="grid grid-cols-[3.25rem_1fr] gap-x-3 border-t border-cream-200 py-6 last:pb-0"
                    >
                      <span aria-hidden="true" className="font-display text-3xl leading-none text-accent-ink">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-xl text-slate">{item.title}</p>
                        <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="lecture-room">
                <h3 id="lecture-room" className="text-2xl text-slate md:text-[1.7rem]">
                  {data.roomTitle}
                </h3>
                <p className="mt-2 text-lg text-muted">{data.roomLead}</p>
                {/* Each stop draws the stretch of line down to the next one,
                    so the line ends at the last circle, not under its text. */}
                <ol className="mt-7 space-y-7">
                  {data.room.map((step, index) => (
                    <li
                      key={step.title}
                      className="relative flex items-start gap-5 not-last:after:absolute not-last:after:start-[1.1rem] not-last:after:top-9 not-last:after:-bottom-7 not-last:after:w-px not-last:after:bg-accent/60 not-last:after:content-['']"
                    >
                      <span
                        aria-hidden="true"
                        className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-accent bg-cream-50 font-display text-accent-ink"
                      >
                        {index + 1}
                      </span>
                      <div className="pt-1">
                        <p className="text-xl text-slate">{step.title}</p>
                        <p className="mt-1.5 leading-relaxed text-muted">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 font-display text-xl text-ink">{data.roomCloser}</p>
              </section>

              <section aria-labelledby="lecture-bio">
                <p className="eyebrow">{data.bioEyebrow}</p>
                <h3 id="lecture-bio" className="mt-3 text-2xl text-slate md:text-[1.7rem]">
                  {data.bioTitle}
                </h3>
                <p className="mt-5 text-lg leading-relaxed text-ink">{data.bioLead}</p>
                <div className="mt-4 space-y-4 leading-relaxed text-muted">
                  {data.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* The one dark block: the promise of the evening, set apart
                  rather than listed with the rest. */}
              <section aria-labelledby="lecture-gains" className="on-dark rounded-3xl bg-dark px-6 py-8 md:px-9 md:py-10">
                <h3 id="lecture-gains" className="text-xl text-on-dark md:text-2xl">
                  {data.gainsTitle}
                </h3>
                <ul className="mt-6 space-y-4">
                  {data.gainsLines.map((line) => (
                    <li key={line} className="flex items-start gap-3.5 text-on-dark-muted">
                      <Check className="mt-1 size-4 shrink-0 text-accent-light" aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
              </section>

              {/* The terms, signed off with the drawing of two women side by
                  side - the room this evening is. */}
              <div className="flex items-end gap-6 border-t border-cream-200 pt-8">
                <dl className="grid flex-1 gap-5 sm:grid-cols-3 sm:gap-6">
                  {data.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-sm tracking-[0.12em] text-accent-ink">{fact.label}</dt>
                      <dd className="mt-1 text-lg text-slate">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                <Image
                  {...art}
                  alt=""
                  sizes="140px"
                  aria-hidden="true"
                  className="pointer-events-none hidden h-28 w-auto shrink-0 opacity-75 sm:block"
                />
              </div>
            </div>
          </div>

          {/* One way in, always in view. */}
          <div className="flex flex-col items-stretch gap-2 border-t border-cream-200 bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 md:px-12 md:py-4">
            <p className="hidden text-base text-muted sm:block">{data.ctaNote}</p>
            <Link
              href={data.ctaHref}
              onClick={(event) => {
                track("lecture_cta");
                /* Closing rewrites the address to /, which swallowed the
                   link's own jump to the form. So the jump is done here:
                   close, then scroll to the form and put her in its first
                   field - she pressed the button to fill it in. */
                const id = data.ctaHref.split("#")[1];
                const target = id ? document.getElementById(id) : null;
                close();
                if (!target) return;
                event.preventDefault();
                requestAnimationFrame(() => {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  history.replaceState(null, "", `/#${id}`);
                  target
                    .querySelector<HTMLElement>("input:not([type=hidden]):not([tabindex='-1']), textarea")
                    ?.focus({ preventScroll: true });
                });
              }}
              className="btn btn-primary shrink-0 gap-2 px-8 py-3.5 text-base"
            >
              {data.ctaLabel}
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
