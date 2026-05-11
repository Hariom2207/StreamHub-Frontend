// KYA KAAM KARTA HAI:
//   Video player ki preferences globally store karta hai.
//   Volume, mute, quality — ye sab persist hote hain.
//   User volume 50% kare → page reload kare → phir bhi 50%.
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePlayerStore = create(
  persist(
    (set) => ({
      volume: 1,           // 0 to 1
      isMuted: false,
      isTheaterMode: false,
      quality: 'auto',     // 'auto', '1080p', '720p', '480p', '360p'
      playbackSpeed: 1,    // 0.25 to 2

      setVolume: (v) => set({ volume: v }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      toggleTheaterMode: () => set((s) => ({ isTheaterMode: !s.isTheaterMode })),
      setQuality: (q) => set({ quality: q }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
    }),
    { name: 'player-storage' }
  )
)