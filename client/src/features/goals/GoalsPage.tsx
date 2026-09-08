import { useCallback, useEffect, useState } from 'react'
import { PageContainer } from '../../components/ui/PageContainer'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { GoalJourneyTrack } from '../../components/goals/GoalJourneyTrack'
import { useAuth } from '../../contexts/AuthContext'
import {
  completeGoal,
  createGoal,
  fetchActiveGoal,
  listGoals,
  updateGoal,
  type Goal,
  type GoalInput,
} from '../../services/goalService'
import { fetchDashboard, type DashboardResponse } from '../../services/dashboardService'
import { ApiError } from '../../services/apiClient'
import { formatKcal, formatKg, formatKj, formatLongDate } from '../../utils/format'
import { GoalForm } from './GoalForm'

function goalDurationDays(goal: Goal): number {
  const start = new Date(goal.startDate).getTime()
  const end = new Date(goal.targetDate ?? goal.updatedAt).getTime()
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)))
}

export function GoalsPage() {
  const { token } = useAuth()
  const [activeGoal, setActiveGoal] = useState<Goal | null | undefined>(undefined)
  const [previousGoals, setPreviousGoals] = useState<Goal[]>([])
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'view' | 'create' | 'edit'>('view')
  const [confirmingComplete, setConfirmingComplete] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const [active, all, dashboardData] = await Promise.all([
        fetchActiveGoal(token),
        listGoals(token),
        fetchDashboard(token),
      ])
      setActiveGoal(active)
      setPreviousGoals(all.items.filter((goal) => goal.status !== 'active'))
      setDashboard(dashboardData)
      setMode(active ? 'view' : 'create')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load goals')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  async function handleCreate(input: GoalInput) {
    if (!token) return
    const goal = await createGoal(token, input)
    setActiveGoal(goal)
    setMode('view')
    await load()
  }

  async function handleUpdate(input: GoalInput) {
    if (!token || !activeGoal) return
    const goal = await updateGoal(token, activeGoal.id, input)
    setActiveGoal(goal)
    setMode('view')
    await load()
  }

  async function handleComplete() {
    if (!token || !activeGoal) return
    setActionError(null)
    try {
      await completeGoal(token, activeGoal.id)
      setConfirmingComplete(false)
      await load()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Unable to complete goal')
      setConfirmingComplete(false)
    }
  }

  if (loading) {
    return (
      <PageContainer title="Goals">
        <p className="text-sm text-[var(--color-ink-muted)]">Loading goals…</p>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer title="Goals">
        <p role="alert" className="text-sm text-[var(--color-coral)]">
          {error}
        </p>
        <Button className="mt-4" onClick={() => void load()}>
          Retry
        </Button>
      </PageContainer>
    )
  }

  const currentWeightKg = dashboard?.weight.currentWeightKg ?? null
  const status = dashboard?.today.status ?? null
  const daysRemaining = dashboard?.weight.daysRemaining ?? null

  return (
    <PageContainer
      title="Goals"
      description="Create, review and complete your tracking goals. Previous goals stay available for reference."
    >
      {mode === 'create' ? (
        <section className="max-w-xl">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">
            {activeGoal ? 'Edit goal' : 'Start a new goal'}
          </h2>
          <GoalForm
            onSubmit={handleCreate}
            onCancel={activeGoal ? () => setMode('view') : undefined}
            submitLabel="Create goal"
          />
        </section>
      ) : null}

      {mode === 'edit' && activeGoal ? (
        <section className="max-w-xl">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">Edit goal</h2>
          <GoalForm initial={activeGoal} onSubmit={handleUpdate} onCancel={() => setMode('view')} submitLabel="Save changes" />
        </section>
      ) : null}

      {mode === 'view' && activeGoal ? (
        <section className="max-w-2xl rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">{activeGoal.name}</h2>
              <p className="text-sm text-[var(--color-ink-muted)]">
                Started {formatLongDate(activeGoal.startDate)}
                {activeGoal.targetDate ? ` · Target ${formatLongDate(activeGoal.targetDate)}` : ''}
              </p>
              {status ? (
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-moss)]">
                  {status.replace('-', ' ')}
                </p>
              ) : null}
              {daysRemaining ? (
                <p className="text-xs text-[var(--color-ink-muted)]">
                  {daysRemaining.status === 'remaining'
                    ? `${daysRemaining.days} days remaining`
                    : daysRemaining.status === 'passed'
                      ? 'Target date passed'
                      : 'No target date set'}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setMode('edit')}>
                Edit
              </Button>
              <Button
                variant="ghost"
                className="text-[var(--color-coral)] hover:bg-[color-mix(in_srgb,var(--color-coral)_14%,transparent)]"
                onClick={() => setConfirmingComplete(true)}
              >
                Complete
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <GoalJourneyTrack
              startWeightKg={activeGoal.startingWeightKg}
              currentWeightKg={currentWeightKg}
              targetWeightKg={activeGoal.targetWeightKg}
            />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Calorie target</dt>
              <dd className="font-semibold text-[var(--color-ink)]">{formatKcal(activeGoal.targetCalories)}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Move target</dt>
              <dd className="font-semibold text-[var(--color-ink)]">{formatKj(activeGoal.targetMoveKj)}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Progress</dt>
              <dd className="font-semibold text-[var(--color-ink)]">
                {dashboard?.weight.progressPercent != null ? `${Math.round(dashboard.weight.progressPercent)}%` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Remaining</dt>
              <dd className="font-semibold text-[var(--color-ink)]">
                {dashboard?.weight.remainingKg != null ? formatKg(dashboard.weight.remainingKg) : '—'}
              </dd>
            </div>
          </dl>

          {actionError ? (
            <p role="alert" className="mt-4 text-sm text-[var(--color-coral)]">
              {actionError}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="mt-10 max-w-2xl">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          Previous goals
        </h2>
        {previousGoals.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)]">No previous goals yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {previousGoals.map((goal) => (
              <li
                key={goal.id}
                className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-moss)_14%,transparent)] bg-white/50 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-[var(--color-ink)]">{goal.name}</p>
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                    {goal.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-ink-muted)]">
                  {formatKg(goal.startingWeightKg)} → {formatKg(goal.targetWeightKg)} · {goalDurationDays(goal)} days
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={confirmingComplete}
        title="Complete this goal?"
        description="This marks the goal as completed. Your history for this period stays available in Previous Goals, and you can start a new goal right away."
        confirmLabel="Complete goal"
        onConfirm={() => void handleComplete()}
        onCancel={() => setConfirmingComplete(false)}
      />
    </PageContainer>
  )
}
