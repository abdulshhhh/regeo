import React from 'react'
import Card from './Card'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  iconColor?: string
  trend?: { value: number; label: string }
  className?: string
}

export default function StatCard({ title, value, subtitle, icon, iconColor = 'text-indigo-500', trend, className = '' }: StatCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <span>{trend.value >= 0 ? '+' : ''}{trend.value}%</span>
              <span className="text-slate-400">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 ${iconColor}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
