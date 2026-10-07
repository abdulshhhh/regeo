import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export default function Input({
  label, error, helperText, leftIcon, rightIcon,
  className = '', id, ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          {...props}
          className={`
            w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'}
            focus:outline-none focus:ring-2 focus:border-transparent transition-all
            ${leftIcon ? 'pl-10' : 'pl-3'} ${rightIcon ? 'pr-10' : 'pr-3'} py-2 text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  )
}
