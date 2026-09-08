import { motion, useReducedMotion } from 'motion/react'

export type WeightLineChartPoint = { date: string; weightKg: number }

export type WeightLineChartProps = {
  points: WeightLineChartPoint[]
  targetWeightKg?: number | null
  className?: string
}

/** Owned SVG line chart for weight-over-time. Exact values live in the accompanying history table. */
export function WeightLineChart({ points, targetWeightKg, className = '' }: WeightLineChartProps) {
  const reduceMotion = useReducedMotion()
  const width = 640
  const height = 200
  const padding = 28

  if (points.length === 0) {
    return (
      <div
        className={`flex h-48 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[color-mix(in_srgb,var(--color-moss)_25%,transparent)] text-sm text-[var(--color-ink-muted)] ${className}`}
      >
        No weight entries in this range yet.
      </div>
    )
  }

  const values = points.map((p) => p.weightKg).concat(targetWeightKg != null ? [targetWeightKg] : [])
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const xFor = (index: number) =>
    padding + (index / Math.max(1, points.length - 1)) * (width - padding * 2)
  const yFor = (weight: number) => height - padding - ((weight - min) / range) * (height - padding * 2)

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(point.weightKg)}`)
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Weight trend over the selected range; see the table below for exact values"
      className={`h-48 w-full ${className}`}
    >
      {targetWeightKg != null ? (
        <line
          x1={padding}
          x2={width - padding}
          y1={yFor(targetWeightKg)}
          y2={yFor(targetWeightKg)}
          stroke="var(--color-coral)"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
      ) : null}
      <motion.path
        d={linePath}
        fill="none"
        stroke="var(--color-moss)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
      />
      {points.map((point, index) => (
        <circle
          key={point.date}
          cx={xFor(index)}
          cy={yFor(point.weightKg)}
          r={3}
          fill="var(--color-lime)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        >
          <title>
            {point.date}: {point.weightKg} kg
          </title>
        </circle>
      ))}
    </svg>
  )
}
