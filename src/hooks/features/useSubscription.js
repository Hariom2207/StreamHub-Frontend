import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { subscriptionService } from '@/services/subscription.service'
import { useAuthStore } from '@/stores/auth.store'
import toast from 'react-hot-toast'

export const useSubscription = ({
  channelId,
  initialSubscribed = false,
  initialCount = 0,
  onSuccess,
}) => {
  const { isLoggedIn } = useAuthStore()

  const [isSubscribed, setIsSubscribed] = useState(Boolean(initialSubscribed))
  const [subCount, setSubCount]         = useState(initialCount)

  // Sirf naya channel aane pe reset karo
  useEffect(() => {
    setIsSubscribed(Boolean(initialSubscribed))
    setSubCount(initialCount)
  }, [channelId])  // ← channelId pe depend — initialSubscribed pe nahi!

  const { mutate, isPending } = useMutation({
    mutationFn: () => subscriptionService.toggle(channelId),

    onSuccess: (response) => {
      const data = response?.data || response

      // Backend ka exact response use karo
      setIsSubscribed(Boolean(data?.isSubscribed))
      setSubCount(data?.subscribersCount ?? subCount)

      if (onSuccess) onSuccess(data)  // WatchPage ko bhi batao
    },

    onError: () => {
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