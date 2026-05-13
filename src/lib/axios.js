import axios from 'axios'
import { config } from './config'

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 120000,
  withCredentials: true,
})

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

    if (
      originalRequest?.url?.includes('/logout') ||
      originalRequest?.url?.includes('/refresh-token')
    ) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then(() => api(originalRequest))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      await api.post('/users/refresh-token')
      flushQueue(null)
      return api(originalRequest)

    } catch (refreshError) {
      flushQueue(refreshError)

      try {
        await api.post('/users/logout')
      } catch (_) {}

      localStorage.clear()
      sessionStorage.clear()

      // ✅ FIXED — public pages pe redirect mat karo
      const publicPaths = ['/', '/watch', '/search', '/c/']
      const isPublicPath = publicPaths.some(path =>
        window.location.pathname === '/' ||
        window.location.pathname.startsWith(path)
      )

      if (!isPublicPath) {
        window.location.href = '/login'
      }

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api