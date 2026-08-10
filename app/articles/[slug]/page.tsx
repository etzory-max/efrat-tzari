import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { getArticle, getArticles } from "@/lib/content";
import { proseComponents } from "@/components/ui/PortableProse";
import { ArticleJsonLd } from "@/components/seo/JsonLd";

type Params = { params: Promise<{ slug: string }> };

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      images: [{ url: article.image.src, alt: article.image.alt }],
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const others = (await getArticles()).filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <article className="bg-cream-50 pt-12 pb-20 md:pb-28">
      <div className="shell max-w-3xl">
        <nav aria-label="מסלול ניווט" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                דף הבית
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#articles" className="underline-offset-4 hover:underline">
                מאמרים
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {article.title}
            </li>
          </ol>
        </nav>

        <header className="mt-8">
          <h1 className="text-3xl text-slate md:text-5xl">{article.title}</h1>
          <p className="mt-4 text-sm text-muted">
            <time dateTime={article.date}>{dateFormatter.format(new Date(article.date))}</time>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            {article.readingMinutes} דקות קריאה
          </p>
          <p className="mt-5 text-lg text-muted">{article.excerpt}</p>
        </header>

        <div className="relative mt-10 aspect-16/9 overflow-hidden rounded-3xl">
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            priority
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-10 text-lg text-ink">
          <PortableText value={article.body} components={proseComponents} />
        </div>

        <div className="mt-14 rounded-3xl border border-cream-200 bg-cream-100 p-8 text-center">
          <h2 className="text-2xl text-slate">רוצים לדבר על מה שקורה אצלכם?</h2>
          <p className="mt-3 text-muted">
            שיחת ההיכרות הראשונה היא ללא עלות וללא התחייבות.
          </p>
          <Link
            href="/#contact"
            className="tap mt-6 inline-flex items-center justify-center rounded-xl bg-slate px-6 py-4 font-medium text-white transition-colors hover:bg-slate-deep"
          >
            לקביעת שיחה
          </Link>
        </div>

        {others.length > 0 && (
          <section aria-labelledby="more-articles" className="mt-16">
            <h2 id="more-articles" className="text-xl text-slate">
              מאמרים נוספים
            </h2>
            <ul className="mt-5 space-y-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/articles/${item.slug}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-cream-200 bg-white/70 px-5 py-4 transition-colors hover:border-slate"
                  >
                    <span className="text-ink">{item.title}</span>
                    <ArrowRight className="size-4 shrink-0 rotate-180 text-slate" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <ArticleJsonLd article={article} />
    </article>
  );
}
