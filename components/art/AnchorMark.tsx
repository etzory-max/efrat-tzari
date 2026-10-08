/**
 * An anchor, drawn rather than picked off an icon set.
 *
 * The guide it sits beside is about the three fixed points that hold an
 * ordinary day in place, so the mark is the obvious one - but a stock glyph
 * would have landed on this page like a sticker. This is one open line with
 * uneven curves, in the weight the site's other drawings are drawn at, and
 * it takes its colour from whatever it sits in.
 */
export function AnchorMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* the ring, a little off-round the way a hand draws one */}
      <path d="M32 5.2c2.7-.2 4.9 1.9 4.9 4.4 0 2.6-2.2 4.6-4.9 4.5-2.6-.1-4.7-2-4.7-4.5 0-2.4 2.1-4.3 4.7-4.4z" />
      {/* shank */}
      <path d="M32 14.2c.3 7.4.4 21.6.2 36.4" />
      {/* crossbar, dipping slightly as a drawn line does */}
      <path d="M20.5 22.3c7.4-1.1 15-1.1 23 0" />
      {/* the arms sweeping up out of the water */}
      <path d="M12.4 36.4c-.6 8.4 7.8 16.3 19.8 16.5 12 .2 20.6-7.8 20-16.5" />
      {/* the flukes at each end */}
      <path d="M12.4 36.4c-1.9 1.2-3.9 2-6 2.3 1.2-2.6 3.1-4.7 5.5-6.2" />
      <path d="M52.2 36.4c1.9 1.2 3.9 2 6 2.3-1.2-2.6-3.1-4.7-5.5-6.2" />
    </svg>
  );
}
