/**
 * Hand-drawn line illustrations. One weight, no faces, child proportions —
 * large heads and short limbs, which is what keeps them from reading as stick
 * figures. All strokes are currentColor, so each takes its colour from the
 * surface it lands on.
 *
 * Every illustration here is decorative: they repeat what the copy beside them
 * already says, so they are hidden from assistive technology.
 */
type Props = { className?: string };

const base: React.SVGProps<SVGSVGElement> = {
  viewBox: "0 0 100 100",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

const ground = <path d="M10 86h80" strokeWidth={2.4} opacity="0.4" />;

/** A grown-up and a child, hand in hand. */
export function FamilyWalk({ className }: Props) {
  return (
    <svg {...base} className={className}>
      {/* grown-up */}
      <circle cx="30" cy="22" r="12" />
      <path d="M30 34v26" />
      <path d="M30 60l-6 26M30 60l6 26" />
      <path d="M30 42l-11 9" />
      <path d="M30 42l14 12" />
      {/* child */}
      <circle cx="70" cy="42" r="10" />
      <path d="M70 52v18" />
      <path d="M70 70l-5 16M70 70l5 16" />
      <path d="M70 58l-11-4" />
      <path d="M70 58l9 7" />
      {/* joined hands */}
      <circle cx="50" cy="55" r="3" />
      {ground}
    </svg>
  );
}

/** A child sitting with building blocks. */
export function ChildBlocks({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="32" cy="26" r="13" />
      <path d="M32 39v20" />
      <path d="M32 59l-11 8M32 59l12 7" />
      <path d="M32 46l-12 7" />
      <path d="M32 46l17 5" />
      <rect x="56" y="60" width="20" height="20" rx="3" />
      <rect x="78" y="66" width="14" height="14" rx="3" />
      <rect x="60" y="38" width="16" height="18" rx="3" />
      {ground}
    </svg>
  );
}

/** A child mid-kick, ball rolling away. */
export function ChildBall({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="30" cy="22" r="13" />
      <path d="M30 35v22" />
      <path d="M30 57l-4 29" />
      <path d="M30 57l20 8" />
      <path d="M30 42l-12 5" />
      <path d="M30 42l14 8" />
      <circle cx="72" cy="74" r="12" />
      <path d="M63 66l18 16M81 66l-18 16" strokeWidth={2.2} opacity="0.55" />
      {ground}
    </svg>
  );
}

/** Two children standing side by side. */
export function TwoChildren({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="28" cy="24" r="13" />
      <path d="M28 37v22" />
      <path d="M28 59l-6 27M28 59l6 27" />
      <path d="M28 44l-12 7" />
      <path d="M28 44l14 8" />

      <circle cx="72" cy="32" r="11" />
      <path d="M72 43v18" />
      <path d="M72 61l-5 25M72 61l5 25" />
      <path d="M72 50l11 7" />
      <path d="M72 50l-14 4" />

      <circle cx="50" cy="53" r="3" />
      {ground}
    </svg>
  );
}
