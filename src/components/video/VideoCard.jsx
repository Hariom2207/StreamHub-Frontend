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
  const [isVisible, setIsVisible] = useState(false)  // ← lazy load
  const containerRef = useRef(null)

  // ← Sirf visible hone pe video load karo
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()  // ← ek baar visible hua — observer hatao
        }
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const goToWatch = () => navigate(`/watch/${_id}`)

  return (
    <div className="flex flex-col gap-2">

      {/* VIDEO */}
      <div
        ref={containerRef}
        className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
      >
        {/* Thumbnail — video load hone tak dikhta hai */}
        {!isVisible && (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Video — sirf jab visible ho tab load karo */}
        {isVisible && (
          <>
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
  // ← Yeh add karo
  onWaiting={() => {}}   // buffering ignore karo
  onCanPlay={() => {}}   // ready ignore karo
/>

            {/* Overlay — sirf jab play nahi ho raha */}
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
          </>
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