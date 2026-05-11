import { useState } from 'react'
import { useUpdateComment, useDeleteComment } from '@/queries/useCommentQuery'
import { useLike } from '@/hooks/features/useLike'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { timeAgo } from '@/utils/timeAgo'
import { formatCount } from '@/utils/formatCount'

export const CommentItem = ({ comment, videoId, currentUser }) => {
  const [isEditing,   setIsEditing]   = useState(false)
  const [editText,    setEditText]    = useState(comment.content)
  const [showActions, setShowActions] = useState(false)

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(videoId)
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(videoId)

  const { isLiked, likesCount, toggleLike } = useLike({
    commentId:    comment._id,
    initialLiked: comment.isLiked    ?? false,
    initialCount: comment.likesCount ?? 0,
  })

  const isOwner    = currentUser?._id === comment.owner?._id
  const isOptimistic = comment.isOptimistic

  const handleUpdate = () => {
    if (!editText.trim() || editText === comment.content) { setIsEditing(false); return }
    updateComment({ commentId: comment._id, content: editText.trim() }, { onSuccess: () => setIsEditing(false) })
  }

  return (
    <div className={`flex gap-3 ${isOptimistic ? 'opacity-60' : ''}`}>
      <Avatar src={comment.owner?.avatar} alt={comment.owner?.fullName} size="sm" className="shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.owner?.fullName}</span>
          <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
          {isOptimistic && <span className="text-xs text-gray-400 italic">posting...</span>}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="xs" variant="ghost" onClick={() => { setIsEditing(false); setEditText(comment.content) }}>Cancel</Button>
              <Button size="xs" isLoading={isUpdating} onClick={handleUpdate} disabled={!editText.trim()}>Save</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
        )}

        {!isEditing && !isOptimistic && (
          <div className="flex items-center gap-3 mt-1.5">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              👍 {likesCount > 0 && formatCount(likesCount)}
            </button>

            {isOwner && (
              <div className="relative">
                <button onClick={() => setShowActions(!showActions)} className="text-xs text-gray-400 hover:text-gray-600 px-1">⋯</button>
                {showActions && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
                    <div className="absolute left-0 top-6 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden min-w-27.5]">
                      <button onClick={() => { setIsEditing(true); setShowActions(false) }} className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">✏️ Edit</button>
                      <button onClick={() => { deleteComment(comment._id); setShowActions(false) }} disabled={isDeleting} className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">🗑️ Delete</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}