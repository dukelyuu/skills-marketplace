/*
 * DashboardSkeleton — Loading placeholder for Dashboard page (FE-008)
 */
export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded shimmer" />
              <div className="w-8 h-8 rounded-lg shimmer" />
            </div>
            <div className="h-7 w-16 rounded shimmer" />
            <div className="h-3 w-24 rounded shimmer" />
          </div>
        ))}
      </div>
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64 rounded-xl shimmer" />
        <div className="h-64 rounded-xl shimmer" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-56 rounded-xl shimmer" />
        <div className="h-56 rounded-xl shimmer" />
      </div>
    </div>
  );
}
