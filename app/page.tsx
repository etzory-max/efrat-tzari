import { getContent } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Services } from "@/components/sections/Services";
import { Media } from "@/components/sections/Media";
import { Articles } from "@/components/sections/Articles";
import { Guide } from "@/components/sections/Guide";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { BookJsonLd, FaqJsonLd, MediaJsonLd, ServicesJsonLd } from "@/components/seo/JsonLd";

export default async function HomePage() {
  const content = await getContent();

  return (
    <>
      <Hero slides={content.hero} />
      <About data={content.about} />
      <Approach data={content.approach} />
      <Services data={content.services} />
      <Media data={content.media} />
      <Articles data={content.articles} />
      <Guide data={content.guide} />
      <Faq data={content.faq} />
      <Contact data={content.contact} />

      <FaqJsonLd items={content.faq.items} />
      <ServicesJsonLd services={content.services.services} />
      <MediaJsonLd items={content.media.items} />
      {content.about.book && <BookJsonLd book={content.about.book} />}
    </>
  );
}
