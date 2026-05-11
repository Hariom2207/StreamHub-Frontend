import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { videoService } from '@/services/video.service'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { config } from '@/lib/config'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/errorHandler'


export const useGetVideos = (params = {}, options = {}) =>
  useInfiniteQuery({
    queryKey: [QUERY_KEYS.VIDEOS, params],
    queryFn: ({ pageParam = 1 }) =>
      videoService.getAll({ ...params, page: pageParam, limit: config.pageSize }),
    
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.docs?.length < config.pageSize) return undefined
      return pages.length + 1
    },
    staleTime: config.staleTime,
    ...options, 
  })

export const useGetVideoById = (videoId) =>
  useQuery({
    queryKey: QUERY_KEYS.VIDEO(videoId),
    queryFn: () => videoService.getById(videoId),
    enabled: !!videoId,
    staleTime: config.staleTime,
  })


export const useSyncVideoLikeCache = () => {
  const queryClient = useQueryClient()

  const syncVideoLike = (videoId, data) => {
    queryClient.setQueryData(
      QUERY_KEYS.VIDEO(videoId),
      (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          data: {
            ...oldData.data,
            isLiked: data?.isLiked,
            likesCount: data?.likesCount,
          },
        }
      }
    )
  }

  return { syncVideoLike }
}

export const useUploadVideo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ formData, onProgress }) =>
      videoService.upload(formData, onProgress),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEOS] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS],
      })

      toast.success('Video uploaded successfully!')
    },

    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export const useUpdateVideo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ videoId, data }) =>
      videoService.update(videoId, data),

    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.VIDEO(videoId),
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS],
      })

      toast.success('Video updated!')
    },

    onError: (err) => toast.error(getErrorMessage(err)),
  })
}


export const useDeleteVideo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (videoId) => videoService.delete(videoId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEOS] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS],
      })

      toast.success('Video deleted!')
    },

    onError: (err) => toast.error(getErrorMessage(err)),
  })
}


export const useTogglePublish = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (videoId) =>
      videoService.togglePublish(videoId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS],
      })
    },

    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export const useGetLikedVideos = () =>
  useQuery({
    queryKey: [QUERY_KEYS.LIKED_VIDEOS],
    queryFn: () =>
      import('@/services/like.service').then(
        (m) => m.likeService.getLikedVideos()
      ),

    staleTime: config.staleTime,
  })