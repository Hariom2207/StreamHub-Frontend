import { useSubscription } from '@/hooks/features/useSubscription'
import { Button } from '@/components/ui/Button'
import { formatCount } from '@/utils/formatCount'

export const SubscribeButton = ({
  channelId,
  initialSubscribed = false,
  subscriberCount = 0,
  showCount = false,
  onSuccessCallback,
}) => {

  const {
    isSubscribed,
    subCount,
    toggleSubscription,
    isPending,
  } = useSubscription({
    channelId,
    initialSubscribed: Boolean(initialSubscribed), // 🔥 FIX
    initialCount: subscriberCount,
    onSuccess: onSuccessCallback,
  })

  return (
    <div className="flex items-center gap-3">

      {/* SUBSCRIBE BUTTON */}
      <Button
        variant={isSubscribed ? 'secondary' : 'primary'}
        onClick={toggleSubscription}
        isLoading={isPending}
        className="rounded-full min-w-27.5"
      >
        {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
      </Button>

      {/* COUNT */}
      {showCount && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatCount(subCount)} subscribers
        </span>
      )}
    </div>
  )
}