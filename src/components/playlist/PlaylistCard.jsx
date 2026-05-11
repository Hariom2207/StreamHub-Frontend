import { Link } from 'react-router-dom'
import { formatCount } from '@/utils/formatCount'

export const PlaylistCard = ({ playlist }) => (
  <Link to={`/playlist/${playlist._id}`} className="group block">
    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2">
      {/* Thumbnail — pehle video ka thumbnail */}
      {playlist.thumbnail ? (
        <img
          src={playlist.thumbnail}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl">
          🎵
        </div>
      )}
      {/* Video count badge */}
      <div className="absolute bottom-0 right-0 bg-black/80 text-white text-xs px-2 py-1 flex items-center gap-1">
        <span>≡</span>
        <span>{formatCount(playlist.videosCount ?? 0)} videos</span>
      </div>
    </div>
    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
      {playlist.name}
    </h3>
    {playlist.description && (
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
        {playlist.description}
      </p>
    )}
  </Link>
)