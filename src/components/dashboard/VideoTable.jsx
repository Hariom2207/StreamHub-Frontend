import { useState } from 'react'
import { useTogglePublish, useDeleteVideo } from '@/queries/useVideoQuery'
import { formatCount } from '@/utils/formatCount'
import { formatDuration } from '@/utils/formatDuration'
import { timeAgo } from '@/utils/timeAgo'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/error/EmptyState'

export const VideoTable = ({ videos = [], isLoading }) => {
  const { mutate: togglePublish }         = useTogglePublish()
  const { mutate: deleteVideo }           = useDeleteVideo()
  const [deletingId, setDeletingId]       = useState(null)

  const handleDelete = (id) => {
    if (!window.confirm('Delete this video? This cannot be undone.')) return
    setDeletingId(id)
    deleteVideo(id, { onSettled: () => setDeletingId(null) })
  }

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (!videos.length) return <EmptyState icon="🎬" title="No videos yet" description="Upload your first video!" />

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-left">
            {['Video', 'Status', 'Views', 'Likes', 'Date', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {videos.map((video) => (
            <tr key={video._id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              {/* Thumbnail + title */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={video.thumbnail} alt={video.title} className="w-24 aspect-video object-cover rounded-lg" />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm max-w-50">
                    {video.title}
                  </p>
                </div>
              </td>

              {/* Publish toggle */}
              <td className="px-4 py-3">
                <button
                  onClick={() => togglePublish(video._id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    video.isPublished
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {video.isPublished ? '🟢 Published' : '⚫ Draft'}
                </button>
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatCount(video.views)}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatCount(video.likesCount ?? 0)}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{timeAgo(video.createdAt)}</td>

              <td className="px-4 py-3 text-right">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleDelete(video._id)}
                  isLoading={deletingId === video._id}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}