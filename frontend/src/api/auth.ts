import { client } from './client'
import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from '@/types/auth'

/**
 * Register a new user.
 */
export async function signup(
  credentials: SignupCredentials
): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>('/auth/signup', credentials)
  return response.data
}

/**
 * Authenticate an existing user.
 */
export async function signin(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>('/auth/signin', credentials)
  return response.data
}

/**
 * Get the current authenticated user's info.
 * This is a protected endpoint that requires a valid token.
 */
export async function getMe(): Promise<User> {
  const response = await client.get<User>('/auth/me')
  return response.data
}
