// KYA KAAM KARTA HAI:
//   Jab user page ke bottom par scroll kare toh
//   automatically next page load karo.
//   IntersectionObserver use karta hai — scroll event se
//   better performance.

// EXAMPLE USE:
//   const { ref } = useInfiniteScroll({ fetchNextPage, hasNextPage })
//   <div ref={ref} /> // Ise list ke end mein rakh do
// ============================================================

import { useEffect, useRef } from 'react'

export const useInfiniteScroll = ({ fetchNextPage, hasNextPage, isFetchingNextPage }) => {
  const observerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Element screen mein aa gaya
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }  // 10% visible hone par trigger
    )

    const el = observerRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return { ref: observerRef }
}