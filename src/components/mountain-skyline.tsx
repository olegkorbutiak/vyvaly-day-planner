export function MountainSkyline() {
  return (
    <svg
      viewBox="0 0 800 220"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-brand-dark sm:h-48"
      aria-hidden="true"
    >
      <path
        d="M0,220 L0,130 L90,70 L170,115 L250,50 L330,105 L410,55 L490,120 L570,75 L650,125 L730,65 L800,110 L800,220 Z"
        fill="currentColor"
        opacity="0.05"
      />
      <path
        d="M0,220 L0,165 L70,100 L150,150 L230,85 L310,140 L390,90 L470,155 L550,105 L630,160 L710,95 L800,145 L800,220 Z"
        fill="currentColor"
        opacity="0.08"
      />
    </svg>
  );
}
