import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import ErrorCircleIcon from '@/assets/icons/error-circle.svg?react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  trailing?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, trailing, id, className = '', ...props },
  ref
) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${inputId}-error`

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="flex items-center justify-between font-bold text-sm mb-[0.375rem] text-ink-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`
            w-full h-[3.125rem] border-[1.5px] rounded-md bg-white px-[0.875rem]
            font-body text-base text-ink-900 placeholder:text-ink-300
            border-border hover:border-border-strong
            focus:outline-none focus:ring-4
            disabled:bg-bg disabled:text-ink-300 disabled:cursor-not-allowed
            transition-[border-color,box-shadow] duration-default ease-default
            ${error ? 'border-error focus:border-error focus:ring-error-bg' : 'focus:border-coral-500 focus:ring-coral-100'}
            ${trailing ? 'pr-12' : ''}
            ${className}
          `}
          {...props}
        />
        {trailing && (
          <div className="absolute right-[0.375rem] top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          className="flex items-center gap-[0.375rem] mt-[0.375rem] text-xs font-bold text-error"
          role="alert"
        >
          <ErrorCircleIcon className="w-3.5 h-3.5 flex-none" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
})
