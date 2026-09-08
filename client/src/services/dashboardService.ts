import { apiRequest } from './apiClient'
import type { Goal } from './goalService'
import type { Meal } from './mealService'

export type DailyStatus = 'on-track' | 'partial' | 'off-track' | 'awaiting-data'
export type WeeklyStatus = 'on-track' | 'mixed' | 'off-track' | 'awaiting-data'

export type DaysRemaining =
  | { status: 'remaining'; days: number }
  | { status: 'passed' }
  | { status: 'no-target-date' }

export type DashboardDay = {
  date: string
  isToday: boolean
  isFuture: boolean
  isSelected: boolean
  caloriesConsumed: number
  moveKj: number | null
  status: DailyStatus | null
}

export type DashboardResponse = {
  date: string
  activeGoal: Goal | null
  today: {
    date: string
    caloriesConsumed: number
    targetCalories: number | null
    caloriesRemaining: number | null
    moveKj: number | null
    targetMoveKj: number | null
    moveRemainingKj: number | null
    baselineTdee: number | null
    moveKcal: number | null
    estimatedDeficit: number | null
    status: DailyStatus | null
    meals: Meal[]
  }
  weight: {
    currentWeightKg: number | null
    startingWeightKg: number | null
    targetWeightKg: number | null
    weightLostKg: number | null
    remainingKg: number | null
    progressPercent: number | null
    daysRemaining: DaysRemaining | null
  }
  week: {
    startDate: string
    endDate: string
    totalCalories: number
    averageCalories: number | null
    totalMoveKj: number
    averageMoveKj: number | null
    estimatedDeficit: number | null
    weightChangeKg: number | null
    status: WeeklyStatus | null
    days: DashboardDay[]
  }
}

export function fetchDashboard(token: string, date?: string) {
  const query = date ? `?date=${date}` : ''
  return apiRequest<DashboardResponse>(`/dashboard${query}`, { method: 'GET', token })
}
