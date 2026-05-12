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

export const WatchPage = () => {
  const { videoId } = useParams()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  /* ================= VIDEO FETCH ================= */
  const { data, isLoading, isError } = useGetVideoById(videoId, {
    enabled: !!videoId, // 🔥 important fix
  })

  const video = useMemo(() => {
    return data?.data || data || null
  }, [data])

  const owner = video?.owner || {}

  const isOwner = user?._id === owner?._id

  /* ================= HISTORY ================= */
  useEffect(() => {
    if (videoId) {
      userService.addToHistory(videoId)
    }
  }, [videoId])

  /* ================= USER SYNC FIX ================= */
  useEffect(() => {
    if (user && videoId) {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.VIDEO(videoId),
      })
    }
  }, [user, videoId])

  /* ================= ERROR ================= */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
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

  return (
    <div className="max-w-5xl mx-auto">

      {/* ================= PLAYER ================= */}
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

      <div className="mt-4 space-y-3">

        {/* ================= TITLE ================= */}
        {isLoading || !video ? (
          <Skeleton className="h-6 w-3/4" />
        ) : (
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {video?.title}
          </h1>
        )}

        {/* ================= CHANNEL ================= */}
        {isLoading || !video ? (
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            <div className="flex items-center gap-3 flex-1">
              <Link to={`/c/${owner?.username}`}>
                <Avatar
                  src={owner?.avatar}
                  alt={owner?.fullName}
                  size="md"
                />
              </Link>

              <div>
                <Link
                  to={`/c/${owner?.username}`}
                  className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 transition-colors"
                >
                  {owner?.fullName}
                </Link>

                <p className="text-xs text-gray-500">
                  {formatCount(owner?.subscribersCount || 0)} subscribers
                </p>
              </div>

              {!isOwner && (
                <SubscribeButton
                  channelId={owner?._id}
                  initialSubscribed={Boolean(owner?.isSubscribed)} // 🔥 FIXED
                  subscriberCount={owner?.subscribersCount || 0}
                  onSuccessCallback={() =>
                    queryClient.invalidateQueries({
                      queryKey: QUERY_KEYS.VIDEO(videoId),
                    })
                  }
                />
              )}
            </div>

            <VideoActions video={video} />
          </div>
        )}

        {/* ================= DESCRIPTION ================= */}
        {video?.description && !isLoading && (
          <Description
            text={video.description}
            views={video.views}
            createdAt={video.createdAt}
          />
        )}

        {/* ================= COMMENTS ================= */}
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