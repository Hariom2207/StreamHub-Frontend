import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { formatDuration } from '@/utils/formatDuration'
import { formatCount } from '@/utils/formatCount'
import { timeAgo } from '@/utils/timeAgo'

export const VideoCard = React.memo(({ video }) => {
  
  // console.log("VIDEO OBJECT:", video) 
  if (!video) return null

  const {
    _id,
    title,
    thumbnail,
    duration,
    views,
    owner,
    createdAt,
  } = video
  
    // console.log("VIDEO _id:", _id) 

  const videoSrc =  video.videofile

  return (
    <div className="group flex flex-col gap-2">

      {/* VIDEO */}
      <Link
        to={`/watch/${_id}`}
        className="relative block aspect-video overflow-hidden rounded-xl"
      >
        <video
          src={videoSrc}
          poster={thumbnail}
          controls
          preload="metadata"
          playsInline
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
          {formatDuration(duration)}
        </span>
      </Link>

      {/* DETAILS */}
      <div className="flex gap-3">
        <Avatar src={owner?.avatar} size="sm" />

        <div>
          <h3 className="text-sm font-medium line-clamp-2">
            {title}
          </h3>

          <p className="text-xs text-gray-500">
            {formatCount(views)} views • {timeAgo(createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
})