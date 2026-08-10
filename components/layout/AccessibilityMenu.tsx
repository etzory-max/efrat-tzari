"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Accessibility, RotateCcw, X } from "lucide-react";

type Prefs = {
  text: "base" | "lg" | "xl";
  contrast: "off" | "on";
  links: "off" | "on";
  motion: "on" | "off";
};

const DEFAULTS: Prefs = { text: "base", contrast: "off", links: "off", motion: "on" };
export const A11Y_STORAGE_KEY = "efrat-a11y";
const PREFS_EVENT = "efrat-a11y-change";

/**
 * The preferences live on <html> — an inline script in the layout applies the
 * stored ones before first paint. We read them from there rather than mirroring
 * them into an effect, so there is no flash and no cascading render.
 */
const serialise = (prefs: Prefs) => `${prefs.text}|${prefs.contrast}|${prefs.links}|${prefs.motion}`;

const parse = (value: string): Prefs => {
  const [text, contrast, links, motion] = value.split("|");
  return {
    text: (text as Prefs["text"]) || DEFAULTS.text,
    contrast: (contrast as Prefs["contrast"]) || DEFAULTS.contrast,
    links: (links as Prefs["links"]) || DEFAULTS.links,
    motion: (motion as Prefs["motion"]) || DEFAULTS.motion,
  };
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(PREFS_EVENT, onChange);
  return () => window.removeEventListener(PREFS_EVENT, onChange);
};

const getSnapshot = () => {
  const { a11yText, a11yContrast, a11yLinks, a11yMotion } = document.documentElement.dataset;
  return serialise({
    text: (a11yText as Prefs["text"]) ?? DEFAULTS.text,
    contrast: (a11yContrast as Prefs["contrast"]) ?? DEFAULTS.contrast,
    links: (a11yLinks as Prefs["links"]) ?? DEFAULTS.links,
    motion: (a11yMotion as Prefs["motion"]) ?? DEFAULTS.motion,
  });
};

const getServerSnapshot = () => serialise(DEFAULTS);

/**
 * A first-party accessibility panel. Deliberately not a third-party overlay:
 * overlays do not satisfy IS 5568 and frequently break screen readers. Every
 * toggle here maps to a plain CSS rule in globals.css.
 */
export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const prefs = parse(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot));
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const apply = useCallback((next: Prefs) => {
    const root = document.documentElement;
    root.dataset.a11yText = next.text;
    root.dataset.a11yContrast = next.contrast;
    root.dataset.a11yLinks = next.links;
    root.dataset.a11yMotion = next.motion;
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage blocked — the page still reflects the change */
    }
    window.dispatchEvent(new Event(PREFS_EVENT));
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  const textOptions: { value: Prefs["text"]; label: string }[] = [
    { value: "base", label: "רגיל" },
    { value: "lg", label: "גדול" },
    { value: "xl", label: "גדול מאוד" },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        className="tap inline-flex size-12 items-center justify-center rounded-full bg-slate text-white shadow-lg transition-colors hover:bg-slate-deep"
      >
        <Accessibility className="size-6" aria-hidden="true" />
        <span className="sr-only">תפריט נגישות</span>
      </button>

      <div
        id="a11y-panel"
        ref={panelRef}
        hidden={!open}
        role="dialog"
        aria-label="הגדרות נגישות"
        className="absolute bottom-full left-0 mb-3 w-[min(20rem,calc(100vw-3rem))] rounded-2xl border border-cream-200 bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-slate">הגדרות נגישות</h2>
          <button
            type="button"
            onClick={close}
            className="tap inline-flex items-center justify-center rounded-lg text-ink"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">סגירת תפריט הנגישות</span>
          </button>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-ink">גודל טקסט</legend>
          <div className="mt-2 flex gap-2">
            {textOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={prefs.text === option.value}
                onClick={() => apply({ ...prefs, text: option.value })}
                className={`tap flex-1 rounded-lg border px-2 py-2 text-sm transition-colors ${
                  prefs.text === option.value
                    ? "border-slate bg-slate text-white"
                    : "border-cream-200 text-ink hover:border-slate"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <ul className="mt-5 space-y-2">
          {(
            [
              { key: "contrast", label: "ניגודיות גבוהה", on: "on", off: "off" },
              { key: "links", label: "הדגשת קישורים", on: "on", off: "off" },
              { key: "motion", label: "עצירת אנימציות", on: "off", off: "on" },
            ] as const
          ).map((row) => {
            const pressed = prefs[row.key] === row.on;
            return (
              <li key={row.key}>
                <button
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => apply({ ...prefs, [row.key]: pressed ? row.off : row.on })}
                  className={`tap flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                    pressed ? "border-slate bg-slate text-white" : "border-cream-200 text-ink hover:border-slate"
                  }`}
                >
                  <span>{row.label}</span>
                  <span aria-hidden="true">{pressed ? "פעיל" : "כבוי"}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => apply(DEFAULTS)}
          className="tap mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cream-200 px-3 py-2 text-sm text-ink transition-colors hover:border-slate"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          איפוס הגדרות
        </button>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          נתקלתם בבעיית נגישות?{" "}
          <a href="/accessibility" className="underline underline-offset-2">
            להצהרת הנגישות ולפנייה
          </a>
        </p>
      </div>
    </>
  );
}
