import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  trailing?: ReactNode
}

function ErrorIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM6.25 3.5V7.75H7.75V3.5H6.25ZM7 10.5C7.55228 10.5 8 10.0523 8 9.5C8 8.94772 7.55228 8.5 7 8.5C6.44772 8.5 6 8.94772 6 9.5C6 10.0523 6.44772 10.5 7 10.5Z"
        fill="currentColor"
      />
    </svg>
  )
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
            focus:outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-100
            disabled:bg-bg disabled:text-ink-300 disabled:cursor-not-allowed
            transition-[border-color,box-shadow] duration-default ease-default
            ${error ? 'border-error focus:ring-error-bg' : ''}
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
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  )
})
