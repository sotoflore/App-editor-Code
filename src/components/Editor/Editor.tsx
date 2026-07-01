import { useEffect, useRef, useCallback } from 'react'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { EditorState, type Extension } from '@codemirror/state'
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, indentUnit } from '@codemirror/language'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { lintKeymap } from '@codemirror/lint'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { useStore } from '../../store/useStore'
import { typescriptCompletionSource } from '../../services/autocomplete'

export function CodeEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  const files = useStore(s => s.files)
  const activeFileId = useStore(s => s.activeFileId)
  const updateFileContent = useStore(s => s.updateFileContent)
  const setCursorPosition = useStore(s => s.setCursorPosition)
  const theme = useStore(s => s.theme)
  const settings = useStore(s => s.editorSettings)

  const activeFile = files.find(f => f.id === activeFileId)

  const handleUpdate = useCallback(
    (update: { docChanged: boolean; state: EditorState }) => {
      if (update.docChanged && activeFileId) {
        const content = update.state.doc.toString()
        updateFileContent(activeFileId, content)
      }
      const pos = update.state.selection.main.head
      const line = update.state.doc.lineAt(pos)
      setCursorPosition({ line: line.number, column: pos - line.from + 1 })
    },
    [activeFileId, updateFileContent, setCursorPosition]
  )

  useEffect(() => {
    if (!editorRef.current) return

    if (viewRef.current) {
      viewRef.current.destroy()
      viewRef.current = null
    }

    const extensions: Extension[] = [
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        ...closeBracketsKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      history(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion({
        override: [typescriptCompletionSource],
        activateOnTyping: true,
        maxRenderedOptions: 200,
        defaultKeymap: true,
      }),
      highlightSelectionMatches(),
      foldGutter(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.lineWrapping,
      EditorView.updateListener.of(handleUpdate),
      placeholder('Start typing your TypeScript code...'),
      indentUnit.of('  '.repeat(settings.tabSize)),
    ]

    const language = activeFile?.language || 'typescript'
    if (language === 'json') {
      extensions.push(json())
    } else {
      extensions.push(javascript({ typescript: true, jsx: true }))
    }

    if (theme === 'dark') {
      extensions.push(oneDark)
    }

    extensions.push(EditorView.theme({
      '&': { fontSize: `${settings.fontSize}px` },
    }))

    const state = EditorState.create({
      doc: activeFile?.content || '',
      extensions,
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [activeFileId, theme, settings.tabSize, settings.fontSize])

  useEffect(() => {
    const view = viewRef.current
    if (!view || !activeFile) return

    const currentContent = view.state.doc.toString()
    if (currentContent !== activeFile.content) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: activeFile.content,
        },
      })
    }
  }, [activeFile?.content])

  return (
    <div
      ref={editorRef}
      className={`flex-1 overflow-hidden ${theme === 'dark' ? 'bg-editor-bg' : 'bg-white'}`}
      aria-label="Code editor"
      role="textbox"
      aria-multiline="true"
    />
  )
}
