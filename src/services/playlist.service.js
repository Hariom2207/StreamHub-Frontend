import { apiCall } from './base.service'
import { PLAYLIST } from '@/constants/apiRoutes'

export const playlistService = {
  create:        (data)                    => apiCall('post',   PLAYLIST.CREATE, data),
  getById:       (playlistId)              => apiCall('get',    PLAYLIST.GET_BY_ID(playlistId)),
  update:        (playlistId, data)        => apiCall('patch',  PLAYLIST.UPDATE(playlistId), data),
  delete:        (playlistId)              => apiCall('delete', PLAYLIST.DELETE(playlistId)),
  addVideo:      (videoId, playlistId)     => apiCall('patch',  PLAYLIST.ADD_VIDEO(videoId, playlistId)),
  removeVideo:   (videoId, playlistId)     => apiCall('patch',  PLAYLIST.REMOVE_VIDEO(videoId, playlistId)),
  getUserPlaylists: (userId)               => apiCall('get',    PLAYLIST.USER_PLAYLISTS(userId)),
}