import { KJ_PER_KCAL } from "./thresholds.js";

/** `06-Calculation-Rules.md` #2 — Daily Calories. */
export function sumDailyCalories(meals: { calories: number }[]): number {
  return meals.reduce((total, meal) => total + meal.calories, 0);
}

/**
 * `06-Calculation-Rules.md` #3 — Calories Remaining.
 * Negative means the target has been exceeded; callers display `Math.abs()`
 * of a negative result as "over target" rather than a negative number.
 */
export function caloriesRemaining(targetCalories: number, dailyCalories: number): number {
  return targetCalories - dailyCalories;
}

/** `06-Calculation-Rules.md` #4 — Move Conversion (kJ -> kcal). */
export function moveKjToKcal(moveKj: number): number {
  return moveKj / KJ_PER_KCAL;
}

/**
 * `06-Calculation-Rules.md` #5 — Estimated Daily Expenditure.
 * Returns `null` when baseline TDEE or Move has not been recorded — missing
 * inputs must not be coerced to zero (see rule #19).
 */
export function estimatedDailyExpenditure(
  baselineTdee: number | null | undefined,
  moveKj: number | null | undefined,
): number | null {
  if (baselineTdee == null || moveKj == null) return null;
  return baselineTdee + moveKjToKcal(moveKj);
}

/** `06-Calculation-Rules.md` #6 — Estimated Daily Calorie Deficit. */
export function estimatedDailyDeficit(
  baselineTdee: number | null | undefined,
  moveKj: number | null | undefined,
  caloriesConsumed: number,
): number | null {
  const expenditure = estimatedDailyExpenditure(baselineTdee, moveKj);
  if (expenditure == null) return null;
  return expenditure - caloriesConsumed;
}

/** `06-Calculation-Rules.md` #7 — Weekly Calories. */
export function sumWeeklyCalories(dailyCalories: number[]): number {
  return dailyCalories.reduce((total, calories) => total + calories, 0);
}

/**
 * `06-Calculation-Rules.md` #8 — Average Daily Calories (logged-day average).
 * Returns `null` when no day in the range has been logged.
 */
export function averageDailyCalories(
  weeklyCalories: number,
  loggedDayCount: number,
): number | null {
  if (loggedDayCount <= 0) return null;
  return weeklyCalories / loggedDayCount;
}

/** `06-Calculation-Rules.md` #9 — Weekly Move. */
export function sumWeeklyMoveKj(moveKjValues: number[]): number {
  return moveKjValues.reduce((total, value) => total + value, 0);
}

/** `06-Calculation-Rules.md` #10 — Average Move. */
export function averageMoveKj(
  weeklyMoveKj: number,
  daysWithMoveData: number,
): number | null {
  if (daysWithMoveData <= 0) return null;
  return weeklyMoveKj / daysWithMoveData;
}

/**
 * `06-Calculation-Rules.md` #11 — Estimated Weekly Deficit.
 * Only dates with a computable daily deficit are summed; returns `null` when
 * no date in the range has sufficient data.
 */
export function sumEstimatedWeeklyDeficit(dailyDeficits: (number | null)[]): number | null {
  const known = dailyDeficits.filter((deficit): deficit is number => deficit != null);
  if (known.length === 0) return null;
  return known.reduce((total, deficit) => total + deficit, 0);
}
