import Link from "next/link";
import type { PortableTextComponents } from "@portabletext/react";

/**
 * Shared Portable Text renderer. Body colour is inherited from the surrounding
 * card/article; only the headings need to know which surface they sit on.
 */
function makeProse(
  surface: "light" | "dark",
  /** Where this prose sits in the page outline, so headings never skip a level. */
  startLevel: 2 | 4 = 2,
): PortableTextComponents {
  const heading = surface === "dark" ? "text-white" : "text-slate";
  const Major = `h${startLevel}` as "h2" | "h4";
  const Minor = `h${startLevel + 1}` as "h3" | "h5";

  return {
    block: {
      normal: ({ children }) => <p className="mb-4 leading-relaxed last:mb-0">{children}</p>,
      h2: ({ children }) => (
        <Major className={`mt-8 mb-3 text-xl first:mt-0 md:text-2xl ${heading}`}>{children}</Major>
      ),
      h3: ({ children }) => <Minor className={`mt-6 mb-2 text-lg ${heading}`}>{children}</Minor>,
      blockquote: ({ children }) => (
        <blockquote className="my-6 border-s-2 border-current/40 ps-5 italic">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="mb-4 space-y-2">{children}</ul>,
      number: ({ children }) => <ol className="mb-4 list-decimal space-y-2 ps-5">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="relative ps-5 leading-relaxed before:absolute before:top-[0.65em] before:start-0 before:size-1.5 before:rounded-full before:bg-current/60 before:content-['']">
          {children}
        </li>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-medium">{children}</strong>,
      link: ({ children, value }) => {
        const href = (value?.href as string) ?? "#";
        const external = href.startsWith("http");
        return (
          <Link
            href={href}
            className="underline underline-offset-4"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {children}
          </Link>
        );
      },
    },
  };
}

/** Article pages: the page title is the h1, so prose headings start at h2. */
export const proseComponents = makeProse("light");
/** Service cards: the card title is already an h3, so prose headings start at h4. */
export const proseInCard = makeProse("light", 4);
export const proseInCardOnDark = makeProse("dark", 4);
