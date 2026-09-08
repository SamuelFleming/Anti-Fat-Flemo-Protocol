/**
 * Centralised, explainable thresholds/config for derived status calculations.
 * See `docs/core-scope/06-Calculation-Rules.md` #17-18.
 */

export const DAILY_STATUS_THRESHOLDS = {
  onTrackCalorieOverKcal: 100,
  offTrackCalorieOverKcal: 300,
  onTrackMoveRatio: 0.9,
  offTrackMoveRatio: 0.6,
} as const;

export const WEEKLY_STATUS_THRESHOLDS = {
  onTrackCalorieOverKcal: 100,
  onTrackMoveRatio: 0.9,
  offTrackCalorieOverKcal: 300,
  offTrackMoveRatio: 0.6,
  /** A status "majority" requires strictly more than this fraction of logged days. */
  majorityRatio: 0.5,
} as const;

/** Apple Fitness Move energy is entered in kJ; kcal = kJ / 4.184. */
export const KJ_PER_KCAL = 4.184;
