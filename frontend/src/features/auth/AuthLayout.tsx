import type { ReactNode } from 'react'
import { Wordmark, Card, AuthShapes } from '@/components'

interface AuthLayoutProps {
  children: ReactNode
}

/**
 * Shared layout for authentication pages (Sign Up, Sign In).
 * Includes decorative background shapes, centered card, and logo.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg flex items-center justify-center px-6 py-12 pt-22 max-sm:px-4 max-sm:py-8 max-sm:pt-[4.875rem]">
      <AuthShapes />

      {/* Header logo */}
      <div className="absolute top-7 left-9 z-10 max-sm:top-5 max-sm:left-5">
        <Wordmark />
      </div>

      {/* Auth card — roomier sizing */}
      <Card className="relative z-10 w-full max-w-120 p-12 max-sm:p-6 max-sm:rounded-lg">
        {children}
      </Card>
    </div>
  )
}
