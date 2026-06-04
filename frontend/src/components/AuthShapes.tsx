/**
 * Decorative background shapes for auth pages.
 * These are purely visual and hidden from assistive technologies.
 */
export function AuthShapes() {
  return (
    <>
      {/* Top-left coral blob */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-coral-100 opacity-60 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Bottom-right violet blob */}
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top-right teal accent */}
      <div
        className="absolute top-40 right-10 w-16 h-16 rounded-full bg-teal-500/20 blur-xl pointer-events-none max-sm:scale-[0.7]"
        aria-hidden="true"
      />

      {/* Bottom-left coral accent */}
      <div
        className="absolute bottom-40 left-10 w-12 h-12 rounded-full bg-coral-300/30 blur-xl pointer-events-none max-sm:hidden"
        aria-hidden="true"
      />
    </>
  )
}
