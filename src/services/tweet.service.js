import { apiCall } from './base.service'
import { TWEET } from '@/constants/apiRoutes'

export const tweetService = {
  create:         (content)          => apiCall('post',   TWEET.CREATE, { content }),
  getUserTweets:  (userId, params)   => apiCall('get',    TWEET.GET_USER_TWEETS(userId), null, { params }),
  update:         (tweetId, content) => apiCall('patch',  TWEET.UPDATE(tweetId), { content }),
  delete:         (tweetId)          => apiCall('delete', TWEET.DELETE(tweetId)),
}