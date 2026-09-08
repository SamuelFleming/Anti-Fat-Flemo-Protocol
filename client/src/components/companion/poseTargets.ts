import type {
  AccentToken,
  BodyFormToken,
  FaceToken,
  PostureToken,
  ResolvedBehaviour,
} from '../../features/companion/companionState'

/** Static visual targets for the MVP prototype (no animation). */

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
