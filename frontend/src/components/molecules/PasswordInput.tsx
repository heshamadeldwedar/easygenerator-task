import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Input } from '../atoms/Input'
import EyeIcon from '@/assets/icons/eye.svg?react'
import EyeOffIcon from '@/assets/icons/eye-off.svg?react'

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  /** Show success state when field is valid and not focused */
  valid?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              h-10 px-3 border-0 bg-transparent cursor-pointer
              text-ink-500 font-bold text-sm rounded-lg
              inline-flex items-center gap-1.5
              hover:text-ink-900 hover:bg-bg
              transition-colors duration-default ease-default
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500
            "
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeIcon className="w-4 h-4" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="w-4 h-4" aria-hidden="true" />
            )}
            {showPassword ? 'Hide' : 'Show'}
          </button>
        }
        {...props}
      />
    )
  }
)
