import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '../../components/ui/PageContainer'
import { DailyTargetGauge } from '../../components/metrics/DailyTargetGauge'
import { useAuth } from '../../contexts/AuthContext'
import { fetchActiveGoal, type Goal } from '../../services/goalService'
import { ApiError } from '../../services/apiClient'
import { addDaysToDateString, formatLongDate, todayDateString } from '../../utils/format'
import { MealsPanel } from './MealsPanel'
import { MoveWeightPanel } from './MoveWeightPanel'

export function DailyLogPage() {
  const { token } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const date = searchParams.get('date') ?? todayDateString()

  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)
  const [goalLoading, setGoalLoading] = useState(true)
  const [goalError, setGoalError] = useState<string | null>(null)
  const [caloriesConsumed, setCaloriesConsumed] = useState(0)
  const [moveKj, setMoveKj] = useState<number | null>(null)

  const loadGoal = useCallback(async () => {
    if (!token) return
    setGoalLoading(true)
    setGoalError(null)
    try {
      setActiveGoal(await fetchActiveGoal(token))
    } catch (err) {
      setGoalError(err instanceof ApiError ? err.message : 'Unable to load your goal targets')
    } finally {
      setGoalLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadGoal()
  }, [loadGoal])

  function goToDate(nextDate: string) {
    setSearchParams(nextDate === todayDateString() ? {} : { date: nextDate })
  }

  if (!token) return null

  return (
    <PageContainer title="Daily Log" description="Meals, Move, and weight for a selected day.">
      <nav className="mb-6 flex items-center justify-center gap-4 text-sm">
        <button
          type="button"
          onClick={() => goToDate(addDaysToDateString(date, -1))}
          className="font-medium text-[var(--color-moss)] hover:underline"
        >
          ‹ Previous
        </button>
        <span className="font-semibold text-[var(--color-ink)]">{formatLongDate(date)}</span>
        <button
          type="button"
          onClick={() => goToDate(addDaysToDateString(date, 1))}
          className="font-medium text-[var(--color-moss)] hover:underline"
        >
          Next ›
        </button>
      </nav>

      {!goalLoading && !activeGoal ? (
        <p className="mb-6 text-center text-sm text-[var(--color-ink-muted)]">
          {goalError ?? 'Set an active goal to see targets and status alongside your entries.'}
        </p>
      ) : null}

      <section className="mb-6 flex flex-wrap justify-center gap-6">
        <DailyTargetGauge
          label="Calories"
          metric="calories"
          variant="compact"
          value={activeGoal ? caloriesConsumed : null}
          target={activeGoal?.targetCalories ?? 0}
          unit="kcal"
        />
        <DailyTargetGauge
          label="Move"
          metric="move"
          variant="compact"
          value={activeGoal ? moveKj : null}
          target={activeGoal?.targetMoveKj ?? 0}
          unit="kJ"
        />
      </section>

      <div className="flex flex-col gap-6">
        <MealsPanel key={`meals-${date}`} token={token} date={date} onTotalCaloriesChange={setCaloriesConsumed} />
        <MoveWeightPanel key={`move-${date}`} token={token} date={date} onMoveChange={setMoveKj} />
      </div>
    </PageContainer>
  )
}
