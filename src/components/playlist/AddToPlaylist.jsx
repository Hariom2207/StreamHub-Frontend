// Modal — video ko playlist mein add/remove karo
// BACKEND: PATCH /playlist/add/:videoId/:playlistId
// ============================================================

import { useGetUserPlaylists, useAddToPlaylist, useRemoveFromPlaylist } from '@/queries/usePlaylistQuery'
import { useAuthStore } from '@/stores/auth.store'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'

export const AddToPlaylist = ({ videoId, onClose }) => {
  const { user } = useAuthStore()
  const { data: playlists, isLoading } = useGetUserPlaylists(user?._id)
  const { mutate: addVideo,    isPending: isAdding }   = useAddToPlaylist()
  const { mutate: removeVideo, isPending: isRemoving } = useRemoveFromPlaylist()

  if (!user) return (
    <div className="text-center py-6 text-sm text-gray-500">
      Please login to manage playlists.
    </div>
  )

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-white">Save to playlist</h3>

      {isLoading ? (
        <div className="flex justify-center py-4"><Spinner /></div>
      ) : !playlists?.length ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No playlists yet. Create one first.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {playlists.map((pl) => {
            // Kya yeh video pehle se is playlist mein hai?
            const isInPlaylist = pl.videos?.includes(videoId)
            return (
              <label
                key={pl._id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isInPlaylist}
                  onChange={() => {
                    if (isInPlaylist) {
                      removeVideo({ videoId, playlistId: pl._id })
                    } else {
                      addVideo({ videoId, playlistId: pl._id })
                    }
                  }}
                  disabled={isAdding || isRemoving}
                  className="w-4 h-4 accent-red-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                  {pl.name}
                </span>
                <span className="text-xs text-gray-400">
                  {pl.videosCount ?? 0}
                </span>
              </label>
            )
          })}
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
        <Button variant="ghost" size="sm" onClick={onClose}>Done</Button>
      </div>
    </div>
  )
}