import { getContent } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Services } from "@/components/sections/Services";
import { Articles } from "@/components/sections/Articles";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { FaqJsonLd, ServicesJsonLd } from "@/components/seo/JsonLd";

export default async function HomePage() {
  const content = await getContent();

  return (
    <>
      <Hero slides={content.hero} />
      <About data={content.about} />
      <Approach data={content.approach} />
      <Services data={content.services} />
      <Articles data={content.articles} />
      <Faq data={content.faq} />
      <Contact data={content.contact} />

      <FaqJsonLd items={content.faq.items} />
      <ServicesJsonLd services={content.services.services} />
    </>
  );
}
