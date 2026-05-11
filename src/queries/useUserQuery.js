import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuthStore } from '@/stores/auth.store'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import { config } from '@/lib/config'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/errorHandler'
import { useNavigate } from 'react-router-dom'

// ---- CURRENT USER ----
export const useGetCurrentUser = () => {
  const { isLoggedIn } = useAuthStore()
  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_USER],
    queryFn:  userService.getCurrentUser,
    enabled:  isLoggedIn,   
    staleTime: config.staleTime,
  })
}

// ---- CHANNEL PROFILE ----
export const useGetChannel = (username) =>
  useQuery({
    queryKey: QUERY_KEYS.CHANNEL(username),
    queryFn:  () => userService.getChannel(username),
    enabled:  !!username,
    staleTime: config.staleTime,
  })

// ---- LOGIN ----
export const useLogin = () => {
  const { setUser } = useAuthStore()
  const navigate    = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.login,
    onSuccess: (data) => {
 
  
      setUser(data.user)
      
      connectSocket(data.accessToken)

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] })
      toast.success(`Welcome back, ${data.user.fullName}!`)
      navigate('/')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

// ---- REGISTER ----
export const useRegister = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: userService.register,
    onSuccess: () => {
      toast.success('Account created! Please login.')
      navigate('/login')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

// ---- LOGOUT ----
export const useLogout = () => {
  const { clearUser } = useAuthStore()
  const navigate      = useNavigate()
  const queryClient   = useQueryClient()

  return useMutation({
    mutationFn: userService.logout,
    onSettled: () => {
      clearUser()
      disconnectSocket()
      queryClient.clear()   // Sab cached data clear karo
      navigate('/login')
    },
  })
}

// ---- UPDATE ACCOUNT ----
export const useUpdateAccount = () => {
  const { updateUser } = useAuthStore()
  const queryClient    = useQueryClient()

  return useMutation({
    mutationFn: userService.updateAccount,
    onSuccess: (data) => {
      updateUser(data)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] })
      toast.success('Profile updated!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

// ---- UPDATE AVATAR ----
export const useUpdateAvatar = () => {
  const { updateUser } = useAuthStore()
  return useMutation({
    mutationFn: userService.updateAvatar,
    onSuccess: (data) => {
      updateUser({ avatar: data.avatar })
      toast.success('Avatar updated!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

// ---- UPDATE COVER IMAGE ----
export const useUpdateCoverImage = () => {
  const { updateUser } = useAuthStore()
  return useMutation({
    mutationFn: userService.updateCoverImage,
    onSuccess: (data) => {
      updateUser({ coverImage: data.coverImage })
      toast.success('Cover image updated!')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

// ---- CHANGE PASSWORD ----
export const useChangePassword = () =>
  useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => toast.success('Password changed!'),
    onError: (err) => toast.error(getErrorMessage(err)),
  })

// ---- WATCH HISTORY ----
export const useGetHistory = () =>
  useQuery({
    queryKey: [QUERY_KEYS.WATCH_HISTORY],
    queryFn:  userService.getHistory,
    staleTime: config.staleTime,
  })