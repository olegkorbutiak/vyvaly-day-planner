export function LionWatermark() {
  return (
    <svg
      viewBox="0 0 240 160"
      className="pointer-events-none absolute -right-12 bottom-16 h-64 w-64 text-brand-green opacity-[0.07] sm:h-80 sm:w-80"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* tail with tuft */}
      <path d="M185,97 C212,82 218,48 197,33 C189,26 179,31 183,39 C196,42 200,64 178,78 Z" />
      <path d="M193,32 L183,38 L188,26 L196,20 L191,32 L200,28 Z" />

      {/* legs */}
      <rect x="72" y="108" width="15" height="42" rx="7" />
      <ellipse cx="79.5" cy="150" rx="9" ry="5" />
      <rect x="95" y="112" width="15" height="36" rx="7" />
      <ellipse cx="102.5" cy="148" rx="9" ry="5" />
      <rect x="153" y="112" width="17" height="38" rx="7" />
      <ellipse cx="161.5" cy="150" rx="10" ry="5" />
      <rect x="177" y="108" width="17" height="44" rx="7" />
      <ellipse cx="185.5" cy="152" rx="10" ry="5" />

      {/* body */}
      <ellipse cx="135" cy="100" rx="58" ry="27" />

      {/* mane (spiky rosette behind head) */}
      <path d="M92,66 L77,55 L75,37 L58,44 L41,37 L39,55 L24,66 L39,77 L41,95 L58,88 L75,95 L77,77 Z" />

      {/* head + snout */}
      <circle cx="54" cy="68" r="19" />
      <ellipse cx="32" cy="74" rx="11" ry="8" />
      <polygon points="50,50 60,54 46,58" />
    </svg>
  );
}
