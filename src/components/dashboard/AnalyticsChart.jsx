import { formatCount } from '@/utils/formatCount'

export const AnalyticsChart = ({ data = [] }) => {
  if (!data.length) return null

  const max = Math.max(...data.map((d) => d.views ?? 0), 1)

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Views (last 7 days)</h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((d, i) => {
          const heightPct = ((d.views ?? 0) / max) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{formatCount(d.views ?? 0)}</span>
              <div
                className="w-full bg-red-500 rounded-t-sm transition-all duration-500"
                style={{ height: `${Math.max(heightPct, 2)}%` }}
              />
              <span className="text-xs text-gray-400 truncate w-full text-center">{d.label ?? d.date ?? ''}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}