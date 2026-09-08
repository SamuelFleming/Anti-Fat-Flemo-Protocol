import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { AppNav } from '../components/navigation/AppNav'

type AppShellProps = {
  trailing?: ReactNode
}

export function AppShell({ trailing }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <AppNav trailing={trailing} />
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  )
}
