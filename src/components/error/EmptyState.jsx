export const EmptyState = ({ icon = '📭', title = 'Nothing here', description = '', action = null }) => (
  <div className="flex flex-col items-center justify-center min-h-75 gap-3 text-center p-8">
    <div className="text-5xl">{icon}</div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
    {description && <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{description}</p>}
    {action}
  </div>
)