import type { ComponentType, SVGProps } from "react";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-10 text-center">
      <div className="relative mb-1 flex h-20 w-20 items-center justify-center">
        <span
          className="absolute h-2 w-2 rounded-full bg-brand-green/50 animate-float"
          style={{ top: -2, left: 4 }}
        />
        <span
          className="absolute h-1.5 w-1.5 rounded-full bg-brand-dark/30 animate-float-slow"
          style={{ top: 6, right: -4, animationDelay: "0.6s" }}
        />
        <span
          className="absolute h-1 w-1 rounded-full bg-brand-green/40 animate-float"
          style={{ bottom: 2, left: -2, animationDelay: "1.2s" }}
        />
        <div className="flex h-16 w-16 animate-float items-center justify-center rounded-full bg-brand-dark/[0.06] text-brand-dark/40">
          <Icon className="h-8 w-8" strokeWidth={1.75} />
        </div>
      </div>

      <p className="animate-fade-up font-condensed text-lg font-bold uppercase tracking-wide text-brand-text">
        {title}
      </p>
      <p
        className="animate-fade-up text-sm text-brand-muted"
        style={{ animationDelay: "80ms" }}
      >
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          style={{ animationDelay: "160ms" }}
          className="animate-fade-up rounded-md bg-brand-green px-5 py-2.5 font-condensed text-sm font-bold uppercase tracking-wide text-white shadow-glow transition-all duration-200 active:scale-95"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
