"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KEY = "efrat-privacy-notice";

/**
 * Deliberately a notice, not a consent gate.
 *
 * The site sets no cookies and runs no analytics or advertising pixels, so
 * there is nothing to ask permission for — a banner with "accept" and
 * "reject" would be claiming to gate something that does not exist. What is
 * worth saying, next to a form that collects a name and a phone number, is
 * plainly what happens to it. If analytics are ever added, this has to become
 * a real consent gate with a working refusal.
 */
export function PrivacyNotice() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Only after mount, so the server and client markup agree.
    const timer = setTimeout(() => {
      try {
        if (localStorage.getItem(KEY) !== "seen") setShown(true);
      } catch {
        setShown(true);
      }
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  if (!shown) return null;

  const dismiss = () => {
    setShown(false);
    try {
      localStorage.setItem(KEY, "seen");
    } catch {
      /* storage blocked — it will simply show again next time */
    }
  };

  return (
    <div
      data-site-chrome
      role="region"
      aria-label="הודעת פרטיות"
      className="on-dark fixed inset-x-0 bottom-0 z-40 bg-dark/97 px-4 py-4 shadow-[0_-6px_30px_rgba(44,50,56,0.25)] backdrop-blur print:hidden"
    >
      <div className="shell flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-on-dark">
          באתר הזה אין עוגיות מעקב, אנליטיקה או פיקסלים פרסומיים. פרטים שתשאירו בטופס נשלחים
          אליי במייל בלבד ואינם נשמרים.{" "}
          <Link href="/privacy" className="text-accent-light underline underline-offset-4">
            מדיניות הפרטיות
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="btn btn-primary shrink-0 gap-2 px-5 py-2.5 text-sm"
        >
          הבנתי
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
