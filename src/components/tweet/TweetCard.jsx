// KYA KAAM KARTA HAI:
//   Ek tweet dikhata hai — like, edit, delete.
//   Owner apna tweet edit/delete kar sakta hai.
// ============================================================

import { useState } from 'react'
import { useUpdateTweet, useDeleteTweet } from '@/queries/useTweetQuery'
import { useLike } from '@/hooks/features/useLike'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { timeAgo } from '@/utils/timeAgo'
import { formatCount } from '@/utils/formatCount'
import { useAuthStore } from '@/stores/auth.store'
import { APP } from '@/constants/appConfig'

export const TweetCard = ({ tweet }) => {
  const { user }                              = useAuthStore()
  const [isEditing, setIsEditing]             = useState(false)
  const [editText,  setEditText]              = useState(tweet.content)
  const isOwner                               = user?._id === tweet.owner?._id

  const { mutate: updateTweet, isPending: isUpdating } = useUpdateTweet(tweet.owner?._id)
  const { mutate: deleteTweet, isPending: isDeleting } = useDeleteTweet(tweet.owner?._id)

  const { isLiked, likesCount, toggleLike } = useLike({
    tweetId:      tweet._id,
    initialLiked: tweet.isLiked    ?? false,
    initialCount: tweet.likesCount ?? 0,
  })

  const handleUpdate = () => {
    if (!editText.trim() || editText === tweet.content) { setIsEditing(false); return }
    updateTweet(
      { tweetId: tweet._id, content: editText.trim() },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  return (
    <div className="flex gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
      <Avatar src={tweet.owner?.avatar} alt={tweet.owner?.fullName} size="sm" className="shrink-0" />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{tweet.owner?.fullName}</span>
            <span className="text-xs text-gray-400">{timeAgo(tweet.createdAt)}</span>
          </div>

          {isOwner && !isEditing && (
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTweet(tweet._id)}
                disabled={isDeleting}
                className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              maxLength={APP.MAX_TWEET_LENGTH}
              rows={2}
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{editText.length}/{APP.MAX_TWEET_LENGTH}</span>
              <div className="flex gap-2">
                <Button size="xs" variant="ghost" onClick={() => { setIsEditing(false); setEditText(tweet.content) }}>Cancel</Button>
                <Button size="xs" isLoading={isUpdating} onClick={handleUpdate} disabled={!editText.trim()}>Save</Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tweet.content}</p>
        )}

        {/* Like */}
        {!isEditing && (
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 mt-2 text-xs transition-colors ${
              isLiked ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <span>👍</span>
            {likesCount > 0 && <span>{formatCount(likesCount)}</span>}
          </button>
        )}
      </div>
    </div>
  )
}