import { motion, useReducedMotion } from 'motion/react'

export type MetricBarChartPoint = { date: string; value: number | null; target: number | null }

export type MetricBarChartProps = {
  points: MetricBarChartPoint[]
  color: string
  unit: string
  label: string
  className?: string
}

/** Owned SVG bar chart with a historical target reference line. Exact values live in the history table. */
export function MetricBarChart({ points, color, unit, label, className = '' }: MetricBarChartProps) {
  const reduceMotion = useReducedMotion()
  const width = 640
  const height = 200
  const padding = 24

  const values = points.map((p) => p.value ?? 0).concat(points.map((p) => p.target ?? 0))
  const max = Math.max(1, ...values)
  const barWidth = Math.max(2, (width - padding * 2) / points.length - 4)

  const xFor = (index: number) => padding + index * ((width - padding * 2) / points.length)
  const yFor = (value: number) => height - padding - (value / max) * (height - padding * 2)

  const targetPath = points
    .map((point, index) =>
      point.target != null ? `${index === 0 ? 'M' : 'L'} ${xFor(index) + barWidth / 2} ${yFor(point.target)}` : null,
    )
    .filter((segment): segment is string => segment != null)
    .join(' ')

  if (points.length === 0) {
    return (
      <div
        className={`flex h-48 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[color-mix(in_srgb,var(--color-moss)_25%,transparent)] text-sm text-[var(--color-ink-muted)] ${className}`}
      >
        No data in this range yet.
      </div>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${label} trend over the selected range; see the table below for exact values`}
      className={`h-48 w-full ${className}`}
    >
      {points.map((point, index) =>
        point.value != null ? (
          <motion.rect
            key={point.date}
            x={xFor(index)}
            width={barWidth}
            rx={2}
            fill={color}
            initial={reduceMotion ? false : { height: 0, y: height - padding }}
            animate={{ height: Math.max(0, height - padding - yFor(point.value)), y: yFor(point.value) }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.35, delay: index * 0.01 }}
          >
            <title>
              {point.date}: {point.value} {unit}
            </title>
          </motion.rect>
        ) : null,
      )}
      {targetPath ? (
        <path d={targetPath} fill="none" stroke="var(--color-ink)" strokeDasharray="4 4" strokeWidth={1} />
      ) : null}
    </svg>
  )
}
