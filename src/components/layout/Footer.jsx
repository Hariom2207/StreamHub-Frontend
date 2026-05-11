import { APP } from '@/constants/appConfig'

export const Footer = () => (
  <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-6 text-center text-xs text-gray-400">
    © {new Date().getFullYear()} {APP.NAME}. All rights reserved.
  </footer>
)