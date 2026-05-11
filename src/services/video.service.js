// BACKEND ROUTES:
//   GET    /videos              → sab videos (with filters)
//   POST   /videos              → upload new video
//   GET    /videos/:id          → single video
//   PATCH  /videos/:id          → update video
//   DELETE /videos/:id          → delete video
//   PATCH  /videos/toggle/publish/:id → publish/unpublish
// ============================================================

import { apiCall } from './base.service'
import { VIDEO } from '@/constants/apiRoutes'

export const videoService = {
  // Sab videos lo — home page ke liye
  // params = { page, limit, query, sortBy, sortType, userId }
  getAll: (params = {}) =>
    apiCall('get', VIDEO.GET_ALL, null, { params }),

  // Ek video lo — watch page ke liye
  getById: (videoId) => apiCall('get', VIDEO.GET_BY_ID(videoId)),

  // Video upload karo
  // formData = FormData with: videoFile, thumbnail, title,
  //            description, duration, isPublished
  upload: (formData, onUploadProgress) =>
    apiCall('post', VIDEO.UPLOAD, formData, {
      multipart: true,
      onUploadProgress,
    }),

  // Video metadata update karo

  update: (videoId, data) =>
    apiCall('patch', VIDEO.UPDATE(videoId), data),

  // Thumbnail update karo (file)
  updateThumbnail: (videoId, formData) =>
    apiCall('patch', VIDEO.UPDATE(videoId), formData, { multipart: true }),

  // Video delete karo
  delete: (videoId) => apiCall('delete', VIDEO.DELETE(videoId)),

  // Publish/unpublish toggle
  togglePublish: (videoId) =>
    apiCall('patch', VIDEO.TOGGLE_PUBLISH(videoId)),

  
incrementViews: (videoId) =>
  apiCall('post', `/videos/${videoId}/view`),
}