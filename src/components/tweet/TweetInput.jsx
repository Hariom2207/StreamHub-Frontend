// Naya tweet likhne ka box

import { useState } from 'react'
import { useCreateTweet } from '@/queries/useTweetQuery'
import { useAuthStore } from '@/stores/auth.store'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { APP } from '@/constants/appConfig'

export const TweetInput = ({ userId }) => {
  const { user } = useAuthStore()
  const [text, setText] = useState('')
  const { mutate: createTweet, isPending } = useCreateTweet(userId)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    createTweet(text.trim(), {
      onSuccess: () => setText(''),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-xl mb-4">
      <Avatar src={user?.avatar} alt={user?.fullName} size="sm" />
      <div className="flex-1 space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share a thought..."
          maxLength={APP.MAX_TWEET_LENGTH}
          rows={2}
          className="input-base resize-none text-sm"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {text.length}/{APP.MAX_TWEET_LENGTH}
          </span>
          <Button type="submit" size="sm" isLoading={isPending} disabled={!text.trim()}>
            Tweet
          </Button>
        </div>
      </div>
    </form>
  )
}