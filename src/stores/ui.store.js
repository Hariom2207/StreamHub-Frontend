// KYA KAAM KARTA HAI:
//   UI state globally manage karta hai.
//   Sidebar open/close, theme (light/dark), active modal.
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      isSidebarOpen: true,
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light',
      activeModal: null,   // 'upload' | 'createPlaylist' | null

      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      setSidebar: (val) => set({ isSidebarOpen: val }),

      toggleTheme: () => set((s) => ({
        theme: s.theme === 'dark' ? 'light' : 'dark',
      })),

      openModal:  (name) => set({ activeModal: name }),
      closeModal: ()     => set({ activeModal: null }),
    }),
    { name: 'ui-storage', partialize: (s) => ({ theme: s.theme }) }
  )
)