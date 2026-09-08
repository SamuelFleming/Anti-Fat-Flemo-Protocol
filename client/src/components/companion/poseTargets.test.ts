import { describe, expect, it } from 'vitest'
import {
  resolveCompanionBehaviour,
  type CompanionSemanticState,
} from '../../features/companion/companionState'
import {
  MANNEQUIN_VISUAL,
  TRANSITION_SPEED,
  companionTransitionKind,
  gestureForTransition,
  motionParamsFromBehaviour,
  poseVisualFromBehaviour,
} from './poseTargets'

function semantic(overrides: Partial<CompanionSemanticState> = {}): CompanionSemanticState {
  return {
    nutrition: 'within-range',
    movement: 'target-met',
    goalProgress: 'on-trajectory',
    dataState: 'live',
    timeContext: 'afternoon',
    ...overrides,
  }
}

describe('poseTargets motion params (3010 pure logic)', () => {
  it('maps heavy exertion breathing above resting rate and amplitude', () => {
    const resting = motionParamsFromBehaviour(resolveCompanionBehaviour(semantic()))
    const heavy = motionParamsFromBehaviour(
      resolveCompanionBehaviour(semantic({ movement: 'very-high' })),
    )
    expect(heavy.breathRate).toBeGreaterThan(resting.breathRate)
    expect(heavy.breathAmplitude).toBeGreaterThan(resting.breathAmplitude)
    expect(heavy.sweatIntensity).toBeGreaterThan(0.5)
  })

  it('keeps the no-data mannequin near-static with no effects or accent', () => {
    const behaviour = resolveCompanionBehaviour(
      semantic({ nutrition: 'unknown', movement: 'unknown', dataState: 'no-data' }),
    )
    const motion = motionParamsFromBehaviour(behaviour)
    expect(motion.idleSwayAmplitude).toBeLessThan(0.01)
    expect(motion.sweatIntensity).toBe(0)
    expect(motion.accentIntensity).toBe(0)

    const visual = poseVisualFromBehaviour(behaviour)
    expect(visual.opacity).toBeLessThanOrEqual(0.7)
  })

  it('uses recovery breathing for firm low-fuel + high Move', () => {
    const behaviour = resolveCompanionBehaviour(
      semantic({ nutrition: 'low', movement: 'very-high', timeContext: 'evening' }),
    )
    expect(behaviour.breathing).toBe('recovery')
    const motion = motionParamsFromBehaviour(behaviour)
    const heavy = motionParamsFromBehaviour(
      resolveCompanionBehaviour(semantic({ movement: 'very-high' })),
    )
    expect(motion.breathRate).toBeLessThan(heavy.breathRate)
    expect(motion.breathAmplitude).toBeGreaterThan(0)
  })

  it('exports a neutral mannequin start pose for fresh-load settle-in', () => {
    expect(MANNEQUIN_VISUAL.opacity).toBe(0.7)
    expect(MANNEQUIN_VISUAL.accent).toBe('none')
    expect(MANNEQUIN_VISUAL.torsoScale).toEqual([1, 1, 1])
  })

  it('classifies settle, live-update, and day-change from selected-day identity', () => {
    expect(companionTransitionKind(undefined, '2026-09-09')).toBe('settle')
    expect(companionTransitionKind('2026-09-09', '2026-09-09')).toBe('live-update')
    expect(companionTransitionKind('2026-09-09', '2026-09-03')).toBe('day-change')
    expect(TRANSITION_SPEED['day-change']).toBeLessThan(TRANSITION_SPEED['live-update'])
  })

  it('applies slower damping on historical day-change than on same-day live updates', () => {
    const behaviour = resolveCompanionBehaviour(semantic())
    const live = motionParamsFromBehaviour(behaviour, 'live-update')
    const day = motionParamsFromBehaviour(behaviour, 'day-change')
    expect(day.transitionSpeed).toBeLessThan(live.transitionSpeed)
  })

  it('picks sparse gestures on composition entry, not on first paint', () => {
    const balanced = resolveCompanionBehaviour(semantic())
    const full = resolveCompanionBehaviour(semantic({ nutrition: 'over-target' }))
    const exertion = resolveCompanionBehaviour(semantic({ movement: 'very-high' }))
    const milestone = resolveCompanionBehaviour(semantic(), { milestone: true })

    expect(gestureForTransition(null, full)).toBe('none')
    expect(gestureForTransition(balanced, full)).toBe('hand-to-torso')
    expect(gestureForTransition(balanced, exertion)).toBe('recovery-stretch')
    expect(gestureForTransition(balanced, milestone)).toBe('pleased-pulse')
    expect(gestureForTransition(full, full)).toBe('none')
  })
})
