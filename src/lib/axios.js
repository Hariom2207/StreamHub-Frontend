import axios from 'axios'
import { config } from './config'

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  withCredentials: true, // cookies automatically jayengi
})

// ── RESPONSE INTERCEPTOR ──────
let isRefreshing = false
let queue = []

const flushQueue = (error) => {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
  })
  queue = []
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    //  Logout ya refresh-token pe retry nahi karna
    if (
      originalRequest?.url?.includes('/logout') ||
      originalRequest?.url?.includes('/refresh-token')
    ) {
      return Promise.reject(error)
    }

    //  Agar 401 nahi hai ya already retry ho chuka hai
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    //  Agar already refresh chal raha hai → queue me daal
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then(() => api(originalRequest))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      //  Cookie-based refresh (no token manually needed)
      await api.post('/users/refresh-token')

      flushQueue(null)

      //  original request retry
      return api(originalRequest)

    } catch (refreshError) {
      flushQueue(refreshError)

      //  Refresh bhi fail → full logout
      try {
        await api.post('/users/logout')
      } catch (_) {}

      localStorage.clear()
      sessionStorage.clear()

      window.location.href = '/login'

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api