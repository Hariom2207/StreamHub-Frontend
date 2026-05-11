import { useState } from 'react'
import { useGetComments, useAddComment } from '@/queries/useCommentQuery'
import { useInfiniteScroll } from '@/hooks/ui/useInfiniteScroll'
import { useAuthStore } from '@/stores/auth.store'
import { CommentItem } from './CommentItem'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { formatCount } from '@/utils/formatCount'
import toast from 'react-hot-toast'

export const CommentSection = ({ videoId, commentsCount = 0 }) => {

  //  console.log("CommentSection render hua, videoId:", videoId) 

  const { user, isLoggedIn }     = useAuthStore()
  const [text,      setText]     = useState('')
  const [focused,   setFocused]  = useState(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetComments(videoId)
  const { mutate: addComment, isPending: isAdding } = useAddComment(videoId)
  const { ref: bottomRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage })
  const comments = data?.pages.flatMap((p) => p?.comments ?? []) ?? []

  const handleSubmit = (e) => {
    e.preventDefault()

  // console.log("handleSubmit chala")       
  // console.log("text:", text)              
  // console.log("isLoggedIn:", isLoggedIn)

    if (!isLoggedIn) { toast.error('Please login to comment'); return }
    if (!text.trim()) return

      console.log("addComment call ho raha hai")  // ← ADD
  console.log("videoId:", videoId) 
    addComment(text.trim(), { onSuccess: () => { setText(''); setFocused(false) } })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {formatCount(commentsCount)} Comments
      </h3>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar src={user?.avatar} alt={user?.fullName} size="sm" className="mt-1 shrink-0" />
        <div className="flex-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={isLoggedIn ? 'Add a comment...' : 'Login to comment'}
            disabled={!isLoggedIn}
            maxLength={1000}
            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 pb-1 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          {focused && (
            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => { setText(''); setFocused(false) }}>Cancel</Button>
              <Button type="submit" size="sm" isLoading={isAdding} disabled={!text.trim()}>Comment</Button>
            </div>
          )}
        </div>
      </form>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No comments yet. Be the first!</p>
        ) : (
          <>
            {comments.map((c) => (
              <CommentItem key={c._id} comment={c} videoId={videoId} currentUser={user} />
            ))}
            <div ref={bottomRef} className="py-2 flex justify-center">
              {isFetchingNextPage && <Spinner size="sm" />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}