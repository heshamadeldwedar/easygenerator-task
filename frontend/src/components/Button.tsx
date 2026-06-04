import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'default' | 'sm'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'default', className = '', children, ...props },
    ref
  ) {
    const baseClasses = `
      w-full border-0 cursor-pointer font-display font-semibold
      inline-flex items-center justify-center gap-2 whitespace-nowrap
      transition-[transform,box-shadow,background] duration-default ease-default
      disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
      focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-500 focus-visible:ring-offset-2
    `

    const sizeClasses =
      size === 'sm'
        ? 'w-auto h-[2.625rem] px-[1.125rem] text-base rounded-[0.75rem]'
        : 'h-[3.25rem] text-lg rounded-md'

    const variantClasses =
      variant === 'primary'
        ? 'text-white bg-coral-500 shadow-pop hover:bg-coral-600 hover:-translate-y-px active:bg-coral-700 active:translate-y-0'
        : 'bg-white text-ink-900 border-[1.5px] border-border-strong shadow-none hover:bg-bg hover:border-ink-300'

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)
