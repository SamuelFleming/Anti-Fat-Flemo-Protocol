import { useEffect, useMemo, useState } from 'react'
import {
  GoalStateCompanion,
  setCompanionForceReducedMotion,
  setCompanionRendererForceFallback,
} from '../../components/companion/GoalStateCompanion'
import type { CompanionDayContext } from './companionState'

type FixtureId =
  | 'no-data'
  | 'future-day'
  | 'balanced'
  | 'mildly-full'
  | 'over-full'
  | 'exertion'
  | 'high-exertion'
  | 'low-fuel'
  | 'under-moved'
  | 'partial-nutrition'
  | 'partial-movement'
  | 'milestone'
  | 'historical-complete'

const TODAY = '2026-09-09'

const baseGoal = {
  progressPercent: 40,
  goalStartDate: '2026-07-01',
  goalTargetDate: '2026-12-31',
  hasActiveGoal: true,
}

const liveDay = {
  date: TODAY,
  isToday: true,
  isFuture: false,
  targetCalories: 1800,
  targetMoveKj: 1800,
  ...baseGoal,
}

const FIXTURES: Record<FixtureId, { label: string; context: CompanionDayContext }> = {
  'no-data': {
    label: 'No data (mannequin)',
    context: {
      ...liveDay,
      caloriesConsumed: 0,
      moveKj: null,
      hasMeals: false,
      progressPercent: null,
      goalStartDate: null,
      goalTargetDate: null,
      hasActiveGoal: false,
      clockHourLocal: 15,
    },
  },
  'future-day': {
    label: 'Future day (mannequin)',
    context: {
      ...liveDay,
      date: '2026-09-12',
      isToday: false,
      isFuture: true,
      caloriesConsumed: 0,
      moveKj: null,
      hasMeals: false,
      clockHourLocal: 15,
    },
  },
  balanced: {
    label: 'On-track (balanced)',
    context: { ...liveDay, caloriesConsumed: 1500, moveKj: 1700, hasMeals: true, clockHourLocal: 15 },
  },
  'mildly-full': {
    label: 'Over-target (mildly-full)',
    context: { ...liveDay, caloriesConsumed: 1950, moveKj: 1700, hasMeals: true, clockHourLocal: 21 },
  },
  'over-full': {
    label: 'Significantly over (over-full)',
    context: { ...liveDay, caloriesConsumed: 2200, moveKj: 1700, hasMeals: true, clockHourLocal: 21 },
  },
  exertion: {
    label: 'High Move (exertion)',
    context: { ...liveDay, caloriesConsumed: 1500, moveKj: 2400, hasMeals: true, clockHourLocal: 18 },
  },
  'high-exertion': {
    label: 'Very-high Move (high-exertion)',
    context: { ...liveDay, caloriesConsumed: 1500, moveKj: 2900, hasMeals: true, clockHourLocal: 18 },
  },
  'low-fuel': {
    label: 'Low intake, evening (low-fuel)',
    context: { ...liveDay, caloriesConsumed: 600, moveKj: 1700, hasMeals: true, clockHourLocal: 21 },
  },
  'under-moved': {
    label: 'Low Move, evening (under-moved)',
    context: { ...liveDay, caloriesConsumed: 1500, moveKj: 900, hasMeals: true, clockHourLocal: 21 },
  },
  'partial-nutrition': {
    label: 'Meals only (partial)',
    context: { ...liveDay, caloriesConsumed: 1500, moveKj: null, hasMeals: true, clockHourLocal: 15 },
  },
  'partial-movement': {
    label: 'Move only, historical (partial)',
    context: {
      ...liveDay,
      date: '2026-09-04',
      isToday: false,
      caloriesConsumed: 0,
      moveKj: 900,
      hasMeals: false,
      clockHourLocal: 12,
    },
  },
  milestone: {
    label: 'Milestone beat',
    context: {
      ...liveDay,
      caloriesConsumed: 1500,
      moveKj: 1700,
      hasMeals: true,
      clockHourLocal: 15,
      milestone: true,
    },
  },
  'historical-complete': {
    label: 'Historical Wednesday (final state)',
    context: {
      ...liveDay,
      date: '2026-09-03',
      isToday: false,
      caloriesConsumed: 2100,
      moveKj: 2000,
      hasMeals: true,
      clockHourLocal: 9,
    },
  },
}

/**
 * Isolation harness for tickets 3009/3010 — not Dashboard, not in nav.
 * Switching fixtures does NOT remount the companion, so day-change / live-update
 * transitions animate from the previously displayed state (Motion Rules).
 */
export function CompanionPrototypePage() {
  const [fixture, setFixture] = useState<FixtureId>('balanced')
  const [forceFallback, setForceFallback] = useState(false)
  const [forceReducedMotion, setForceReducedMotion] = useState(false)
  const context = useMemo(() => FIXTURES[fixture].context, [fixture])

  useEffect(() => {
    setCompanionRendererForceFallback(forceFallback)
    return () => setCompanionRendererForceFallback(false)
  }, [forceFallback])

  useEffect(() => {
    setCompanionForceReducedMotion(forceReducedMotion)
    return () => setCompanionForceReducedMotion(false)
  }, [forceReducedMotion])

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-4 bg-[var(--color-canvas)] p-6 text-[var(--color-ink)]">
      <header className="space-y-1">
        <p className="text-xs tracking-wide text-[var(--color-ink-muted)] uppercase">
          Dev prototype · 3009/3010
        </p>
        <h1 className="font-display text-2xl">GoalStateCompanion</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Full catalogue fixtures. Switch fixtures to see transitions animate from the previous
          state; the companion is never remounted between fixtures. Not wired into the Dashboard.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(FIXTURES) as FixtureId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`rounded-md px-3 py-1.5 text-xs ${
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

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
          <input
            type="checkbox"
            checked={forceFallback}
            onChange={(e) => setForceFallback(e.target.checked)}
          />
          Simulate renderer unavailable
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
          <input
            type="checkbox"
            checked={forceReducedMotion}
            onChange={(e) => setForceReducedMotion(e.target.checked)}
          />
          Simulate reduced motion (static 3004 poses)
        </label>
      </div>

      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-lg bg-[color-mix(in_srgb,var(--color-canvas)_70%,white)]">
        <GoalStateCompanion
          key={`${forceFallback}-${forceReducedMotion}`}
          context={context}
        />
      </div>

      <p className="text-xs text-[var(--color-ink-muted)]">
        Fixture: <strong>{fixture}</strong>
        {forceFallback ? ' · fallback path' : ''}
        {forceReducedMotion ? ' · reduced motion' : ''}
        {' · '}same-day fixtures = live-update; date-changing fixtures = day-crossfade (no
        settle replay)
      </p>
    </main>
  )
}
