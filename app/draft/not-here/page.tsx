import type { Metadata } from "next";
import { draftContent } from "@/content/draft";
import { NotHere, type NotHereVariant } from "@/components/sections/NotHere";

/**
 * Three treatments of one section, stacked, so they can be compared by
 * scrolling instead of by reloading. Temporary — it goes once one is chosen.
 */
export const metadata: Metadata = {
  title: "מה שלא תמצאי כאן - שלוש אפשרויות",
  robots: { index: false, follow: false },
};

const options: { variant: NotHereVariant; n: string; name: string; note: string }[] = [
  {
    variant: "dark",
    n: "1",
    name: "סקשן כהה",
    note: "רקע slate, מונחים בלבן, הסברים בבהיר. לא נוגע בטרקוטה בכלל.",
  },
  {
    variant: "spine",
    n: "2",
    name: "רצועת טרקוטה",
    note: "עמודת המונחים על לוחיות טרקוטה רכות, ההסברים נשארים על הקרם.",
  },
  {
    variant: "chip",
    n: "3",
    name: "שבב טרקוטה",
    note: "כל מונח יושב על שבב מעוגל. הכי מינימלי מהשלושה.",
  },
];

export default function NotHereOptionsPage() {
  const data = draftContent.notHere;
  if (!data) return null;

  return (
    <>
      {options.map((option) => (
        <div key={option.variant}>
          <p className="bg-dark px-6 py-3 text-center text-base text-on-dark">
            <span className="font-medium">אפשרות {option.n} · {option.name}</span>
            <span className="mx-3 text-on-dark-muted">{option.note}</span>
          </p>
          <NotHere
            data={data}
            variant={option.variant}
            sectionId={`not-here-${option.variant}`}
          />
        </div>
      ))}
    </>
  );
}
