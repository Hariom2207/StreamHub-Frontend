import { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetVideoById } from '@/queries/useVideoQuery'
import { VideoPlayer } from '@/components/video/VideoPlayer'
import { VideoActions } from '@/components/video/VideoActions'
import { CommentSection } from '@/components/comment/CommentSection'
import { SubscribeButton } from '@/components/channel/SubscribeButton'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCount } from '@/utils/formatCount'
import { timeAgo } from '@/utils/timeAgo'
import { useAuthStore } from '@/stores/auth.store'
import { userService } from '@/services/user.service'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'

/* ================= DESCRIPTION ================= */
const Description = ({ text, views, createdAt }) => {
  const [expanded, setExpanded] = useState(false)
  const isLong = text?.length > 200

  return (
    <div
      className="bg-gray-100 dark:bg-gray-800/60 rounded-xl p-3 cursor-pointer"
      onClick={() => isLong && setExpanded(prev => !prev)}
    >
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
        {formatCount(views || 0)} views · {timeAgo(createdAt)}
      </p>
      <p className={`text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${
        !expanded && isLong ? 'line-clamp-2' : ''
      }`}>
        {text || ''}
      </p>
      {isLong && (
        <button className="text-xs font-medium text-gray-900 dark:text-white mt-1">
          {expanded ? 'Show less' : '...more'}
        </button>
      )}
    </div>
  )
}

/* ================= WATCH PAGE ================= */
export const WatchPage = () => {
  const { videoId } = useParams()
  const { user }    = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useGetVideoById(videoId, {
    enabled: !!videoId,
  })

  const video   = useMemo(() => data?.data || data || null, [data])
  const owner   = video?.owner || {}
  const isOwner = user?._id === owner?._id

  // Sirf logged in user ke liye history
  useEffect(() => {
    if (videoId && user) {
      userService.addToHistory(videoId)
    }
  }, [videoId, user])

  /* ================= ERROR ================= */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <div className="text-5xl">😵</div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Video not found
        </h2>
        <p className="text-sm text-gray-500">
          This video may have been deleted or is unavailable.
        </p>
      </div>
    )
  }

  /* ================= MAIN ================= */
  return (
    <div className="max-w-5xl mx-auto px-3 pb-20">

      {/* ===== PLAYER ===== */}
      {isLoading || !video ? (
        <Skeleton className="w-full aspect-video rounded-xl" />
      ) : (
        <VideoPlayer
          src={video?.videofile}
          poster={video?.thumbnail}
          title={video?.title}
          videoId={videoId}
        />
      )}

      <div className="mt-3 space-y-3">

        {/* ===== TITLE ===== */}
        {isLoading || !video ? (
          <Skeleton className="h-6 w-3/4" />
        ) : (
          <h1 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
            {video?.title}
          </h1>
        )}

        {/* ===== CHANNEL + SUBSCRIBE + ACTIONS ===== */}
        {isLoading || !video ? (
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ) : (
          <>
            {/* Channel info + Subscribe button */}
            <div className="flex items-center gap-3">
              <Link to={`/c/${owner?.username}`} className="shrink-0">
                <Avatar
                  src={owner?.avatar}
                  alt={owner?.fullName}
                  size="md"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/c/${owner?.username}`}
                  className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 transition-colors block truncate"
                >
                  {owner?.fullName}
                </Link>
                <p className="text-xs text-gray-500">
                  {formatCount(owner?.subscribersCount || 0)} subscribers
                </p>
              </div>

              {/* Subscribe button — sirf dusre ka channel */}
              {!isOwner && (
                <div className="shrink-0">
                  <SubscribeButton
                    channelId={owner?._id}
                    initialSubscribed={Boolean(owner?.isSubscribed)}
                    subscriberCount={owner?.subscribersCount || 0}
                    onSuccessCallback={(data) => {
                      queryClient.setQueryData(QUERY_KEYS.VIDEO(videoId), (old) => {
                        if (!old) return old
                        return {
                          ...old,
                          owner: {
                            ...old.owner,
                            isSubscribed: data?.isSubscribed,
                            subscribersCount: data?.subscribersCount,
                          }
                        }
                      })
                    }}
                  />
                </div>
              )}
            </div>

            {/* Like / Save — alag row */}
            <div className="flex items-center gap-2 flex-wrap">
              <VideoActions video={video} />
            </div>
          </>
        )}

        {/* ===== DESCRIPTION ===== */}
        {video?.description && !isLoading && (
          <Description
            text={video.description}
            views={video.views}
            createdAt={video.createdAt}
          />
        )}

        {/* ===== COMMENTS ===== */}
        {!isLoading && video && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <CommentSection
              videoId={videoId}
              commentsCount={video?.commentsCount || 0}
            />
          </div>
        )}

      </div>
    </div>
  )
}