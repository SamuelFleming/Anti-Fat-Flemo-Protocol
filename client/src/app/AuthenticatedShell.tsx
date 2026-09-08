import { Navigate, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { AppShell } from './AppShell'

export function AuthenticatedShell() {
  const { user, logout } = useAuth()
  const { isLoading, isSetupComplete } = useProfile()
  const location = useLocation()

  if (!isLoading && !isSetupComplete && location.pathname !== '/settings') {
    return <Navigate to="/settings" replace />
  }

  return (
    <AppShell
      trailing={
        <div className="flex items-center gap-3">
          <span className="hidden max-w-[10rem] truncate text-xs text-[color-mix(in_srgb,var(--color-canvas)_80%,transparent)] sm:inline">
            {user?.name}
          </span>
          <Button
            variant="ghost"
            className="text-[var(--color-canvas)] hover:bg-[color-mix(in_srgb,var(--color-canvas)_14%,transparent)]"
            onClick={() => void logout()}
          >
            Log out
          </Button>
        </div>
      }
    />
  )
}
