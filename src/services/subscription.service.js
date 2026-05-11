import { apiCall } from './base.service'
import { SUBSCRIPTION } from '@/constants/apiRoutes'

export const subscriptionService = {
  toggle:          (channelId) => apiCall('post', SUBSCRIPTION.TOGGLE(channelId)),
  getChannelSubs:  (channelId) => apiCall('get',  SUBSCRIPTION.CHANNEL_SUBS(channelId)),
  getUserSubs:     (userId)    => apiCall('get',  SUBSCRIPTION.USER_SUBS(userId)),
}