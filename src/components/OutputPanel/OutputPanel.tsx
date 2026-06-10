import { useStore } from '../../store/useStore'
import { Trash2, ChevronDown, ChevronUp, Play, Terminal } from 'lucide-react'
import { runTypeScriptCode } from '../../services/runCode'
import type { ConsoleEntry } from '../../types'

function formatArg(arg: unknown): string {
  if (arg === null) return 'null'
  if (arg === undefined) return 'undefined'
  if (typeof arg === 'string') return arg
  if (typeof arg === 'object') {
    try {
      return JSON.stringify(arg, null, 2)
    } catch {
      return String(arg)
    }
  }
  return String(arg)
}

export function OutputPanel() {
  const theme = useStore(s => s.theme)
  const consoleEntries = useStore(s => s.consoleEntries)
  const showConsole = useStore(s => s.showConsole)
  const toggleConsole = useStore(s => s.toggleConsole)
  const clearConsole = useStore(s => s.clearConsole)
  const addConsoleEntry = useStore(s => s.addConsoleEntry)
  const setIsRunning = useStore(s => s.setIsRunning)
  const isRunning = useStore(s => s.isRunning)
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
        useStore.getState().setShowConsole(true)
      }
      setIsRunning(false)
    }, 100)
  }

  const colorMap = {
    log: isDark ? 'text-editor-fg' : 'text-gray-800',
    info: 'text-blue-400',
    warn: 'text-yellow-400',
    error: 'text-red-400',
  }

  return (
    <div className={`flex flex-col border-t ${isDark ? 'border-editor-border bg-editor-sidebar' : 'border-gray-200 bg-gray-50'}`}>
      <div className={`flex items-center justify-between px-3 py-1 border-b ${isDark ? 'border-editor-border' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleConsole}
            className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-editor-hover' : 'hover:bg-gray-200'}`}
            aria-label={showConsole ? 'Hide console' : 'Show console'}
          >
            <Terminal className={`w-3.5 h-3.5 ${isDark ? 'text-editor-fg-dim' : 'text-gray-500'}`} />
          </button>
          <span className={`text-xs font-semibold ${isDark ? 'text-editor-fg-dim' : 'text-gray-500'}`}>
            CONSOLE
          </span>
          <span className={`text-xs ${isDark ? 'text-editor-fg-dim' : 'text-gray-400'}`}>
            ({consoleEntries.length})
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleRun}
            disabled={isRunning || !activeFile}
            className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded transition-colors ${
              isDark
                ? 'bg-green-700 text-white hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            aria-label="Run code"
          >
            <Play className="w-3 h-3" />
            {isRunning ? 'Running...' : 'Run'}
          </button>

          <button
            onClick={clearConsole}
            className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-editor-hover text-editor-fg-dim hover:text-white' : 'hover:bg-gray-200 text-gray-500'}`}
            aria-label="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleConsole}
            className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-editor-hover text-editor-fg-dim' : 'hover:bg-gray-200 text-gray-500'}`}
            aria-label={showConsole ? 'Collapse console' : 'Expand console'}
          >
            {showConsole ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {showConsole && (
        <div
          className={`overflow-y-auto font-mono text-xs leading-relaxed ${isDark ? 'bg-editor-bg' : 'bg-white'}`}
          style={{ height: '180px', minHeight: '80px' }}
          role="log"
          aria-label="Console output"
        >
          {consoleEntries.length === 0 ? (
            <div className={`p-3 italic ${isDark ? 'text-editor-fg-dim' : 'text-gray-400'}`}>
              Click "Run" to execute the code and see console output here.
            </div>
          ) : (
            consoleEntries.map(entry => (
              <div key={entry.id} className={`px-3 py-0.5 ${colorMap[entry.method]} ${entry.method === 'error' ? (isDark ? 'bg-red-900/20' : 'bg-red-50') : ''}`}>
                {entry.method === 'error' && <span className="mr-1">✗</span>}
                {entry.method === 'warn' && <span className="mr-1">⚠</span>}
                {entry.method === 'info' && <span className="mr-1">ℹ</span>}
                {entry.args.map((arg, i) => (
                  <span key={i}>
                    {formatArg(arg)}
                    {i < entry.args.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
