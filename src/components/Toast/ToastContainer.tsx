import { useStore } from '../../store/useStore'
import { ToastItem } from './ToastItem'

export function ToastContainer() {
  const toasts = useStore(s => s.toasts)
  const removeToast = useStore(s => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
      ))}
    </div>
  )
}
