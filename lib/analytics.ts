/**
 * Measurement, and the consent it waits for.
 *
 * Google Analytics writes an identifier into the visitor's browser, which
 * under Israeli privacy law and the GDPR is something she has to agree to
 * first - not be told about after the fact. So nothing here loads until she
 * says yes, the refusal is real (no script, no request, no identifier), and
 * her answer is remembered so she is not asked twice.
 *
 * The answer lives in localStorage rather than a cookie: a cookie would be
 * sent to the server on every request, which is exactly the thing a visitor
 * who refused is trying to avoid.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-HWZ16FS67P";

export const CONSENT_KEY = "efrat-analytics-consent";

/** Fired when the banner is answered, so the page reacts without a reload. */
export const CONSENT_EVENT = "efrat:consent";

export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Storage blocked. Treated as "not answered", and nothing loads.
    return null;
  }
}

export function writeConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* blocked storage: the choice holds for this page view only */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/**
 * One of the four things worth knowing: did she take the guide, write, open
 * WhatsApp, or go to buy the book. Silent when analytics never loaded, which
 * is the whole point - a refusal must not be worked around.
 */
export function track(event: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params ?? {});
}
