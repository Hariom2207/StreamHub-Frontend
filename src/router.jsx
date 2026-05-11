import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout }  from '@/components/layout/AppLayout'
import { AuthGuard }  from '@/guard/AuthGuard'
import { GuestGuard } from '@/guard/GuestGuard'
import { Spinner }    from '@/components/ui/Spinner'

const HomePage          = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const WatchPage         = lazy(() => import('@/pages/WatchPage').then((m) => ({ default: m.WatchPage })))
const SearchPage        = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })))
const ChannelPage       = lazy(() => import('@/pages/ChannelPage').then((m) => ({ default: m.ChannelPage })))
const PlaylistPage      = lazy(() => import('@/pages/PlaylistPage').then((m) => ({ default: m.PlaylistPage })))
const TweetsPage        = lazy(() => import('@/pages/TweetsPage').then((m) => ({ default: m.TweetsPage })))
const SubscriptionsPage = lazy(() => import('@/pages/SubscriptionsPage').then((m) => ({ default: m.SubscriptionsPage })))
const DashboardPage     = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const LoginPage         = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage      = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const LibraryPage       = lazy(() => import('@/pages/LibraryPage').then(m => ({ default: m.LibraryPage })))
const HistoryPage       = lazy(() => import('@/pages/HistoryPage').then(m => ({ default: m.HistoryPage })))



const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
)
const S = (Component) => <Suspense fallback={<Loader />}><Component /></Suspense>

export const router = createBrowserRouter([
  // Auth pages — apna layout (no Navbar/Sidebar)
  {
    path: '/login',
    element: <GuestGuard>{S(LoginPage)}</GuestGuard>,
  },
  {
    path: '/register',
    element: <GuestGuard>{S(RegisterPage)}</GuestGuard>,
  },

  // Main app — Navbar + Sidebar layout
  {
    element: <AppLayout />,
    children: [
      { path: '/',                   element: S(HomePage) },
      { path: '/watch/:videoId',     element: S(WatchPage) },
      { path: '/search',             element: S(SearchPage) },
      { path: '/c/:username',        element: S(ChannelPage) },
      { path: '/playlist/:playlistId', element: S(PlaylistPage) },
      {
        path: '/dashboard',
        element: <AuthGuard>{S(DashboardPage)}</AuthGuard>,
      },
      {
        path: '/subscriptions',
        element: <AuthGuard>{S(SubscriptionsPage)}</AuthGuard>,
      },
      {
        path: '/tweets',
        element: <AuthGuard>{S(TweetsPage)}</AuthGuard>,
      },
      {
        path: '/library',
        element: <AuthGuard>{S(LibraryPage)}</AuthGuard>,
      },
      {
        path: '/history',
        element: <AuthGuard>{S(HistoryPage)}</AuthGuard>,
      },
      { path: '*', element: S(NotFoundPage) },
    ],
  },
])