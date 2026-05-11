// React class component — crash catch karta hai

import { Component } from 'react'
import { Button } from '@/components/ui/Button'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-100 gap-4 text-center p-8">
          <div className="text-6xl">😵</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Something went wrong</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      )
    }
    return this.props.children
  }
}