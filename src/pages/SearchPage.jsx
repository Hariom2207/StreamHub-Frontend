import { useSearchParams } from 'react-router-dom'
import { useGetVideos } from '@/queries/useVideoQuery'
import { useInfiniteScroll } from '@/hooks/ui/useInfiniteScroll'
import { VideoGrid } from '@/components/video/VideoGrid'
import { EmptyState } from '@/components/error/EmptyState'
import { Spinner } from '@/components/ui/Spinner'

export const SearchPage = () => {
  const [searchParams]  = useSearchParams()
  const query           = searchParams.get('q') || ''

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetVideos({ query }, { enabled: !!query })

  const { ref: bottomRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage })

  const videos = data?.pages.flatMap((p) => (Array.isArray(p?.docs) ? p.docs : Array.isArray(p) ? p : [])) ?? []

  return (
    <div>
      <h2 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-5">
        {query ? `Results for "${query}"` : 'Search for videos'}
      </h2>

      {!query ? (
        <EmptyState icon="🔍" title="Enter a search term above" />
      ) : (
        <>
          <VideoGrid videos={videos} isLoading={isLoading} />
          {!isLoading && videos.length === 0 && (
            <EmptyState icon="😕" title="No results found" description={`No videos match "${query}"`} />
          )}
          <div ref={bottomRef} className="flex justify-center py-6">
            {isFetchingNextPage && <Spinner />}
          </div>
        </>
      )}
    </div>
  )
}