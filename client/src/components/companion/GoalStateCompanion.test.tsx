import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GoalStateCompanion } from './GoalStateCompanion'
import type { CompanionDayContext } from '../../features/companion/companionState'

const noData: CompanionDayContext = {
  date: '2026-09-09',
  isToday: true,
  isFuture: false,
  caloriesConsumed: 0,
  targetCalories: 1800,
  moveKj: null,
  targetMoveKj: 1800,
  hasMeals: false,
  progressPercent: null,
  goalStartDate: null,
  goalTargetDate: null,
  hasActiveGoal: false,
  clockHourLocal: 12,
}

const balanced: CompanionDayContext = {
  ...noData,
  hasMeals: true,
  caloriesConsumed: 1500,
  moveKj: 1700,
  progressPercent: 40,
  goalStartDate: '2026-07-01',
  goalTargetDate: '2026-12-31',
  hasActiveGoal: true,
  clockHourLocal: 15,
}

const overTarget: CompanionDayContext = {
  ...balanced,
  caloriesConsumed: 1950,
  clockHourLocal: 21,
}

describe('GoalStateCompanion', () => {
  it('renders mannequin composition for no-data without throwing', () => {
    render(
      <div data-testid="host">
        <GoalStateCompanion context={noData} />
      </div>,
    )
    expect(screen.getByTestId('host')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /no data/i })).toHaveAttribute(
      'data-composition',
      'mannequin',
    )
  })

  it('resolves balanced and mildly-full compositions from context only', () => {
    const { rerender } = render(<GoalStateCompanion context={balanced} />)
    expect(screen.getByRole('img')).toHaveAttribute('data-composition', 'balanced')
    expect(screen.getByRole('img')).toHaveAttribute('data-transition-kind', 'settle')

    rerender(<GoalStateCompanion context={overTarget} />)
    expect(screen.getByRole('img')).toHaveAttribute('data-composition', 'mildly-full')
    expect(screen.getByRole('img')).toHaveAttribute('data-transition-kind', 'live-update')
    expect(screen.getByRole('img')).toHaveAttribute('data-gesture', 'hand-to-torso')
  })

  it('cross-fades a historical day without treating it as a fresh-load settle', () => {
    const historical: CompanionDayContext = {
      ...overTarget,
      date: '2026-09-03',
      isToday: false,
      clockHourLocal: 9,
    }
    const { rerender } = render(<GoalStateCompanion context={balanced} />)
    rerender(<GoalStateCompanion context={historical} />)
    expect(screen.getByRole('img')).toHaveAttribute('data-transition-kind', 'day-change')
    expect(screen.getByRole('img')).toHaveAttribute('data-composition', 'mildly-full')
  })
})
