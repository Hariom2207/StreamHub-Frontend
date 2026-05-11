import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { useLogout } from '@/queries/useUserQuery'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { APP } from '@/constants/appConfig'

export const Navbar = () => {
  const { user, isLoggedIn } = useAuthStore()
  const { toggleSidebar, openModal, toggleTheme, theme } = useUIStore()
  const { mutate: logout, isPending: loggingOut } = useLogout()

  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search.trim()) return
    navigate(`/search?q=${encodeURIComponent(search.trim())}`)
    setShowSearch(false)
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-40 h-14 flex items-center px-4 gap-3 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">

        {/* LEFT */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ☰
          </button>

          <Link to="/" className="flex items-center gap-1.5 font-bold text-lg">
            <span className="text-red-600">▶</span>
            <span className="hidden sm:block text-gray-900 dark:text-white">
              {APP.NAME}
            </span>
          </Link>
        </div>

        {/* DESKTOP SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl mx-auto"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-full bg-gray-50 dark:bg-gray-800"
          >
            🔍
          </button>
        </form>

        {/* RIGHT */}
        <div className="flex items-center gap-2 ml-auto">

          {/* MOBILE SEARCH BUTTON */}
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            🔍
          </button>

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isLoggedIn ? (
            <>


              {/* USER */}
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)}>
                  <Avatar src={user?.avatar} alt={user?.fullName} size="sm" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />

                    <div className="absolute right-0 top-12 z-20 w-52 bg-white dark:bg-gray-900 border rounded-xl shadow-lg">

                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">@{user?.username}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={() => logout()}
                        disabled={loggingOut}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-t"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </header>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-950 p-4 flex items-start gap-2">

          <button
            onClick={() => setShowSearch(false)}
            className="text-lg"
          >
            ←
          </button>

          <form onSubmit={handleSearch} className="flex flex-1">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-4 py-2 border rounded-l-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 border border-l-0 rounded-r-full bg-gray-100 dark:bg-gray-800"
            >
              🔍
            </button>
          </form>

        </div>
      )}
    </>
  )
}

