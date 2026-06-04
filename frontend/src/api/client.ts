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

// Response interceptor: decrement loading + handle 401
client.interceptors.response.use(
  (response) => {
    decrementLoading()
    return response
  },
  (error) => {
    decrementLoading()

    // On 401 Unauthorized, clear auth and redirect to signin
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      // Use window.location for hard redirect to clear React state
      window.location.href = '/signin'
    }

    return Promise.reject(error)
  }
)
