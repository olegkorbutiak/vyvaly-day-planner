export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-10 text-center">
      <p className="font-condensed text-lg font-bold uppercase tracking-wide text-brand-text">
        {title}
      </p>
      <p className="text-sm text-brand-muted">{description}</p>
    </div>
  );
}
