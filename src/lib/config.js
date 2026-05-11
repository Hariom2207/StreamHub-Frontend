
// KYA KAAM KARTA HAI:
//   Poori app ki configuration ek jagah.
//   .env file se variables yahan aate hain.
//   Koi bhi file seedha import.meta.env nahi use karegi —
//   sirf is file se config import karegi.

// EXAMPLE:
//   Agar backend URL change karna ho toh sirf .env badlo.
//   Baaki poori app automatically update ho jaati hai.
// ============================================================

export const config = {
  // Backend ka base URL — .env se aata hai
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',

  // Socket URL — realtime notifications ke liye
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000',

  // Ek page mein kitne videos dikhane hain
  pageSize: 12,

  // Search mein kitne milliseconds baad API call ho
  searchDebounce: 400,

  // Upload limits
  maxVideoSize: 100 * 1024 * 1024,  // 100MB
  maxImageSize: 5 * 1024 * 1024,    // 5MB

  // Supported formats
  videoFormats: ['video/mp4', 'video/webm', 'video/ogg'],
  imageFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],

  // React Query — kitni der tak data fresh maana jaaye
  staleTime: 5 * 60 * 1000,         // 5 minutes
  cacheTime: 10 * 60 * 1000,        // 10 minutes

  // Toast duration
  toastDuration: 3000,
}