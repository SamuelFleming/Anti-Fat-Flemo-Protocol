import { useCallback, useEffect, useState } from 'react'
import { PageContainer } from '../../components/ui/PageContainer'
import { Button } from '../../components/ui/Button'
import { GoalJourneyTrack } from '../../components/goals/GoalJourneyTrack'
import { WeightLineChart } from '../../components/charts/WeightLineChart'
import { MetricBarChart } from '../../components/charts/MetricBarChart'
import { useAuth } from '../../contexts/AuthContext'
import { fetchProgress, type ProgressQuery, type ProgressResponse } from '../../services/progressService'
import { ApiError } from '../../services/apiClient'
import { formatKcal, formatKg, formatKj, formatShortDate } from '../../utils/format'
import { statusLabel } from '../../utils/status'

type RangeOption = { id: 'goal' | '7d' | '30d' | 'all'; label: string }

const RANGE_OPTIONS: RangeOption[] = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: 'goal', label: 'Goal' },
  { id: 'all', label: 'All Time' },
]

export function ProgressPage() {
  const { token } = useAuth()
  const [range, setRange] = useState<RangeOption['id']>('30d')
  const [data, setData] = useState<ProgressResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (selectedRange: RangeOption['id']) => {
      if (!token) return
      setLoading(true)
      setError(null)
      try {
        const query: ProgressQuery = { range: selectedRange }
        setData(await fetchProgress(token, query))
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Unable to load progress')
      } finally {
        setLoading(false)
      }
    },
    [token],
  )

  useEffect(() => {
    void load(range)
  }, [load, range])

  if (loading && !data) {
    return (
      <PageContainer title="Progress">
        <p className="text-sm text-[var(--color-ink-muted)]">Loading your progress…</p>
      </PageContainer>
    )
  }

  if (error && !data) {
    return (
      <PageContainer title="Progress">
        <p role="alert" className="text-sm text-[var(--color-coral)]">
          {error}
        </p>
        <Button className="mt-4" onClick={() => void load(range)}>
          Retry
        </Button>
      </PageContainer>
    )
  }

  if (!data) return null

  const activeGoal = data.goals.find((goal) => goal.status === 'active') ?? null
  const caloriesPoints = data.history.map((row) => ({
    date: row.date,
    value: row.caloriesConsumed > 0 || row.status ? row.caloriesConsumed : null,
    target: row.targetCalories,
  }))
  const movePoints = data.history.map((row) => ({ date: row.date, value: row.moveKj, target: row.targetMoveKj }))

  return (
    <PageContainer title="Progress" description="Longer-term weight and accountability trends.">
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Date range">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setRange(option.id)}
            aria-pressed={range === option.id}
            className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors ${
              range === option.id
                ? 'bg-[var(--color-moss)] text-[var(--color-canvas)]'
                : 'bg-[var(--color-moss-soft)] text-[var(--color-moss)] hover:brightness-95'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {activeGoal ? (
        <section className="mb-8 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-5">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">Goal progress</h2>
          <GoalJourneyTrack
            startWeightKg={activeGoal.startingWeightKg}
            currentWeightKg={data.summary.endWeightKg}
            targetWeightKg={activeGoal.targetWeightKg}
            history={data.weightEntries}
          />
        </section>
      ) : (
        <p className="mb-8 text-sm text-[var(--color-ink-muted)]">No active goal for this range.</p>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          Weight
        </h2>
        <WeightLineChart points={data.weightEntries} targetWeightKg={activeGoal?.targetWeightKg} />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            Calories
          </h2>
          <MetricBarChart points={caloriesPoints} color="var(--color-coral)" unit="kcal" label="Calories" />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            Move
          </h2>
          <MetricBarChart points={movePoints} color="var(--color-lavender)" unit="kJ" label="Move" />
        </div>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-5 sm:grid-cols-4">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Avg calories</dt>
          <dd className="font-semibold text-[var(--color-ink)]">
            {data.summary.averageCalories != null ? formatKcal(data.summary.averageCalories) : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Avg Move</dt>
          <dd className="font-semibold text-[var(--color-ink)]">
            {data.summary.averageMoveKj != null ? formatKj(data.summary.averageMoveKj) : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Weight change</dt>
          <dd className="font-semibold text-[var(--color-ink)]">
            {data.summary.weightChangeKg != null ? formatKg(data.summary.weightChangeKg) : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Days logged</dt>
          <dd className="font-semibold text-[var(--color-ink)]">
            {data.summary.loggedDayCount} / {data.summary.totalDayCount}
          </dd>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          History
        </h2>
        <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[var(--color-moss-soft)] text-[var(--color-moss)]">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Date</th>
                <th scope="col" className="px-3 py-2 font-semibold">Calories</th>
                <th scope="col" className="px-3 py-2 font-semibold">Move</th>
                <th scope="col" className="px-3 py-2 font-semibold">Weight</th>
                <th scope="col" className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.history.map((row) => (
                <tr key={row.date} className="border-t border-[color-mix(in_srgb,var(--color-moss)_12%,transparent)]">
                  <td className="px-3 py-2 text-[var(--color-ink)]">{formatShortDate(row.date)}</td>
                  <td className="px-3 py-2 text-[var(--color-ink-muted)]">
                    {formatKcal(row.caloriesConsumed)}
                    {row.targetCalories != null ? ` / ${formatKcal(row.targetCalories)}` : ''}
                  </td>
                  <td className="px-3 py-2 text-[var(--color-ink-muted)]">
                    {row.moveKj != null ? formatKj(row.moveKj) : '—'}
                    {row.targetMoveKj != null ? ` / ${formatKj(row.targetMoveKj)}` : ''}
                  </td>
                  <td className="px-3 py-2 text-[var(--color-ink-muted)]">
                    {row.weightKg != null ? formatKg(row.weightKg) : '—'}
                  </td>
                  <td className="px-3 py-2 text-[var(--color-ink-muted)]">{statusLabel(row.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageContainer>
  )
}
