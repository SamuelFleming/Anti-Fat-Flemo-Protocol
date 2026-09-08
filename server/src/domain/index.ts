export {
  sumDailyCalories,
  caloriesRemaining,
  moveKjToKcal,
  estimatedDailyExpenditure,
  estimatedDailyDeficit,
  sumWeeklyCalories,
  averageDailyCalories,
  sumWeeklyMoveKj,
  averageMoveKj,
  sumEstimatedWeeklyDeficit,
} from "./energy.js";

export {
  resolveCurrentWeightKg,
  weightChangeKg,
  remainingWeightKg,
  goalProgressPercent,
  calculateDaysRemaining,
  type DaysRemaining,
} from "./weight.js";

export {
  DAILY_STATUSES,
  WEEKLY_STATUSES,
  calculateDailyStatus,
  calculateWeeklyStatus,
  type DailyStatus,
  type WeeklyStatus,
  type DailyStatusInput,
  type WeeklyStatusInput,
} from "./status.js";

export { DAILY_STATUS_THRESHOLDS, WEEKLY_STATUS_THRESHOLDS, KJ_PER_KCAL } from "./thresholds.js";
