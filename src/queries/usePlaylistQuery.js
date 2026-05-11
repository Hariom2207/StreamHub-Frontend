import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { playlistService } from '@/services/playlist.service'
import { QUERY_KEYS } from '@/constants/queryKeys'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/errorHandler'
import { config } from '@/lib/config'

export const useGetPlaylist = (playlistId) =>
  useQuery({
    queryKey: QUERY_KEYS.PLAYLIST(playlistId),
    queryFn:  () => playlistService.getById(playlistId),
    enabled:  !!playlistId,
    staleTime: config.staleTime,
  })

export const useGetUserPlaylists = (userId) =>
  useQuery({
    queryKey: QUERY_KEYS.USER_PLAYLISTS(userId),
    queryFn:  () => playlistService.getUserPlaylists(userId),
    enabled:  !!userId,
  })

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: playlistService.create,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PLAYLISTS(vars?.userId) })
      toast.success('Playlist created!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export const useAddToPlaylist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ videoId, playlistId }) =>
      playlistService.addVideo(videoId, playlistId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLAYLIST(playlistId) })
      toast.success('Added to playlist!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export const useRemoveFromPlaylist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ videoId, playlistId }) =>
      playlistService.removeVideo(videoId, playlistId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLAYLIST(playlistId) })
      toast.success('Removed from playlist!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export const useDeletePlaylist = (userId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: playlistService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PLAYLISTS(userId) })
      toast.success('Playlist deleted!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}