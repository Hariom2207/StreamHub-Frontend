import { useParams } from 'react-router-dom'
import { useGetPlaylist } from '@/queries/usePlaylistQuery'
import { VideoGrid } from '@/components/video/VideoGrid'
import { Spinner } from '@/components/ui/Spinner'
import { formatCount } from '@/utils/formatCount'

export const PlaylistPage = () => {
  const { playlistId }                  = useParams()
  const { data: playlist, isLoading }   = useGetPlaylist(playlistId)

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{playlist?.name}</h1>
        {playlist?.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{playlist.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {formatCount(playlist?.videos?.length ?? 0)} videos
        </p>
      </div>
      <VideoGrid videos={playlist?.videos ?? []} />
    </div>
  )
}