const STORAGE_KEY_PREFIX = 'codeeditor-file-'

export const storageService = {
  saveFile(id: string, content: string): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, content)
    } catch (e) {
      console.error('Failed to save file to localStorage:', e)
    }
  },

  loadFile(id: string): string | null {
    try {
      return localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`)
    } catch {
      return null
    }
  },

  removeFile(id: string): void {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`)
    } catch {
      // ignore
    }
  },

  clearAll(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_KEY_PREFIX))
      keys.forEach(k => localStorage.removeItem(k))
    } catch {
      // ignore
    }
  },
}
