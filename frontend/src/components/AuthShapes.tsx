/**
 * Decorative geometric shapes for auth pages.
 * Matches the Coursely design system from coursely-components.css.
 * These are purely visual and hidden from assistive technologies.
 */
export function AuthShapes() {
  return (
    <>
      {/* Large coral gradient blob — top-left, extends off-screen */}
      <div
        className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-coral-100 via-coral-100/80 to-coral-300/40 opacity-80 blur-2xl pointer-events-none z-0 max-sm:scale-[0.7] max-sm:-top-20 max-sm:-left-20"
        aria-hidden="true"
      />

      {/* Top-right teal circle accent */}
      <div
        className="absolute top-24 right-16 w-20 h-20 rounded-full bg-teal-500/25 blur-xl pointer-events-none z-0 max-sm:scale-[0.7] max-sm:top-16 max-sm:right-8"
        aria-hidden="true"
      />

      {/* Small coral circle — mid-right floating */}
      <div
        className="absolute top-1/2 -right-8 w-24 h-24 rounded-full bg-coral-300/30 blur-xl pointer-events-none z-0 max-sm:scale-[0.7]"
        aria-hidden="true"
      />

      {/* Bottom-right violet blob */}
      <div
        className="absolute -bottom-24 -right-24 w-[22rem] h-[22rem] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-tl from-violet-500/15 via-violet-500/10 to-transparent blur-2xl pointer-events-none z-0 max-sm:scale-[0.7] max-sm:-bottom-16 max-sm:-right-16"
        aria-hidden="true"
      />

      {/* Bottom-left coral accent */}
      <div
        className="absolute bottom-32 left-8 w-14 h-14 rounded-full bg-coral-300/35 blur-lg pointer-events-none z-0 max-sm:hidden"
        aria-hidden="true"
      />

      {/* Small teal dot — bottom center-right */}
      <div
        className="absolute bottom-48 right-32 w-8 h-8 rounded-full bg-teal-500/20 blur-md pointer-events-none z-0 max-sm:scale-[0.7] max-sm:bottom-32 max-sm:right-20"
        aria-hidden="true"
      />
    </>
  )
}
