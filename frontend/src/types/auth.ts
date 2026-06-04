export interface User {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  name: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}
