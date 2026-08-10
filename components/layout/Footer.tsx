import Link from "next/link";
import { Clock, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { FacebookIcon, InstagramIcon } from "@/components/brand/SocialIcons";
import { navItems, site } from "@/lib/site";

const legalItems = [
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "הצהרת נגישות", href: "/accessibility" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-dark pt-20 pb-8 text-on-dark">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo variant="dark" />
            <p className="mt-6 max-w-sm text-on-dark-muted">
              ליווי מקצועי וחם למשפחות עם ילדים על הרצף האוטיסטי — כלים מעשיים שמותאמים
              בדיוק לכם.
            </p>

            {(site.social.instagram || site.social.facebook) && (
              <ul className="mt-6 flex items-center gap-3">
                {site.social.instagram && (
                  <li>
                    <a
                      href={site.social.instagram}
                      className="tap inline-flex items-center justify-center rounded-full border border-white/25 text-on-dark transition-colors hover:border-white/60 hover:bg-white/10"
                      rel="me noopener"
                    >
                      <InstagramIcon className="size-5" />
                      <span className="sr-only">אינסטגרם של אפרת צרי</span>
                    </a>
                  </li>
                )}
                {site.social.facebook && (
                  <li>
                    <a
                      href={site.social.facebook}
                      className="tap inline-flex items-center justify-center rounded-full border border-white/25 text-on-dark transition-colors hover:border-white/60 hover:bg-white/10"
                      rel="me noopener"
                    >
                      <FacebookIcon className="size-5" />
                      <span className="sr-only">פייסבוק של אפרת צרי</span>
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          <nav aria-label="ניווט בתחתית העמוד">
            <h2 className="text-base font-medium text-on-dark">ניווט מהיר</h2>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-on-dark-muted transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-base font-medium text-on-dark">צרי קשר</h2>
            <ul className="mt-5 space-y-4 text-on-dark-muted">
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-sage" aria-hidden="true" />
                <a href={`tel:${site.phoneE164}`} className="transition-colors hover:text-white">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-sage" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-1 size-4 shrink-0 text-sage" aria-hidden="true" />
                <span>{site.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 text-sm text-on-dark-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. כל הזכויות שמורות.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline underline-offset-4 transition-colors hover:text-white">
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
