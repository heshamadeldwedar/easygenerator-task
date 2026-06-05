import { Link } from 'react-router-dom'

export interface WordmarkProps {
  onDark?: boolean
}

export function Wordmark({ onDark = false }: WordmarkProps) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-[0.625rem] no-underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-500 focus-visible:ring-offset-2 rounded-sm"
      aria-label="Coursely - Go to home"
    >
      {/* Mark */}
      <div
        className={`
          w-9 h-9 rounded-[0.75rem] flex-none grid place-items-center relative
          ${
            onDark
              ? 'bg-white shadow-none'
              : 'bg-coral-500 shadow-[0_6px_16px_-5px_rgba(249,145,72,0.75)]'
          }
        `}
      >
        {/* Ring */}
        <div
          className={`
            w-4 h-4 rounded-full border-[3px]
            ${onDark ? 'border-coral-500' : 'border-white'}
          `}
        />
        {/* Dot */}
        <div className="absolute right-[0.4375rem] bottom-[0.4375rem] w-[0.375rem] h-[0.375rem] rounded-full bg-teal-500" />
      </div>

      {/* Text */}
      <span
        className={`
          font-display font-semibold text-[1.4375rem] tracking-[-0.01em]
          ${onDark ? 'text-white' : 'text-ink-900'}
        `}
      >
        Coursely
      </span>
    </Link>
  )
}
