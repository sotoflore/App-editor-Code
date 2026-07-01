import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { runTypeScriptCode } from '../services/runCode'
import type { ConsoleEntry } from '../types'

export function useKeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey

      if (mod && e.key === 'Enter') {
        e.preventDefault()
        const state = useStore.getState()
        const activeFile = state.files.find(f => f.id === state.activeFileId)
        if (!activeFile) return

        state.setIsRunning(true)
        state.addConsoleEntry('info', [`Running ${activeFile.name}...`])

        setTimeout(() => {
          const result = runTypeScriptCode(activeFile.content)

          if (result.error && result.logs.length === 0) {
            state.addConsoleEntry('error', [result.error])
          } else {
            for (const log of result.logs) {
              state.addConsoleEntry(log.method as ConsoleEntry['method'], log.args)
            }
          }

          if (!state.showConsole) {
            state.setShowConsole(true)
          }
          state.setIsRunning(false)
        }, 100)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
