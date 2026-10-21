import type { Metadata } from "next";
import { HomeView } from "@/components/HomeView";
import { getLecture } from "@/lib/content";

/**
 * tzory.com/lecture: the home page with the lecture lightbox open on arrival.
 *
 * It exists for Instagram, which reads the "#" in tzory.com/#lecture as the
 * start of a hashtag and breaks the link there. The old address still works.
 *
 * Its own title and share card, so a link sent on WhatsApp or Facebook shows
 * the lecture rather than the site's general preview - but the canonical is
 * the home page, because this is the home page, not a second copy of it.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lecture = await getLecture();
  const title = lecture.title.replace(/[״"]/g, "");
  const description = `${lecture.subtitle}. ${lecture.audience}`;
  const image = { url: "/images/og-lecture.9d7d6bd7.jpg", width: 1200, height: 630, alt: lecture.photo.alt };

  return {
    title: `הרצאה: ${title}`,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/lecture",
      title: `${title} · הרצאה של אפרת צרי`,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · הרצאה של אפרת צרי`,
      description,
      images: [image.url],
    },
  };
}

export default function LecturePage() {
  return <HomeView openLecture />;
}
