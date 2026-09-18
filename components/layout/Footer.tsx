import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { InstagramIcon, LinkedInIcon } from "@/components/brand/SocialIcons";
import type { SiteSettings } from "@/lib/content";

const legalItems = [
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "הצהרת נגישות", href: "/accessibility" },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer data-site-chrome className="on-dark bg-dark pt-20 pb-8 text-on-dark">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1fr_1.7fr_1fr]">
          <div>
            <Logo name={settings.name} tagline={settings.tagline} variant="dark" />
          </div>

          {/* The middle column carries the sentence rather than repeating the
              menu - every one of those links already sits in the header.
              Left ragged, not centred: centring Hebrew this long gives a
              jagged block with no edge to read down. */}
          {/* Centred in its column now that the drawing under it is gone -
              left ragged against nothing, the sentence hung off the edge of a
              column twice its width. */}
          <div className="md:col-span-2 lg:col-span-1 lg:self-center">
            <p className="mx-auto max-w-sm text-lg leading-relaxed text-balance text-on-dark lg:mx-0 md:text-xl">
              {settings.footerLine}
            </p>
          </div>

          <div>
            <span aria-hidden="true" className="mb-3 block h-0.5 w-7 bg-accent" />
            <h2 className="text-base font-medium text-on-dark">צרי קשר</h2>
            <ul className="mt-5 space-y-4 text-on-dark-muted">
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={`tel:${settings.phoneE164}`} className="transition-colors hover:text-accent">
                  {settings.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={`mailto:${settings.email}`} className="transition-colors hover:text-accent">
                  {settings.email}
                </a>
              </li>
            </ul>
            {(settings.instagram || settings.linkedin) && (
              <ul className="mt-6 flex items-center gap-3">
                {settings.instagram && (
                  <li>
                    <a
                      href={settings.instagram}
                      className="tap inline-flex items-center justify-center rounded-full border border-white/25 text-on-dark transition-colors hover:border-accent hover:text-accent"
                      rel="me noopener"
                    >
                      <InstagramIcon className="size-5" />
                      <span className="sr-only">אינסטגרם של {settings.name}</span>
                    </a>
                  </li>
                )}
                {settings.linkedin && (
                  <li>
                    <a
                      href={settings.linkedin}
                      className="tap inline-flex items-center justify-center rounded-full border border-white/25 text-on-dark transition-colors hover:border-accent hover:text-accent"
                      rel="me noopener"
                    >
                      <LinkedInIcon className="size-5" />
                      <span className="sr-only">לינקדאין של {settings.name}</span>
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 text-base text-on-dark-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.name}. כל הזכויות שמורות.
            {/* The site addresses the reader as "you" in the feminine
                throughout; saying so once is what keeps that a choice of
                voice rather than an exclusion. */}
            <span className="mt-1 block">{settings.footerNote}</span>
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline decoration-accent/70 underline-offset-4 transition-colors hover:text-accent">
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
