import { createContext } from 'react'
import type { AuthState } from '@/types/auth'
import type { User } from '@/types/auth'

export interface AuthContextValue extends AuthState {
  login: (user: User, accessToken: string) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
