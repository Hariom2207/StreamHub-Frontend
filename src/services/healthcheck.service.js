import { apiCall } from './base.service'
import { HEALTHCHECK } from '@/constants/apiRoutes'

export const healthcheckService = {
  ping: () => apiCall('get', HEALTHCHECK),
}