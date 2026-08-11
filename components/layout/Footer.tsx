import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { FacebookIcon, InstagramIcon } from "@/components/brand/SocialIcons";
import { site } from "@/lib/site";

const legalItems = [
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "הצהרת נגישות", href: "/accessibility" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-dark pt-20 pb-8 text-on-dark">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1fr_1.7fr_1fr]">
          <div>
            <Logo variant="dark" />

            {(site.social.instagram || site.social.facebook) && (
              <ul className="mt-6 flex items-center gap-3">
                {site.social.instagram && (
                  <li>
                    <a
                      href={site.social.instagram}
                      className="tap inline-flex items-center justify-center rounded-full border border-white/25 text-on-dark transition-colors hover:border-accent hover:text-accent"
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
                      className="tap inline-flex items-center justify-center rounded-full border border-white/25 text-on-dark transition-colors hover:border-accent hover:text-accent"
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

          {/* The middle column carries the sentence rather than repeating the
              menu — every one of those links already sits in the header.
              Left ragged, not centred: centring Hebrew this long gives a
              jagged block with no edge to read down. */}
          <div className="md:col-span-2 lg:col-span-1">
            <p className="max-w-md text-lg leading-relaxed text-balance text-on-dark md:text-xl">
              ליווי מקצועי וחם למשפחות עם ילדים על הרצף האוטיסטי — כלים מעשיים שמותאמים בדיוק
              לכם.
            </p>
            {/* Tinted light so the line art reads on the dark footer. */}
            <Image
              src="/images/art-kid-ball-light.png"
              alt=""
              width={691}
              height={900}
              sizes="160px"
              className="mx-auto mt-8 h-28 w-auto opacity-75 md:h-32 lg:mx-0"
            />
          </div>

          <div>
            <span aria-hidden="true" className="mb-3 block h-0.5 w-7 bg-accent" />
            <h2 className="text-base font-medium text-on-dark">צרי קשר</h2>
            <ul className="mt-5 space-y-4 text-on-dark-muted">
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={`tel:${site.phoneE164}`} className="transition-colors hover:text-accent">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-accent">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
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
