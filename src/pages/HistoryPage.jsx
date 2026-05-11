import { useGetHistory } from '@/queries/useUserQuery'
import { VideoGrid } from '@/components/video/VideoGrid'
import { EmptyState } from '@/components/error/EmptyState'

export const HistoryPage = () => {
  const { data: history, isLoading } = useGetHistory()
  // console.log('History data:', history)
  
const videos = Array.isArray(history)
  ? history
  : history?.docs ?? []

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Watch History
      </h1>

      {!isLoading && videos.length === 0 ? (
        <EmptyState
          icon="🕐"
          title="No history yet"
          description="Videos you watch will appear here"
        />
      ) : (
    <VideoGrid videos={videos ?? []} isLoading={isLoading} />
      )}
    </div>
  )
}