import { apiCall } from './base.service'
import { LIKE } from '@/constants/apiRoutes'

export const likeService = {
  toggleVideoLike: async (videoId) => {
    const res = await apiCall('post', LIKE.TOGGLE_VIDEO(videoId))
    return res?.data?.data   
  },

  toggleCommentLike: async (commentId) => {
    const res = await apiCall('post', LIKE.TOGGLE_COMMENT(commentId))
    return res?.data?.data
  },

  toggleTweetLike: async (tweetId) => {
    const res = await apiCall('post', LIKE.TOGGLE_TWEET(tweetId))
    return res?.data?.data
  },

  getLikedVideos: async () => {
    const res = await apiCall('get', LIKE.LIKED_VIDEOS)
    return res?.data?.data
  }
}