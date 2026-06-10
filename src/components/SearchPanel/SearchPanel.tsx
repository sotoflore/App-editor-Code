import { useState, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { Search, FileCode, FileJson, File, X, ArrowRight } from 'lucide-react'

const iconFor = (name: string) => {
  if (name.endsWith('.json')) return FileJson
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return FileCode
  return File
}

export function SearchPanel() {
  const files = useStore(s => s.files)
  const openFile = useStore(s => s.openFile)
  const activeFileId = useStore(s => s.activeFileId)
  const theme = useStore(s => s.theme)
  const isDark = theme === 'dark'
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []

    const q = query.toLowerCase()
    const matches: { fileId: string; fileName: string; type: 'name' | 'content'; line?: number; lineContent?: string }[] = []

    for (const file of files) {
      if (file.name.toLowerCase().includes(q)) {
        matches.push({ fileId: file.id, fileName: file.name, type: 'name' })
      }

      const lines = file.content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(q)) {
          matches.push({
            fileId: file.id,
            fileName: file.name,
            type: 'content',
            line: i + 1,
            lineContent: lines[i].trim(),
          })
        }
      }
    }

    return matches.slice(0, 50)
  }, [files, query])

  function handleSelect(fileId: string) {
    openFile(fileId)
  }

  function highlightMatch(text: string) {
    if (!query.trim()) return <>{text}</>
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return <>{text}</>
    return (
      <>
        {text.slice(0, idx)}
        <span className={isDark ? 'bg-yellow-500/30 text-yellow-200' : 'bg-yellow-200 text-yellow-900'}>{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    )
  }

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-editor-sidebar text-editor-fg' : 'bg-gray-50 text-gray-800'}`}>
      <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b ${isDark ? 'border-editor-border text-editor-fg-dim' : 'border-gray-200 text-gray-500'}`}>
        Search
      </div>

      <div className="p-3">
        <div className={`flex items-center gap-1 px-2 py-1.5 rounded border ${isDark ? 'bg-editor-bg border-editor-border' : 'bg-white border-gray-300'}`}>
          <Search className={`w-3.5 h-3.5 ${isDark ? 'text-editor-fg-dim' : 'text-gray-400'}`} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search files and content..."
            className={`flex-1 bg-transparent text-xs outline-none ${isDark ? 'text-editor-fg placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
            autoFocus
            aria-label="Search files and content"
          />
          {query && (
            <button onClick={() => setQuery('')} className={`p-0.5 rounded ${isDark ? 'hover:bg-editor-hover' : 'hover:bg-gray-200'}`}>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {query && results.length === 0 && (
          <div className={`px-3 py-4 text-xs text-center ${isDark ? 'text-editor-fg-dim' : 'text-gray-400'}`}>
            No results found for "{query}"
          </div>
        )}

        {!query && (
          <div className={`px-3 py-4 text-xs text-center ${isDark ? 'text-editor-fg-dim' : 'text-gray-400'}`}>
            Type to search across {files.length} file{files.length !== 1 ? 's' : ''}
          </div>
        )}

        {results.map((result, idx) => {
          const Icon = iconFor(result.fileName)
          const isActive = result.fileId === activeFileId
          return (
            <button
              key={`${result.fileId}-${idx}`}
              onClick={() => handleSelect(result.fileId)}
              className={`w-full text-left px-3 py-1.5 transition-colors ${
                isActive
                  ? isDark ? 'bg-editor-active' : 'bg-blue-50'
                  : isDark ? 'hover:bg-editor-hover' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-editor-fg-dim' : 'text-gray-400'}`} />
                <span className="text-xs font-medium truncate">{result.fileName}</span>
                {result.type === 'content' && result.line && (
                  <span className={`text-[10px] ml-auto ${isDark ? 'text-editor-fg-dim' : 'text-gray-400'}`}>
                    Ln {result.line}
                  </span>
                )}
              </div>
              {result.type === 'content' && result.lineContent && (
                <div className={`flex items-center gap-1 pl-5 ${isDark ? 'text-editor-fg-dim' : 'text-gray-500'}`}>
                  <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                  <span className="text-[11px] truncate">{highlightMatch(result.lineContent)}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
