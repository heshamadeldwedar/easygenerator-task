import axios, { type InternalAxiosRequestConfig } from 'axios'
import { incrementLoading, decrementLoading } from '@/stores/loadingStore'

const AUTH_STORAGE_KEY = 'auth'

/**
 * Axios instance configured with:
 * - Base URL from environment
 * - Request interceptor: attach Bearer token + increment loading counter
 * - Response interceptor: decrement counter, handle 401 logout
 */
const baseOrigin = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const client = axios.create({
  baseURL: `${baseOrigin}/api/v1`, // API prefix defined once here
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for httpOnly cookies (refresh_token) on cross-origin requests
})

// Request interceptor: add auth token + track loading
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    incrementLoading()

    // Attach Bearer token if available
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const { accessToken } = JSON.parse(stored)
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
      } catch {
        // Invalid JSON in storage, ignore
      }
    }

    return config
  },
  (error) => {
    decrementLoading()
    return Promise.reject(error)
  }
)

// Response interceptor: decrement loading + handle 401 with token refresh
client.interceptors.response.use(
  (response) => {
    decrementLoading()
    return response
  },
  async (error) => {
    decrementLoading()

    const originalRequest = error.config

    // Check if this is an auth endpoint - skip refresh logic entirely
    const isAuthEndpoint = originalRequest.url?.startsWith('/auth')

    // On 401, try to refresh the token once before logging out (skip for auth endpoints)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true

      try {
        // Call refresh endpoint (reads httpOnly cookie automatically)
        const response = await client.post<{ success: boolean; data: { accessToken: string } }>('/auth/refresh')
        const { accessToken } = response.data.data

        // Update stored token
        const stored = localStorage.getItem(AUTH_STORAGE_KEY)
        if (stored) {
          const auth = JSON.parse(stored)
          auth.accessToken = accessToken
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return client(originalRequest)
      } catch {
        // Refresh failed, clear auth and redirect to signin
        localStorage.removeItem(AUTH_STORAGE_KEY)
        window.location.href = '/signin'
      }
    }

    return Promise.reject(error)
  }
)
