export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * Efrat's project. Hard-coded rather than left to an environment variable
 * because it is not a secret — every visitor's browser receives it with the
 * page, and the repository is public. Keeping it here means the one thing that
 * has to be set in Vercel is the write token, which really is secret. An env
 * var still overrides it, for anyone pointing the site at another dataset.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "i4b6c318";

/** False only if someone deliberately blanks the id to fall back to /content. */
export const sanityConfigured = projectId.length > 0;
