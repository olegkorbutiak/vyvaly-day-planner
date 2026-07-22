export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-10 text-center">
      <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
        {title}
      </p>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  );
}
