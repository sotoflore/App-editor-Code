export interface FileItem {
  id: string;
  name: string;
  content: string;
  savedContent: string;
  language: string;
  createdAt: number;
  updatedAt: number;
}

export type Theme = 'dark' | 'light';

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

export type LogLevel = 'log' | 'info' | 'warn' | 'error';

export interface ConsoleEntry {
  id: string;
  method: LogLevel;
  args: unknown[];
  timestamp: number;
}
