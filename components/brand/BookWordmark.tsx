/**
 * The book page's mark, which is not a mark.
 *
 * The sprout in the rings belongs to the practice - parents, children, a
 * growing thing - and says nothing about a collection of short stories. On a
 * book, the author's name is the logo: her name, and under it the title, set
 * the way every section label on this site is set. Nothing to draw.
 */
export function BookWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex min-w-0 flex-col leading-none ${className}`}>
      <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-slate sm:text-2xl md:text-3xl">
        אפרת צרי
      </span>
      <span className="mt-1.5 truncate text-sm leading-tight tracking-[0.2em] text-accent-ink sm:mt-2">
        שברים עדינים
      </span>
    </span>
  );
}
