import { getContent } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { Recognise } from "@/components/sections/Recognise";
import { Approach } from "@/components/sections/Approach";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Media } from "@/components/sections/Media";
import { Articles } from "@/components/sections/Articles";
import { Guide } from "@/components/sections/Guide";
import { Faq } from "@/components/sections/Faq";
import { NotHere } from "@/components/sections/NotHere";
import { Contact } from "@/components/sections/Contact";
import { FaqJsonLd, MediaJsonLd, ServicesJsonLd } from "@/components/seo/JsonLd";

export default async function HomePage() {
  const content = await getContent();

  return (
    <>
      <Hero data={content.hero} />
      {content.recognise && <Recognise data={content.recognise} />}
      {/* Before "about": the reader is shown how the work is structured
          before she is told who is offering it. */}
      <Approach data={content.approach} numbered tone="light" />
      <About data={content.about} tone="deep" />
      <Services data={content.services} />
      <Media data={content.media} />
      <Articles data={content.articles} tone="light" />
      <Guide data={content.guide} tone="deep" />
      <Faq data={content.faq} />
      {/* Last thing read before the form: what she is not being sold. */}
      {content.notHere && <NotHere data={content.notHere} variant="dark" />}
      <Contact data={content.contact} />

      <FaqJsonLd items={content.faq.items} />
      <ServicesJsonLd services={content.services.services} />
      <MediaJsonLd items={content.media.items} />
    </>
  );
}
