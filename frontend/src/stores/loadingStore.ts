/**
 * Module-level loading state store.
 *
 * This store bridges axios (non-React) to React components.
 * It uses a request counter (not boolean) to handle concurrent requests correctly.
 *
 * Why module-level?
 * - Axios interceptors run outside React's lifecycle
 * - Need to increment/decrement counter synchronously
 * - React components subscribe via useSyncExternalStore pattern
 */

type Listener = () => void

let requestCount = 0
const listeners = new Set<Listener>()

/**
 * Get the current number of in-flight requests.
 */
export function getLoadingCount(): number {
  return requestCount
}

/**
 * Check if any requests are in flight.
 */
export function isLoading(): boolean {
  return requestCount > 0
}

/**
 * Increment the request counter (called by request interceptor).
 */
export function incrementLoading(): void {
  requestCount++
  notifyListeners()
}

/**
 * Decrement the request counter (called by response/error interceptor).
 */
export function decrementLoading(): void {
  requestCount = Math.max(0, requestCount - 1)
  notifyListeners()
}

/**
 * Subscribe to loading state changes.
 * Returns an unsubscribe function.
 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Get a snapshot of the current state for useSyncExternalStore.
 */
export function getSnapshot(): number {
  return requestCount
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener())
}
