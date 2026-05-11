import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

import { router } from './router'
import { useUIStore } from './stores/ui.store'
import { config } from './lib/config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.staleTime,
      gcTime: config.gcTime,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

function ThemeSync() {
  const { theme } = useUIStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />

      <RouterProvider router={router} />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: config.toastDuration ?? 3000,
          style: {
            borderRadius: '10px',
            fontSize: '14px',
          },
        }}
      />

      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}