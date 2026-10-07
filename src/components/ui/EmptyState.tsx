import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-slate-300 dark:text-slate-600 mb-4">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
      {description && <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
