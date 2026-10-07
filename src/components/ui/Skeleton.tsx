interface SkeletonProps {
  className?: string
  lines?: number
}

export default function Skeleton({ className = '', lines }: SkeletonProps) {
  if (lines) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
        ))}
      </div>
    )
  }
  return (
    <div className={`bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${className}`} />
  )
}
