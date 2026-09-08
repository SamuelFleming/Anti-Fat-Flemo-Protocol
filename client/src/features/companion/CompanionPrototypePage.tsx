import { useEffect, useMemo, useState } from 'react'
import {
  GoalStateCompanion,
  setCompanionRendererForceFallback,
} from '../../components/companion/GoalStateCompanion'
import type { CompanionDayContext } from './companionState'

type FixtureId = 'no-data' | 'balanced' | 'mildly-full' | 'high-exertion'

const FIXTURES: Record<FixtureId, { label: string; context: CompanionDayContext }> = {
  'no-data': {
    label: 'No data (mannequin)',
    context: {
      date: '2026-09-09',
      isToday: true,
      isFuture: false,
      caloriesConsumed: 0,
      targetCalories: 1800,
      moveKj: null,
      targetMoveKj: 1800,
      hasMeals: false,
      progressPercent: null,
      goalStartDate: null,
      goalTargetDate: null,
      hasActiveGoal: false,
      clockHourLocal: 15,
    },
  },
  balanced: {
    label: 'On-track (balanced)',
    context: {
      date: '2026-09-09',
      isToday: true,
      isFuture: false,
      caloriesConsumed: 1500,
      targetCalories: 1800,
      moveKj: 1700,
      targetMoveKj: 1800,
      hasMeals: true,
      progressPercent: 40,
      goalStartDate: '2026-07-01',
      goalTargetDate: '2026-12-31',
      hasActiveGoal: true,
      clockHourLocal: 15,
    },
  },
  'mildly-full': {
    label: 'Over-target (mildly-full)',
    context: {
      date: '2026-09-09',
      isToday: true,
      isFuture: false,
      caloriesConsumed: 1950,
      targetCalories: 1800,
      moveKj: 1700,
      targetMoveKj: 1800,
      hasMeals: true,
      progressPercent: 40,
      goalStartDate: '2026-07-01',
      goalTargetDate: '2026-12-31',
      hasActiveGoal: true,
      clockHourLocal: 21,
    },
  },
  'high-exertion': {
    label: 'Very-high Move (high-exertion)',
    context: {
      date: '2026-09-09',
      isToday: true,
      isFuture: false,
      caloriesConsumed: 1500,
      targetCalories: 1800,
      moveKj: 2900,
      targetMoveKj: 1800,
      hasMeals: true,
      progressPercent: 40,
      goalStartDate: '2026-07-01',
      goalTargetDate: '2026-12-31',
      hasActiveGoal: true,
      clockHourLocal: 18,
    },
  },
}

/**
 * Isolation harness for ticket 3009 — not Dashboard, not in nav.
 * Replaces the 3007 throwaway spike route.
 */
export function CompanionPrototypePage() {
  const [fixture, setFixture] = useState<FixtureId>('balanced')
  const [forceFallback, setForceFallback] = useState(false)
  const context = useMemo(() => FIXTURES[fixture].context, [fixture])

  useEffect(() => {
    setCompanionRendererForceFallback(forceFallback)
    return () => setCompanionRendererForceFallback(false)
  }, [forceFallback])

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col gap-4 bg-[var(--color-canvas)] p-6 text-[var(--color-ink)]">
      <header className="space-y-1">
        <p className="text-xs tracking-wide text-[var(--color-ink-muted)] uppercase">
          Dev prototype · 3009
        </p>
        <h1 className="font-display text-2xl">GoalStateCompanion</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Real component driven by companion context fixtures. Static poses only — animation is
          3010. Not wired into the Dashboard.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(FIXTURES) as FixtureId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`rounded-md px-3 py-2 text-sm ${
              fixture === id
                ? 'bg-[var(--color-moss)] text-white'
                : 'bg-[var(--color-moss-soft)] text-[var(--color-ink)]'
            }`}
            onClick={() => setFixture(id)}
          >
            {FIXTURES[id].label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
        <input
          type="checkbox"
          checked={forceFallback}
          onChange={(e) => setForceFallback(e.target.checked)}
        />
        Simulate renderer unavailable (page must stay intact)
      </label>

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[color-mix(in_srgb,var(--color-canvas)_70%,white)]">
        <GoalStateCompanion key={`${fixture}-${forceFallback}`} context={context} />
      </div>

      <p className="text-xs text-[var(--color-ink-muted)]">
        Fixture: <strong>{fixture}</strong>
        {forceFallback ? ' · fallback path' : ' · WebGL path when available'}
      </p>
      <p className="text-xs text-[var(--color-ink-muted)]">Surrounding harness page remains mounted.</p>
    </main>
  )
}
