import ts from 'typescript'

export interface ExecutionResult {
  logs: { method: string; args: unknown[] }[]
  error: string | null
}

export function runTypeScriptCode(code: string): ExecutionResult {
  const logs: { method: string; args: unknown[] }[] = []

  const result = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      strict: true,
      jsx: ts.JsxEmit.Preserve,
    },
    reportDiagnostics: true,
  })

  if (result.diagnostics && result.diagnostics.length > 0) {
    const messages = result.diagnostics.map(d =>
      `TS${d.code}: ${typeof d.messageText === 'string' ? d.messageText : d.messageText.messageText}`
    )
    return { logs: [{ method: 'error', args: messages }], error: messages.join('\n') }
  }

  const jsCode = result.outputText

  const originalLog = console.log
  const originalError = console.error
  const originalWarn = console.warn
  const originalInfo = console.info

  console.log = (...args: unknown[]) => {
    logs.push({ method: 'log', args })
    originalLog(...args)
  }
  console.error = (...args: unknown[]) => {
    logs.push({ method: 'error', args })
    originalError(...args)
  }
  console.warn = (...args: unknown[]) => {
    logs.push({ method: 'warn', args })
    originalWarn(...args)
  }
  console.info = (...args: unknown[]) => {
    logs.push({ method: 'info', args })
    originalInfo(...args)
  }

  try {
    const fn = new Function(jsCode)
    fn()
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    logs.push({ method: 'error', args: [message] })
    return { logs, error: message }
  } finally {
    console.log = originalLog
    console.error = originalError
    console.warn = originalWarn
    console.info = originalInfo
  }

  return { logs, error: null }
}
