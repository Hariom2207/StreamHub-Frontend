import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { likeService } from '@/services/like.service'
import { useAuthStore } from '@/stores/auth.store'
import toast from 'react-hot-toast'

export const useLike = ({
  videoId,
  commentId,
  tweetId,
  initialLiked = false,
  initialCount = 0
}) => {
  const { isLoggedIn } = useAuthStore()

  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likesCount, setLikesCount] = useState(initialCount)

  // sync only when props actually change
  useEffect(() => {
    setIsLiked(initialLiked)
    setLikesCount(initialCount)
  }, [initialLiked, initialCount])

  const mutation = useMutation({
    mutationFn: async () => {
      if (videoId) return likeService.toggleVideoLike(videoId)
      if (commentId) return likeService.toggleCommentLike(commentId)
      if (tweetId) return likeService.toggleTweetLike(tweetId)
    },

    //  Optimistic Update (UI instant)
    onMutate: async () => {
      const prevState = { isLiked, likesCount }

      setIsLiked(prev => {
        setLikesCount(count => count + (prev ? -1 : 1))
        return !prev
      })

      return prevState
    },

    //  Server response sync (ONLY if needed)
    onSuccess: (data) => {
      if (!data) return

      setIsLiked(data.isLiked)
      setLikesCount(data.likesCount)
    },

    //  rollback on failure
    onError: (err, variables, context) => {
      if (context) {
        setIsLiked(context.isLiked)
        setLikesCount(context.likesCount)
      }

      toast.error('Failed to update like')
    }
  })

  const toggleLike = () => {
    if (!isLoggedIn) {
      toast.error('Please login to like')
      return
    }

    if (mutation.isPending) return

    mutation.mutate()
  }

  return {
    isLiked,
    likesCount,
    toggleLike,
    isPending: mutation.isPending
  }
}