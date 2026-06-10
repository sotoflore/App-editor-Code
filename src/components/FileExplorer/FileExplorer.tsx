import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { FileItem } from './FileItem'
import { Plus, FolderOpen, Upload, Download } from 'lucide-react'

export function FileExplorer() {
  const files = useStore(s => s.files)
  const addFile = useStore(s => s.addFile)
  const exportProject = useStore(s => s.exportProject)
  const importProject = useStore(s => s.importProject)
  const addToast = useStore(s => s.addToast)
  const theme = useStore(s => s.theme)
  const [isCreating, setIsCreating] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const isDark = theme === 'dark'

  function handleCreateFile() {
    if (newFileName.trim()) {
      addFile(newFileName.trim())
      setNewFileName('')
      setIsCreating(false)
    }
  }

  function handleExport() {
    const json = exportProject()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'codeeditor-project.json'
    a.click()
    URL.revokeObjectURL(url)
    addToast({ message: 'Project exported successfully', type: 'success' })
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        importProject(text)
        addToast({ message: 'Project imported successfully', type: 'success' })
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-editor-sidebar text-editor-fg' : 'bg-gray-50 text-gray-800'}`}>
      <div className={`flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b ${isDark ? 'border-editor-border text-editor-fg-dim' : 'border-gray-200 text-gray-500'}`}>
        <span>Explorer</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreating(true)}
            className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-editor-hover hover:text-white' : 'hover:bg-gray-200'}`}
            aria-label="Create new file"
            title="New File"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-editor-hover hover:text-white' : 'hover:bg-gray-200'}`}
            aria-label="Export project"
            title="Export Project"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={handleImport}
            className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-editor-hover hover:text-white' : 'hover:bg-gray-200'}`}
            aria-label="Import project"
            title="Import Project"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full px-4 text-center ${isDark ? 'text-editor-fg-dim' : 'text-gray-400'}`}>
            <FolderOpen className="w-8 h-8 mb-2" />
            <p className="text-xs">No files yet</p>
          </div>
        ) : (
          files.map(file => (
            <FileItem key={file.id} file={file} />
          ))
        )}
      </div>

      {isCreating && (
        <div className={`px-3 py-2 border-t ${isDark ? 'border-editor-border' : 'border-gray-200'}`}>
          <input
            autoFocus
            type="text"
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCreateFile()
              if (e.key === 'Escape') { setIsCreating(false); setNewFileName('') }
            }}
            onBlur={() => { if (!newFileName) { setIsCreating(false) } }}
            placeholder="filename.ts"
            className={`w-full px-2 py-1 text-xs rounded border outline-none ${
              isDark
                ? 'bg-editor-bg border-editor-border text-editor-fg placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500'
            }`}
            aria-label="New file name"
          />
        </div>
      )}
    </div>
  )
}
