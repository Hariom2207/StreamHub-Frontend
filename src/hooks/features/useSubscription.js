import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionService } from '@/services/subscription.service'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/stores/auth.store'
import toast from 'react-hot-toast'

export const useSubscription = ({
  channelId,
  initialSubscribed = false,
  initialCount = 0,
  onSuccess,
}) => {
  const { isLoggedIn } = useAuthStore()
  const queryClient = useQueryClient()

  const [isSubscribed, setIsSubscribed] = useState(Boolean(initialSubscribed))
  const [subCount, setSubCount] = useState(initialCount)

  const { mutate, isPending } = useMutation({
    mutationFn: () => subscriptionService.toggle(channelId),

    // 🔥 Optimistic update
    onMutate: async () => {
      const prevState = { isSubscribed, subCount }

      const nextState = !isSubscribed

      setIsSubscribed(nextState)
      setSubCount(prev => nextState ? prev + 1 : prev - 1)

      return { prevState }
    },

    // ✅ success → backend is truth
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.VIDEO(channelId), // optional if used
      })

      if (onSuccess) onSuccess(data)
    },

    // ❌ rollback on error
    onError: (err, variables, context) => {
      if (context?.prevState) {
        setIsSubscribed(context.prevState.isSubscribed)
        setSubCount(context.prevState.subCount)
      }

      toast.error('Failed to update subscription')
    },
  })

  const toggleSubscription = () => {
    if (!isLoggedIn) {
      toast.error('Please login first')
      return
    }
    mutate()
  }

  return {
    isSubscribed,
    subCount,
    toggleSubscription,
    isPending,
  }
}