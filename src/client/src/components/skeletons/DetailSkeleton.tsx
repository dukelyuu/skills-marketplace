/*
 * DetailSkeleton — Loading placeholder for SkillDetail page (FE-008)
 */
export default function DetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex gap-2">
        <div className="h-3 w-20 rounded shimmer" />
        <div className="h-3 w-4 rounded shimmer" />
        <div className="h-3 w-24 rounded shimmer" />
      </div>
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 rounded shimmer" />
          <div className="h-4 w-96 rounded shimmer" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 w-16 rounded-full shimmer" />
            <div className="h-5 w-20 rounded-full shimmer" />
          </div>
        </div>
      </div>
      {/* Content area */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-3">
          <div className="h-4 w-full rounded shimmer" />
          <div className="h-4 w-5/6 rounded shimmer" />
          <div className="h-4 w-4/6 rounded shimmer" />
          <div className="h-32 w-full rounded-lg shimmer mt-4" />
          <div className="h-4 w-full rounded shimmer" />
          <div className="h-4 w-3/4 rounded shimmer" />
        </div>
        <div className="space-y-3">
          <div className="h-24 w-full rounded-lg shimmer" />
          <div className="h-40 w-full rounded-lg shimmer" />
        </div>
      </div>
    </div>
  );
}
