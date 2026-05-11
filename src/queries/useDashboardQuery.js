import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'
import { QUERY_KEYS } from '@/constants/queryKeys'

// Dashboard mein staleTime: 0 — har visit par fresh data chahiye
export const useGetDashboardStats = () =>
  useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn:  dashboardService.getStats,
    staleTime: 0,
  })

export const useGetDashboardVideos = () =>
  useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS],
    queryFn:  dashboardService.getVideos,
    staleTime: 0,
  })