import { useEffect, useId, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { primaryNavItems } from '../../app/navItems'
import { Button } from '../ui/Button'

type AppNavProps = {
  brand?: string
  trailing?: ReactNode
}

export function AppNav({ brand = 'Anti-Fat-Flemo', trailing }: AppNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const menuId = useId()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-[var(--color-lime)] text-[var(--color-ink)]'
        : 'text-[color-mix(in_srgb,var(--color-canvas)_92%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-canvas)_14%,transparent)]',
    ].join(' ')

  return (
    <header className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--color-moss)_55%,black)] bg-[var(--color-moss)] text-[var(--color-canvas)]">
      <div
        className="mx-auto flex h-[var(--nav-height)] max-w-6xl items-center gap-3 px-4 sm:px-6"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <p className="shrink-0 text-base font-semibold tracking-tight">{brand}</p>

        <nav aria-label="Primary" className="ml-2 hidden flex-1 items-center gap-1 md:flex">
          {primaryNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={'end' in item ? item.end : false} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {trailing}
          <Button
            variant="ghost"
            className="md:hidden text-[var(--color-canvas)] hover:bg-[color-mix(in_srgb,var(--color-canvas)_14%,transparent)]"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            onClick={() => setMobileOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Primary navigation"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="overflow-hidden border-t border-[color-mix(in_srgb,var(--color-canvas)_18%,transparent)] md:hidden"
          >
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Mobile primary">
              {primaryNavItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { delay: index * 0.04, duration: 0.18 }}
                >
                  <NavLink
                    to={item.to}
                    end={'end' in item ? item.end : false}
                    className={linkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
