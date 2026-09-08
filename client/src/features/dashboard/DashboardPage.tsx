import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../../components/ui/PageContainer'
import { Button } from '../../components/ui/Button'
import { GoalJourneyTrack } from '../../components/goals/GoalJourneyTrack'
import { DailyTargetGauge } from '../../components/metrics/DailyTargetGauge'
import { WeeklyAccountabilityRibbon, type RibbonDay } from '../../components/accountability/WeeklyAccountabilityRibbon'
import { EnergyBalanceCard } from '../../components/dashboard/EnergyBalanceCard'
import { GoalStateCompanion } from '../../components/companion/GoalStateCompanion'
import { useAuth } from '../../contexts/AuthContext'
import { fetchDashboard, type DashboardResponse } from '../../services/dashboardService'
import { ApiError } from '../../services/apiClient'
import { formatKcal, formatLongDate, todayDateString } from '../../utils/format'
import { statusLabel, statusNote } from '../../utils/status'
import { companionContextFromDashboard } from '../companion/companionContextFromDashboard'
import type { CompanionDayContext } from '../companion/companionState'

export function DashboardPage() {
  const { token } = useAuth()
  const [selectedDate, setSelectedDate] = useState(todayDateString())
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  /** Local UI-only toggle (charter 4.9) — not persisted, no profile/API field. */
  const [companionEnabled, setCompanionEnabled] = useState(true)
  /** Render/WebGL failure collapses the centre slot like a disabled companion. */
  const [companionFailed, setCompanionFailed] = useState(false)

  const load = useCallback(
    async (date: string) => {
      if (!token) return
      setLoading((prev) => prev && dashboard == null)
      setError(null)
      try {
        const data = await fetchDashboard(token, date)
        setDashboard(data)
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Unable to load dashboard')
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token],
  )

  useEffect(() => {
    void load(selectedDate)
  }, [load, selectedDate])

  useEffect(() => {
    // Allow retrying the companion after the user re-enables it.
    if (companionEnabled) setCompanionFailed(false)
  }, [companionEnabled])

  const companionContext = useMemo(() => {
    if (!dashboard) return null
    return companionContextFromDashboard(dashboard, selectedDate)
  }, [dashboard, selectedDate])

  if (loading && !dashboard) {
    return (
      <PageContainer title="Dashboard">
        <p className="text-sm text-[var(--color-ink-muted)]">Loading your dashboard…</p>
      </PageContainer>
    )
  }

  if (error && !dashboard) {
    return (
      <PageContainer title="Dashboard">
        <p role="alert" className="text-sm text-[var(--color-coral)]">
          {error}
        </p>
        <Button className="mt-4" onClick={() => void load(selectedDate)}>
          Retry
        </Button>
      </PageContainer>
    )
  }

  if (!dashboard) return null

  const { activeGoal, today, weight, week } = dashboard
  const isToday = selectedDate === todayDateString()
  const showCompanion = companionEnabled && !companionFailed && companionContext != null

  const ribbonDays: RibbonDay[] = week.days.map((day) => ({
    date: day.date,
    status: day.status,
    isFuture: day.isFuture,
    isToday: day.isToday,
    caloriesConsumed: day.caloriesConsumed,
    moveKj: day.moveKj,
  }))

  return (
    <PageContainer
      title="Dashboard"
      description={
        isToday
          ? "Today's energy picture and goal position."
          : `Viewing ${formatLongDate(selectedDate)}.`
      }
    >
      {!activeGoal ? (
        <section className="mb-8 rounded-[var(--radius-md)] border border-dashed border-[color-mix(in_srgb,var(--color-moss)_30%,transparent)] bg-white/50 p-5">
          <p className="text-sm text-[var(--color-ink)]">
            You don&apos;t have an active goal yet. Set one to unlock progress tracking.
          </p>
          <Link
            to="/goals"
            className="mt-3 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-moss)] px-4 py-2 text-sm font-medium text-[var(--color-canvas)] transition-[filter] hover:brightness-110"
          >
            Create a goal
          </Link>
        </section>
      ) : (
        <section className="mb-8 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">{activeGoal.name}</h2>
            <Link to="/goals" className="text-xs font-medium text-[var(--color-moss)] hover:underline">
              View goal details
            </Link>
          </div>
          <GoalJourneyTrack
            startWeightKg={activeGoal.startingWeightKg}
            currentWeightKg={weight.currentWeightKg}
            targetWeightKg={activeGoal.targetWeightKg}
          />
        </section>
      )}

      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            Daily targets
          </h2>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--color-ink-muted)]">
            <input
              type="checkbox"
              checked={companionEnabled}
              onChange={(e) => setCompanionEnabled(e.target.checked)}
            />
            Show companion
          </label>
        </div>

        <div
          className={
            showCompanion
              ? 'grid grid-cols-2 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(7.5rem,10.5rem)_minmax(0,1fr)]'
              : 'grid grid-cols-2 items-center gap-3'
          }
        >
          <div className="flex flex-col items-center rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-3 sm:p-4">
            <DailyTargetGauge
              label="Calories"
              metric="calories"
              value={today.targetCalories != null ? today.caloriesConsumed : null}
              target={today.targetCalories ?? 0}
              unit="kcal"
              variant="compact"
            />
          </div>

          {showCompanion && companionContext ? (
            <div className="col-span-2 order-last h-44 overflow-hidden rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 sm:col-span-1 sm:order-none sm:h-40">
              <CompanionDashboardSlot
                context={companionContext}
                onUnavailable={() => setCompanionFailed(true)}
              />
            </div>
          ) : null}

          <div className="flex flex-col items-center rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-3 sm:p-4">
            <DailyTargetGauge
              label="Move"
              metric="move"
              value={today.targetMoveKj != null ? today.moveKj : null}
              target={today.targetMoveKj ?? 0}
              unit="kJ"
              variant="compact"
            />
          </div>
        </div>

        {companionEnabled && companionFailed ? (
          <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
            Companion unavailable — showing gauges only.
          </p>
        ) : null}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <EnergyBalanceCard
          baselineTdee={today.baselineTdee}
          moveKcal={today.moveKcal}
          foodKcal={today.caloriesConsumed}
          estimatedDeficit={today.estimatedDeficit}
        />
        <div className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            {isToday ? "Today's status" : 'Status'}
          </p>
          <p className="text-lg font-semibold text-[var(--color-ink)]">{statusLabel(today.status)}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{statusNote(today.status)}</p>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            {isToday ? "Today's meals" : `Meals on ${formatLongDate(selectedDate)}`}
          </h2>
          <Link
            to={`/daily-log?date=${selectedDate}`}
            className="text-xs font-medium text-[var(--color-moss)] hover:underline"
          >
            Manage in Daily Log
          </Link>
        </div>
        {today.meals.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)]">No meals logged yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {today.meals.map((meal) => (
              <li
                key={meal.id}
                className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-moss)_14%,transparent)] bg-white/50 px-3 py-2 text-sm"
              >
                <span className="text-[var(--color-ink)]">{meal.name}</span>
                <span className="text-[var(--color-ink-muted)]">{formatKcal(meal.calories)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <WeeklyAccountabilityRibbon
        days={ribbonDays}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        averageCalories={week.averageCalories}
        averageMoveKj={week.averageMoveKj}
        weightChangeKg={week.weightChangeKg}
      />
    </PageContainer>
  )
}

type SlotProps = {
  context: CompanionDayContext
  onUnavailable: () => void
}

/** Isolates companion render failures from the rest of the Dashboard. */
function CompanionDashboardSlot({ context, onUnavailable }: SlotProps) {
  return (
    <CompanionSlotErrorBoundary onError={onUnavailable}>
      <GoalStateCompanion context={context} onUnavailable={onUnavailable} />
    </CompanionSlotErrorBoundary>
  )
}

type BoundaryProps = {
  children: React.ReactNode
  onError: () => void
}

type BoundaryState = { hasError: boolean }

class CompanionSlotErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
