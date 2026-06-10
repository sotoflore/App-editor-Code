export function getLanguageFromFileName(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    css: 'css',
    html: 'html',
    md: 'markdown',
    sql: 'sql',
    py: 'python',
    rs: 'rust',
    go: 'go',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    h: 'c',
  }
  return languageMap[ext] || 'plain text'
}

export function isValidFileName(name: string): boolean {
  if (!name || name.trim().length === 0) return false
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/
  return !invalidChars.test(name) && name.includes('.')
}
