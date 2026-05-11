import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'
import { subscriptionService } from '@/services/subscription.service'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { Avatar } from '@/components/ui/Avatar'
import { SubscribeButton } from '@/components/channel/SubscribeButton'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/error/EmptyState'
import { formatCount } from '@/utils/formatCount'
import { Link } from 'react-router-dom'

export const SubscriptionsPage = () => {
  const { user } = useAuthStore()
// console.log("User object:", user)
// console.log("User ID:", user?._id)
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: QUERY_KEYS.USER_SUBS(user?._id),
    queryFn:  () => subscriptionService.getUserSubs(user?._id),
    enabled:  !!user?._id,
  })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  if (!subscriptions?.length) return (
    <EmptyState icon="📺" title="No subscriptions yet" description="Subscribe to channels you like!" />
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Subscriptions</h1>
      <div className="space-y-3">
        {subscriptions.map((channel) => (
          <div key={channel._id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <Link to={`/channel/${channel.username}`}>
              <Avatar src={channel.avatar} alt={channel.fullName} size="lg" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/channel/${channel.username}`}>
                <p className="font-medium text-gray-900 dark:text-white hover:text-red-600 transition-colors">
                  {channel.fullName}
                </p>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{channel.username} · {formatCount(channel.subscribersCount ?? 0)} subscribers
              </p>
            </div>
            <SubscribeButton channelId={channel._id} initialSubscribed={true} />
          </div>
        ))}
      </div>
    </div>
  )
}