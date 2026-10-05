"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent, writeConsent } from "@/lib/analytics";

/**
 * A consent gate, now that there is something to consent to.
 *
 * It used to be a notice: the site set no cookies and ran no analytics, so a
 * banner with "accept" and "reject" would have been theatre. Google Analytics
 * changed that, and the comment that stood here said what to do when it did -
 * make the refusal real. It is: "לא, תודה" stores a no, no script is ever
 * loaded, and nothing is sent to Google.
 *
 * Both answers are buttons of equal weight. A refusal hidden behind a link
 * while acceptance gets the coloured button is consent collected under
 * pressure, and worth nothing.
 */
export function PrivacyNotice() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Only after mount, so the server and client markup agree.
    const timer = setTimeout(() => {
      if (readConsent() === null) setShown(true);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const close = () => setShown(false);
    window.addEventListener(CONSENT_EVENT, close);
    return () => window.removeEventListener(CONSENT_EVENT, close);
  }, []);

  if (!shown) return null;

  return (
    <div
      data-site-chrome
      role="region"
      aria-label="הודעת פרטיות"
      className="on-dark fixed inset-x-0 bottom-0 z-40 bg-dark/97 px-4 py-4 shadow-[0_-6px_30px_rgba(44,50,56,0.25)] backdrop-blur print:hidden"
    >
      <div className="shell flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-on-dark">
          אני רוצה לדעת אילו עמודים מועילים, ולשם כך משתמשת בכלי מדידה של גוגל. הוא שומר מזהה
          בדפדפן שלך. בלי אישורך הוא לא נטען בכלל, והאתר עובד בדיוק אותו דבר.{" "}
          <Link href="/privacy" className="text-accent-light underline underline-offset-4">
            מדיניות הפרטיות
          </Link>
        </p>
        {/* Two buttons, same size, same prominence. */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="btn btn-primary px-5 py-2.5 text-sm"
          >
            מאשרת
          </button>
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="btn border border-white/40 px-5 py-2.5 text-sm text-on-dark transition-colors hover:border-white hover:bg-white/10"
          >
            לא, תודה
          </button>
        </div>
      </div>
    </div>
  );
}
