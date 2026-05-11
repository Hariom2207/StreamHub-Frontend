import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tweetService } from '@/services/tweet.service'
import { QUERY_KEYS } from '@/constants/queryKeys'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/errorHandler'

export const useGetUserTweets = (userId) =>
  useQuery({
    queryKey: QUERY_KEYS.USER_TWEETS(userId),
    queryFn:  () => tweetService.getUserTweets(userId),
    enabled:  !!userId,
  })

export const useCreateTweet = (userId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tweetService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_TWEETS(userId) })
      toast.success('Tweet posted!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export const useUpdateTweet = (userId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tweetId, content }) => tweetService.update(tweetId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_TWEETS(userId) })
      toast.success('Tweet updated!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export const useDeleteTweet = (userId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tweetService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_TWEETS(userId) })
      toast.success('Tweet deleted!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}