import { Rubik, Varela_Round } from "next/font/google";

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
