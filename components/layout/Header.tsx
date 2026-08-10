"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { navItems } from "@/lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Compact the bar once the user leaves the top of the page.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Drawer: lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white transition-shadow duration-300 ${
        scrolled ? "border-cream-200 shadow-[0_1px_16px_rgba(44,50,56,0.07)]" : "border-transparent"
      }`}
    >
      <div
        className="shell flex items-center justify-between gap-6 transition-[height] duration-300"
        style={{
          height: scrolled ? "4.5rem" : "6rem",
          ["--logo-size" as string]: scrolled ? "2.75rem" : "3.5rem",
        }}
      >
        <Link
          href="/"
          className="tap flex items-center rounded-lg"
          aria-label={`${"אפרת צרי"} — לעמוד הבית`}
        >
          <Logo />
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative inline-flex items-center py-2 text-[0.9375rem] text-ink transition-colors duration-200 hover:text-slate focus-visible:text-slate after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-slate after:transition-transform after:duration-200 hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#contact"
            className="tap hidden items-center justify-center rounded-xl bg-slate px-5 py-3 text-[0.9375rem] font-medium text-white transition-colors duration-200 hover:bg-slate-deep sm:inline-flex"
          >
            לקביעת שיחה
          </Link>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="tap inline-flex items-center justify-center rounded-xl text-ink lg:hidden"
          >
            <Menu className="size-7" aria-hidden="true" />
            <span className="sr-only">פתיחת תפריט ניווט</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 z-50 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
      >
        <div
          className="absolute inset-0 bg-dark/50"
          onClick={close}
          aria-hidden="true"
        />
        <div
          ref={panelRef}
          className="absolute inset-y-0 start-0 flex w-[min(22rem,88vw)] flex-col bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-cream-200 px-6 py-5">
            <Logo />
            <button
              type="button"
              data-autofocus
              onClick={close}
              className="tap inline-flex items-center justify-center rounded-xl text-ink"
            >
              <X className="size-6" aria-hidden="true" />
              <span className="sr-only">סגירת התפריט</span>
            </button>
          </div>

          <nav aria-label="ניווט ראשי (מובייל)" className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="tap flex items-center border-b border-cream-100 py-4 text-lg text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-cream-200 p-6">
            <Link
              href="#contact"
              onClick={close}
              className="tap flex items-center justify-center rounded-xl bg-slate px-5 py-4 text-base font-medium text-white"
            >
              לקביעת שיחה
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
