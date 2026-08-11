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

export type Book = {
  title: string;
  subtitle: string;
  /** One or two lines bridging from the practice to the book. */
  blurb: string;
  cover: Img;
  buyLabel: string;
  buyHref: string;
};

export type AboutSection = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  portrait: Img;
  badgeValue: string;
  badgeLabel: string;
  /** Four short statements — replaced the business figures the demo showed. */
  points: string[];
  book?: Book;
};

export type MediaItem = {
  /** Drives the card's tag and what happens on activation. */
  kind: "video" | "podcast" | "press";
  title: string;
  /** Outlet or programme name. */
  outlet: string;
  date?: string;
  /** Short standalone summary — also what a screen reader gets for a PDF scan. */
  summary: string;
  poster: Img;
  /** YouTube id for video/podcast; a file or page URL for press. */
  youtubeId?: string;
  href?: string;
};

export type MediaSection = {
  eyebrow: string;
  title: string;
  lead: string;
  items: MediaItem[];
};

export type GuideSection = {
  eyebrow: string;
  title: string;
  lead: string;
  bullets: string[];
  consentLabel: string;
  submitLabel: string;
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
  /**
   * The consent checkbox is now the only notice at the point of collection —
   * it links to /privacy, which carries the full disclosure.
   */
  consentLabel: string;
};

export type SiteContent = {
  hero: HeroSlide[];
  about: AboutSection;
  approach: ApproachSection;
  services: ServicesSection;
  media: MediaSection;
  articles: ArticlesSection;
  guide: GuideSection;
  faq: FaqSection;
  contact: ContactSection;
};
