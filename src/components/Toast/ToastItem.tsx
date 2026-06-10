import type { Toast as ToastType } from '../../types'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

interface ToastItemProps {
  toast: ToastType
  onDismiss: (id: string) => void
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colorMap = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-yellow-600',
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = iconMap[toast.type]
  return (
    <div
      role="alert"
          className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm min-w-76 max-w-112.5 ${colorMap[toast.type]}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-0.5 rounded hover:bg-white/20 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
