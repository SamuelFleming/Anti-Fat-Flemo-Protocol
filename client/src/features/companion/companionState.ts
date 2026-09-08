/**
 * Pure companion state contract (ticket 3008).
 * Renderer-independent: plain data in → semantic + resolved behaviour out.
 * Thresholds mirror server domain / 06-Calculation-Rules (do not invent new formulas).
 */

export type NutritionState =
  | 'unknown'
  | 'low'
  | 'within-range'
  | 'approaching-target'
  | 'over-target'
  | 'significantly-over'

export type MovementState = 'unknown' | 'low' | 'moderate' | 'target-met' | 'high' | 'very-high'

export type GoalProgressState =
  | 'unknown'
  | 'behind-trajectory'
  | 'on-trajectory'
  | 'ahead-of-trajectory'
  | 'neutral'

export type DataState = 'no-data' | 'partial' | 'live' | 'complete'

export type DayPhase = 'morning' | 'midday' | 'afternoon' | 'evening' | 'day-complete'

export type CompanionSemanticState = {
  nutrition: NutritionState
  movement: MovementState
  goalProgress: GoalProgressState
  dataState: DataState
  timeContext: DayPhase
  intensity?: {
    nutrition?: number
    movement?: number
    goalProgress?: number
  }
}

export type PostureToken =
  | 'mannequin-stand'
  | 'balanced'
  | 'mildly-full'
  | 'over-full'
  | 'exertion'
  | 'high-exertion'
  | 'low-fuel'
  | 'under-moved'

export type FaceToken =
  | 'blank-neutral'
  | 'content'
  | 'pleased'
  | 'attentive'
  | 'concern-soft'
  | 'low-fuel'
  | 'effort-content'
  | 'effort-tired'
  | 'full-soft'
  | 'full-content'
  | 'full-effort'
  | 'neutral'

export type BodyFormToken = 'rest' | 'slight-fullness' | 'slight-tuck'
export type BreathingToken = 'resting' | 'easy' | 'elevated' | 'heavy' | 'recovery'
export type EffectsToken = 'none' | 'light-sweat' | 'sweat'
export type AccentToken = 'none' | 'coral' | 'lavender' | 'lime'
export type IdleToken = 'subdued' | 'minimal' | 'soft' | 'recovery'

export type CompositionId =
  | 'mannequin'
  | 'balanced'
  | 'over-full'
  | 'mildly-full'
  | 'high-exertion'
  | 'exertion'
  | 'low-fuel'
  | 'under-moved'
  | 'partial-nutrition-only'
  | 'partial-movement-only'
  | 'milestone'

export type ResolvedBehaviour = {
  compositionId: CompositionId
  posture: PostureToken
  face: FaceToken
  breathing: BreathingToken
  bodyForm: BodyFormToken
  effects: EffectsToken
  materialAccent: AccentToken
  idle: IdleToken
  confidenceBias: -1 | 0 | 1
}

/** Parent-owned selected-day snapshot — companion never fetches. */
export type CompanionDayContext = {
  date: string
  isToday: boolean
  isFuture: boolean
  caloriesConsumed: number
  targetCalories: number | null
  moveKj: number | null
  targetMoveKj: number | null
  hasMeals: boolean
  progressPercent: number | null
  goalStartDate: string | null
  goalTargetDate: string | null
  hasActiveGoal: boolean
  /** Local hour 0–23; ignored when not today (historical → day-complete). */
  clockHourLocal: number
  /** Optional parent flag for a quiet milestone beat. */
  milestone?: boolean
}

export const COMPANION_THRESHOLDS = {
  onTrackCalorieOverKcal: 100,
  offTrackCalorieOverKcal: 300,
  onTrackMoveRatio: 0.9,
  offTrackMoveRatio: 0.6,
  highMoveRatio: 1.15,
  veryHighMoveRatio: 1.5,
  approachingRemainingFraction: 0.15,
  /** Firm low-intake: consumed below this fraction of target. */
  lowIntakeFraction: 0.55,
  goalQuietBandPoints: 12.5,
  goalNeutralMaxPercent: 5,
} as const

export function deriveDayPhase(input: {
  isToday: boolean
  isFuture: boolean
  clockHourLocal: number
}): DayPhase {
  if (!input.isToday) return 'day-complete'
  const h = input.clockHourLocal
  if (h < 11) return 'morning'
  if (h < 14) return 'midday'
  if (h < 18) return 'afternoon'
  return 'evening'
}

function isFirmTime(phase: DayPhase): boolean {
  return phase === 'evening' || phase === 'day-complete'
}

export function deriveDataState(input: {
  isToday: boolean
  isFuture: boolean
  hasMeals: boolean
  moveKj: number | null
}): DataState {
  if (input.isFuture) return 'no-data'
  const hasNutrition = input.hasMeals
  const hasMove = input.moveKj != null
  if (!hasNutrition && !hasMove) return 'no-data'
  if (hasNutrition !== hasMove) return 'partial'
  if (input.isToday) return 'live'
  return 'complete'
}

export function deriveNutrition(
  input: Pick<CompanionDayContext, 'caloriesConsumed' | 'targetCalories' | 'hasMeals'>,
  timeContext: DayPhase,
  dataState: DataState,
): NutritionState {
  if (dataState === 'no-data') return 'unknown'
  if (input.targetCalories == null || !input.hasMeals) return 'unknown'

  const over = input.caloriesConsumed - input.targetCalories
  if (over > COMPANION_THRESHOLDS.offTrackCalorieOverKcal) return 'significantly-over'
  if (over > COMPANION_THRESHOLDS.onTrackCalorieOverKcal) return 'over-target'

  const fraction = input.caloriesConsumed / input.targetCalories
  const remaining = input.targetCalories - input.caloriesConsumed
  const contextuallyLow = fraction < COMPANION_THRESHOLDS.lowIntakeFraction

  if (contextuallyLow && isFirmTime(timeContext)) return 'low'
  // Soft time: do not label under-intake as low yet.
  if (
    remaining <= input.targetCalories * COMPANION_THRESHOLDS.approachingRemainingFraction &&
    over <= 0
  ) {
    return 'approaching-target'
  }
  return 'within-range'
}

export function deriveMovement(
  input: Pick<CompanionDayContext, 'moveKj' | 'targetMoveKj'>,
  dataState: DataState,
): MovementState {
  if (dataState === 'no-data') return 'unknown'
  if (input.moveKj == null || input.targetMoveKj == null || input.targetMoveKj <= 0) {
    return 'unknown'
  }
  const ratio = input.moveKj / input.targetMoveKj
  if (ratio < COMPANION_THRESHOLDS.offTrackMoveRatio) return 'low'
  if (ratio < COMPANION_THRESHOLDS.onTrackMoveRatio) return 'moderate'
  if (ratio <= COMPANION_THRESHOLDS.highMoveRatio) return 'target-met'
  if (ratio <= COMPANION_THRESHOLDS.veryHighMoveRatio) return 'high'
  return 'very-high'
}

function daysBetween(start: string, end: string): number {
  const a = Date.parse(`${start}T00:00:00`)
  const b = Date.parse(`${end}T00:00:00`)
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.max(0, Math.round((b - a) / 86_400_000))
}

export function deriveGoalProgress(
  input: Pick<
    CompanionDayContext,
    'hasActiveGoal' | 'progressPercent' | 'goalStartDate' | 'goalTargetDate' | 'date'
  >,
  dataState: DataState,
): GoalProgressState {
  if (!input.hasActiveGoal || input.progressPercent == null) return 'unknown'
  // No-data days: keep goal influence quiet/neutral-level only (02 §6).
  if (dataState === 'no-data') return 'neutral'

  const p = input.progressPercent
  if (p <= COMPANION_THRESHOLDS.goalNeutralMaxPercent) return 'neutral'

  if (!input.goalStartDate || !input.goalTargetDate) {
    if (p < 25) return 'neutral'
    if (p < 75) return 'on-trajectory'
    return 'ahead-of-trajectory'
  }

  const total = daysBetween(input.goalStartDate, input.goalTargetDate)
  if (total <= 0) return 'neutral'
  const elapsed = daysBetween(input.goalStartDate, input.date)
  const expected = Math.min(100, (elapsed / total) * 100)
  const delta = p - expected
  const band = COMPANION_THRESHOLDS.goalQuietBandPoints
  if (delta < -band) return 'behind-trajectory'
  if (delta > band) return 'ahead-of-trajectory'
  return 'on-trajectory'
}

export function mapCompanionSemanticState(ctx: CompanionDayContext): CompanionSemanticState {
  const timeContext = deriveDayPhase(ctx)
  const dataState = deriveDataState(ctx)

  let nutrition = deriveNutrition(ctx, timeContext, dataState)
  let movement = deriveMovement(ctx, dataState)
  const goalProgress = deriveGoalProgress(ctx, dataState)

  if (dataState === 'no-data') {
    nutrition = 'unknown'
    movement = 'unknown'
  } else if (dataState === 'partial') {
    if (!ctx.hasMeals) nutrition = 'unknown'
    if (ctx.moveKj == null) movement = 'unknown'
  }

  return {
    nutrition,
    movement,
    goalProgress,
    dataState,
    timeContext,
  }
}

function resolvePosture(
  semantic: CompanionSemanticState,
): PostureToken {
  const { nutrition, movement, dataState, timeContext } = semantic
  if (dataState === 'no-data') return 'mannequin-stand'

  const firm = isFirmTime(timeContext)
  const nutritionKnown = nutrition !== 'unknown'
  const movementKnown = movement !== 'unknown'

  // Partial: only known dimension drives posture.
  if (dataState === 'partial') {
    if (nutritionKnown && !movementKnown) {
      if (nutrition === 'significantly-over') return 'over-full'
      if (nutrition === 'over-target') return 'mildly-full'
      if (nutrition === 'low' && firm) return 'low-fuel'
      return 'balanced'
    }
    if (movementKnown && !nutritionKnown) {
      if (movement === 'very-high') return 'high-exertion'
      if (movement === 'high') return 'exertion'
      if (movement === 'low' && firm) return 'under-moved'
      return 'balanced'
    }
  }

  if (nutrition === 'significantly-over') return 'over-full'
  if (nutrition === 'over-target') return 'mildly-full'
  if (movement === 'very-high') return 'high-exertion'
  if (movement === 'high') return 'exertion'
  if (nutrition === 'low' && firm) return 'low-fuel'
  if (movement === 'low' && firm) return 'under-moved'
  return 'balanced'
}

function movementFaceColumn(
  movement: MovementState,
): 'low-mod' | 'target' | 'high' | 'unknown' {
  if (movement === 'unknown') return 'unknown'
  if (movement === 'low' || movement === 'moderate') return 'low-mod'
  if (movement === 'target-met') return 'target'
  return 'high'
}

function resolveFace(
  semantic: CompanionSemanticState,
  posture: PostureToken,
  milestone?: boolean,
): FaceToken {
  if (semantic.dataState === 'no-data') return 'blank-neutral'
  if (milestone && posture !== 'mannequin-stand') return 'pleased'

  const { nutrition, movement } = semantic
  const col = movementFaceColumn(movement)

  if (nutrition === 'unknown' && movement === 'unknown') return 'neutral'
  if (nutrition === 'unknown') {
    if (col === 'high') return 'effort-content'
    if (col === 'low-mod') return 'attentive'
    return 'content'
  }
  if (movement === 'unknown') {
    if (nutrition === 'low') return 'low-fuel'
    if (nutrition === 'over-target' || nutrition === 'significantly-over') return 'full-soft'
    return 'attentive'
  }

  const nutRow =
    nutrition === 'low'
      ? 'low'
      : nutrition === 'over-target' || nutrition === 'significantly-over'
        ? 'over'
        : 'within'

  if (nutRow === 'low') {
    if (col === 'high') return 'effort-tired'
    if (col === 'target') return 'low-fuel'
    return 'concern-soft'
  }
  if (nutRow === 'over') {
    if (col === 'high') return 'full-effort'
    if (col === 'target') return 'full-content'
    return 'full-soft'
  }
  if (col === 'high') return 'effort-content'
  if (col === 'target') return 'content'
  return 'attentive'
}

function resolveBreathing(semantic: CompanionSemanticState): BreathingToken {
  if (semantic.movement === 'unknown') return 'resting'
  if (
    (semantic.movement === 'high' || semantic.movement === 'very-high') &&
    semantic.nutrition === 'low' &&
    isFirmTime(semantic.timeContext)
  ) {
    return 'recovery'
  }
  if (semantic.movement === 'very-high') return 'heavy'
  if (semantic.movement === 'high') return 'elevated'
  if (semantic.movement === 'target-met') return 'easy'
  return 'resting'
}

function resolveBodyForm(semantic: CompanionSemanticState): BodyFormToken {
  if (semantic.nutrition === 'unknown') return 'rest'
  if (semantic.nutrition === 'significantly-over' || semantic.nutrition === 'over-target') {
    return 'slight-fullness'
  }
  if (semantic.nutrition === 'low' && isFirmTime(semantic.timeContext)) return 'slight-tuck'
  return 'rest'
}

function resolveEffects(semantic: CompanionSemanticState): EffectsToken {
  if (semantic.movement === 'very-high') return 'sweat'
  if (semantic.movement === 'high') return 'light-sweat'
  return 'none'
}

function resolveAccent(
  semantic: CompanionSemanticState,
  posture: PostureToken,
  milestone?: boolean,
): AccentToken {
  if (semantic.dataState === 'no-data') return 'none'
  if (milestone || semantic.goalProgress === 'ahead-of-trajectory') return 'lime'
  if (
    posture === 'mildly-full' ||
    posture === 'over-full' ||
    posture === 'low-fuel' ||
    semantic.nutrition === 'over-target' ||
    semantic.nutrition === 'significantly-over'
  ) {
    return 'coral'
  }
  if (
    posture === 'exertion' ||
    posture === 'high-exertion' ||
    semantic.movement === 'high' ||
    semantic.movement === 'very-high'
  ) {
    return 'lavender'
  }
  return 'none'
}

function resolveIdle(semantic: CompanionSemanticState, posture: PostureToken): IdleToken {
  if (semantic.dataState === 'no-data') return 'subdued'
  if (
    posture === 'low-fuel' ||
    posture === 'under-moved' ||
    posture === 'over-full' ||
    posture === 'mildly-full'
  ) {
    return 'minimal'
  }
  if (posture === 'exertion' || posture === 'high-exertion') return 'recovery'
  return 'soft'
}

function resolveConfidenceBias(goal: GoalProgressState): -1 | 0 | 1 {
  if (goal === 'behind-trajectory') return -1
  if (goal === 'ahead-of-trajectory') return 1
  return 0
}

function compositionIdFrom(
  semantic: CompanionSemanticState,
  posture: PostureToken,
  milestone?: boolean,
): CompositionId {
  if (semantic.dataState === 'no-data') return 'mannequin'
  if (milestone) return 'milestone'
  if (semantic.dataState === 'partial') {
    if (semantic.nutrition !== 'unknown' && semantic.movement === 'unknown') {
      return 'partial-nutrition-only'
    }
    if (semantic.movement !== 'unknown' && semantic.nutrition === 'unknown') {
      return 'partial-movement-only'
    }
  }
  switch (posture) {
    case 'over-full':
      return 'over-full'
    case 'mildly-full':
      return 'mildly-full'
    case 'high-exertion':
      return 'high-exertion'
    case 'exertion':
      return 'exertion'
    case 'low-fuel':
      return 'low-fuel'
    case 'under-moved':
      return 'under-moved'
    default:
      return 'balanced'
  }
}

export function resolveCompanionBehaviour(
  semantic: CompanionSemanticState,
  options: { milestone?: boolean } = {},
): ResolvedBehaviour {
  const milestone = options.milestone
  const posture = resolvePosture(semantic)
  const face = resolveFace(semantic, posture, milestone)
  return {
    compositionId: compositionIdFrom(semantic, posture, milestone),
    posture,
    face,
    breathing: resolveBreathing(semantic),
    bodyForm: resolveBodyForm(semantic),
    effects: resolveEffects(semantic),
    materialAccent: resolveAccent(semantic, posture, milestone),
    idle: resolveIdle(semantic, posture),
    confidenceBias: resolveConfidenceBias(semantic.goalProgress),
  }
}

export type CompanionContractResult = {
  semantic: CompanionSemanticState
  behaviour: ResolvedBehaviour
}

/** Full pure pipeline: selected-day context → semantic → resolved layers. */
export function resolveCompanionState(ctx: CompanionDayContext): CompanionContractResult {
  const semantic = mapCompanionSemanticState(ctx)
  const behaviour = resolveCompanionBehaviour(semantic, { milestone: ctx.milestone })
  return { semantic, behaviour }
}
