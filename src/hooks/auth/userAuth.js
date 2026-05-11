// KYA KAAM KARTA HAI:
//   Auth state aur actions ek jagah se access karo.
//   useAuthStore aur useLogin/useLogout queries ko wrap karta hai.

// EXAMPLE USE:
//   const { user, isLoggedIn, login, logout } = useAuth()
// ============================================================

import { useAuthStore } from '@/stores/auth.store'
import { useLogin, useLogout, useRegister } from '@/queries/useUserQuery'

export const useAuth = () => {
  const { user, isLoggedIn } = useAuthStore()
  const { mutate: login,    isPending: isLoggingIn    } = useLogin()
  const { mutate: logout,   isPending: isLoggingOut   } = useLogout()
  const { mutate: register, isPending: isRegistering  } = useRegister()

  return {
    user,
    isLoggedIn,
    login,
    logout,
    register,
    isLoggingIn,
    isLoggingOut,
    isRegistering,
  }
}