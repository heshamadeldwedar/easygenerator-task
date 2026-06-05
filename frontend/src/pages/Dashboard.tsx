import { Header } from '@/components'
import { useAuth } from '@/context/useAuth'

/**
 * Protected welcome/dashboard page.
 * Displays a welcome message after successful authentication.
 */
export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display font-semibold text-display tracking-[-0.02em] text-ink-900 mb-4">
          Welcome to the application
        </h1>
        {user && (
          <p className="text-ink-500 text-lg font-semibold">
            Hello, {user.name}!
          </p>
        )}
      </main>
    </div>
  )
}
