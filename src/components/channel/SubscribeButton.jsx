import { useSubscription } from '@/hooks/features/useSubscription'
import { Button } from '@/components/ui/Button'
import { formatCount } from '@/utils/formatCount'

export const SubscribeButton = ({ channelId, initialSubscribed = false, subscriberCount = 0, showCount = false }) => {
  const { isSubscribed, subCount, toggleSubscription, isPending } = useSubscription({
    channelId,
    initialSubscribed,
    initialCount: subscriberCount,
  })

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={isSubscribed ? 'secondary' : 'primary'}
        onClick={toggleSubscription}
        isLoading={isPending}
        className="rounded-full min-w-27.5"
      >
        {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
      </Button>
      {showCount && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatCount(subCount)} subscribers
        </span>
      )}
    </div>
  )
}