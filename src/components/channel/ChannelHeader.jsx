import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { SubscribeButton } from './SubscribeButton'
import { useAuthStore } from '@/stores/auth.store'
import { formatCount } from '@/utils/formatCount'

export const ChannelHeader = ({ channel }) => {
  const { user } = useAuthStore()

   console.log(channel)
  const isOwner  = user?._id === channel?._id || user?.username === channel?.username

  return (
    <div className="mb-6">
      
      {/* Cover */}
      <div className="relative h-32 md:h-44 rounded-xl overflow-hidden bg-linear-to-r from-red-400 to-red-600 mb-4">
        {channel?.coverImage && (
          <img src={channel.coverImage} alt="cover" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Info row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <Avatar
          src={channel?.avatar}
          alt={channel?.fullName}
          size="xl"
          className="-mt-8 ring-4 ring-white dark:ring-gray-950 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{channel?.fullName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{channel?.username} · {formatCount(channel?.subscribersCount ?? 0)} subscribers · {formatCount(channel?.videosCount ?? 0)} videos
          </p>
        </div>
        <div className="shrink-0">
          {isOwner ? (
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Manage channel
            </Link>
          ) : (
            <SubscribeButton
              channelId={channel?._id}
              initialSubscribed={channel?.isSubscribed ?? false}
              subscriberCount={channel?.subscribersCount ?? 0}
            />
          )}
        </div>
      </div>
    </div>
  )
}