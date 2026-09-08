import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeeklyAccountabilityRibbon, type RibbonDay } from './WeeklyAccountabilityRibbon'

function buildDays(): RibbonDay[] {
  const statuses: (RibbonDay['status'])[] = ['on-track', 'on-track', 'partial', 'off-track', 'awaiting-data', null, null]
  return statuses.map((status, index) => ({
    date: `2026-09-0${index + 1}`,
    status,
    isFuture: index >= 5,
    isToday: index === 4,
    caloriesConsumed: status ? 1700 : 0,
    moveKj: status ? 1600 : null,
  }))
}

describe('WeeklyAccountabilityRibbon', () => {
  it('renders seven connected day controls and weekly summary stats', () => {
    render(
      <WeeklyAccountabilityRibbon
        days={buildDays()}
        selectedDate="2026-09-05"
        onSelectDate={vi.fn()}
        averageCalories={1710}
        averageMoveKj={1650}
        weightChangeKg={-0.4}
      />,
    )

    expect(screen.getAllByRole('button', { name: /Sep/i })).toHaveLength(7)
    expect(screen.getByText('1,710 kcal')).toBeInTheDocument()
    expect(screen.getByText('2 on track · 1 partial · 1 off track')).toBeInTheDocument()
  })

  it('disables future days so they cannot be selected', () => {
    render(
      <WeeklyAccountabilityRibbon
        days={buildDays()}
        selectedDate="2026-09-05"
        onSelectDate={vi.fn()}
        averageCalories={null}
        averageMoveKj={null}
        weightChangeKg={null}
      />,
    )

    const futureButtons = screen.getAllByRole('button', { name: /Upcoming/i })
    expect(futureButtons.length).toBeGreaterThan(0)
    for (const button of futureButtons) {
      expect(button).toBeDisabled()
    }
  })
})
