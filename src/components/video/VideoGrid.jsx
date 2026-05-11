import { VideoCard } from './VideoCard'
import { VideoCardSkeleton } from '@/components/ui/Skeleton'

export const VideoGrid = ({ videos = [], isLoading = false, skeletonCount = 12 }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: skeletonCount }).map((_, i) => <VideoCardSkeleton key={i} />)}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
     {videos.map((video, index) => (
  <VideoCard
    key={video._id || index}
    video={video}
  />
))}
    </div>
  )
}