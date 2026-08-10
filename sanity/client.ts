import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { apiVersion, dataset, projectId, sanityConfigured } from "./env";

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

export const sanityClient = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

const builder = sanityConfigured ? imageUrlBuilder({ projectId, dataset }) : null;

export function urlFor(source: SanityImageSource, width: number) {
  return builder?.image(source).width(width).auto("format").quality(80).url() ?? "";
}
