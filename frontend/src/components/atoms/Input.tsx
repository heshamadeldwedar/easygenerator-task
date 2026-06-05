import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import ErrorCircleIcon from '@/assets/icons/error-circle.svg?react'
import CheckCircleIcon from '@/assets/icons/check-circle.svg?react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  /** Show success state when field is valid and not focused */
  valid?: boolean
  trailing?: ReactNode
}

/**
 * Resolves to exactly ONE visual state at a time.
 * Precedence: disabled > active (focused) > error > valid > default
 *
 * Per design reference: active state clears error/valid styling —
 * focusing a field shows only the active ring, not error or success.
 */
type InputState = 'default' | 'active' | 'valid' | 'error' | 'disabled'

function resolveInputState(
  isFocused: boolean,
  isDisabled: boolean,
  hasError: boolean,
  isValid: boolean
): InputState {
  if (isDisabled) return 'disabled'
  if (isFocused) return 'active' // Active clears other states
  if (hasError) return 'error'
  if (isValid) return 'valid'
  return 'default'
}

/** State-specific input styles (only one applies at a time) */
const stateStyles: Record<InputState, string> = {
  default: 'border-border hover:border-border-strong',
  active: 'border-coral-500',
  valid: 'border-[color-mix(in_srgb,var(--color-success)_55%,var(--color-border))]',
  error: 'border-error',
  disabled: 'bg-bg text-ink-300 cursor-not-allowed border-border',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, valid = false, trailing, id, className = '', disabled, onFocus, onBlur, ...props },
  ref
) {
  const [isFocused, setIsFocused] = useState(false)
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${inputId}-error`

  const inputState = resolveInputState(isFocused, !!disabled, !!error, valid)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  return (
    <div className="mb-5">
      <label
        htmlFor={inputId}
        className="flex items-center justify-between font-bold text-sm mb-1.5 text-ink-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full h-14 border-[1.5px] rounded-md bg-white px-4
            font-body text-base text-ink-900 placeholder:text-ink-300
            outline-none
            transition-[border-color,box-shadow] duration-default ease-default
            ${stateStyles[inputState]}
            ${trailing ? 'pr-14' : ''}
            ${className}
          `}
          {...props}
        />
        {trailing && (
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {/* Error message (only when not focused, per single-state rule the error is still there but styling is active) */}
      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-error"
          role="alert"
        >
          <ErrorCircleIcon className="w-4 h-4 flex-none" aria-hidden="true" />
          {error}
        </p>
      )}
      {/* Success indicator (only when valid, not focused, and no error) */}
      {!error && valid && !isFocused && (
        <p className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-success">
          <CheckCircleIcon className="w-4 h-4 flex-none" aria-hidden="true" />
          Looks good
        </p>
      )}
    </div>
  )
})
