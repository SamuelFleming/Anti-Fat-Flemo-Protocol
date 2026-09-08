import { describe, expect, it } from 'vitest'
import {
  mapCompanionSemanticState,
  resolveCompanionState,
  type CompanionDayContext,
} from './companionState'

function base(overrides: Partial<CompanionDayContext> = {}): CompanionDayContext {
  return {
    date: '2026-09-09',
    isToday: true,
    isFuture: false,
    caloriesConsumed: 1500,
    targetCalories: 1800,
    moveKj: 1700,
    targetMoveKj: 1800,
    hasMeals: true,
    progressPercent: 40,
    goalStartDate: '2026-07-01',
    goalTargetDate: '2026-12-31',
    hasActiveGoal: true,
    clockHourLocal: 15,
    ...overrides,
  }
}

describe('companionState contract', () => {
  it('maps an on-track live afternoon day to balanced content behaviour', () => {
    const { semantic, behaviour } = resolveCompanionState(base())
    expect(semantic.dataState).toBe('live')
    expect(semantic.nutrition).toBe('within-range')
    expect(semantic.movement).toBe('target-met')
    expect(behaviour.compositionId).toBe('balanced')
    expect(behaviour.posture).toBe('balanced')
    expect(behaviour.face).toBe('content')
    expect(behaviour.effects).toBe('none')
  })

  it('resolves the 3003 conflict example: over-target + very-high Move at evening', () => {
    // 02/03 worked example: nutrition over-target, movement very-high, evening
    const { semantic, behaviour } = resolveCompanionState(
      base({
        caloriesConsumed: 1950,
        moveKj: 2800,
        clockHourLocal: 21,
      }),
    )
    expect(semantic.nutrition).toBe('over-target')
    expect(semantic.movement).toBe('very-high')
    expect(semantic.timeContext).toBe('evening')
    expect(behaviour.posture).toBe('mildly-full')
    expect(behaviour.face).toBe('full-effort')
    expect(behaviour.bodyForm).toBe('slight-fullness')
    expect(behaviour.effects).toBe('sweat')
    expect(behaviour.breathing).toBe('heavy')
    expect(behaviour.compositionId).toBe('mildly-full')
  })

  it('treats no-data as mannequin / unknown (never low-fuel)', () => {
    const { semantic, behaviour } = resolveCompanionState(
      base({
        hasMeals: false,
        caloriesConsumed: 0,
        moveKj: null,
      }),
    )
    expect(semantic.dataState).toBe('no-data')
    expect(semantic.nutrition).toBe('unknown')
    expect(semantic.movement).toBe('unknown')
    expect(behaviour.compositionId).toBe('mannequin')
    expect(behaviour.posture).toBe('mannequin-stand')
    expect(behaviour.face).toBe('blank-neutral')
  })

  it('keeps future days as no-data mannequin', () => {
    const { semantic, behaviour } = resolveCompanionState(
      base({
        isToday: false,
        isFuture: true,
        hasMeals: false,
        moveKj: null,
        caloriesConsumed: 0,
      }),
    )
    expect(semantic.dataState).toBe('no-data')
    expect(behaviour.compositionId).toBe('mannequin')
  })

  it('expresses partial Move-only historical days without inventing nutrition cues', () => {
    const { semantic, behaviour } = resolveCompanionState(
      base({
        date: '2026-09-04',
        isToday: false,
        isFuture: false,
        hasMeals: false,
        caloriesConsumed: 0,
        moveKj: 900,
        targetMoveKj: 1800,
        clockHourLocal: 12,
      }),
    )
    expect(semantic.dataState).toBe('partial')
    expect(semantic.nutrition).toBe('unknown')
    expect(semantic.movement).toBe('low')
    expect(semantic.timeContext).toBe('day-complete')
    expect(behaviour.compositionId).toBe('partial-movement-only')
    expect(behaviour.posture).toBe('under-moved')
    expect(behaviour.bodyForm).toBe('rest')
    expect(behaviour.effects).toBe('none')
  })

  it('does not label morning under-intake as low (time-aware nutrition)', () => {
    const morning = mapCompanionSemanticState(
      base({
        caloriesConsumed: 600,
        clockHourLocal: 10,
      }),
    )
    expect(morning.timeContext).toBe('morning')
    expect(morning.nutrition).toBe('within-range')

    const evening = mapCompanionSemanticState(
      base({
        caloriesConsumed: 600,
        clockHourLocal: 21,
      }),
    )
    expect(evening.timeContext).toBe('evening')
    expect(evening.nutrition).toBe('low')
  })

  it('uses firm day-complete low-fuel for a completed historical under-intake day', () => {
    const { semantic, behaviour } = resolveCompanionState(
      base({
        date: '2026-09-03',
        isToday: false,
        isFuture: false,
        caloriesConsumed: 600,
        moveKj: 1700,
        clockHourLocal: 10,
      }),
    )
    expect(semantic.dataState).toBe('complete')
    expect(semantic.timeContext).toBe('day-complete')
    expect(semantic.nutrition).toBe('low')
    expect(behaviour.compositionId).toBe('low-fuel')
    expect(behaviour.posture).toBe('low-fuel')
  })
})
