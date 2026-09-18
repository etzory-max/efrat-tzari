import type { PortableTextBlock } from "@portabletext/react";

export type Img = {
  src: string;
  alt: string;
  /** Present when the image comes from Sanity — enables blur-up + CDN sizing. */
  lqip?: string;
};

export type Hero = {
  /** Section label above the headline — the positioning line. */
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  /** A quieter second action for readers not ready to make contact yet. */
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
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

/**
 * One moment in an ordinary day. `time` is a phase rather than a clock
 * reading — two of the four are not tied to an hour, and pretending
 * otherwise would make the timeline lie about the content.
 */
export type RecogniseItem = { time: string; title: string; body: string };

export type RecogniseSection = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Caption over the timeline — what the four moments add up to. */
  timelineLabel: string;
  items: RecogniseItem[];
  /** The line that turns the section from recognition towards the offer. */
  closer: string;
};

/** One thing the practice deliberately does not offer. */
export type NotHereItem = { title: string; body: string };

export type NotHereSection = {
  eyebrow: string;
  title: string;
  items: NotHereItem[];
};

/** One parent, in her own words. */
export type Testimonial = {
  quote: string;
  name: string;
  /** How she describes herself — "אמא לבן בן 7". Optional. */
  role?: string;
};

export type TestimonialsSection = {
  eyebrow: string;
  title: string;
  items: Testimonial[];
};

export type ApproachCard = {
  /**
   * The first three are the original photographic-style PNGs; the last three
   * are drawn inline and take their colour from the card.
   */
  icon: "heart" | "star" | "leaf" | "shift" | "household" | "anchor";
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
  /**
   * Long-form copy revealed by "קראי עוד" — also feeds the Service JSON-LD.
   * An empty array hides the expander entirely.
   */
  details: PortableTextBlock[];
  /** What it costs, or how it is booked. */
  price?: string;
  /** Terms worth stating up front — format, availability. */
  note?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type ServicesSection = {
  eyebrow: string;
  title: string;
  /** Optional standfirst under the section heading. */
  lead?: string;
  services: Service[];
  /** The line that closes the section, and the button under it. */
  ctaTitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
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
  hero: Hero;
  /** Optional while the draft carries it and the live page does not. */
  recognise?: RecogniseSection;
  about: AboutSection;
  approach: ApproachSection;
  services: ServicesSection;
  /** Optional: the section only renders when there are quotes to show. */
  testimonials?: TestimonialsSection;
  media: MediaSection;
  articles: ArticlesSection;
  guide: GuideSection;
  faq: FaqSection;
  /** Optional while the draft carries it and the live page does not. */
  notHere?: NotHereSection;
  contact: ContactSection;
};
