import { createBrowserRouter, Navigate } from 'react-router-dom'
import { SignUp, SignIn } from '@/features/auth'
import { Dashboard } from '@/pages/Dashboard'
import { ProtectedRoute } from './ProtectedRoute'

/**
 * Application router configuration.
 *
 * Routes:
 * - /          -> Redirects to /signin (or /dashboard if authenticated - handled by ProtectedRoute)
 * - /signup    -> Sign Up page
 * - /signin    -> Sign In page
 * - /dashboard -> Protected Welcome page
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/signin" replace />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    // Catch-all: redirect unknown routes to signin
    path: '*',
    element: <Navigate to="/signin" replace />,
  },
])
