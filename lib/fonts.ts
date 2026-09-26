import { Frank_Ruhl_Libre, Rubik, Varela_Round } from "next/font/google";

/** Body copy across the whole site. */
export const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-rubik",
});

/**
 * Headings, large and small, plus the section labels.
 * Varela Round ships a single weight (400), so display type carries its
 * lightness through size and spacing rather than through weight.
 */
export const varelaRound = Varela_Round({
  subsets: ["hebrew", "latin"],
  weight: "400",
  display: "swap",
  variable: "--font-varela",
});

/**
 * The first story, and only it: Frank Ruhl Libre is the open cut of
 * Frank-Ruhl, the face most Hebrew books are set in. A story set in the
 * site's UI sans would read as another section of a website; set in this,
 * it reads as a page of the book it came from.
 */
export const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-frank",
});
