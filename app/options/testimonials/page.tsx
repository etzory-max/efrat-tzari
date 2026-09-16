import type { Metadata } from "next";
import { defaultContent } from "@/content/defaults";
import { Testimonials, type TestimonialsSurface } from "@/components/sections/Testimonials";

/**
 * Three ways of bringing terracotta into the testimonials, stacked so they can
 * be compared by scrolling. Temporary — it goes once one is chosen.
 */
export const metadata: Metadata = {
  title: "המלצות - שלוש אפשרויות",
  robots: { index: false, follow: false },
};

const options: { surface: TestimonialsSurface; n: string; name: string; note: string }[] = [
  {
    surface: "panel",
    n: "1",
    name: "שדה טרקוטה אחד",
    note: "כל הקומפוזיציה יושבת על פאנל רך אחד עם פינות מעוגלות.",
  },
  {
    surface: "wash",
    n: "2",
    name: "וואש מאחורי כל ציטוט",
    note: "כתם שמתפוגג ויוצא מהקצה, לא מסגרת סגורה.",
  },
  {
    surface: "single",
    n: "3",
    name: "רק הציטוט הקצר",
    note: "הצבע נכנס בנקודה אחת, והא־סימטריה נובעת מאורך הטקסט עצמו.",
  },
];

export default function TestimonialOptionsPage() {
  const data = defaultContent.testimonials;
  if (!data) return null;

  return (
    <>
      {options.map((option) => (
        <div key={option.surface}>
          <p className="bg-dark px-6 py-3 text-center text-base text-on-dark">
            <span className="font-medium">
              אפשרות {option.n} · {option.name}
            </span>
            <span className="mx-3 text-on-dark-muted">{option.note}</span>
          </p>
          <Testimonials
            data={data}
            surface={option.surface}
            sectionId={`testimonials-${option.surface}`}
          />
        </div>
      ))}
    </>
  );
}
