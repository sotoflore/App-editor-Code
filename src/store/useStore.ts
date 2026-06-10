import { create } from 'zustand'
import type { FileItem, Theme, EditorSettings, Toast, ActivityBarView, CursorPosition, SaveStatus, ConsoleEntry } from '../types'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  lineNumbers: true,
  wordWrap: false,
  minimap: false,
  bracketPairColorization: true,
  formatOnSave: true,
}

function createWelcomeFile(): FileItem {
  return {
    id: generateId(),
    name: 'welcome.ts',
    content: `// Welcome to CodeEditor!
// Start coding in TypeScript below:

function greet(name: string): string {
  return \`Hello, \${name}! Welcome to TypeScript editing.\`;
}

const message = greet('Developer');
console.log(message);

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

users.forEach(user => {
  console.log(\`User: \${user.name} (\${user.email})\`);
});
`,
    savedContent: '',
    language: 'typescript',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

interface AppState {
  files: FileItem[];
  openFiles: string[];
  activeFileId: string | null;
  theme: Theme;
  sidebarOpen: boolean;
  activityBar: ActivityBarView;
  editorSettings: EditorSettings;
  toasts: Toast[];
  cursorPosition: CursorPosition;
  saveStatus: SaveStatus;
  consoleEntries: ConsoleEntry[];
  showConsole: boolean;
  isRunning: boolean;

  addFile: (name: string) => void;
  renameFile: (id: string, newName: string) => void;
  deleteFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  setActiveFile: (id: string) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActivityBar: (view: ActivityBarView) => void;
  updateSettings: (settings: Partial<EditorSettings>) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setCursorPosition: (pos: CursorPosition) => void;
  setSaveStatus: (status: SaveStatus) => void;

  getActiveFile: () => FileItem | undefined;
  getOpenFiles: () => FileItem[];
  isFileUnsaved: (id: string) => boolean;

  exportProject: () => string;
  importProject: (json: string) => void;
  saveCurrentFile: () => void;

  addConsoleEntry: (method: ConsoleEntry['method'], args: unknown[]) => void;
  clearConsole: () => void;
  setShowConsole: (show: boolean) => void;
  toggleConsole: () => void;
  setIsRunning: (running: boolean) => void;
}

export const useStore = create<AppState>()((set, get) => {
  const saved = localStorage.getItem('codeeditor-state')
  const initialState: Partial<AppState> = saved ? (() => {
    try {
      return JSON.parse(saved)
    } catch {
      return {}
    }
  })() : {}

  const welcomeFile = createWelcomeFile()

  return {
    files: initialState.files || [welcomeFile],
    openFiles: initialState.openFiles || [welcomeFile.id],
    activeFileId: initialState.activeFileId || welcomeFile.id,
    theme: (initialState.theme as Theme) || 'dark',
    sidebarOpen: initialState.sidebarOpen ?? true,
    activityBar: (initialState.activityBar as ActivityBarView) || 'files',
    editorSettings: { ...DEFAULT_SETTINGS, ...initialState.editorSettings },
    toasts: [],
    cursorPosition: { line: 1, column: 1 },
    saveStatus: 'saved',
    consoleEntries: [],
    showConsole: false,
    isRunning: false,

    addFile: (name: string) => {
      const newFile: FileItem = {
        id: generateId(),
        name,
        content: '',
        savedContent: '',
        language: name.endsWith('.json') ? 'json' : 'typescript',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      set(state => {
        const files = [...state.files, newFile]
        const openFiles = [...state.openFiles, newFile.id]
        return { files, openFiles, activeFileId: newFile.id }
      })
    },

    renameFile: (id: string, newName: string) => {
      set(state => {
        const files = state.files.map(f =>
          f.id === id ? {
            ...f,
            name: newName,
            language: newName.endsWith('.json') ? 'json' : 'typescript',
            updatedAt: Date.now(),
          } : f
        )
        return { files }
      })
    },

    deleteFile: (id: string) => {
      set(state => {
        const files = state.files.filter(f => f.id !== id)
        const openFiles = state.openFiles.filter(fid => fid !== id)
        let activeFileId = state.activeFileId
        if (activeFileId === id) {
          activeFileId = openFiles.length > 0 ? openFiles[openFiles.length - 1] : null
        }
        return { files, openFiles, activeFileId }
      })
    },

    updateFileContent: (id: string, content: string) => {
      set(state => ({
        files: state.files.map(f =>
          f.id === id ? { ...f, content, updatedAt: Date.now() } : f
        ),
        saveStatus: 'unsaved' as SaveStatus,
      }))
    },

    openFile: (id: string) => {
      set(state => {
        if (!state.openFiles.includes(id)) {
          return { openFiles: [...state.openFiles, id], activeFileId: id }
        }
        return { activeFileId: id }
      })
    },

    closeFile: (id: string) => {
      set(state => {
        const openFiles = state.openFiles.filter(fid => fid !== id)
        let activeFileId = state.activeFileId
        if (activeFileId === id) {
          activeFileId = openFiles.length > 0 ? openFiles[openFiles.length - 1] : null
        }
        return { openFiles, activeFileId }
      })
    },

    setActiveFile: (id: string) => {
      set({ activeFileId: id })
    },

    setTheme: (theme: Theme) => {
      set({ theme })
    },

    toggleSidebar: () => {
      set(state => ({ sidebarOpen: !state.sidebarOpen }))
    },

    setSidebarOpen: (open: boolean) => {
      set({ sidebarOpen: open })
    },

    setActivityBar: (view: ActivityBarView) => {
      set({ activityBar: view })
    },

    updateSettings: (settings: Partial<EditorSettings>) => {
      set(state => ({
        editorSettings: { ...state.editorSettings, ...settings },
      }))
    },

    addToast: (toast: Omit<Toast, 'id'>) => {
      const id = generateId()
      set(state => ({
        toasts: [...state.toasts, { ...toast, id }],
      }))
      setTimeout(() => {
        get().removeToast(id)
      }, toast.duration || 4000)
    },

    removeToast: (id: string) => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id),
      }))
    },

    setCursorPosition: (pos: CursorPosition) => {
      set({ cursorPosition: pos })
    },

    setSaveStatus: (status: SaveStatus) => {
      set({ saveStatus: status })
    },

    getActiveFile: () => {
      const state = get()
      return state.files.find(f => f.id === state.activeFileId)
    },

    getOpenFiles: () => {
      const state = get()
      return state.files.filter(f => state.openFiles.includes(f.id))
    },

    isFileUnsaved: (id: string) => {
      const state = get()
      const file = state.files.find(f => f.id === id)
      return file ? file.content !== file.savedContent : false
    },

    exportProject: () => {
      const state = get()
      const data = {
        files: state.files,
        openFiles: state.openFiles,
        activeFileId: state.activeFileId,
        theme: state.theme,
        editorSettings: state.editorSettings,
      }
      return JSON.stringify(data, null, 2)
    },

    importProject: (json: string) => {
      try {
        const data = JSON.parse(json)
        set({
          files: data.files || [],
          openFiles: data.openFiles || [],
          activeFileId: data.activeFileId || null,
          theme: data.theme || 'dark',
          editorSettings: { ...DEFAULT_SETTINGS, ...data.editorSettings },
        })
      } catch {
        get().addToast({ message: 'Failed to import project: invalid JSON', type: 'error' })
      }
    },

    saveCurrentFile: () => {
      const state = get()
      const file = state.files.find(f => f.id === state.activeFileId)
      if (file) {
        set({
          files: state.files.map(f =>
            f.id === file.id ? { ...f, savedContent: f.content } : f
          ),
          saveStatus: 'saved',
        })
        get().addToast({ message: `"${file.name}" saved successfully`, type: 'success', duration: 2000 })
      }
    },

    addConsoleEntry: (method: ConsoleEntry['method'], args: unknown[]) => {
      set(state => ({
        consoleEntries: [...state.consoleEntries, {
          id: generateId(),
          method,
          args,
          timestamp: Date.now(),
        }],
      }))
    },

    clearConsole: () => {
      set({ consoleEntries: [] })
    },

    setShowConsole: (show: boolean) => {
      set({ showConsole: show })
    },

    toggleConsole: () => {
      set(state => ({ showConsole: !state.showConsole }))
    },

    setIsRunning: (running: boolean) => {
      set({ isRunning: running })
    },
  }
})

useStore.subscribe(state => {
  const { toasts, consoleEntries, isRunning, showConsole, ...persistable } = state
  const toSave = {
    files: persistable.files,
    openFiles: persistable.openFiles,
    activeFileId: persistable.activeFileId,
    theme: persistable.theme,
    editorSettings: persistable.editorSettings,
  }
  localStorage.setItem('codeeditor-state', JSON.stringify(toSave))
})
