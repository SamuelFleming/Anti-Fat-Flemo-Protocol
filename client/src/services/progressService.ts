import { apiRequest } from './apiClient'
import type { Goal } from './goalService'
import type { DailyStatus } from './dashboardService'

export type ProgressRangeType = '7d' | '30d' | 'goal' | 'all' | 'custom'

export type ProgressHistoryRow = {
  date: string
  caloriesConsumed: number
  targetCalories: number | null
  moveKj: number | null
  targetMoveKj: number | null
  estimatedDeficit: number | null
  status: DailyStatus | null
  weightKg: number | null
  goalId: string | null
}

export type ProgressResponse = {
  range: { type: ProgressRangeType; startDate: string; endDate: string; goalId: string | null }
  goals: Goal[]
  history: ProgressHistoryRow[]
  weightEntries: { date: string; weightKg: number }[]
  summary: {
    loggedDayCount: number
    totalDayCount: number
    averageCalories: number | null
    averageMoveKj: number | null
    totalEstimatedDeficit: number | null
    startWeightKg: number | null
    endWeightKg: number | null
    weightChangeKg: number | null
  }
}

export type ProgressQuery =
  | { range: '7d' | '30d' | 'all' }
  | { range: 'goal'; goalId?: string }
  | { startDate: string; endDate: string }

export function fetchProgress(token: string, query: ProgressQuery) {
  const params = new URLSearchParams(query as Record<string, string>).toString()
  return apiRequest<ProgressResponse>(`/progress?${params}`, { method: 'GET', token })
}
