import { useStore } from '../../store/useStore'

export function StatusBar() {
  const files = useStore(s => s.files)
  const activeFileId = useStore(s => s.activeFileId)
  const theme = useStore(s => s.theme)
  const cursorPosition = useStore(s => s.cursorPosition)
  const saveStatus = useStore(s => s.saveStatus)
  const isDark = theme === 'dark'

  const activeFile = files.find(f => f.id === activeFileId)
  const lineCount = activeFile ? activeFile.content.split('\n').length : 0
  const language = activeFile?.language || 'Plain Text'

  return (
    <div
      className={`flex items-center justify-between px-4 py-1 text-xs border-t ${
        isDark ? 'bg-editor-status text-white border-editor-border' : 'bg-blue-600 text-white border-gray-200'
      }`}
      role="status"
      aria-label="Status Bar"
    >
      <div className="flex items-center gap-4">
        <span aria-label="Language">{language}</span>
        <span aria-label="Save status">
          {saveStatus === 'saved' && 'Saved'}
          {saveStatus === 'unsaved' && 'Unsaved'}
          {saveStatus === 'saving' && 'Saving...'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span aria-label="Line count">Ln {lineCount}</span>
        <span aria-label="Cursor position">
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </span>
      </div>
    </div>
  )
}
