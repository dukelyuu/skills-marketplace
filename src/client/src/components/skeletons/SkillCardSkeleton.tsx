/*
 * SkillCardSkeleton — Loading placeholder for SkillCard (FE-008)
 */
export default function SkillCardSkeleton() {
  return (
    <div className="rounded-xl border border-[oklch(1_0_0/18%)] bg-[oklch(0.22_0.006_285)] overflow-hidden h-full">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 rounded shimmer" />
            <div className="h-3 w-36 rounded shimmer" />
          </div>
        </div>
        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded shimmer" />
          <div className="h-3 w-3/4 rounded shimmer" />
        </div>
        {/* Tags */}
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full shimmer" />
          <div className="h-5 w-20 rounded-full shimmer" />
          <div className="h-5 w-14 rounded-full shimmer" />
        </div>
        {/* Stats */}
        <div className="flex gap-4 pt-3 border-t border-[oklch(1_0_0/10%)]">
          <div className="h-3 w-12 rounded shimmer" />
          <div className="h-3 w-10 rounded shimmer" />
          <div className="h-3 w-10 rounded shimmer" />
          <div className="ml-auto h-3 w-14 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkillCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkillCardSkeleton key={i} />
      ))}
    </div>
  );
}
