import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GoalJourneyTrack } from './GoalJourneyTrack'

describe('GoalJourneyTrack', () => {
  it('renders start, current and goal values', () => {
    render(<GoalJourneyTrack startWeightKg={82} currentWeightKg={80.7} targetWeightKg={76} />)
    expect(screen.getByText('82.0 kg')).toBeInTheDocument()
    expect(screen.getByText('80.7 kg')).toBeInTheDocument()
    expect(screen.getByText('76.0 kg')).toBeInTheDocument()
  })

  it('shows a missing-data state when no current weight exists', () => {
    render(<GoalJourneyTrack startWeightKg={82} currentWeightKg={null} targetWeightKg={76} />)
    expect(screen.getByText('No weight yet')).toBeInTheDocument()
  })

  it('flags regression beyond the starting point without erroring', () => {
    render(<GoalJourneyTrack startWeightKg={82} currentWeightKg={84} targetWeightKg={76} />)
    expect(screen.getByText(/beyond the starting point/)).toBeInTheDocument()
  })

  it('flags overshoot beyond the goal', () => {
    render(<GoalJourneyTrack startWeightKg={82} currentWeightKg={74} targetWeightKg={76} />)
    expect(screen.getByText(/past the goal/)).toBeInTheDocument()
  })

  it('offers an expandable history view when history is provided', () => {
    render(
      <GoalJourneyTrack
        startWeightKg={82}
        currentWeightKg={80.7}
        targetWeightKg={76}
        history={[
          { date: '2026-09-01', weightKg: 82 },
          { date: '2026-09-08', weightKg: 80.7 },
        ]}
      />,
    )
    expect(screen.getByText('Show weight history')).toBeInTheDocument()
  })
})
