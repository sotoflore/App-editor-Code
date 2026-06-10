import { useStore } from '../../store/useStore'
import { Tab } from './Tab'

export function Tabs() {
  const openFiles = useStore(s => s.openFiles)
  const files = useStore(s => s.files)
  const theme = useStore(s => s.theme)
  const isDark = theme === 'dark'

  const openFileItems = files.filter(f => openFiles.includes(f.id))

  if (openFileItems.length === 0) return null

  return (
    <div
      className={`flex items-center overflow-x-auto border-b ${isDark ? 'bg-editor-tab border-editor-border' : 'bg-gray-100 border-gray-200'}`}
      role="tablist"
      aria-label="Open files"
    >
      {openFileItems.map(file => (
        <Tab key={file.id} file={file} />
      ))}
    </div>
  )
}
