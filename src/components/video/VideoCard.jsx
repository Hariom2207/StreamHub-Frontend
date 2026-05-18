import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { formatDuration } from '@/utils/formatDuration'
import { formatCount } from '@/utils/formatCount'
import { timeAgo } from '@/utils/timeAgo'

export const VideoCard = React.memo(({ video }) => {
  if (!video) return null

  const { _id, title, thumbnail, duration, views, owner, createdAt } = video
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const goToWatch = () => navigate(`/watch/${_id}`)

  return (
    <div className="flex flex-col gap-2">

      {/* VIDEO CONTAINER */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        
        {/* Actual video */}
        <video
          ref={videoRef}
          src={video.videofile}
          poster={thumbnail}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* ← Invisible overlay — sirf jab video play nahi ho raha */}
        {!isPlaying && (
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={goToWatch}
            onTouchEnd={(e) => {
              e.preventDefault()
              goToWatch()
            }}
          />
        )}
      </div>

      {/* DETAILS */}
      <Link to={`/watch/${_id}`} className="flex gap-3">
        <Avatar src={owner?.avatar} size="sm" className="shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium line-clamp-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {owner?.fullName}
          </p>
          <p className="text-xs text-gray-500">
            {formatCount(views)} views • {timeAgo(createdAt)}
          </p>
        </div>
      </Link>

    </div>
  )
})