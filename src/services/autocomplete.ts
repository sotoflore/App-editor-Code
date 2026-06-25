import {
  type CompletionContext,
  type CompletionResult,
  type Completion,
} from '@codemirror/autocomplete'

const keywords: Completion[] = [
  { label: 'interface', type: 'keyword', detail: 'keyword', info: 'Declare a TypeScript interface' },
  { label: 'type', type: 'keyword', detail: 'keyword', info: 'Declare a type alias' },
  { label: 'enum', type: 'keyword', detail: 'keyword', info: 'Declare an enum' },
  { label: 'implements', type: 'keyword', detail: 'keyword' },
  { label: 'abstract', type: 'keyword', detail: 'keyword' },
  { label: 'readonly', type: 'keyword', detail: 'keyword' },
  { label: 'declare', type: 'keyword', detail: 'keyword' },
  { label: 'namespace', type: 'keyword', detail: 'keyword' },
  { label: 'module', type: 'keyword', detail: 'keyword' },
  { label: 'public', type: 'keyword', detail: 'keyword' },
  { label: 'private', type: 'keyword', detail: 'keyword' },
  { label: 'protected', type: 'keyword', detail: 'keyword' },
  { label: 'static', type: 'keyword', detail: 'keyword' },
  { label: 'async', type: 'keyword', detail: 'keyword' },
  { label: 'await', type: 'keyword', detail: 'keyword' },
  { label: 'yield', type: 'keyword', detail: 'keyword' },
  { label: 'const', type: 'keyword', detail: 'keyword' },
  { label: 'let', type: 'keyword', detail: 'keyword' },
  { label: 'var', type: 'keyword', detail: 'keyword' },
  { label: 'function', type: 'keyword', detail: 'keyword' },
  { label: 'class', type: 'keyword', detail: 'keyword' },
  { label: 'export', type: 'keyword', detail: 'keyword' },
  { label: 'import', type: 'keyword', detail: 'keyword' },
  { label: 'from', type: 'keyword', detail: 'keyword' },
  { label: 'return', type: 'keyword', detail: 'keyword' },
  { label: 'if', type: 'keyword', detail: 'keyword' },
  { label: 'else', type: 'keyword', detail: 'keyword' },
  { label: 'for', type: 'keyword', detail: 'keyword' },
  { label: 'while', type: 'keyword', detail: 'keyword' },
  { label: 'do', type: 'keyword', detail: 'keyword' },
  { label: 'switch', type: 'keyword', detail: 'keyword' },
  { label: 'case', type: 'keyword', detail: 'keyword' },
  { label: 'break', type: 'keyword', detail: 'keyword' },
  { label: 'continue', type: 'keyword', detail: 'keyword' },
  { label: 'throw', type: 'keyword', detail: 'keyword' },
  { label: 'try', type: 'keyword', detail: 'keyword' },
  { label: 'catch', type: 'keyword', detail: 'keyword' },
  { label: 'finally', type: 'keyword', detail: 'keyword' },
  { label: 'typeof', type: 'keyword', detail: 'keyword' },
  { label: 'instanceof', type: 'keyword', detail: 'keyword' },
  { label: 'keyof', type: 'keyword', detail: 'keyword' },
  { label: 'infer', type: 'keyword', detail: 'keyword' },
  { label: 'satisfies', type: 'keyword', detail: 'keyword' },
  { label: 'as', type: 'keyword', detail: 'keyword' },
  { label: 'is', type: 'keyword', detail: 'keyword' },
  { label: 'never', type: 'type', detail: 'keyword' },
  { label: 'unknown', type: 'type', detail: 'keyword' },
  { label: 'any', type: 'type', detail: 'keyword' },
  { label: 'void', type: 'type', detail: 'keyword' },
  { label: 'boolean', type: 'type', detail: 'keyword' },
  { label: 'number', type: 'type', detail: 'keyword' },
  { label: 'string', type: 'type', detail: 'keyword' },
  { label: 'symbol', type: 'type', detail: 'keyword' },
  { label: 'bigint', type: 'type', detail: 'keyword' },
  { label: 'null', type: 'keyword', detail: 'keyword' },
  { label: 'undefined', type: 'keyword', detail: 'keyword' },
  { label: 'true', type: 'keyword', detail: 'keyword' },
  { label: 'false', type: 'keyword', detail: 'keyword' },
  { label: 'this', type: 'keyword', detail: 'keyword' },
  { label: 'super', type: 'keyword', detail: 'keyword' },
  { label: 'new', type: 'keyword', detail: 'keyword' },
  { label: 'delete', type: 'keyword', detail: 'keyword' },
  { label: 'in', type: 'keyword', detail: 'keyword' },
  { label: 'of', type: 'keyword', detail: 'keyword' },
]

const snippets: Completion[] = [
  {
    label: 'console.log',
    type: 'function',
    detail: 'console.log()',
    apply: 'console.log(${})',
    info: 'Log a message to the console',
  },
  {
    label: 'console.error',
    type: 'function',
    detail: 'console.error()',
    apply: 'console.error(${})',
    info: 'Log an error to the console',
  },
  {
    label: 'console.warn',
    type: 'function',
    detail: 'console.warn()',
    apply: 'console.warn(${})',
    info: 'Log a warning to the console',
  },
  {
    label: 'console.info',
    type: 'function',
    detail: 'console.info()',
    apply: 'console.info(${})',
    info: 'Log an info message to the console',
  },
  {
    label: 'console.table',
    type: 'function',
    detail: 'console.table()',
    apply: 'console.table(${})',
  },
  {
    label: 'arrow function',
    type: 'snippet',
    detail: '() => {}',
    apply: '() => {\n  ${}\n}',
  },
  {
    label: 'function',
    type: 'snippet',
    detail: 'function name() {}',
    apply: 'function ${name}(${}) {\n  ${}\n}',
  },
  {
    label: 'if',
    type: 'snippet',
    detail: 'if () {}',
    apply: 'if (${condition}) {\n  ${}\n}',
  },
  {
    label: 'if else',
    type: 'snippet',
    detail: 'if () {} else {}',
    apply: 'if (${condition}) {\n  ${}\n} else {\n  ${}\n}',
  },
  {
    label: 'for',
    type: 'snippet',
    detail: 'for () {}',
    apply: 'for (let ${i} = 0; ${i} < ${length}; ${i}++) {\n  ${}\n}',
  },
  {
    label: 'for of',
    type: 'snippet',
    detail: 'for of loop',
    apply: 'for (const ${item} of ${array}) {\n  ${}\n}',
  },
  {
    label: 'for in',
    type: 'snippet',
    detail: 'for in loop',
    apply: 'for (const ${key} in ${object}) {\n  ${}\n}',
  },
  {
    label: 'while',
    type: 'snippet',
    detail: 'while loop',
    apply: 'while (${condition}) {\n  ${}\n}',
  },
  {
    label: 'do while',
    type: 'snippet',
    detail: 'do while loop',
    apply: 'do {\n  ${}\n} while (${condition});',
  },
  {
    label: 'try',
    type: 'snippet',
    detail: 'try {} catch {}',
    apply: 'try {\n  ${}\n} catch (${error}) {\n  ${}\n}',
  },
  {
    label: 'try finally',
    type: 'snippet',
    detail: 'try {} catch {} finally {}',
    apply: 'try {\n  ${}\n} catch (${error}) {\n  ${}\n} finally {\n  ${}\n}',
  },
  {
    label: 'interface',
    type: 'snippet',
    detail: 'interface Name {}',
    apply: 'interface ${Name} {\n  ${}\n}',
  },
  {
    label: 'type',
    type: 'snippet',
    detail: 'type Alias = ...',
    apply: 'type ${Name} = ${type};',
  },
  {
    label: 'class',
    type: 'snippet',
    detail: 'class Name {}',
    apply: 'class ${Name} {\n  constructor(${}) {\n    ${}\n  }\n}',
  },
  {
    label: 'export default',
    type: 'snippet',
    detail: 'export default',
    apply: 'export default ${}',
  },
  {
    label: 'import',
    type: 'snippet',
    detail: 'import ... from ...',
    apply: 'import { ${} } from "${module}";',
  },
  {
    label: 'import default',
    type: 'snippet',
    detail: 'import Name from ...',
    apply: 'import ${name} from "${module}";',
  },
  {
    label: 'async function',
    type: 'snippet',
    detail: 'async function name()',
    apply: 'async function ${name}(${}) {\n  ${}\n}',
  },
  {
    label: 'Promise',
    type: 'snippet',
    detail: 'new Promise()',
    apply: 'new Promise<void>((${resolve}, ${reject}) => {\n  ${}\n})',
  },
  {
    label: 'setTimeout',
    type: 'function',
    detail: 'setTimeout()',
    apply: 'setTimeout(() => {\n  ${}\n}, ${delay});',
  },
  {
    label: 'setInterval',
    type: 'function',
    detail: 'setInterval()',
    apply: 'setInterval(() => {\n  ${}\n}, ${delay});',
  },
  {
    label: 'addEventListener',
    type: 'function',
    detail: 'addEventListener()',
    apply: 'addEventListener("${event}", (${e}) => {\n  ${}\n});',
  },
  {
    label: 'querySelector',
    type: 'function',
    detail: 'document.querySelector()',
    apply: 'document.querySelector("${selector}")',
  },
  {
    label: 'JSON.stringify',
    type: 'function',
    detail: 'JSON.stringify()',
    apply: 'JSON.stringify(${}, null, 2)',
  },
  {
    label: 'JSON.parse',
    type: 'function',
    detail: 'JSON.parse()',
    apply: 'JSON.parse(${})',
  },
  {
    label: 'fetch',
    type: 'function',
    detail: 'fetch()',
    apply: 'fetch("${url}")\n  .then(res => res.json())\n  .then(data => {\n    ${}\n  })',
  },
  {
    label: 'fetch await',
    type: 'snippet',
    detail: 'const res = await fetch()',
    apply: 'const response = await fetch("${url}");\nconst data = await response.json();',
  },
  {
    label: 'map',
    type: 'function',
    detail: '.map()',
    apply: '.map((${item}) => {\n  ${}\n})',
  },
  {
    label: 'filter',
    type: 'function',
    detail: '.filter()',
    apply: '.filter((${item}) => {\n  ${}\n})',
  },
  {
    label: 'reduce',
    type: 'function',
    detail: '.reduce()',
    apply: '.reduce((${acc}, ${item}) => {\n  ${}\n}, ${initial})',
  },
  {
    label: 'forEach',
    type: 'function',
    detail: '.forEach()',
    apply: '.forEach((${item}) => {\n  ${}\n})',
  },
  {
    label: 'find',
    type: 'function',
    detail: '.find()',
    apply: '.find((${item}) => {\n  ${}\n})',
  },
  {
    label: 'some',
    type: 'function',
    detail: '.some()',
    apply: '.some((${item}) => {\n  ${}\n})',
  },
  {
    label: 'every',
    type: 'function',
    detail: '.every()',
    apply: '.every((${item}) => {\n  ${}\n})',
  },
  {
    label: 'includes',
    type: 'function',
    detail: '.includes()',
    apply: '.includes(${value})',
  },
  {
    label: 'async/await',
    type: 'snippet',
    detail: 'async function with await',
    apply: 'async function ${name}(${}): Promise<void> {\n  ${}\n}',
  },
  {
    label: 'try await',
    type: 'snippet',
    detail: 'try/catch with await',
    apply: 'try {\n  const ${result} = await ${};\n} catch (${error}) {\n  ${}\n}',
  },
  {
    label: 'array',
    type: 'snippet',
    detail: 'Array<Type>',
    apply: 'Array<${T}>',
  },
  {
    label: 'Record',
    type: 'snippet',
    detail: 'Record<Keys, Value>',
    apply: 'Record<${string}, ${any}>',
  },
  {
    label: 'Partial',
    type: 'snippet',
    detail: 'Partial<Type>',
    apply: 'Partial<${T}>',
  },
  {
    label: 'Pick',
    type: 'snippet',
    detail: 'Pick<Type, Keys>',
    apply: 'Pick<${T}, ${K}>',
  },
  {
    label: 'Omit',
    type: 'snippet',
    detail: 'Omit<Type, Keys>',
    apply: 'Omit<${T}, ${K}>',
  },
  {
    label: 'Exclude',
    type: 'snippet',
    detail: 'Exclude<Type, ExcludedUnion>',
    apply: 'Exclude<${T}, ${U}>',
  },
  {
    label: 'ReturnType',
    type: 'snippet',
    detail: 'ReturnType<Type>',
    apply: 'ReturnType<${T}>',
  },
  {
    label: 'Parameters',
    type: 'snippet',
    detail: 'Parameters<Type>',
    apply: 'Parameters<${T}>',
  },
  {
    label: 'required',
    type: 'snippet',
    detail: 'Required<Type>',
    apply: 'Required<${T}>',
  },
  {
    label: 'Readonly',
    type: 'snippet',
    detail: 'Readonly<Type>',
    apply: 'Readonly<${T}>',
  },
]

const builtins: Completion[] = [
  { label: 'Array', type: 'class', detail: 'Array constructor' },
  { label: 'Map', type: 'class', detail: 'Map constructor' },
  { label: 'Set', type: 'class', detail: 'Set constructor' },
  { label: 'Promise', type: 'class', detail: 'Promise constructor' },
  { label: 'JSON', type: 'class', detail: 'JSON static methods' },
  { label: 'Math', type: 'class', detail: 'Math static methods' },
  { label: 'Date', type: 'class', detail: 'Date constructor' },
  { label: 'RegExp', type: 'class', detail: 'RegExp constructor' },
  { label: 'Error', type: 'class', detail: 'Error constructor' },
  { label: 'String', type: 'class', detail: 'String constructor' },
  { label: 'Number', type: 'class', detail: 'Number constructor' },
  { label: 'Boolean', type: 'class', detail: 'Boolean constructor' },
  { label: 'Object', type: 'class', detail: 'Object static methods' },
  { label: 'console', type: 'variable', detail: 'Console object' },
  { label: 'window', type: 'variable', detail: 'Window object' },
  { label: 'document', type: 'variable', detail: 'Document object' },
  { label: 'localStorage', type: 'variable', detail: 'Storage object' },
  { label: 'fetch', type: 'function', detail: 'Fetch API' },
  { label: 'setTimeout', type: 'function', detail: 'Set a timeout' },
  { label: 'setInterval', type: 'function', detail: 'Set an interval' },
  { label: 'clearTimeout', type: 'function', detail: 'Clear a timeout' },
  { label: 'clearInterval', type: 'function', detail: 'Clear an interval' },
  { label: 'Math.max', type: 'function', detail: 'Maximum of values' },
  { label: 'Math.min', type: 'function', detail: 'Minimum of values' },
  { label: 'Math.floor', type: 'function', detail: 'Round down' },
  { label: 'Math.ceil', type: 'function', detail: 'Round up' },
  { label: 'Math.round', type: 'function', detail: 'Round to nearest' },
  { label: 'Math.random', type: 'function', detail: 'Random number' },
  { label: 'Math.abs', type: 'function', detail: 'Absolute value' },
  { label: 'parseInt', type: 'function', detail: 'Parse string to integer' },
  { label: 'parseFloat', type: 'function', detail: 'Parse string to float' },
  { label: 'isNaN', type: 'function', detail: 'Check if NaN' },
  { label: 'isFinite', type: 'function', detail: 'Check if finite' },
  { label: 'encodeURI', type: 'function', detail: 'Encode URI' },
  { label: 'encodeURIComponent', type: 'function', detail: 'Encode URI component' },
  { label: 'decodeURI', type: 'function', detail: 'Decode URI' },
  { label: 'decodeURIComponent', type: 'function', detail: 'Decode URI component' },
]

const allCompletions: Completion[] = [...keywords, ...snippets, ...builtins]

function getScopeCompletions(context: CompletionContext): Completion[] {
  const doc = context.state.doc.toString()
  const seen = new Set<string>()
  const result: Completion[] = []

  const varPattern = /(?:const|let|var|function|class)\s+(\w+)/g
  let match: RegExpExecArray | null
  while ((match = varPattern.exec(doc)) !== null) {
    const name = match[1]
    if (!seen.has(name)) {
      seen.add(name)
      result.push({
        label: name,
        type: 'variable',
        detail: 'local',
      })
    }
  }

  const funcPattern = /(\w+)\s*\([^)]*\)\s*{/g
  while ((match = funcPattern.exec(doc)) !== null) {
    const name = match[1]
    if (!seen.has(name)) {
      seen.add(name)
      result.push({
        label: name,
        type: 'function',
        detail: 'local',
      })
    }
  }

  const exportPattern = /export\s+(?:const|let|var|function|class|interface|type)\s+(\w+)/g
  while ((match = exportPattern.exec(doc)) !== null) {
    const name = match[1]
    if (!seen.has(name)) {
      seen.add(name)
      result.push({
        label: name,
        type: 'variable',
        detail: 'exported',
      })
    }
  }

  const importPattern = /import\s+{?\s*(\w+)/g
  while ((match = importPattern.exec(doc)) !== null) {
    const name = match[1]
    if (!seen.has(name)) {
      seen.add(name)
      result.push({
        label: name,
        type: 'variable',
        detail: 'imported',
      })
    }
  }

  return result
}

export function typescriptCompletionSource(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w+/)
  if (!word && !context.explicit) return null

  const from = word ? word.from : context.pos
  const options: Completion[] = []

  const scopeCompletions = getScopeCompletions(context)
  options.push(...scopeCompletions)

  const seenLabels = new Set(scopeCompletions.map(c => c.label))

  for (const c of allCompletions) {
    if (!seenLabels.has(c.label)) {
      options.push(c)
      seenLabels.add(c.label)
    }
  }

  if (word && !context.explicit) {
    const prefix = word.text.toLowerCase()
    const filtered = options.filter(c => c.label.toLowerCase().startsWith(prefix))
    return { from, options: filtered }
  }

  return {
    from,
    options,
    filter: true,
  }
}
