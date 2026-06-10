import { useStore } from '../../store/useStore'

export function SettingsPanel() {
  const settings = useStore(s => s.editorSettings)
  const updateSettings = useStore(s => s.updateSettings)
  const theme = useStore(s => s.theme)
  const isDark = theme === 'dark'

  const inputClass = `w-16 px-2 py-1 text-xs rounded border outline-none ${
    isDark
      ? 'bg-editor-bg border-editor-border text-editor-fg focus:border-blue-500'
      : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
  }`

  const labelClass = `text-xs ${isDark ? 'text-editor-fg-dim' : 'text-gray-500'}`

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-editor-sidebar text-editor-fg' : 'bg-gray-50 text-gray-800'}`}>
      <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b ${isDark ? 'border-editor-border text-editor-fg-dim' : 'border-gray-200 text-gray-500'}`}>
        Settings
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-3">
          <h3 className={`text-xs font-semibold uppercase ${isDark ? 'text-editor-fg-dim' : 'text-gray-500'}`}>Editor</h3>

          <div className="flex items-center justify-between">
            <span className={labelClass}>Font Size</span>
            <input
              type="number"
              min={10}
              max={32}
              value={settings.fontSize}
              onChange={e => updateSettings({ fontSize: Number(e.target.value) })}
              className={inputClass}
              aria-label="Font size"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className={labelClass}>Tab Size</span>
            <input
              type="number"
              min={1}
              max={8}
              value={settings.tabSize}
              onChange={e => updateSettings({ tabSize: Number(e.target.value) })}
              className={inputClass}
              aria-label="Tab size"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className={labelClass}>Line Numbers</span>
            <input
              type="checkbox"
              checked={settings.lineNumbers}
              onChange={e => updateSettings({ lineNumbers: e.target.checked })}
              className="rounded"
              aria-label="Show line numbers"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className={labelClass}>Word Wrap</span>
            <input
              type="checkbox"
              checked={settings.wordWrap}
              onChange={e => updateSettings({ wordWrap: e.target.checked })}
              className="rounded"
              aria-label="Word wrap"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className={labelClass}>Format on Save</span>
            <input
              type="checkbox"
              checked={settings.formatOnSave}
              onChange={e => updateSettings({ formatOnSave: e.target.checked })}
              className="rounded"
              aria-label="Format on save"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
