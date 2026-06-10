import { useStore } from '../../store/useStore'
import { FileExplorer } from '../FileExplorer/FileExplorer'
import { SettingsPanel } from './SettingsPanel'
import { SearchPanel } from '../SearchPanel/SearchPanel'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export function Sidebar() {
  const sidebarOpen = useStore(s => s.sidebarOpen)
  const activityBar = useStore(s => s.activityBar)
  const theme = useStore(s => s.theme)
  const isDark = theme === 'dark'
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!sidebarOpen) return null

  return (
    <div
      className={`${isMobile ? 'w-52 absolute left-12 top-0 bottom-0 z-40 shadow-2xl' : 'w-60'} border-r flex flex-col overflow-hidden transition-all duration-200 ${
        isDark ? 'bg-editor-sidebar border-editor-border' : 'bg-gray-50 border-gray-200'
      }`}
      role="complementary"
      aria-label="Sidebar"
    >
      {activityBar === 'files' && <FileExplorer />}
      {activityBar === 'settings' && <SettingsPanel />}
      {activityBar === 'search' && <SearchPanel />}
    </div>
  )
}
