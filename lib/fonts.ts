import { Heebo } from "next/font/google";

/**
 * Heebo carries the whole page — display and body alike.
 * Self-hosted by next/font, so there is no render-blocking Google request
 * and no FOUT.
 */
export const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-heebo",
});
