/**
 * Icons for the three pillars.
 *
 * Same drawing language as the rest of the site's line art — one stroke
 * weight, round caps and joins, no fills — but drawn as SVG on `currentColor`
 * so they take the colour of the card they sit on instead of shipping a light
 * and a dark PNG of each.
 *
 * Each one is read straight out of the pillar's own copy rather than chosen as
 * a generic symbol: a change of interpretation, a household running to a
 * rhythm, and the anchor the copy itself names. All three are decorative — the
 * heading beside them says the same thing — so they stay out of the
 * accessibility tree.
 */
type Props = { className?: string };

const base: React.SVGProps<SVGSVGElement> = {
  viewBox: "0 0 100 100",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

/**
 * An eye inside a turning arc — the same situation, seen differently.
 * For "the child is not your business card": what changes is the reading,
 * not the child.
 */
export function ShiftOfView({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M33 50q17-15 34 0-17 15-34 0Z" />
      <circle cx="50" cy="50" r="5.5" />
      {/* Nearly a full turn, opening at the top so the arrowhead reads.
          sweep-flag 0 is what puts the centre at (50,50); with 1 the same
          arc bulges up and out of the box. */}
      <path d="M28.8 28.8a30 30 0 1 0 42.4 0" />
      <path d="M71.2 28.8 63.5 27M71.2 28.8 73.5 21" />
    </svg>
  );
}

/** A house keeping time — running the system, not treating the child. */
export function HouseholdRhythm({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M20 50 50 25l30 25" />
      <path d="M27 46v32h46V46" />
      <circle cx="50" cy="60" r="11" />
      <path d="M50 60v-6M50 60h5.5" />
    </svg>
  );
}

/** An anchor — the word the third pillar uses for what you become. */
export function SteadyAnchor({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="50" cy="21" r="7" />
      <path d="M50 28v52" />
      <path d="M34 40h32" />
      <path d="M24 57c0 17 11.6 26 26 26s26-9 26-26" />
    </svg>
  );
}
