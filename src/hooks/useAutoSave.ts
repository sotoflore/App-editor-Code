import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

export function useAutoSave(delay = 3000) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveCurrentFile = useStore(s => s.saveCurrentFile)
  const files = useStore(s => s.files)
  const activeFileId = useStore(s => s.activeFileId)

  useEffect(() => {
    if (!activeFileId) return
    const file = files.find(f => f.id === activeFileId)
    if (!file) return
    if (file.content === file.savedContent) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      saveCurrentFile()
    }, delay)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [files, activeFileId, saveCurrentFile, delay])
}
