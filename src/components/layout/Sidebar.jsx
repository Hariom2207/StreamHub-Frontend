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

const NavItems = ({ isSidebarOpen, isLoggedIn }) => (
  <>
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
  </>
)

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore()
  const { isLoggedIn } = useAuthStore()
  const w = isSidebarOpen ? APP.SIDEBAR_WIDTH : APP.SIDEBAR_MINI_WIDTH

  return (
    <>
      {/* ✅ DESKTOP sidebar  */}
      <aside
        style={{ width: w, minWidth: w }}
        className="hidden md:flex flex-col gap-0.5 pt-3 px-2 border-r border-gray-200 dark:border-gray-800 overflow-y-auto shrink-0 transition-all duration-200"
      >
        <NavItems isSidebarOpen={isSidebarOpen} isLoggedIn={isLoggedIn} />
      </aside>

      {/* ✅ MOBILE drawer — sirf mobile pe dikhega */}
{/* ✅ MOBILE drawer — sirf mobile pe dikhega */}
{isSidebarOpen && (
  <>
    {/* Background overlay */}
    <div
      className="fixed inset-0 z-40 bg-black/50 md:hidden"
      onClick={toggleSidebar}
    />

    {/* Drawer panel */}
    <aside className="fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 md:hidden">

      {/* ✅ Top header with close button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Menu
        </h2>

        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-xl"
        >
          ✖
        </button>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-0.5 pt-3 px-2 overflow-y-auto">
        <NavItems
          isSidebarOpen={true}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </aside>
  </>
)}
    </>
  )
}