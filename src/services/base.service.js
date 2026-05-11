// KYA KAAM KARTA HAI:
//   Ek generic API call wrapper.
//   Sari services yahi use karti hain.
//   DRY principle — "Don't Repeat Yourself"
//
// BACKEND RESPONSE FORMAT (tumhara backend):
//   { statusCode: 200, data: {...}, message: "Success" }
//
// EXAMPLE:
//   apiCall('get', '/videos')         → GET /videos
//   apiCall('post', '/users/login', {email, password})
//   apiCall('patch', '/videos/123', formData, { multipart: true })
// ============================================================
import api from '@/lib/axios'

export const apiCall = async (
  method,
  url,
  data = null,
  options = {}
) => {
  try {
    //  console.log("apiCall start:", method, url) 
    const config = {
      headers: {},
      params: options.params || {},
    }

    // multipart support
    if (options.multipart) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    // upload progress
    if (options.onUploadProgress) {
      config.onUploadProgress = options.onUploadProgress
    }

    let response

    const methodsWithBody = ['post', 'put', 'patch']

    if (methodsWithBody.includes(method)) {
      response = await api[method](url, data, config)
    } else {
      response = await api[method](url, config)
    }

//  console.log("apiCall success:", response?.status, url)
    // safe return (backend friendly)
    return response?.data?.data ?? response?.data

  } catch (error) {
    console.error("API CALL ERROR:", error?.response?.data || error.message)
    throw error?.response?.data || error
  }
}