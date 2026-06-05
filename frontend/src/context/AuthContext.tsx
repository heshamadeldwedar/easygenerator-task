import {
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type { User, AuthState } from '@/types/auth'
import { AuthContext } from './authContext'

/**
 * Auth storage key for localStorage.
 *
 * NOTE: localStorage is pragmatic for this task but XSS-exposed.
 * In production, httpOnly cookies set by the backend are the more secure
 * alternative since JavaScript cannot access them.
 */
const AUTH_STORAGE_KEY = 'auth'

interface StoredAuth {
  user: User | null
  accessToken: string | null
}

function getStoredAuth(): StoredAuth {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as StoredAuth
      return {
        user: parsed.user || null,
        accessToken: parsed.accessToken || null,
      }
    }
  } catch {
    // Invalid JSON, clear it
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
  return { user: null, accessToken: null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const { user, accessToken } = getStoredAuth()
    return {
      user,
      accessToken,
      isAuthenticated: !!accessToken,
    }
  })

  const login = useCallback((user: User, accessToken: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, accessToken }))
    setState({ user, accessToken, isAuthenticated: true })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setState({ user: null, accessToken: null, isAuthenticated: false })
  }, [])

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({ ...state, login, logout }),
    [state, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
