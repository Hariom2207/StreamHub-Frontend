// Video player local state

import { useState, useRef } from 'react'

export const useVideo = () => {
  const videoRef                          = useRef(null)
  const [isPlaying,   setIsPlaying]   = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,    setDuration]    = useState(0)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    isPlaying ? v.pause() : v.play()
  }

  return { videoRef, isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration, togglePlay }
}