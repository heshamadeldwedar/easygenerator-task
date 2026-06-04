import { Wordmark } from './Wordmark'
import { AvatarDropdown } from './AvatarDropdown'

/**
 * Dashboard header with logo and user avatar dropdown.
 * Logout is only accessible via the avatar dropdown menu.
 */
export function Header() {
  return (
    <header className="flex items-center justify-between px-9 py-4 bg-surface border-b border-border max-md:px-5 max-md:py-3">
      <Wordmark />
      <nav className="max-md:hidden" aria-label="Main navigation">
        {/* Future navigation items can go here */}
      </nav>
      <AvatarDropdown />
    </header>
  )
}
