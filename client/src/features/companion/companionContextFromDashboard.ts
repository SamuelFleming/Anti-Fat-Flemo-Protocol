import type { DashboardResponse } from '../../services/dashboardService'
import type { CompanionDayContext } from './companionState'
import { todayDateString } from '../../utils/format'

/** Map the Dashboard aggregation payload into the companion's parent-owned day context. */
export function companionContextFromDashboard(
  dashboard: DashboardResponse,
  selectedDate: string,
  clockHourLocal: number = new Date().getHours(),
): CompanionDayContext {
  const { today, weight, activeGoal } = dashboard
  const todayStr = todayDateString()
  const isToday = selectedDate === todayStr
  const isFuture = selectedDate > todayStr

  return {
    date: selectedDate,
    isToday,
    isFuture,
    caloriesConsumed: today.caloriesConsumed,
    targetCalories: today.targetCalories,
    moveKj: today.moveKj,
    targetMoveKj: today.targetMoveKj,
    hasMeals: today.meals.length > 0,
    progressPercent: weight.progressPercent,
    goalStartDate: activeGoal?.startDate ?? null,
    goalTargetDate: activeGoal?.targetDate ?? null,
    hasActiveGoal: activeGoal != null,
    clockHourLocal,
  }
}
