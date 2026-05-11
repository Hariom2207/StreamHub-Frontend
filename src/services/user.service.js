// KYA KAAM KARTA HAI:
//   /api/v1/users ke sare endpoints handle karta hai.
//   Register, login, logout, profile update — sab yahan.
//
// BACKEND ROUTES COVERED:
//   POST   /users/register
//   POST   /users/login
//   POST   /users/logout
//   GET    /users/current-user
//   PATCH  /users/update-account
//   PATCH  /users/change-password
//   PATCH  /users/avatar
//   PATCH  /users/cover-image
//   GET    /users/c/:username
//   GET    /users/history
// ============================================================

import { apiCall } from './base.service'
import { USER } from '@/constants/apiRoutes'

export const userService = {
  // Register — naya account banao
  // data = { fullName, username, email, password }
  register: (data) => apiCall('post', USER.REGISTER, data),

  // Login — credentials se token lo
  // data = { email, password }
  login: (data) => apiCall('post', USER.LOGIN, data),

  // Logout — server side token invalidate karo
  logout: () => apiCall('post', USER.LOGOUT),

  // Current logged-in user ka data lo
  getCurrentUser: () => apiCall('get', USER.CURRENT_USER),

  // Profile update karo
  // data = { fullName, email }
  updateAccount: (data) => apiCall('patch', USER.UPDATE_ACCOUNT, data),

  // Password change karo
  // data = { oldPassword, newPassword }
  changePassword: (data) => apiCall('post', USER.UPDATE_PASSWORD, data),

  // Avatar update karo — multipart/form-data
  // formData = FormData with 'avatar' file
  updateAvatar: (formData) =>
    apiCall('patch', USER.UPDATE_AVATAR, formData, { multipart: true }),

  // Cover image update karo
  updateCoverImage: (formData) =>
    apiCall('patch', USER.UPDATE_COVER, formData, { multipart: true }),

  // Channel profile lo — public page
  // username = channel ka username (URL mein aata hai)
  getChannel: (username) => apiCall('get', USER.CHANNEL(username)),

  // watch history add kra
  addToHistory: (videoId) => apiCall('post', `/users/history/${videoId}`),

  // Watch history lo
  getHistory: () => apiCall('get', USER.HISTORY),
  
  
}

