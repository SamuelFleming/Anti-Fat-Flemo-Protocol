import type {
  AccentToken,
  BodyFormToken,
  BreathingToken,
  EffectsToken,
  FaceToken,
  IdleToken,
  PostureToken,
  ResolvedBehaviour,
} from '../../features/companion/companionState'

/** Static pose targets + pure motion parameters (3009 poses, 3010 animation). */

export type PoseVisual = {
  opacity: number
  torsoScale: [number, number, number]
  armSpread: number
  /** Arms forward toward torso (hand-near-midsection cue). */
  armReachZ: number
  armLift: number
  legSpread: number
  leanZ: number
  eyeScale: number
  eyeOpen: number
  mouthCurve: number
  mouthOpen: number
  accent: AccentToken
}

const ACCENT_HEX: Record<Exclude<AccentToken, 'none'>, string> = {
  coral: '#f2898d',
  lavender: '#c7bdf7',
  lime: '#ddf38a',
}

export function accentHex(accent: AccentToken): string | null {
  if (accent === 'none') return null
  return ACCENT_HEX[accent]
}

function faceTargets(face: FaceToken): Pick<PoseVisual, 'eyeScale' | 'eyeOpen' | 'mouthCurve' | 'mouthOpen'> {
  switch (face) {
    case 'blank-neutral':
    case 'neutral':
      return { eyeScale: 1, eyeOpen: 1, mouthCurve: 0, mouthOpen: 0 }
    case 'content':
    case 'pleased':
      return { eyeScale: 0.95, eyeOpen: 1, mouthCurve: face === 'pleased' ? 0.7 : 0.45, mouthOpen: 0 }
    case 'attentive':
      return { eyeScale: 1.05, eyeOpen: 1, mouthCurve: 0.1, mouthOpen: 0 }
    case 'concern-soft':
    case 'low-fuel':
      return { eyeScale: 0.9, eyeOpen: 0.85, mouthCurve: -0.25, mouthOpen: 0 }
    case 'effort-content':
    case 'full-effort':
      return { eyeScale: 1.15, eyeOpen: 1.1, mouthCurve: 0.15, mouthOpen: 0.35 }
    case 'effort-tired':
      return { eyeScale: 1.05, eyeOpen: 0.9, mouthCurve: -0.1, mouthOpen: 0.25 }
    case 'full-soft':
      return { eyeScale: 0.95, eyeOpen: 1, mouthCurve: 0, mouthOpen: 0 }
    case 'full-content':
      return { eyeScale: 0.95, eyeOpen: 1, mouthCurve: 0.35, mouthOpen: 0 }
    default:
      return { eyeScale: 1, eyeOpen: 1, mouthCurve: 0, mouthOpen: 0 }
  }
}

function bodyScale(bodyForm: BodyFormToken, posture: PostureToken): [number, number, number] {
  if (bodyForm === 'slight-fullness' || posture === 'mildly-full') return [1.08, 0.98, 1.1]
  if (posture === 'over-full') return [1.14, 0.95, 1.16]
  if (bodyForm === 'slight-tuck' || posture === 'low-fuel') return [0.94, 1.02, 0.94]
  if (posture === 'high-exertion') return [1.06, 1.06, 1.06]
  if (posture === 'exertion') return [1.03, 1.03, 1.03]
  return [1, 1, 1]
}

/**
 * Procedural motion channels per 05_Animation-Vocabulary (§3 breathing, §4 idle, §7 effects).
 * Pure mapping from behaviour tokens; renderer applies oscillators. Reduced motion zeroes loops.
 */
export type MotionParams = {
  /** Breath cycles per second. */
  breathRate: number
  /** Torso scale amplitude of one breath (bounded). */
  breathAmplitude: number
  /** Idle sway angle amplitude (radians). */
  idleSwayAmplitude: number
  /** Idle sway cycles per second. */
  idleSwaySpeed: number
  /** Sweat sheen strength 0–1. */
  sweatIntensity: number
  /** Accent glow strength 0–1. */
  accentIntensity: number
  /** Damping lambda for transitions toward targets (higher = snappier). */
  transitionSpeed: number
}

/** Motion Rules: fresh load vs live data vs selected-day change. */
export type TransitionKind = 'settle' | 'live-update' | 'day-change'

export type GestureId = 'none' | 'hand-to-torso' | 'recovery-stretch' | 'pleased-pulse'

export const TRANSITION_SPEED: Record<TransitionKind, number> = {
  settle: 2.6,
  'live-update': 4.4,
  'day-change': 2.0,
}

export function companionTransitionKind(
  previousDate: string | undefined,
  nextDate: string,
): TransitionKind {
  if (previousDate == null) return 'settle'
  if (previousDate !== nextDate) return 'day-change'
  return 'live-update'
}

export function gestureForTransition(
  previous: ResolvedBehaviour | null,
  next: ResolvedBehaviour,
): GestureId {
  if (!previous) return 'none'
  if (next.compositionId === 'milestone' && previous.compositionId !== 'milestone') {
    return 'pleased-pulse'
  }
  const nextFull = next.posture === 'mildly-full' || next.posture === 'over-full'
  const prevFull = previous.posture === 'mildly-full' || previous.posture === 'over-full'
  if (nextFull && !prevFull) return 'hand-to-torso'
  if (next.posture === 'high-exertion' && previous.posture !== 'high-exertion') {
    return 'recovery-stretch'
  }
  return 'none'
}

const BREATH: Record<BreathingToken, { rate: number; amplitude: number }> = {
  resting: { rate: 0.22, amplitude: 0.008 },
  easy: { rate: 0.3, amplitude: 0.014 },
  elevated: { rate: 0.5, amplitude: 0.022 },
  heavy: { rate: 0.68, amplitude: 0.032 },
  recovery: { rate: 0.36, amplitude: 0.024 },
}

const IDLE: Record<IdleToken, { amplitude: number; speed: number }> = {
  subdued: { amplitude: 0.004, speed: 0.08 },
  minimal: { amplitude: 0.012, speed: 0.12 },
  soft: { amplitude: 0.028, speed: 0.16 },
  recovery: { amplitude: 0.018, speed: 0.1 },
}

const SWEAT: Record<EffectsToken, number> = {
  none: 0,
  'light-sweat': 0.45,
  sweat: 0.85,
}

export function motionParamsFromBehaviour(
  behaviour: ResolvedBehaviour,
  transitionKind: TransitionKind = 'live-update',
): MotionParams {
  const breath = BREATH[behaviour.breathing]
  const idle = IDLE[behaviour.idle]
  return {
    breathRate: breath.rate,
    breathAmplitude: breath.amplitude,
    idleSwayAmplitude: idle.amplitude,
    idleSwaySpeed: idle.speed,
    sweatIntensity: SWEAT[behaviour.effects],
    accentIntensity: behaviour.materialAccent === 'none' ? 0 : 0.9,
    transitionSpeed: TRANSITION_SPEED[transitionKind],
  }
}

/** Neutral starting values for fresh-load settle-in (mannequin per Motion Rules). */
export const MANNEQUIN_VISUAL: PoseVisual = {
  opacity: 0.7,
  torsoScale: [1, 1, 1],
  armSpread: 0.4,
  armReachZ: 0,
  armLift: 0,
  legSpread: 0.18,
  leanZ: 0,
  eyeScale: 1,
  eyeOpen: 1,
  mouthCurve: 0,
  mouthOpen: 0,
  accent: 'none',
}

export function poseVisualFromBehaviour(behaviour: ResolvedBehaviour): PoseVisual {
  const { posture, face, bodyForm, materialAccent, compositionId } = behaviour
  const facePart = faceTargets(face)

  let opacity = 1
  let armSpread = 0.44
  let armReachZ = 0
  let armLift = 0
  let legSpread = 0.18
  let leanZ = 0

  switch (posture) {
    case 'mannequin-stand':
      opacity = 0.7
      armSpread = 0.4
      break
    case 'balanced':
      armSpread = 0.46
      legSpread = 0.2
      break
    case 'mildly-full':
      leanZ = -0.06
      armSpread = 0.38
      armReachZ = 0.12
      legSpread = 0.2
      break
    case 'over-full':
      leanZ = -0.1
      armSpread = 0.34
      armReachZ = 0.18
      legSpread = 0.22
      break
    case 'exertion':
      armSpread = 0.55
      legSpread = 0.26
      armLift = 0.08
      break
    case 'high-exertion':
      armSpread = 0.62
      legSpread = 0.3
      armLift = 0.16
      break
    case 'low-fuel':
      armSpread = 0.32
      legSpread = 0.14
      leanZ = 0.02
      break
    case 'under-moved':
      armSpread = 0.36
      legSpread = 0.16
      break
  }

  if (compositionId === 'mannequin') opacity = Math.min(opacity, 0.7)
  if (compositionId === 'milestone') {
    armSpread = Math.max(armSpread, 0.5)
    legSpread = Math.max(legSpread, 0.22)
  }

  return {
    opacity,
    torsoScale: bodyScale(bodyForm, posture),
    armSpread,
    armReachZ,
    armLift,
    legSpread,
    leanZ,
    accent: materialAccent,
    ...facePart,
  }
}
