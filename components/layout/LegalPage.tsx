import Link from "next/link";

export function LegalPage({
  title,
  updatedAt,
  intro,
  children,
}: {
  title: string;
  updatedAt: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-cream-50 pt-12 pb-20 md:pb-28">
      <div className="shell max-w-3xl">
        <nav aria-label="מסלול ניווט" className="text-sm text-muted">
          <Link href="/" className="underline-offset-4 hover:underline">
            דף הבית
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-ink">{title}</span>
        </nav>

        <h1 className="mt-8 text-3xl text-slate md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">
          עודכן לאחרונה:{" "}
          <time dateTime={updatedAt}>
            {new Intl.DateTimeFormat("he-IL", { dateStyle: "long" }).format(new Date(updatedAt))}
          </time>
        </p>
        {intro && <p className="mt-6 text-lg text-muted">{intro}</p>}

        <div className="mt-10 space-y-8 text-muted [&_a]:text-accent-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-2xl [&_h2]:text-slate [&_li]:leading-relaxed [&_li]:marker:text-accent [&_p]:leading-relaxed [&_ul]:space-y-2 [&_ul]:ps-5 [&_ul]:list-disc">
          {children}
        </div>
      </div>
    </div>
  );
}
