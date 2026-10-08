import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/client";
import { defaultContent } from "@/content/defaults";

/**
 * A guide, served from this site's own address.
 *
 * The bytes live in the Studio so Efrat can replace a version herself, but a
 * reader who copies the link, a post that points at it and a search result
 * that lists it all see tzory.com/guides/<name>. Swapping the file leaves the
 * address exactly where it was, which is the whole reason this route exists
 * rather than a link straight to Sanity's CDN.
 *
 * If the Studio has no file yet, the copy that ships with the site is served
 * from /files - so the page is never a button that leads nowhere.
 */
export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;

  const known = defaultContent.resources.some((item) => item.slug === slug);

  let url: string | null = null;
  let filename = `${slug}.pdf`;

  try {
    const doc = await sanityClient?.fetch<{ url?: string; name?: string } | null>(
      /* groq */ `*[_type == "resource" && slug.current == $slug][0] {
        "url": file.asset->url, "name": file.asset->originalFilename
      }`,
      { slug },
      { next: { revalidate: 300, tags: ["content"] } },
    );
    if (doc?.url) {
      url = doc.url;
      if (doc.name) filename = doc.name;
    }
  } catch (error) {
    console.error("[guides] Sanity lookup failed", error);
  }

  if (!url) {
    if (!known) return new NextResponse("לא נמצא", { status: 404 });
    // The seeded copy, beside the site's other files.
    return NextResponse.redirect(new URL(`/files/${slug}.pdf`, _request.url), 307);
  }

  const upstream = await fetch(url, { next: { revalidate: 300 } });
  if (!upstream.ok || !upstream.body) {
    return new NextResponse("הקובץ אינו זמין כרגע", { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/pdf",
      /* inline: a guide should open and be readable, not land in a downloads
         folder a reader then has to go and find. */
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
