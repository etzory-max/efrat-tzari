import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { sanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export const metadata = {
  title: "ניהול תוכן",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <div className="shell py-24">
        <h1 className="text-3xl text-slate">מערכת הניהול עדיין לא מחוברת</h1>
        <p className="mt-4 max-w-prose text-muted">
          כדי להפעיל את ה-Studio יש להגדיר את משתני הסביבה{" "}
          <code className="rounded bg-cream-100 px-1">NEXT_PUBLIC_SANITY_PROJECT_ID</code> ו-
          <code className="rounded bg-cream-100 px-1">NEXT_PUBLIC_SANITY_DATASET</code> ולהריץ מחדש.
          עד אז האתר מציג את תוכן ברירת המחדל.
        </p>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
