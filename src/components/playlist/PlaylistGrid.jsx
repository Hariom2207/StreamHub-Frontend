import { PlaylistCard } from './PlaylistCard'
import { EmptyState } from '@/components/error/EmptyState'
import { Spinner } from '@/components/ui/Spinner'

export const PlaylistGrid = ({ playlists = [], isLoading = false }) => {
  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>

  if (!playlists.length) return (
    <EmptyState icon="🎵" title="No playlists yet" description="Create your first playlist!" />
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {playlists.map((pl) => (
        <PlaylistCard key={pl._id} playlist={pl} />
      ))}
    </div>
  )
}