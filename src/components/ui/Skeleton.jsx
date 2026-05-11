export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
)

export const VideoCardSkeleton = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className="aspect-video w-full rounded-xl" />
    <div className="flex gap-3 mt-1">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
)