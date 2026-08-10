import { site } from "@/lib/site";

/**
 * Vector rebuild of Efrat's mark (two overlapping rings around a sprout) so it
 * stays crisp at any size and inherits colour from CSS. The original raster
 * lockup lives at /images/logo-placeholder.jpg for reference.
 */
export function Logomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="55" cy="50" r="34" />
      <circle cx="45" cy="50" r="34" />
      <path d="M50 78c0-8-2-13 0-19" strokeWidth={2.8} />
      <path d="M50 59c-6-8-6-20 0-30 6 10 6 22 0 30z" />
      <path d="M50 63c-8 0-15-5-17-13 8-2 15 4 17 13z" />
      <path d="M50 65c8 0 15-5 17-13-8-2-15 4-17 13z" />
    </svg>
  );
}

/** Full lockup: mark + wordmark + tagline. Used in the header and footer. */
export function Logo({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const markColor = variant === "dark" ? "text-sage" : "text-slate";
  const nameColor = variant === "dark" ? "text-on-dark" : "text-slate";
  const tagColor = variant === "dark" ? "text-on-dark-muted" : "text-muted";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Logomark className={`h-[var(--logo-size,3.5rem)] w-[var(--logo-size,3.5rem)] shrink-0 transition-[height,width] duration-300 ${markColor}`} />
      <span className="flex flex-col leading-none">
        <span className={`text-xl font-medium tracking-tight md:text-2xl ${nameColor}`}>
          {site.name}
        </span>
        <span className={`mt-1.5 hidden text-xs tracking-wide sm:block ${tagColor}`}>
          {site.tagline}
        </span>
      </span>
    </span>
  );
}
