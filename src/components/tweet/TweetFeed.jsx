import { useGetUserTweets } from '@/queries/useTweetQuery'
import { TweetCard } from './TweetCard'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/error/EmptyState'

export const TweetFeed = ({ userId }) => {
  const { data: tweets, isLoading } = useGetUserTweets(userId)

  if (isLoading) return (
    <div className="flex justify-center py-12"><Spinner /></div>
  )

  if (!tweets?.length) return (
    <EmptyState icon="🐦" title="No tweets yet" description="Share your thoughts!" />
  )

  return (
    <div className="space-y-3">
      {tweets.map(tweet => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </div>
  )
}