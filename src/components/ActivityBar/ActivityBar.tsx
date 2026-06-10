import { FileText, Search, Settings, type LucideIcon } from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { ActivityBarView } from '../../types'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const items: { icon: LucideIcon; view: ActivityBarView; label: string }[] = [
  { icon: FileText, view: 'files', label: 'Explorer' },
  { icon: Search, view: 'search', label: 'Search' },
  { icon: Settings, view: 'settings', label: 'Settings' },
]

export function ActivityBar() {
  const activityBar = useStore(s => s.activityBar)
  const setActivityBar = useStore(s => s.setActivityBar)
  const setSidebarOpen = useStore(s => s.setSidebarOpen)
  const theme = useStore(s => s.theme)
  const isDark = theme === 'dark'
  const isMobile = useMediaQuery('(max-width: 768px)')

  function handleClick(view: ActivityBarView) {
    setActivityBar(view)
    setSidebarOpen(true)
  }

  return (
    <div
      className={`flex flex-col items-center py-2 gap-1 ${isMobile ? 'w-10' : 'w-12'} border-r shrink-0 ${isDark ? 'bg-editor-activity border-editor-border' : 'bg-gray-100 border-gray-200'}`}
      role="navigation"
      aria-label="Activity Bar"
    >
      {items.map(item => {
        const Icon = item.icon
        const isActive = activityBar === item.view
        return (
          <button
            key={item.view}
            onClick={() => handleClick(item.view)}
            className={`relative flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded transition-colors ${
              isActive
                ? isDark ? 'text-white bg-editor-hover' : 'text-blue-600 bg-blue-50'
                : isDark ? 'text-editor-fg-dim hover:text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
            aria-label={item.label}
            aria-pressed={isActive}
            title={item.label}
          >
            {isActive && (
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r ${isDark ? 'bg-white' : 'bg-blue-600'}`} />
            )}
            <Icon className="w-5 h-5" />
          </button>
        )
      })}
    </div>
  )
}
