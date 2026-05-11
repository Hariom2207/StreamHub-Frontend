import { apiCall } from './base.service'
import { COMMENT } from '@/constants/apiRoutes'

export const commentService = {
getVideoComments: (videoId, params = {}) =>
  apiCall('get', COMMENT.GET_VIDEO_COMMENTS(videoId), null, { params }),

addComment: (videoId, content) => {
  return apiCall('post', COMMENT.ADD(videoId), { content })
},

  updateComment: (commentId, content) =>
    apiCall('patch', COMMENT.UPDATE(commentId), { content }),

  deleteComment: (commentId) =>
    apiCall('delete', COMMENT.DELETE(commentId)),
}