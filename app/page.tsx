import { getContent, getSiteSettings } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { Recognise } from "@/components/sections/Recognise";
import { Approach } from "@/components/sections/Approach";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Media } from "@/components/sections/Media";
import { Articles } from "@/components/sections/Articles";
import { Guide } from "@/components/sections/Guide";
import { Faq } from "@/components/sections/Faq";
import { NotHere } from "@/components/sections/NotHere";
import { Contact } from "@/components/sections/Contact";
import { FaqJsonLd, MediaJsonLd, ServicesJsonLd } from "@/components/seo/JsonLd";

export default async function HomePage() {
  const [content, settings] = await Promise.all([getContent(), getSiteSettings()]);

  return (
    <>
      <Hero data={content.hero} />
      {content.recognise && <Recognise data={content.recognise} />}
      {/* Before "about": the reader is shown how the work is structured
          before she is told who is offering it. */}
      <Approach data={content.approach} numbered tone="light" />
      <About data={content.about} tone="deep" />
      <Services data={content.services} />
      {/* Right after the price: proof at the moment she is deciding. */}
      {content.testimonials && <Testimonials data={content.testimonials} surface="wash" />}
      <Media data={content.media} tone="light" />
      <Articles data={content.articles} />
      <Guide data={content.guide} tone="light" />
      <Faq data={content.faq} tone="deep" />
      {/* Last thing read before the form: what she is not being sold. */}
      {content.notHere && <NotHere data={content.notHere} variant="dark" />}
      <Contact data={content.contact} settings={settings} />

      <FaqJsonLd items={content.faq.items} />
      <ServicesJsonLd services={content.services.services} />
      <MediaJsonLd items={content.media.items} />
    </>
  );
}
