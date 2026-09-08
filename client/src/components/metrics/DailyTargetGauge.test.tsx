import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DailyTargetGauge } from './DailyTargetGauge'

describe('DailyTargetGauge', () => {
  it('renders current/target values for calories', () => {
    render(<DailyTargetGauge label="Calories" value={1420} target={1800} unit="kcal" metric="calories" />)
    expect(screen.getByText('1,420')).toBeInTheDocument()
    expect(screen.getByText('/ 1,800 kcal')).toBeInTheDocument()
    expect(screen.getByText('380 kcal remaining')).toBeInTheDocument()
  })

  it('shows an explicit missing-data state rather than zero', () => {
    render(<DailyTargetGauge label="Move" value={null} target={1800} unit="kJ" metric="move" />)
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('reports exact overrun without wrapping', () => {
    render(<DailyTargetGauge label="Calories" value={1950} target={1800} unit="kcal" metric="calories" />)
    expect(screen.getByText('150 kcal over target')).toBeInTheDocument()
  })

  it('renders the compact variant without the label/subtext block', () => {
    render(<DailyTargetGauge label="Move" value={900} target={1800} unit="kJ" metric="move" variant="compact" />)
    expect(screen.queryByText('Move')).not.toBeInTheDocument()
  })
})
