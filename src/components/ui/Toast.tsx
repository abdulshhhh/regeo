import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const colors = {
  success: 'border-l-green-500 bg-white dark:bg-slate-800',
  error: 'border-l-red-500 bg-white dark:bg-slate-800',
  warning: 'border-l-yellow-500 bg-white dark:bg-slate-800',
  info: 'border-l-blue-500 bg-white dark:bg-slate-800',
}

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}

function ToastItem({ id, type, title, message }: { id: string; type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) {
  const { removeToast } = useUIStore()
  const Icon = icons[type]

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border-l-4 min-w-72 max-w-80 ${colors[type]} border border-slate-200 dark:border-slate-700`}>
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{title}</p>
        {message && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{message}</p>}
      </div>
      <button onClick={() => removeToast(id)} className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <X size={14} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts } = useUIStore()
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => <ToastItem key={t.id} {...t} />)}
    </div>
  )
}
