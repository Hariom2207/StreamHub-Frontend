import { useState, useMemo } from 'react'
import { useGetVideos } from '@/queries/useVideoQuery'
import { VideoGrid } from '@/components/video/VideoGrid'
import { EmptyState } from '@/components/error/EmptyState'
import { Spinner } from '@/components/ui/Spinner'

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'New', value: 'createdAt' },
  { label: 'Popular', value: 'views' },
]

export const HomePage = () => {
  const [filter, setFilter] = useState('')

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetVideos({ sortBy: filter || 'createdAt', sortType: 'desc' })

  //  STABLE DATA 
  const videos = useMemo(() => {
    return data?.pages?.flatMap((p) => p?.videos || []) || []
  }, [data])

  return (
    <div>
      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm ${
              filter === f.value
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ERROR */}
      {isError && (
        <EmptyState icon="😵" title="Failed to load videos" />
      )}

      {/* GRID */}
      {!isError && (
        <>
          <VideoGrid videos={videos} isLoading={isLoading} />

          {!isLoading && videos.length === 0 && (
            <EmptyState icon="📭" title="No videos found" />
          )}

          <div className="flex justify-center py-6">
            {isFetchingNextPage && <Spinner />}
          </div>
        </>
      )}
    </div>
  )
}