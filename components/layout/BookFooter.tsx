import Link from "next/link";
import type { SiteSettings } from "@/lib/content";

const legalItems = [
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "הצהרת נגישות", href: "/accessibility" },
];

/**
 * The foot of the book page.
 *
 * The site's own footer is built around the practice - the mark, the sentence
 * about parents on the spectrum, the three-column spread. None of that belongs
 * under a book, so this one carries the author, the way to reach her, and the
 * two links the law requires. One line, then the small print.
 */
export function BookFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer data-site-chrome className="on-dark bg-dark py-12 text-on-dark">
      <div className="shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-baseline md:justify-between">
          <p className="text-xl text-on-dark">
            אפרת צרי
            <span className="mt-1 block text-base text-on-dark-muted">שברים עדינים</span>
          </p>

          {/* Separators rather than a list of rows: three short details read
              as one line, and a line is all this page needs. */}
          <p className="text-base text-on-dark-muted">
            <a href={`tel:${settings.phoneE164}`} className="transition-colors hover:text-accent">
              {settings.phoneDisplay}
            </a>
            <span aria-hidden="true" className="px-2 text-white/30">
              ·
            </span>
            <a href={`mailto:${settings.email}`} className="transition-colors hover:text-accent">
              {settings.email}
            </a>
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-on-dark-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} אפרת צרי. כל הזכויות שמורות.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="underline decoration-accent/70 underline-offset-4 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
