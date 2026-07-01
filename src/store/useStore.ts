import { create } from 'zustand'
import type { FileItem, Theme, Toast, CursorPosition, ConsoleEntry } from '../types'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

function createWelcomeFile(): FileItem {
  return {
    id: generateId(),
    name: 'welcome.ts',
    content: `// Welcome to CodeEditor!
// Start coding in TypeScript below:
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
  toasts: Toast[];
  cursorPosition: CursorPosition;
  consoleEntries: ConsoleEntry[];
  showConsole: boolean;
  isRunning: boolean;

  updateFileContent: (id: string, content: string) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  setActiveFile: (id: string) => void;
  setTheme: (theme: Theme) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setCursorPosition: (pos: CursorPosition) => void;
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
    toasts: [],
    cursorPosition: { line: 1, column: 1 },
    consoleEntries: [],
    showConsole: false,
    isRunning: false,

    updateFileContent: (id: string, content: string) => {
      set(state => ({
        files: state.files.map(f =>
          f.id === id ? { ...f, content, updatedAt: Date.now() } : f
        ),
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
  const { toasts, consoleEntries, isRunning, showConsole, cursorPosition, ...persistable } = state
  const toSave = {
    files: persistable.files,
    openFiles: persistable.openFiles,
    activeFileId: persistable.activeFileId,
    theme: persistable.theme,
  }
  localStorage.setItem('codeeditor-state', JSON.stringify(toSave))
})
