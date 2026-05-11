// KYA KAAM KARTA HAI:
//   Search box mein har keypress par API call nahi hoti.
//   400ms baad jab user ruk jaata hai tab call hoti hai.

// EXAMPLE:
//   User types "r", "re", "rea", "reac", "react"
//   Sirf "react" par API call hogi (400ms silence ke baad)
// ============================================================

import { useState, useEffect } from 'react'

export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}