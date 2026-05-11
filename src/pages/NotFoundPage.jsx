import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
    <div className="text-7xl font-bold text-gray-200 dark:text-gray-800">404</div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
    <p className="text-gray-500 dark:text-gray-400">This page doesn't exist or has been removed.</p>
    <Link to="/"><Button>Go Home</Button></Link>
  </div>
)