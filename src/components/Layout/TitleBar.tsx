import { Sun, Moon, Save, PanelLeft, Play } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { runTypeScriptCode } from '../../services/runCode'
import type { ConsoleEntry } from '../../types'

export function TitleBar() {
  const theme = useStore(s => s.theme)
  const setTheme = useStore(s => s.setTheme)
  const toggleSidebar = useStore(s => s.toggleSidebar)
  const saveCurrentFile = useStore(s => s.saveCurrentFile)
  const saveStatus = useStore(s => s.saveStatus)
  const isRunning = useStore(s => s.isRunning)
  const setIsRunning = useStore(s => s.setIsRunning)
  const addConsoleEntry = useStore(s => s.addConsoleEntry)
  const setShowConsole = useStore(s => s.setShowConsole)
  const showConsole = useStore(s => s.showConsole)
  const activeFile = useStore(s => s.files.find(f => f.id === s.activeFileId))
  const isDark = theme === 'dark'

  function handleRun() {
    if (!activeFile) return

    setIsRunning(true)
    addConsoleEntry('info', [`Running ${activeFile.name}...`])

    setTimeout(() => {
      const result = runTypeScriptCode(activeFile.content)

      if (result.error && result.logs.length === 0) {
        addConsoleEntry('error', [result.error])
      } else {
        for (const log of result.logs) {
          addConsoleEntry(log.method as ConsoleEntry['method'], log.args)
        }
      }

      if (!showConsole) {
        setShowConsole(true)
      }
      setIsRunning(false)
    }, 100)
  }

  return (
    <div
      className={`flex items-center justify-between px-4 py-1.5 border-b select-none ${
        isDark ? 'bg-editor-sidebar border-editor-border text-editor-fg' : 'bg-gray-100 border-gray-200 text-gray-800'
      }`}
      role="banner"
      aria-label="Title Bar"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-editor-hover' : 'hover:bg-gray-200'}`}
          aria-label="Toggle sidebar"
          title="Toggle Sidebar (Ctrl+B)"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold tracking-wide">CodeEditor</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleRun}
          disabled={isRunning || !activeFile}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
            isDark
              ? 'bg-green-700 text-white hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
          aria-label="Run code"
          title="Run TypeScript (Ctrl+Enter)"
        >
          <Play className="w-3.5 h-3.5" />
          {isRunning ? 'Running...' : 'Run'}
        </button>

        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`p-1.5 rounded transition-colors ${
            isDark ? 'hover:bg-editor-hover text-editor-fg-dim hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-800'
          }`}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={saveCurrentFile}
          disabled={saveStatus === 'saved'}
          className={`p-1.5 rounded transition-colors ${
            saveStatus === 'saved'
              ? isDark ? 'text-editor-fg-dim cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
              : isDark ? 'hover:bg-editor-hover text-editor-fg-dim hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-800'
          }`}
          aria-label="Save file"
          title="Save (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
