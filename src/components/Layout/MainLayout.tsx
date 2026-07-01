import { TitleBar } from './TitleBar'
import { Tabs } from '../Tabs/Tabs'
import { CodeEditor } from '../Editor/Editor'
import { StatusBar } from '../StatusBar/StatusBar'
import { ToastContainer } from '../Toast/ToastContainer'
import { OutputPanel } from '../OutputPanel/OutputPanel'
import { useTheme } from '../../hooks/useTheme'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { useStore } from '../../store/useStore'

export function MainLayout() {
  useTheme()
  useKeyboardShortcuts()
  const theme = useStore(s => s.theme)
  const isDark = theme === 'dark'

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-editor-bg text-editor-fg' : 'bg-white text-gray-900'}`}>
      <TitleBar />

      <div className="flex flex-1 overflow-hidden relative">
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
