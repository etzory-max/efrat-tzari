import Link from "next/link";

export const metadata = { title: "הדף לא נמצא", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="bg-cream-50 py-28">
      <div className="shell max-w-xl text-center">
        <p className="eyebrow">שגיאה 404</p>
        <h1 className="mt-3 text-3xl text-slate md:text-5xl">הדף שחיפשתם לא נמצא</h1>
        <p className="mt-5 text-lg text-muted">
          ייתכן שהקישור השתנה או שהתוכן הוסר. אפשר לחזור לדף הבית ולהמשיך משם.
        </p>
        <Link
          href="/"
          className="btn btn-primary mt-8 px-6 py-4"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}
