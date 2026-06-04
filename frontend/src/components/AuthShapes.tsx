/**
 * Decorative geometric shapes for auth pages.
 * Matches the Coursely design system from coursely-components.css.
 * ~12 crisp geometric shapes with continuous gentle animations.
 *
 * Accessibility: All animations respect prefers-reduced-motion via CSS.
 */
export function AuthShapes() {
  return (
    <>
      {/* 1. Coral semi-circle — top-left corner */}
      <div
        className="cl-shape absolute -top-16 -left-16 w-40 h-40 rounded-full bg-coral-500 opacity-90 pointer-events-none z-0 max-sm:scale-[0.7] animate-float-slow"
        style={{ clipPath: 'inset(0 50% 50% 0)', animationDelay: '0s' }}
        aria-hidden="true"
      />

      {/* 2. Coral ring outline — top-left near card */}
      <div
        className="cl-shape absolute top-[22%] left-[16%] w-12 h-12 border-[3px] border-coral-300 rounded-full pointer-events-none z-0 max-sm:scale-[0.7] max-sm:left-6 animate-drift"
        style={{ animationDelay: '0.5s' }}
        aria-hidden="true"
      />

      {/* 3. Rotated rounded-square outline — top-right near card */}
      <div
        className="cl-shape absolute top-[20%] right-[16%] w-16 h-16 border-[3px] border-coral-300 rounded-xl pointer-events-none z-0 max-sm:scale-[0.7] max-sm:right-6 animate-rotate-slow"
        style={{ animationDelay: '0.3s' }}
        aria-hidden="true"
      />

      {/* 4. Teal dot cluster — top-right near card */}
      <div
        className="cl-shape absolute top-[18%] right-[28%] flex flex-col gap-1.5 pointer-events-none z-0 max-sm:scale-[0.7] max-sm:right-16 animate-float-gentle"
        style={{ animationDelay: '0.7s' }}
        aria-hidden="true"
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 opacity-60" />
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 opacity-80" />
        </div>
        <div className="flex gap-1.5 ml-1">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 opacity-70" />
        </div>
      </div>

      {/* 5. Teal ring — right side near card */}
      <div
        className="cl-shape absolute top-[45%] right-[14%] w-14 h-14 border-[3px] border-teal-500 opacity-70 rounded-full pointer-events-none z-0 max-sm:scale-[0.7] max-sm:right-4 animate-drift"
        style={{ animationDelay: '1s' }}
        aria-hidden="true"
      />

      {/* 6. Violet circle — right side below center */}
      <div
        className="cl-shape absolute top-[58%] right-[18%] w-6 h-6 rounded-full bg-violet-500 opacity-70 pointer-events-none z-0 max-sm:scale-[0.7] max-sm:right-8 animate-float-slow"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />

      {/* 7. Violet triangle — bottom-right area */}
      <svg
        className="cl-shape absolute bottom-[20%] right-[16%] w-16 h-16 pointer-events-none z-0 max-sm:scale-[0.7] max-sm:right-6 animate-rotate-slow"
        style={{ animationDelay: '1.5s' }}
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

      {/* 8. Coral dot cluster — bottom-left near card */}
      <div
        className="cl-shape absolute bottom-[28%] left-[16%] flex gap-2 pointer-events-none z-0 max-sm:scale-[0.7] max-sm:left-6 animate-drift"
        style={{ animationDelay: '1.2s' }}
        aria-hidden="true"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-coral-300" />
        <div className="w-2.5 h-2.5 rounded-full bg-coral-300" />
        <div className="w-3 h-3 rounded-full bg-coral-500 -mt-0.5" />
      </div>

      {/* 9. Teal circle — mid-left near card */}
      <div
        className="cl-shape absolute top-[48%] left-[14%] w-6 h-6 rounded-full bg-teal-500 opacity-70 pointer-events-none z-0 max-sm:scale-[0.7] max-sm:left-4 animate-pulse-gentle"
        style={{ animationDelay: '1.8s' }}
        aria-hidden="true"
      />

      {/* 10. Small rotated square outline — bottom-left near card */}
      <div
        className="cl-shape absolute bottom-[22%] left-[24%] w-10 h-10 border-[2.5px] border-coral-500 opacity-60 rounded-md pointer-events-none z-0 max-sm:scale-[0.7] max-sm:left-12 animate-rotate-slow"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />

      {/* 11. Coral quarter-circle — bottom-right corner */}
      <div
        className="cl-shape absolute -bottom-14 -right-14 w-36 h-36 rounded-full bg-coral-100 pointer-events-none z-0 max-sm:scale-[0.7] animate-float-gentle"
        style={{ clipPath: 'inset(50% 50% 0 0)', animationDelay: '0.9s' }}
        aria-hidden="true"
      />

      {/* 12. Teal semi-circle — bottom-left corner */}
      <div
        className="cl-shape absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-teal-500 opacity-25 pointer-events-none z-0 max-sm:scale-[0.7] animate-drift"
        style={{ clipPath: 'inset(50% 0 0 50%)', animationDelay: '1.4s' }}
        aria-hidden="true"
      />
    </>
  )
}
