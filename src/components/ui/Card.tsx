import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

export default function Card({ children, className = '', onClick, hover, padding = 'md' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${paddings[padding]} ${hover ? 'hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
