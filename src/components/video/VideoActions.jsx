import { useState } from 'react'
import { useLike } from '@/hooks/features/useLike'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { AddToPlaylist } from '@/components/playlist/AddToPlaylist'
import { formatCount } from '@/utils/formatCount'
import { useAuthStore } from '@/stores/auth.store'

export const VideoActions = ({ video }) => {
    console.log(video)
  const { isLoggedIn } = useAuthStore()
  const [showPlaylist, setShowPlaylist] = useState(false)

  const { isLiked, likesCount, toggleLike } = useLike({
    videoId: video?._id,
    initialLiked: video?.isLiked ?? false,         
    initialCount: video?.likesCount ?? 0,          
  })

  // const handleShare = () => {
  //   navigator.clipboard?.writeText(window.location.href)
  // }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">

        {/* 👍 LIKE */}
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isLiked
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          👍 {formatCount(likesCount)}
        </button>

        {/* 💾 SAVE */}
        {isLoggedIn && (
          <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setShowPlaylist(true)}>
            💾 Save
          </Button>
        )}

        {/* SHARE */}
        {/* <Button variant="secondary" size="sm" className="rounded-full" onClick={handleShare}>
          Share
        </Button> */}
      </div>

      {/* Modal */}
      <Modal isOpen={showPlaylist} onClose={() => setShowPlaylist(false)} title="Save to playlist">
        <AddToPlaylist videoId={video?._id} onClose={() => setShowPlaylist(false)} />
      </Modal>
    </>
  )
}