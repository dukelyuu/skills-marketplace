/*
 * TableSkeleton — Loading placeholder for data tables (FE-008)
 */
export default function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-card/60 border-b border-border/30">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className={`h-3 rounded shimmer ${i === 0 ? "w-16" : i === 1 ? "flex-1" : "w-20"}`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3.5 border-b border-border/20 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className={`h-3 rounded shimmer ${c === 0 ? "w-16" : c === 1 ? "flex-1" : "w-20"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
