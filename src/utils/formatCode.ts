export function formatTypeScriptCode(code: string): string {
  let result = ''
  let indent = 0
  const lines = code.split('\n')
  const tab = '  '

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') {
      result += '\n'
      continue
    }

    if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
      indent = Math.max(0, indent - 1)
    }

    result += tab.repeat(indent) + trimmed + '\n'

    const openBraces = (trimmed.match(/\{/g) || []).length
    const closeBraces = (trimmed.match(/\}/g) || []).length
    const openBrackets = (trimmed.match(/\[/g) || []).length
    const closeBrackets = (trimmed.match(/\]/g) || []).length

    indent += openBraces - closeBraces + openBrackets - closeBrackets

    if (indent < 0) indent = 0
  }

  return result.trimEnd()
}
