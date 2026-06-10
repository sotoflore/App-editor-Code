import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { runTypeScriptCode } from '../services/runCode'
import type { ConsoleEntry } from '../types'

export function useKeyboardShortcuts() {
  const saveCurrentFile = useStore(s => s.saveCurrentFile)
  const exportProject = useStore(s => s.exportProject)
  const importProject = useStore(s => s.importProject)
  const addToast = useStore(s => s.addToast)
  const toggleSidebar = useStore(s => s.toggleSidebar)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey

      if (mod && e.key === 's') {
        e.preventDefault()
        saveCurrentFile()
      }

      if (mod && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }

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

      if (mod && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        const json = exportProject()
        navigator.clipboard.writeText(json).then(() => {
          addToast({ message: 'Project exported to clipboard', type: 'success' })
        })
      }

      if (mod && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        navigator.clipboard.readText().then(text => {
          importProject(text)
          addToast({ message: 'Project imported from clipboard', type: 'success' })
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveCurrentFile, exportProject, importProject, addToast, toggleSidebar])
}
