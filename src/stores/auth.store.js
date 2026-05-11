
// KYA KAAM KARTA HAI:
//   User ka login state globally store karta hai.
// 
//   page refresh karne ke baad bhi user logged in rahega.
//
// KAISE USE KARO:
//   const { user, isLoggedIn } = useAuthStore()
//   const { setUser } = useAuthStore()
//
// EXAMPLE:
//   Login hone par → setUser(userData)
//   Logout hone par → clearUser()
//   Kisi bhi component mein → const { isLoggedIn } = useAuthStore()
//
// BACKEND CONNECTION:
//   Login API response ke baad setUser() call hota hai.
//   User object backend se aata hai.
// ============================================================

import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        isLoggedIn: false,

        // User set karo — login ke baad
        setUser: (user) => set({
          user,
          isLoggedIn: true,
        }, false, 'setUser'),

        // User update karo — profile edit ke baad
        updateUser: (updates) => set((state) => ({
          user: { ...state.user, ...updates },
        }), false, 'updateUser'),

        // User clear karo — logout ke baad
        clearUser: () => set({
          user: null,
          isLoggedIn: false,
        }, false, 'clearUser'),
      }),
      {
        name: 'auth-storage',
       
        partialize: (state) => ({
          user: state.user,
          isLoggedIn: state.isLoggedIn,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)