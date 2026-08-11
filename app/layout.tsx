import type { Metadata, Viewport } from "next";
import "./globals.css";
import { rubik, varelaRound } from "@/lib/fonts";
import { allowIndexing, site, siteUrl } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { PrivacyNotice } from "@/components/layout/PrivacyNotice";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "הורות מותאמת",
    "ילדים על הרצף האוטיסטי",
    "ייעוץ הורים",
    "ליווי משפחות",
    "הרצאות להורים",
    "סדנאות להורים",
    "אפרת צרי",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: siteUrl,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    // A static JPEG, not a generated one: WhatsApp is the fussiest consumer
    // of this tag and it wants a plain, light image at an absolute URL.
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  robots: allowIndexing
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
      }
    : { index: false, follow: false, nocache: true },
  formatDetection: { telephone: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#465b6d",
  // Users must be able to zoom — never lock this down.
  maximumScale: 5,
};

/**
 * Applies saved accessibility preferences and arms the scroll reveal before
 * first paint. `data-reveal` is what allows the CSS to hide anything at all —
 * if this script never runs, every element stays visible.
 */
const a11yBootstrap = `try{var p=JSON.parse(localStorage.getItem('efrat-a11y')||'{}');var d=document.documentElement;if(p.text)d.dataset.a11yText=p.text;if(p.contrast)d.dataset.a11yContrast=p.contrast;if(p.links)d.dataset.a11yLinks=p.links;if(p.motion)d.dataset.a11yMotion=p.motion;if(window.matchMedia&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.reveal='on';}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} ${varelaRound.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-cream-50 antialiased">
        <script dangerouslySetInnerHTML={{ __html: a11yBootstrap }} />
        <SkipLink />
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <FloatingActions />
        <PrivacyNotice />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
