import { useAuthStore } from '@/stores/auth.store'
import { TweetInput } from '@/components/tweet/TweetInput'
import { TweetFeed } from '@/components/tweet/TweetFeed'

export const TweetsPage = () => {
  const { user } = useAuthStore()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tweets</h1>
      <TweetInput userId={user?._id} />
      <TweetFeed userId={user?._id} />
    </div>
  )
}