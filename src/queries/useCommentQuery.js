import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { commentService } from '@/services/comment.service'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/stores/auth.store'
import { config } from '@/lib/config'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/errorHandler'


export const useGetComments = (videoId) => {
  // console.log("useGetComments called, videoId:", videoId)
  
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.COMMENTS(videoId),
    queryFn: async ({ pageParam = 1 }) => {
      // console.log("queryFn chala, videoId:", videoId)
      
      const result = await commentService.getVideoComments(videoId, {
        page: pageParam,
        limit: config.commentPageSize || 20,
      })
      
      // console.log("comments result:", result)  
      return result                         
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.comments?.length < (config.commentPageSize || 20)) return undefined
      return pages.length + 1
    },
    enabled: !!videoId,
  })
}

// ---- ADD COMMENT  ----
export const useAddComment = (videoId) => {
  const queryClient = useQueryClient()
  const { user }    = useAuthStore()

  return useMutation({
    mutationFn: (content) => commentService.addComment(videoId, content),

    onMutate: async (content) => {
      // Pending request 
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.COMMENTS(videoId) })

      // save old data
      const prevData = queryClient.getQueryData(QUERY_KEYS.COMMENTS(videoId))

      // Fake comment UI mein daal do
      queryClient.setQueryData(QUERY_KEYS.COMMENTS(videoId), (old) => {
        if (!old) return old
        const fakeComment = {
          _id: `temp-${Date.now()}`,
          content,
          createdAt: new Date().toISOString(),
          owner: user,
          isOptimistic: true,
        }
        const firstPage = old.pages[0]
        return {
          ...old,
          pages: [
            { ...firstPage, docs: [fakeComment, ...(firstPage?.docs ?? [])] },
            ...old.pages.slice(1),
          ],
        }
      })

      return { prevData }
    },

    // Success — real data se replace karo
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS(videoId) })
    },

    // Error — rollback karo
    onError: (err, _, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(QUERY_KEYS.COMMENTS(videoId), context.prevData)
      }
      toast.error(getErrorMessage(err))
    },
  })
}

// ---- UPDATE COMMENT ----
export const useUpdateComment = (videoId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, content }) =>
      commentService.updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS(videoId) })
      toast.success('Comment updated!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

// ---- DELETE COMMENT ----
export const useDeleteComment = (videoId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS(videoId) })
      toast.success('Comment deleted!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}