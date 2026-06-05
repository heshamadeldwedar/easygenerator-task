import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'

/**
 * Route guard that redirects to /signin when user is not authenticated.
 * Wrap protected routes with this component using React Router's nested routes.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return <Outlet />
}
