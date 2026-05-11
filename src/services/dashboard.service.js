import { apiCall } from './base.service'
import { DASHBOARD } from '@/constants/apiRoutes'

export const dashboardService = {
  getStats:  () => apiCall('get', DASHBOARD.STATS),
  getVideos: () => apiCall('get', DASHBOARD.VIDEOS),
}