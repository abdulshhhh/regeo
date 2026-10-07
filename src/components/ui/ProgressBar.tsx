interface ProgressBarProps {
  value: number
  max?: number
  color?: 'indigo' | 'green' | 'red' | 'yellow'
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

const colors = {
  indigo: 'bg-indigo-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
}

export default function ProgressBar({ value, max = 100, color = 'indigo', size = 'md', showLabel, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">{Math.round(pct)}%</span>}
    </div>
  )
}
