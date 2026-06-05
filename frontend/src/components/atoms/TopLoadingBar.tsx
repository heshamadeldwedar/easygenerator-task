import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react'
import { subscribe, getSnapshot, getLoadingCount } from '@/stores/loadingStore'

/**
 * Anti-flicker thresholds (in ms)
 */
const SHOW_DELAY = 150 // Only show bar if request takes longer than this
const MIN_VISIBLE_TIME = 300 // Keep bar visible for at least this long once shown

/**
 * Global loading bar that appears at the top of the page during API calls.
 *
 * Features:
 * - Driven by axios interceptors via module-level loading store
 * - Request counter (not boolean) handles concurrent requests correctly
 * - Anti-flicker: only shows after 150ms delay, stays visible for min 300ms
 * - Smooth animation: creeps to ~90%, snaps to 100% on completion
 * - Accessible: role="progressbar" with aria-busy
 */
export function TopLoadingBar() {
  // Subscribe to loading store using useSyncExternalStore
  const loadingCount = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  const showTimeoutRef = useRef<number | null>(null)
  const hideTimeoutRef = useRef<number | null>(null)
  const visibleSinceRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  /**
   * Animate progress from current value toward ~90%.
   * Slows down as it approaches 90% for a natural feel.
   */
  const startProgressAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const tick = () => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        // Slow down as we approach 90%
        const increment = (90 - prev) * 0.03
        return Math.min(90, prev + Math.max(0.5, increment))
      })

      // Continue animation while requests are in flight
      if (getLoadingCount() > 0) {
        animationFrameRef.current = requestAnimationFrame(tick)
      }
    }

    animationFrameRef.current = requestAnimationFrame(tick)
  }, [])

  /**
   * Complete the progress bar and schedule hide.
   */
  const completeProgress = useCallback(() => {
    setProgress(100)

    // Calculate remaining minimum visible time
    const visibleFor = Date.now() - (visibleSinceRef.current || 0)
    const remaining = Math.max(0, MIN_VISIBLE_TIME - visibleFor)

    // Hide after completion animation + remaining minimum time
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false)
      setProgress(0)
      visibleSinceRef.current = null
      hideTimeoutRef.current = null
    }, remaining + 200) // +200ms for completion animation
  }, [])

  useEffect(() => {
    const hasRequests = loadingCount > 0

    if (hasRequests) {
      // Clear any pending hide
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }

      // Schedule show after delay (anti-flicker)
      if (!isVisible && !showTimeoutRef.current) {
        showTimeoutRef.current = window.setTimeout(() => {
          setIsVisible(true)
          visibleSinceRef.current = Date.now()
          setProgress(10)
          startProgressAnimation()
          showTimeoutRef.current = null
        }, SHOW_DELAY)
      }
    } else {
      // No requests in flight

      // Clear pending show
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
        showTimeoutRef.current = null
      }

      // Stop animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      if (isVisible) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: completeProgress schedules hide via setTimeout
        completeProgress()
      }
    }

    return () => {
      // Cleanup only the animation frame on effect re-run
      // Don't cleanup timeouts here as they handle the hide sequence
    }
  }, [loadingCount, isVisible, startProgressAnimation, completeProgress])

  // Cleanup all on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      role="progressbar"
      aria-busy={progress < 100}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label="Loading"
      className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none"
    >
      <div
        className="h-full bg-coral-500 transition-[width] duration-200 ease-default"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
