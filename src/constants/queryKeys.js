// KYA KAAM KARTA HAI:
//   React Query mein har cached data ka ek unique key hota hai.
//   Yahan sab centralized hain.

// EXAMPLE:
//   WatchPage mein video fetch hoti hai key ['video', 'abc123']
//   Agar comment add hota hai toh us key ko invalidate karo
//   → React Query automatically refetch karega
// ============================================================

export const QUERY_KEYS = {
  // Videos
  VIDEOS:           'videos',
  VIDEO:            (id) => ['video', id],
  LIKED_VIDEOS:     'liked-videos',
  WATCH_HISTORY:    'watch-history',

  // User / Channel
  CURRENT_USER:     'current-user',
  CHANNEL:          (username) => ['channel', username],
  USER_PLAYLISTS:   (userId) => ['playlists', userId],
  USER_TWEETS:      (userId) => ['tweets', userId],
  USER_SUBS:        (userId) => ['subscriptions', userId],
  CHANNEL_SUBS:     (channelId) => ['channel-subs', channelId],

  // Comments
  COMMENTS:         (videoId) => ['comments', videoId],

  // Playlist
  PLAYLIST:         (id) => ['playlist', id],

  // Dashboard
  DASHBOARD_STATS:  'dashboard-stats',
  DASHBOARD_VIDEOS: 'dashboard-videos',

  // Healthcheck
  HEALTH:           'healthcheck',
}