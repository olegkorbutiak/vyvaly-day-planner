import type { Holiday } from "@/lib/holidays";

export function HolidayBanner({ holiday }: { holiday: Holiday }) {
  return (
    <div className="flex animate-fade-up items-center gap-2 rounded-md bg-[linear-gradient(120deg,#0057b7_0%,#0057b7_50%,#ffd700_50%,#ffd700_100%)] px-3 py-2 shadow-card">
      <span className="text-lg leading-none">🇺🇦</span>
      <p className="font-condensed text-sm font-bold uppercase tracking-wide text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
        {holiday.name}
      </p>
    </div>
  );
}
