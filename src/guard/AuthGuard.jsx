// Private route — login nahi hai toh /login par bhejo

import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export const AuthGuard = ({ children }) => {
  const { isLoggedIn } = useAuthStore()
  const location       = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}