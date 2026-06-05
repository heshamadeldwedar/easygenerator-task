import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import UserAvatar from '@/assets/icons/user-avatar.svg?react'

/**
 * Avatar button with dropdown menu for user actions.
 * Logout is only accessible via this dropdown.
 *
 * Accessibility:
 * - Button has aria-haspopup and aria-expanded
 * - Menu closes on Escape and outside click
 * - Keyboard navigable with Tab/Enter
 * - Visible focus states
 */
export function AvatarDropdown() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = useCallback(async () => {
    setIsOpen(false)
    await logout()
    navigate('/signin')
  }, [logout, navigate])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Account menu"
        className="
          w-11 h-11 rounded-full bg-coral-100 text-coral-600
          flex items-center justify-center
          cursor-pointer border-2 border-coral-200
          transition-all duration-default ease-default
          hover:border-coral-400 hover:bg-coral-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2
        "
      >
        <UserAvatar className="w-7 h-7" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="
            absolute right-0 top-full mt-2 w-64
            bg-surface border border-border rounded-xl shadow-lg
            overflow-hidden z-50
          "
        >
          {/* User info header */}
          {user && (
            <div className="px-5 py-4 bg-bg border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-coral-100 text-coral-600 flex items-center justify-center border border-coral-200">
                  <UserAvatar className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-900 text-base truncate">{user.name}</p>
                  <p className="text-ink-500 text-sm truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu items */}
          <div className="py-2">
            <button
              role="menuitem"
              onClick={handleLogout}
              className="
                w-full px-5 py-3 text-left
                flex items-center gap-3
                text-base font-semibold text-ink-700
                hover:bg-coral-50 hover:text-coral-700
                focus-visible:outline-none focus-visible:bg-coral-50 focus-visible:text-coral-700
                transition-colors duration-default ease-default
                cursor-pointer border-0 bg-transparent
              "
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
