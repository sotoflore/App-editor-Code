import { useStore } from '../../store/useStore'
import { FileCode, FileJson, File, X, Circle } from 'lucide-react'
import type { FileItem } from '../../types'

interface TabProps {
  file: FileItem
}

const fileIcon = (name: string) => {
  if (name.endsWith('.json')) return FileJson
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return FileCode
  return File
}

export function Tab({ file }: TabProps) {
  const activeFileId = useStore(s => s.activeFileId)
  const setActiveFile = useStore(s => s.setActiveFile)
  const closeFile = useStore(s => s.closeFile)
  const theme = useStore(s => s.theme)
  const isDark = theme === 'dark'
  const isActive = activeFileId === file.id
  const isUnsaved = file.content !== file.savedContent
  const Icon = fileIcon(file.name)

  return (
    <div
      className={`group flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer border-r select-none transition-colors ${
        isActive
          ? isDark
            ? 'bg-editor-tab-active text-white border-t-2 border-t-editor-status border-editor-border'
            : 'bg-white text-gray-900 border-t-2 border-t-blue-500 border-gray-200'
          : isDark
            ? 'bg-editor-tab text-editor-fg-dim hover:text-editor-fg border-editor-border'
            : 'bg-gray-100 text-gray-600 hover:text-gray-800 border-gray-200'
      }`}
      onClick={() => setActiveFile(file.id)}
      role="tab"
      aria-selected={isActive}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') setActiveFile(file.id) }}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="text-xs truncate max-w-[120px]">{file.name}</span>

      <button
        onClick={e => { e.stopPropagation(); closeFile(file.id) }}
        className={`p-0.5 rounded transition-colors ${
          isActive
            ? isDark
              ? 'opacity-0 group-hover:opacity-100 hover:bg-editor-active'
              : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200'
            : isDark
              ? 'opacity-0 group-hover:opacity-100 hover:bg-editor-hover'
              : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200'
        }`}
        aria-label={`Close ${file.name}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {isUnsaved && (
        <Circle className="w-2.5 h-2.5 shrink-0 opacity-60" aria-label="Unsaved changes" />
      )}
    </div>
  )
}
