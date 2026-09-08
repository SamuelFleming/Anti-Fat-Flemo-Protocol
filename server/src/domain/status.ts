import { DAILY_STATUS_THRESHOLDS, WEEKLY_STATUS_THRESHOLDS } from "./thresholds.js";

/** `06-Calculation-Rules.md` #17 + Core Scope #10 (adds `awaiting-data`). */
export const DAILY_STATUSES = ["on-track", "partial", "off-track", "awaiting-data"] as const;
export type DailyStatus = (typeof DAILY_STATUSES)[number];

export interface DailyStatusInput {
  /** Sum of the day's meal calories (0 when nothing has been logged). */
  caloriesConsumed: number;
  targetCalories: number;
  /** `null` when no Move value has been recorded for the day. */
  moveKj: number | null;
  targetMoveKj: number;
}

/**
 * `06-Calculation-Rules.md` #17 — Daily Status.
 *
 * When Move has not been recorded, the day cannot be conclusively judged
 * "on track" or "partial" — it is genuinely unknown, not zero (rule #19) —
 * so it resolves to `awaiting-data` unless calories alone already breach the
 * off-track threshold.
 */
export function calculateDailyStatus(input: DailyStatusInput): DailyStatus {
  const { caloriesConsumed, targetCalories, moveKj, targetMoveKj } = input;
  const t = DAILY_STATUS_THRESHOLDS;

  const caloriesOffTrack = caloriesConsumed > targetCalories + t.offTrackCalorieOverKcal;
  const caloriesOnTrack = caloriesConsumed <= targetCalories + t.onTrackCalorieOverKcal;

  if (moveKj == null) {
    return caloriesOffTrack ? "off-track" : "awaiting-data";
  }

  const moveOffTrack = moveKj < targetMoveKj * t.offTrackMoveRatio;
  const moveOnTrack = moveKj >= targetMoveKj * t.onTrackMoveRatio;

  if (caloriesOffTrack || moveOffTrack) return "off-track";
  if (caloriesOnTrack && moveOnTrack) return "on-track";
  return "partial";
}

/** `06-Calculation-Rules.md` #18. */
export const WEEKLY_STATUSES = ["on-track", "mixed", "off-track", "awaiting-data"] as const;
export type WeeklyStatus = (typeof WEEKLY_STATUSES)[number];

export interface WeeklyStatusInput {
  /** One `DailyStatus` per day considered, in any order. */
  dailyStatuses: DailyStatus[];
  averageCalories: number | null;
  targetCalories: number;
  averageMoveKj: number | null;
  targetMoveKj: number;
}

/**
 * `06-Calculation-Rules.md` #18 — Weekly Status (deliberately simple, per doc).
 */
export function calculateWeeklyStatus(input: WeeklyStatusInput): WeeklyStatus {
  const { dailyStatuses, averageCalories, targetCalories, averageMoveKj, targetMoveKj } = input;
  const t = WEEKLY_STATUS_THRESHOLDS;

  const loggedStatuses = dailyStatuses.filter((status) => status !== "awaiting-data");
  if (loggedStatuses.length === 0) return "awaiting-data";

  const onTrackCount = loggedStatuses.filter((status) => status === "on-track").length;
  const offTrackCount = loggedStatuses.filter((status) => status === "off-track").length;
  const majorityThreshold = loggedStatuses.length * t.majorityRatio;

  const caloriesNearTarget =
    averageCalories != null && averageCalories <= targetCalories + t.onTrackCalorieOverKcal;
  const moveNearTarget =
    averageMoveKj != null && averageMoveKj >= targetMoveKj * t.onTrackMoveRatio;
  const caloriesMaterialMiss =
    averageCalories != null && averageCalories > targetCalories + t.offTrackCalorieOverKcal;
  const moveMaterialMiss =
    averageMoveKj != null && averageMoveKj < targetMoveKj * t.offTrackMoveRatio;

  if (onTrackCount > majorityThreshold && caloriesNearTarget && moveNearTarget) {
    return "on-track";
  }

  if (offTrackCount > majorityThreshold || (caloriesMaterialMiss && moveMaterialMiss)) {
    return "off-track";
  }

  return "mixed";
}
