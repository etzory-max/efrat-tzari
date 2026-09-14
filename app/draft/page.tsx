import type { Metadata } from "next";
import { draftContent } from "@/content/draft";
import { Hero } from "@/components/sections/Hero";
import { Recognise } from "@/components/sections/Recognise";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Services } from "@/components/sections/Services";
import { Media } from "@/components/sections/Media";
import { Articles } from "@/components/sections/Articles";
import { Guide } from "@/components/sections/Guide";
import { Faq } from "@/components/sections/Faq";
import { NotHere } from "@/components/sections/NotHere";
import { Contact } from "@/components/sections/Contact";

/**
 * The copy workbench. Same components and same order as the home page, fed
 * from `content/draft.ts` instead of the CMS — so a section that has already
 * been rewritten sits next to sections that have not, and the seam is visible.
 *
 * No JSON-LD here: a second page carrying the same FAQ and Service markup
 * would compete with the real one. Kept out of the index and the sitemap.
 */
export const metadata: Metadata = {
  title: "טיוטה - גרסת ביניים",
  robots: { index: false, follow: false },
};

export default function DraftPage() {
  const content = draftContent;

  return (
    <>
      <Hero data={content.hero} />
      {content.recognise && <Recognise data={content.recognise} />}
      {/* Ahead of "about" here, unlike the live page: the reader is shown how
          the work is structured before she is told who is offering it. */}
      <Approach data={content.approach} numbered tone="light" />
      <About data={content.about} tone="deep" />
      <Services data={content.services} />
      <Media data={content.media} />
      <Articles data={content.articles} tone="light" />
      <Guide data={content.guide} tone="deep" />
      <Faq data={content.faq} />
      {/* Last thing read before the form: what she is not being sold. The dark
          treatment is option 1 from /draft/not-here, still on trial. */}
      {content.notHere && <NotHere data={content.notHere} variant="dark" />}
      <Contact data={content.contact} />
    </>
  );
}
