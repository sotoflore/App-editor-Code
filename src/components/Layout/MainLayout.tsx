import { ActivityBar } from '../ActivityBar/ActivityBar'
import { Sidebar } from '../Sidebar/Sidebar'
import { TitleBar } from './TitleBar'
import { Tabs } from '../Tabs/Tabs'
import { CodeEditor } from '../Editor/Editor'
import { StatusBar } from '../StatusBar/StatusBar'
import { ToastContainer } from '../Toast/ToastContainer'
import { OutputPanel } from '../OutputPanel/OutputPanel'
import { useTheme } from '../../hooks/useTheme'
import { useAutoSave } from '../../hooks/useAutoSave'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useStore } from '../../store/useStore'
import { useEffect } from 'react'

export function MainLayout() {
  useTheme()
  useAutoSave()
  useKeyboardShortcuts()
  const theme = useStore(s => s.theme)
  const sidebarOpen = useStore(s => s.sidebarOpen)
  const setSidebarOpen = useStore(s => s.setSidebarOpen)
  const isDark = theme === 'dark'
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile, setSidebarOpen])

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-editor-bg text-editor-fg' : 'bg-white text-gray-900'}`}>
      <TitleBar />

      <div className="flex flex-1 overflow-hidden relative">
        <ActivityBar />
        <Sidebar />

        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <Tabs />
          <CodeEditor />
          <OutputPanel />
        </div>
      </div>

      <StatusBar />
      <ToastContainer />
    </div>
  )
}
