import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FileCode, FileJson, File, Pencil, Trash2 } from 'lucide-react'
import type { FileItem as FileItemType } from '../../types'

interface FileItemProps {
  file: FileItemType
}

const fileIcon = (name: string) => {
  if (name.endsWith('.json')) return FileJson
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return FileCode
  return File
}

export function FileItem({ file }: FileItemProps) {
  const activeFileId = useStore(s => s.activeFileId)
  const openFile = useStore(s => s.openFile)
  const renameFile = useStore(s => s.renameFile)
  const deleteFile = useStore(s => s.deleteFile)
  const theme = useStore(s => s.theme)
  const isDark = theme === 'dark'
  const isActive = activeFileId === file.id
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(file.name)
  const Icon = fileIcon(file.name)

  function handleRename() {
    if (newName.trim() && newName.trim() !== file.name) {
      renameFile(file.id, newName.trim())
    }
    setIsEditing(false)
  }

  function handleDelete() {
    deleteFile(file.id)
  }

  return (
    <div
      className={`group flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer transition-colors ${
        isActive
          ? isDark ? 'bg-editor-active text-white' : 'bg-blue-50 text-blue-700'
          : isDark ? 'text-editor-fg hover:bg-editor-hover' : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={() => openFile(file.id)}
      role="treeitem"
      aria-selected={isActive}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') openFile(file.id) }}
    >
      <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isDark ? 'text-white' : 'text-blue-600') : ''}`} />

      {isEditing ? (
        <input
          autoFocus
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') { setIsEditing(false); setNewName(file.name) }
          }}
          onBlur={handleRename}
          className={`flex-1 px-1 py-0.5 text-xs rounded border outline-none ${
            isDark
              ? 'bg-editor-bg border-editor-border text-editor-fg'
              : 'bg-white border-gray-300 text-gray-800'
          }`}
          onClick={e => e.stopPropagation()}
          aria-label="Rename file"
        />
      ) : (
        <span className="flex-1 truncate text-xs">{file.name}</span>
      )}

      {!isEditing && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); setIsEditing(true); setNewName(file.name) }}
            className={`p-0.5 rounded transition-colors ${isDark ? 'hover:bg-editor-active hover:text-white' : 'hover:bg-gray-200'}`}
            aria-label={`Rename ${file.name}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); handleDelete() }}
            className={`p-0.5 rounded transition-colors ${isDark ? 'hover:bg-editor-active hover:text-editor-error' : 'hover:bg-gray-200 hover:text-red-600'}`}
            aria-label={`Delete ${file.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
