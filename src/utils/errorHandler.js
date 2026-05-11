// KYA KAAM KARTA HAI:
//   Backend se aaye error ko human-readable message mein
//   convert karta hai.
//
// BACKEND ERROR FORMAT:
//   { statusCode: 400, message: "Email already exists", ... }
//
// EXAMPLE:
//   Network down → "Network error. Please check your connection."
//   Backend 400  → "Email already exists"
//   Unknown      → "Something went wrong. Please try again."
// ============================================================

export const getErrorMessage = (error) => {
  // Network error — server tak pahuncha hi nahi
  if (!error.response) {
    return 'Network error. Please check your connection.'
  }

  const { data, status } = error.response

  // Backend ka custom message
  if (data?.message) return data.message

  // HTTP status ke basis par
  const statusMessages = {
    400: 'Invalid request. Please check your input.',
    401: 'Please login to continue.',
    403: 'You do not have permission to do this.',
    404: 'Not found.',
    409: 'This already exists.',
    413: 'File too large.',
    422: 'Invalid data.',
    429: 'Too many requests. Please wait.',
    500: 'Server error. Please try again later.',
    503: 'Service unavailable. Please try later.',
  }

  return statusMessages[status] || 'Something went wrong. Please try again.'
}