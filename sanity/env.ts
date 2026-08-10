export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

/** Until a project id is set, the site renders the seed content from /content. */
export const sanityConfigured = projectId.length > 0;
