import layoutStyles from "./CountryExplorerLayout.module.css";

export function ExplorerTableSkeleton() {
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-3 h-9 rounded-lg bg-zinc-800/70 animate-pulse" />
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => {
          const key = i <= 6 ? `skeletonRow${i}` : "skeletonRowDefault";
          const widthClass =
            layoutStyles[key as keyof typeof layoutStyles] ?? layoutStyles.skeletonRowDefault;
          return (
            <div key={i} className={`h-9 rounded-lg bg-zinc-700/80 animate-pulse ${widthClass}`} />
          );
        })}
      </div>
    </div>
  );
}
