// KYA KAAM KARTA HAI:
//   Sare backend API endpoints ek jagah.
//   Services yahan se import karti hain.

// KYU ZAROORI HAI:
//   Agar '/api/v1/vidoes' likhne ki jagah '/api/v2/videos'
//   likhna ho — sirf ek jagah fix karo, poori app theek.
//   Typo bug sabse common bug hai — yeh usse rokta hai.

// EXAMPLE USE:
//   import { USER } from '@/constants/apiRoutes'
//   api.post(USER.LOGIN, credentials)
// ============================================================


export const USER = {
  REGISTER:        '/users/register',
  LOGIN:           '/users/login',
  LOGOUT:          '/users/logout',
  REFRESH_TOKEN:   '/users/refresh-token',
  CURRENT_USER:    '/users/current-user',
  UPDATE_ACCOUNT:  '/users/update-account',
  UPDATE_PASSWORD: '/users/change-password',
  UPDATE_AVATAR:   '/users/avatar',
  UPDATE_COVER:    '/users/cover-image',
  CHANNEL:         (username) => `/users/c/${username}`,
  HISTORY:         '/users/history',
}

export const VIDEO = {
  GET_ALL:         '/videos',
  GET_BY_ID:       (id) => `/videos/${id}`,
  UPLOAD:          '/videos',
  UPDATE:          (id) => `/videos/${id}`,
  DELETE:          (id) => `/videos/${id}`,
  TOGGLE_PUBLISH:  (id) => `/videos/toggle/publish/${id}`,
}

export const COMMENT = {
  GET_VIDEO_COMMENTS: (videoId)   => `/comments/${videoId}`,  // ← GET → GET_VIDEO_COMMENTS
  ADD:                (videoId)   => `/comments/${videoId}`,
  UPDATE:             (commentId) => `/comments/c/${commentId}`,
  DELETE:             (commentId) => `/comments/c/${commentId}`,
}

export const LIKE = {
  TOGGLE_VIDEO:   (videoId)   => `/likes/video/${videoId}/toggle`,
  TOGGLE_COMMENT: (commentId) => `/likes/comment/${commentId}/toggle`,
  TOGGLE_TWEET:   (tweetId)   => `/likes/tweet/${tweetId}/toggle`,
  LIKED_VIDEOS:   '/likes/videos',
}

export const TWEET = {
  CREATE:    '/tweets',
  GET_USER:  (userId)  => `/tweets/user/${userId}`,
  UPDATE:    (id)      => `/tweets/${id}`,
  DELETE:    (id)      => `/tweets/${id}`,
}

export const PLAYLIST = {
  CREATE:       '/playlist',
  GET_BY_ID:    (id)              => `/playlist/${id}`,
  UPDATE:       (id)              => `/playlist/${id}`,
  DELETE:       (id)              => `/playlist/${id}`,
  ADD_VIDEO:    (vid, pid)        => `/playlist/add/${vid}/${pid}`,
  REMOVE_VIDEO: (vid, pid)        => `/playlist/remove/${vid}/${pid}`,
  USER:         (userId)          => `/playlist/user/${userId}`,
}

export const SUBSCRIPTION = {
  TOGGLE:      (channelId) => `/subscriptions/c/${channelId}`,
  CHANNEL_SUBS:(channelId) => `/subscriptions/c/${channelId}`,
  USER_SUBS:   (userId)    => `/subscriptions/u/${userId}`,
}

export const DASHBOARD = {
  STATS:  '/dashboard/stats',
  VIDEOS: '/dashboard/videos',
}

export const HEALTHCHECK = '/healthcheck'