// Custom HTML5 player — play/pause, volume, seek, fullscreen, speed

import { useRef, useState, useEffect, useCallback } from 'react'
import { usePlayerStore } from '@/stores/player.store'
import { formatDuration } from '@/utils/formatDuration'
import { videoService } from '@/services/video.service'

export const VideoPlayer = ({ src, poster, title, videoId }) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const hideTimer = useRef(null)
  const viewCounted = useRef(false)

  const {
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isTheaterMode,
    toggleTheaterMode,
    playbackSpeed,
    setPlaybackSpeed,
  } = usePlayerStore()

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)

  // ✅ Sync volume + mute with actual video element
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    v.volume = isMuted ? 0 : volume
    v.muted = isMuted
  }, [volume, isMuted])

  // ✅ Sync playback speed
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    v.playbackRate = playbackSpeed
  }, [playbackSpeed])

  // Video event listeners
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const handlers = {
      timeupdate: () => setCurrentTime(v.currentTime),

      loadedmetadata: () => {
        setDuration(v.duration)
      },

      play: () => {
        setIsPlaying(true)

        if (!viewCounted.current && videoId) {
          viewCounted.current = true
          videoService.incrementViews(videoId).catch(() => {})
        }
      },

      pause: () => setIsPlaying(false),

      waiting: () => setIsBuffering(true),

      canplay: () => setIsBuffering(false),

      progress: () => {
        if (v.buffered.length > 0) {
          setBuffered(
            (v.buffered.end(v.buffered.length - 1) / v.duration) * 100
          )
        }
      },
    }

    Object.entries(handlers).forEach(([event, fn]) => {
      v.addEventListener(event, fn)
    })

    return () => {
      Object.entries(handlers).forEach(([event, fn]) => {
        v.removeEventListener(event, fn)
      })
    }
  }, [videoId])

  // Fullscreen listener
  useEffect(() => {
    const fn = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', fn)

    return () => {
      document.removeEventListener('fullscreenchange', fn)
    }
  }, [])

  // Play / Pause
  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return

    if (isPlaying) {
      v.pause()
    } else {
      v.play()
    }
  }, [isPlaying])

  // Keyboard shortcuts
  useEffect(() => {
    const fn = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break

        case 'arrowright':
          videoRef.current.currentTime += 10
          break

        case 'arrowleft':
          videoRef.current.currentTime -= 10
          break

        case 'm':
          toggleMute()
          break

        case 'f':
          handleFullscreen()
          break

        case 't':
          toggleTheaterMode()
          break

        default:
          break
      }
    }

    document.addEventListener('keydown', fn)

    return () => {
      document.removeEventListener('keydown', fn)
    }
  }, [togglePlay, toggleMute, toggleTheaterMode])

  // Seek video
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const newTime =
      ((e.clientX - rect.left) / rect.width) * duration

    videoRef.current.currentTime = newTime
  }

  // Volume change
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value)

    setVolume(val)

    if (videoRef.current) {
      videoRef.current.volume = val
      videoRef.current.muted = val === 0
    }
  }

  // Fullscreen
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // Playback speed
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed)

    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  // Auto-hide controls
  const showControlsTemporarily = () => {
    setShowControls(true)

    clearTimeout(hideTimer.current)

    if (isPlaying) {
      hideTimer.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0

  return (
    <div
      ref={containerRef}
      className={`relative bg-black select-none ${
        isTheaterMode
          ? 'w-full'
          : 'rounded-xl overflow-hidden'
      } ${
        isFullscreen
          ? 'fixed inset-0 z-50'
          : 'aspect-video'
      }`}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false)
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onDoubleClick={handleFullscreen}
        playsInline
      />

      {/* Buffering spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
          showControls
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      >
        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 px-4 pb-3 space-y-2">

          {/* Progress */}
          <div
            className="relative h-1 bg-white/30 rounded-full cursor-pointer group/seek"
            onClick={handleSeek}
          >
            <div
              className="absolute h-full bg-white/40 rounded-full"
              style={{ width: `${buffered}%` }}
            />

            <div
              className="absolute h-full bg-red-500 rounded-full group-hover/seek:h-1.5 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-3">

            {/* Play */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-red-400 text-xl w-8 h-8 flex items-center justify-center transition-colors"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="text-white text-lg"
              >
                {isMuted || volume === 0
                  ? '🔇'
                  : volume < 0.5
                  ? '🔉'
                  : '🔊'}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-red-500"
              />
            </div>

            {/* Duration */}
            <span className="text-white text-xs font-mono">
              {formatDuration(currentTime)} /{' '}
              {formatDuration(duration)}
            </span>

            <span className="flex-1" />

            {/* Speed */}
            <div className="relative group/speed">
              <button className="text-white text-xs px-2 py-1 rounded hover:bg-white/20">
                {playbackSpeed}x
              </button>

              <div className="absolute bottom-full right-0 mb-1 bg-black/90 rounded-lg overflow-hidden hidden group-hover/speed:block">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((sp) => (
                  <button
                    key={sp}
                    onClick={() => handleSpeedChange(sp)}
                    className={`block w-full px-4 py-1.5 text-xs text-left hover:bg-white/10 ${
                      playbackSpeed === sp
                        ? 'text-red-400'
                        : 'text-white'
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-red-400 transition-colors"
              title="Fullscreen (f)"
            >
              {isFullscreen ? '⊡' : '⛶'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}