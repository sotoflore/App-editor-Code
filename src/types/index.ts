export interface FileItem {
  id: string;
  name: string;
  content: string;
  savedContent: string;
  language: string;
  createdAt: number;
  updatedAt: number;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  minimap: boolean;
  bracketPairColorization: boolean;
  formatOnSave: boolean;
}

export type Theme = 'dark' | 'light';

export type ActivityBarView = 'files' | 'search' | 'settings';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export type SaveStatus = 'saved' | 'unsaved' | 'saving';

export type LogLevel = 'log' | 'info' | 'warn' | 'error';

export interface ConsoleEntry {
  id: string;
  method: LogLevel;
  args: unknown[];
  timestamp: number;
}
