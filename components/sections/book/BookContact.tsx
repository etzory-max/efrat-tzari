import { Mail, MessageCircle, Phone } from "lucide-react";
import type { ContactSection } from "@/content/types";
import type { SiteSettings } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * A strip, not a form.
 *
 * The home page asks for a phone number because what follows is a call about
 * a child. Here the thing being sold is a book, and the payment page already
 * takes the details - anyone writing to this page has a question, and a
 * question wants the shortest possible route out: tap the number, tap
 * WhatsApp, tap the address. So the section is one band across the page with
 * the sentence on one side and three targets on the other, and there is
 * nothing to fill in.
 */
export function BookContact({
  data,
  settings,
}: {
  data: ContactSection;
  settings: SiteSettings;
}) {
  const actions = [
    { label: settings.phoneDisplay, href: `tel:${settings.phoneE164}`, Icon: Phone, note: "חיוג" },
    { label: "וואטסאפ", href: settings.whatsappHref, Icon: MessageCircle, note: "הודעה" },
    { label: settings.email, href: `mailto:${settings.email}`, Icon: Mail, note: "מייל" },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="book-contact-title"
      className="on-accent bg-accent py-14 text-ink md:py-16"
    >
      <div className="shell grid items-center gap-9 lg:grid-cols-[1fr_auto] lg:gap-16">
        <Reveal>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="book-contact-title" className="mt-3 text-3xl text-ink md:text-4xl">
            {data.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink/80">{data.lead}</p>
        </Reveal>

        {/* Three targets in a row on a wide screen, stacked on a phone - each
            one its own tap area, each one leaving the site rather than
            collecting anything. */}
        <Reveal delay={120}>
          <ul className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            {actions.map(({ label, href, Icon, note }) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center gap-3 rounded-2xl bg-white/85 px-5 py-4 text-ink transition-colors hover:bg-white"
                >
                  <Icon className="size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <span>
                    <span className="block text-sm text-muted">{note}</span>
                    <span className="block text-lg">{label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
