import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export function useTheme() {
  const theme = useStore(s => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#1e1e1e' : '#ffffff')
    }
  }, [theme])

  return theme
}
