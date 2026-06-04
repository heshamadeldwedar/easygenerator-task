import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Input } from './Input'

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    // Eye open icon (visible)
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 3C4.36364 3 1.25818 5.28067 0 8.5C1.25818 11.7193 4.36364 14 8 14C11.6364 14 14.7418 11.7193 16 8.5C14.7418 5.28067 11.6364 3 8 3ZM8 12.1667C5.97091 12.1667 4.32727 10.5233 4.32727 8.5C4.32727 6.47667 5.97091 4.83333 8 4.83333C10.0291 4.83333 11.6727 6.47667 11.6727 8.5C11.6727 10.5233 10.0291 12.1667 8 12.1667ZM8 6.3C6.78182 6.3 5.79636 7.28333 5.79636 8.5C5.79636 9.71667 6.78182 10.7 8 10.7C9.21818 10.7 10.2036 9.71667 10.2036 8.5C10.2036 7.28333 9.21818 6.3 8 6.3Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  // Eye closed icon (hidden)
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 3C4.36364 3 1.25818 5.28067 0 8.5C1.25818 11.7193 4.36364 14 8 14C11.6364 14 14.7418 11.7193 16 8.5C14.7418 5.28067 11.6364 3 8 3ZM8 12.1667C5.97091 12.1667 4.32727 10.5233 4.32727 8.5C4.32727 6.47667 5.97091 4.83333 8 4.83333C10.0291 4.83333 11.6727 6.47667 11.6727 8.5C11.6727 10.5233 10.0291 12.1667 8 12.1667Z"
        fill="currentColor"
      />
      <line
        x1="2"
        y1="14"
        x2="14"
        y2="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
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
              h-[2.375rem] px-[0.625rem] border-0 bg-transparent cursor-pointer
              text-ink-500 font-bold text-xs rounded-[0.5625rem]
              inline-flex items-center gap-[0.3125rem]
              hover:text-ink-900 hover:bg-bg
              transition-colors duration-default ease-default
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500
            "
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            <EyeIcon open={showPassword} />
            {showPassword ? 'Hide' : 'Show'}
          </button>
        }
        {...props}
      />
    )
  }
)
