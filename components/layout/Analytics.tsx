"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, GA_ID, readConsent, type Consent } from "@/lib/analytics";

/**
 * Google Analytics, loaded only after a yes.
 *
 * Mounted on every page but inert until consent exists: no script tag, no
 * request to Google, no identifier in the browser. It listens for the
 * banner's answer so the first page view is still counted for a visitor who
 * agrees - without that, agreeing would cost her the very visit she agreed on.
 */
export function Analytics() {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onAnswer = (event: Event) => setConsent((event as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_EVENT, onAnswer);
    return () => window.removeEventListener(CONSENT_EVENT, onAnswer);
  }, []);

  if (consent !== "granted" || !GA_ID) return null;

  return (
    <>
      <Script
        id="ga-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
window.gtag=gtag;gtag('js',new Date());
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
gtag('config','${GA_ID}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
