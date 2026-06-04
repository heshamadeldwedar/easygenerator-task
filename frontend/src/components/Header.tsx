import { useNavigate } from 'react-router-dom'
import { Wordmark } from './Wordmark'
import { Button } from './Button'
import { useAuth } from '@/context/AuthContext'

export function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <header className="flex items-center justify-between px-9 py-5 bg-surface border-b border-border max-md:px-[1.125rem] max-md:py-[0.875rem] max-md:gap-3">
      <Wordmark />
      <nav className="max-md:hidden" aria-label="Main navigation">
        {/* Future navigation items can go here */}
      </nav>
      <Button variant="secondary" size="sm" onClick={handleLogout}>
        Log out
      </Button>
    </header>
  )
}
