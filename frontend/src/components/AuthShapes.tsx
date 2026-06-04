/**
 * Decorative geometric shapes for auth pages.
 * Matches the Coursely design system from coursely-components.css.
 * Crisp geometric shapes — no blur, solid colors/borders.
 */
export function AuthShapes() {
  return (
    <>
      {/* Coral semi-circle — top-left */}
      <div
        className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-coral-500 opacity-90 pointer-events-none z-0 max-sm:scale-[0.7]"
        style={{ clipPath: 'inset(0 50% 50% 0)' }}
        aria-hidden="true"
      />

      {/* Coral ring outline — top area left of center */}
      <div
        className="absolute top-16 left-1/4 w-12 h-12 border-[2.5px] border-coral-300 rounded-full pointer-events-none z-0 max-sm:scale-[0.7] max-sm:top-10 max-sm:left-16"
        aria-hidden="true"
      />

      {/* Rotated rounded-square outline — top-right area */}
      <div
        className="absolute top-32 right-24 w-16 h-16 border-[3px] border-coral-300 rounded-xl pointer-events-none z-0 max-sm:scale-[0.7] max-sm:top-20 max-sm:right-12"
        style={{ transform: 'rotate(15deg)' }}
        aria-hidden="true"
      />

      {/* Small dot cluster — top-right */}
      <div
        className="absolute top-20 right-48 flex flex-col gap-1.5 pointer-events-none z-0 max-sm:scale-[0.7] max-sm:top-14 max-sm:right-32"
        aria-hidden="true"
      >
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 opacity-60" />
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 opacity-80" />
        </div>
        <div className="flex gap-1.5 ml-1">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 opacity-70" />
        </div>
      </div>

      {/* Teal ring — right side */}
      <div
        className="absolute top-1/3 -right-6 w-20 h-20 border-[3px] border-teal-500 rounded-full pointer-events-none z-0 max-sm:scale-[0.7]"
        aria-hidden="true"
      />

      {/* Small violet circle — right side below center */}
      <div
        className="absolute top-[55%] right-12 w-5 h-5 rounded-full bg-violet-500 opacity-60 pointer-events-none z-0 max-sm:scale-[0.7] max-sm:right-6"
        aria-hidden="true"
      />

      {/* Violet triangle — bottom-right */}
      <svg
        className="absolute bottom-24 right-16 w-14 h-14 pointer-events-none z-0 max-sm:scale-[0.7] max-sm:bottom-16 max-sm:right-8"
        viewBox="0 0 56 56"
        fill="none"
        aria-hidden="true"
      >
        <polygon
          points="28,4 52,48 4,48"
          fill="var(--color-violet-500)"
          opacity="0.85"
        />
      </svg>

      {/* Dot cluster — bottom-left area */}
      <div
        className="absolute bottom-40 left-12 flex gap-2 pointer-events-none z-0 max-sm:scale-[0.7] max-sm:bottom-28 max-sm:left-6"
        aria-hidden="true"
      >
        <div className="w-2 h-2 rounded-full bg-coral-300" />
        <div className="w-2 h-2 rounded-full bg-coral-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-coral-500 -mt-1" />
        <div className="w-2 h-2 rounded-full bg-coral-300" />
      </div>

      {/* Small teal circle — mid-left */}
      <div
        className="absolute top-1/2 left-8 w-6 h-6 rounded-full bg-teal-500 opacity-70 pointer-events-none z-0 max-sm:hidden"
        aria-hidden="true"
      />

      {/* Small rotated square — bottom-left */}
      <div
        className="absolute bottom-28 left-24 w-8 h-8 border-[2px] border-coral-500 opacity-50 rounded-md pointer-events-none z-0 max-sm:scale-[0.7] max-sm:bottom-20 max-sm:left-16"
        style={{ transform: 'rotate(-12deg)' }}
        aria-hidden="true"
      />

      {/* Coral quarter-circle — bottom-right corner */}
      <div
        className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-coral-100 pointer-events-none z-0 max-sm:scale-[0.7]"
        style={{ clipPath: 'inset(50% 50% 0 0)' }}
        aria-hidden="true"
      />

      {/* Teal semi-circle — bottom-left corner */}
      <div
        className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-teal-500 opacity-20 pointer-events-none z-0 max-sm:scale-[0.7]"
        style={{ clipPath: 'inset(50% 0 0 50%)' }}
        aria-hidden="true"
      />
    </>
  )
}
