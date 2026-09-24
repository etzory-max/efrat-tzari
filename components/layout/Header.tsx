"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { drawings } from "@/components/art/drawings";
import { bookNavItems, navItems } from "@/lib/site";

export function Header({ name, tagline }: { name: string; tagline: string }) {
  /* The book page is its own page, not a section of the home page, so the bar
     above it has to point at the book's sections. Same header, same logo,
     different menu - deciding here keeps it out of every route's layout. */
  const onBookPage = usePathname()?.startsWith("/gentle-cracks") ?? false;
  const items = onBookPage ? bookNavItems : navItems;
  const contactHref = onBookPage ? "#contact" : "/#contact";

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
      data-site-chrome
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
          aria-label={`${name} - לעמוד הבית`}
        >
          <Logo name={name} tagline={tagline} />
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-4 xl:gap-6">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative inline-flex items-center py-2 text-base text-ink transition-colors duration-200 hover:text-accent-ink focus-visible:text-accent-ink after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-accent-ink after:transition-transform after:duration-200 hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={contactHref}
            className="btn btn-primary hidden px-5 py-3 text-base sm:inline-flex"
          >
            דברי איתי
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
            <Logo name={name} tagline={tagline} />
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
              {items.map((item) => (
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
            {/* Was /images/art-kids-table.png, which no longer exists - the
                drawer has been showing a broken image. The drawings carry
                their own dimensions now, so this cannot drift again. */}
            <Image
              src={drawings["art-family-hold"].src}
              alt=""
              width={drawings["art-family-hold"].width}
              height={drawings["art-family-hold"].height}
              sizes="180px"
              aria-hidden="true"
              className="mx-auto mb-5 h-24 w-auto opacity-70"
            />
            <Link
              href={contactHref}
              onClick={close}
              className="btn btn-primary w-full px-5 py-4 text-base"
            >
              דברי איתי
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
