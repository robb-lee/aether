import * as React from 'react'
import { cn } from '../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, type = 'text', ...props }, ref) => {
    const inputId = React.useId()
    
    const baseStyles = 'w-full px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-100 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    const borderStyles = error
      ? 'border-red-500 focus:ring-red-500 dark:border-red-400'
      : 'border-gray-300 dark:border-dark-300 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400'
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              baseStyles,
              borderStyles,
              icon && 'pl-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
        </div>
        
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }