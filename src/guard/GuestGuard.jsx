// Already logged in toh / par bhejo

import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useAuthStore()
  if (isLoggedIn) return <Navigate to="/" replace />
  return children
}