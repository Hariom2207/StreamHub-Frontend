
import { formatCount } from '@/utils/formatCount'

const StatItem = ({ icon, label, value, color }) => (
  <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
        Total
      </span>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {formatCount(value)}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
)

export const StatsCard = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatItem icon="👁️" label="Total Views"       value={stats.totalViews       ?? 0} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
      <StatItem icon="👥" label="Subscribers"        value={stats.totalSubscribers  ?? 0} color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
      <StatItem icon="👍" label="Total Likes"        value={stats.totalLikes        ?? 0} color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
      <StatItem icon="🎬" label="Total Videos"       value={stats.totalVideos       ?? 0} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
    </div>
  )
}