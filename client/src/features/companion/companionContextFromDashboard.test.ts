import { describe, expect, it } from 'vitest'
import { companionContextFromDashboard } from './companionContextFromDashboard'
import type { DashboardResponse } from '../../services/dashboardService'
import { todayDateString } from '../../utils/format'

function dashboard(overrides: Partial<DashboardResponse['today']> = {}): DashboardResponse {
  const date = todayDateString()
  return {
    date,
    activeGoal: {
      id: 'g1',
      userId: 'u1',
      name: 'Goal',
      startDate: '2026-07-01',
      targetDate: '2026-12-31',
      startingWeightKg: 90,
      targetWeightKg: 80,
      targetCalories: 1800,
      targetMoveKj: 1800,
      status: 'active',
      createdAt: '',
      updatedAt: '',
    },
    today: {
      date,
      caloriesConsumed: 1500,
      targetCalories: 1800,
      caloriesRemaining: 300,
      moveKj: 1700,
      targetMoveKj: 1800,
      moveRemainingKj: 100,
      baselineTdee: 2000,
      moveKcal: 400,
      estimatedDeficit: 900,
      status: 'on-track',
      meals: [{ id: 'm1', name: 'Lunch', calories: 1500 } as never],
      ...overrides,
    },
    weight: {
      currentWeightKg: 86,
      startingWeightKg: 90,
      targetWeightKg: 80,
      weightLostKg: 4,
      remainingKg: 6,
      progressPercent: 40,
      daysRemaining: { status: 'remaining', days: 100 },
    },
    week: {
      startDate: '2026-09-07',
      endDate: '2026-09-13',
      totalCalories: 1500,
      averageCalories: 1500,
      totalMoveKj: 1700,
      averageMoveKj: 1700,
      estimatedDeficit: 900,
      weightChangeKg: null,
      status: 'on-track',
      days: [],
    },
  }
}

describe('companionContextFromDashboard', () => {
  it('maps selected-day dashboard fields into companion context', () => {
    const today = todayDateString()
    const ctx = companionContextFromDashboard(dashboard(), today, 15)
    expect(ctx.date).toBe(today)
    expect(ctx.isToday).toBe(true)
    expect(ctx.isFuture).toBe(false)
    expect(ctx.caloriesConsumed).toBe(1500)
    expect(ctx.hasMeals).toBe(true)
    expect(ctx.moveKj).toBe(1700)
    expect(ctx.hasActiveGoal).toBe(true)
    expect(ctx.goalStartDate).toBe('2026-07-01')
    expect(ctx.progressPercent).toBe(40)
    expect(ctx.clockHourLocal).toBe(15)
  })

  it('marks future selected days without inventing meal evidence', () => {
    const ctx = companionContextFromDashboard(
      dashboard({ caloriesConsumed: 0, meals: [], moveKj: null }),
      '2099-01-01',
      10,
    )
    expect(ctx.isFuture).toBe(true)
    expect(ctx.isToday).toBe(false)
    expect(ctx.hasMeals).toBe(false)
    expect(ctx.moveKj).toBeNull()
  })
})
