/**
 * `06-Calculation-Rules.md` #12 — Current Weight.
 * Falls back to the goal's starting weight when no weight entry exists yet.
 */
export function resolveCurrentWeightKg(
  latestWeightKg: number | null | undefined,
  startingWeightKg: number,
): number {
  return latestWeightKg ?? startingWeightKg;
}

/** `06-Calculation-Rules.md` #13 — Total Weight Change. Positive = loss. */
export function weightChangeKg(startingWeightKg: number, currentWeightKg: number): number {
  return startingWeightKg - currentWeightKg;
}

/** `06-Calculation-Rules.md` #14 — Remaining Weight. Never negative. */
export function remainingWeightKg(currentWeightKg: number, targetWeightKg: number): number {
  const remaining = currentWeightKg - targetWeightKg;
  return remaining > 0 ? remaining : 0;
}

/**
 * `06-Calculation-Rules.md` #15 — Goal Progress Percentage.
 * Generalises the documented loss-goal formula
 * (`Loss Achieved / Required Loss × 100`) to a signed required/achieved
 * change so gain-direction goals resolve consistently; clamped to 0-100.
 */
export function goalProgressPercent(
  startingWeightKg: number,
  currentWeightKg: number,
  targetWeightKg: number,
): number {
  const requiredChange = targetWeightKg - startingWeightKg;
  if (requiredChange === 0) {
    return currentWeightKg === targetWeightKg ? 100 : 0;
  }

  const achievedChange = currentWeightKg - startingWeightKg;
  const percent = (achievedChange / requiredChange) * 100;
  return Math.min(100, Math.max(0, percent));
}

export type DaysRemaining =
  | { status: "remaining"; days: number }
  | { status: "passed" }
  | { status: "no-target-date" };

/** `06-Calculation-Rules.md` #16 — Days Remaining. */
export function calculateDaysRemaining(
  targetDate: Date | null | undefined,
  currentDate: Date,
): DaysRemaining {
  if (!targetDate) return { status: "no-target-date" };

  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.ceil((targetDate.getTime() - currentDate.getTime()) / msPerDay);

  if (days < 0) return { status: "passed" };
  return { status: "remaining", days };
}
