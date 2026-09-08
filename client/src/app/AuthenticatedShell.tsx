import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { AppShell } from './AppShell'

export function AuthenticatedShell() {
  const { user, logout } = useAuth()

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
