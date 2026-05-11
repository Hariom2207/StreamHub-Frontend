// axios.js mein use hota hai — token attach + refresh
// Note: Logic already lib/axios.js interceptors mein hai.
// Yeh file named exports provide karta hai agar kabhi alag jagah use karna ho.

import { tokenStorage } from '@/utils/tokenStorage'

export const authMiddleware = {
  attachToken: (config) => {
    const token = tokenStorage.getAccess()
    if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
    return config
  },
}