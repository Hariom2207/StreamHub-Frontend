import { NavLink } from 'react-router-dom'
import { useUIStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { APP } from '@/constants/appConfig'

const ITEMS = [
  { to: '/',              icon: '🏠', label: 'Home',          auth: false },
  { to: '/subscriptions', icon: '📺', label: 'Subscriptions', auth: true  },
  { to: '/history',       icon: '🕐', label: 'History',       auth: true  },
  { to: '/dashboard',     icon: '📊', label: 'Dashboard',     auth: true  },
  { to: '/search',        icon: '🔍', label: 'Search',        auth: false },
]

export const Sidebar = () => {
  const { isSidebarOpen } = useUIStore()
  const { isLoggedIn }    = useAuthStore()
  const w = isSidebarOpen ? APP.SIDEBAR_WIDTH : APP.SIDEBAR_MINI_WIDTH

  return (
    <aside
      style={{ width: w, minWidth: w }}
      className="hidden md:flex flex-col gap-0.5 pt-3 px-2 border-r border-gray-200 dark:border-gray-800 overflow-y-auto shrink-0 transition-all duration-200"
    >
      {ITEMS.map((item) => {
        if (item.auth && !isLoggedIn) return null
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                !isSidebarOpen ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
            title={!isSidebarOpen ? item.label : undefined}
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            {isSidebarOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        )
      })}
    </aside>
  )
}