import { useState, useMemo, useEffect, useRef } from 'react'
import { useGetVideos } from '@/queries/useVideoQuery'
import { VideoGrid } from '@/components/video/VideoGrid'
import { EmptyState } from '@/components/error/EmptyState'
import { Spinner } from '@/components/ui/Spinner'

const FILTERS = [
  { label: 'All',     value: '' },
  { label: 'New',     value: 'createdAt' },
  { label: 'Popular', value: 'views' },
]

export const HomePage = () => {
  const [filter, setFilter] = useState('')
  const bottomRef = useRef(null)

  //  Stable params — sirf filter change hone pe naya object
  const params = useMemo(() => ({
    sortBy: filter || 'createdAt',
    sortType: 'desc'
  }), [filter])

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetVideos(params)

  const videos = useMemo(() => {
    return data?.pages?.flatMap((p) => p?.videos || []) || []
  }, [data])

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div>
      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === f.value
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ERROR */}
      {isError && <EmptyState icon="😵" title="Failed to load videos" />}

      {/* GRID */}
      {!isError && (
        <>
          <VideoGrid videos={videos} isLoading={isLoading} />

          {!isLoading && videos.length === 0 && (
            <EmptyState icon="📭" title="No videos found" />
          )}

          <div ref={bottomRef} className="py-4 flex justify-center">
            {isFetchingNextPage && <Spinner />}
          </div>
        </>
      )}
    </div>
  )
}