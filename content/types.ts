import type { PortableTextBlock } from "@portabletext/react";

export type Img = {
  src: string;
  alt: string;
  /** Present when the image comes from Sanity — enables blur-up + CDN sizing. */
  lqip?: string;
};

export type HeroSlide = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: Img;
};

export type Stat = { value: string; label: string };

export type AboutSection = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  portrait: Img;
  badgeValue: string;
  badgeLabel: string;
  stats: Stat[];
};

export type ApproachCard = {
  icon: "heart" | "star" | "leaf";
  title: string;
  body: string;
};

export type ApproachSection = {
  eyebrow: string;
  title: string;
  lead: string;
  cards: ApproachCard[];
  quote: string;
  quoteAuthor: string;
};

export type Service = {
  id: string;
  icon: "users" | "mic" | "book";
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  variant: "dark" | "light";
  moreLabel: string;
  /** Long-form copy revealed by "קראי עוד" — also feeds the Service JSON-LD. */
  details: PortableTextBlock[];
};

export type ServicesSection = {
  eyebrow: string;
  title: string;
  services: Service[];
};

export type Article = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  image: Img;
  readingMinutes: number;
  body: PortableTextBlock[];
};

export type ArticlesSection = {
  eyebrow: string;
  title: string;
  articles: Article[];
};

export type FaqItem = { question: string; answer: string };

export type FaqSection = {
  eyebrow: string;
  title: string;
  lead: string;
  items: FaqItem[];
};

export type ContactSection = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Notice shown at the point of collection (Privacy Protection Law, Amdt. 13). */
  privacyNotice: string;
  consentLabel: string;
  subjects: string[];
};

export type SiteContent = {
  hero: HeroSlide[];
  about: AboutSection;
  approach: ApproachSection;
  services: ServicesSection;
  articles: ArticlesSection;
  faq: FaqSection;
  contact: ContactSection;
};
