import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionService } from '@/services/subscription.service'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/stores/auth.store'
import toast from 'react-hot-toast'

export const useSubscription = ({ channelId, initialSubscribed = false, initialCount = 0 }) => {
  const { isLoggedIn }   = useAuthStore()
  const queryClient      = useQueryClient()
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed)
  const [subCount,     setSubCount]     = useState(initialCount)

  const { mutate, isPending } = useMutation({
    mutationFn: () => subscriptionService.toggle(channelId),
    onMutate: () => {
      setIsSubscribed(prev => !prev)
      setSubCount(prev => isSubscribed ? prev - 1 : prev + 1)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHANNEL_SUBS(channelId) })
    },
    onError: () => {
      // Rollback
      setIsSubscribed(prev => !prev)
      setSubCount(prev => isSubscribed ? prev + 1 : prev - 1)
      toast.error('Failed to update subscription.')
    },
  })

  const toggleSubscription = () => {
    if (!isLoggedIn) { toast.error('Please login to subscribe'); return }
    mutate()
  }

  return { isSubscribed, subCount, toggleSubscription, isPending }
}