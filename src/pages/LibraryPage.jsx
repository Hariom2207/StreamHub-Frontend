import { useGetLikedVideos } from '@/queries/useVideoQuery'
import { VideoGrid } from '@/components/video/VideoGrid'
import { EmptyState } from '@/components/error/EmptyState'

export const LibraryPage = () => {
  const { data: likedVideos, isLoading } = useGetLikedVideos()

  const videos = Array.isArray(likedVideos)
    ? likedVideos
    : likedVideos?.docs ?? []

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Liked Videos
      </h1>

      {!isLoading && videos.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No liked videos yet"
          description="Like videos to save them here"
        />
      ) : (
        <VideoGrid videos={videos} isLoading={isLoading} />
      )}
    </div>
  )
}