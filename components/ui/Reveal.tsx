"use client";

import { useEffect, useRef } from "react";

/**
 * One IntersectionObserver for the whole page rather than one per element —
 * a long page has dozens of revealed blocks and they all want the same
 * threshold.
 */
let observer: IntersectionObserver | null = null;
const callbacks = new Map<Element, () => void>();

function getObserver() {
  if (typeof IntersectionObserver === "undefined") return null;
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
      }
    },
    // Fire a little before the element is fully on screen, so the motion
    // finishes about when the reader's eye arrives.
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );
  return observer;
}

type RevealProps = {
  children: React.ReactNode;
  /** Stagger within a group, in milliseconds. */
  delay?: number;
  className?: string;
  /** Reveal on mount instead of on scroll — for content already above the fold. */
  immediate?: boolean;
};

export function Reveal({ children, delay = 0, className, immediate = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => {
      element.setAttribute("data-revealed", "");
      callbacks.delete(element);
      getObserver()?.unobserve(element);
      element.removeEventListener("focusin", reveal);
    };

    if (immediate) {
      // Next frame, so the transition has an initial state to move from.
      const frame = requestAnimationFrame(reveal);
      return () => cancelAnimationFrame(frame);
    }

    const io = getObserver();
    if (!io) {
      reveal();
      return;
    }

    // Keyboard users can tab into a block before it scrolls into view; it must
    // never be focused while still faded out.
    element.addEventListener("focusin", reveal);
    callbacks.set(element, reveal);
    io.observe(element);

    return () => {
      element.removeEventListener("focusin", reveal);
      callbacks.delete(element);
      io.unobserve(element);
    };
  }, [immediate]);

  return (
    <div
      ref={ref}
      data-reveal-item=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
