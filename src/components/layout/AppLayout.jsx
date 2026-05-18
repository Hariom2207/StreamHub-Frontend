import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useUIStore } from '@/stores/ui.store'
import { APP } from '@/constants/appConfig'

export function AppLayout() {
  const { isSidebarOpen } = useUIStore()

  const sidebarWidth = isSidebarOpen
    ? APP.SIDEBAR_WIDTH
    : APP.SIDEBAR_MINI_WIDTH

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      <Navbar />

      <div className="flex pt-14">

        <Sidebar />

        <main className="flex-1 min-w-0 overflow-x-hidden p-3 md:p-6 transition-all duration-200">
          <Outlet />
        </main>

      </div>
    </div>
  )
}