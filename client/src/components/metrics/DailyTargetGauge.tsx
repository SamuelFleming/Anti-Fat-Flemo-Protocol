import { useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { GAUGE_START_ANGLE, GAUGE_SWEEP_DEGREES, describeArc } from './arc'
import { formatNumber } from '../../utils/format'

export type DailyTargetGaugeMetric = 'calories' | 'move'

export type DailyTargetGaugeProps = {
  label: string
  /** Current value; `null` means genuinely unrecorded, distinct from `0`. */
  value: number | null
  target: number
  unit: string
  metric: DailyTargetGaugeMetric
  variant?: 'default' | 'compact'
  className?: string
}

const METRIC_COLOR_VAR: Record<DailyTargetGaugeMetric, string> = {
  calories: 'var(--color-coral)',
  move: 'var(--color-lavender)',
}

const MAX_OVERRUN_DEGREES = 26

export function DailyTargetGauge({
  label,
  value,
  target,
  unit,
  metric,
  variant = 'default',
  className = '',
}: DailyTargetGaugeProps) {
  const reduceMotion = useReducedMotion()
  const size = variant === 'compact' ? 96 : 176
  const strokeWidth = variant === 'compact' ? 8 : 12
  const radius = size / 2 - strokeWidth
  const center = size / 2

  const fraction = useMotionValue(0)
  const overrun = useMotionValue(0)

  const hasValue = value != null
  const rawFraction = hasValue && target > 0 ? value / target : 0
  const targetFraction = Math.min(1, Math.max(0, rawFraction))
  const overshootRatio = hasValue && target > 0 && value > target ? (value - target) / target : 0
  const overrunDegrees = overshootRatio > 0 ? Math.min(MAX_OVERRUN_DEGREES, Math.sqrt(overshootRatio) * 22) : 0

  useEffect(() => {
    const transition = reduceMotion
      ? { duration: 0 }
      : { type: 'spring' as const, stiffness: 90, damping: 18 }
    const controlsA = animate(fraction, targetFraction, transition)
    const controlsB = animate(overrun, overrunDegrees, transition)
    return () => {
      controlsA.stop()
      controlsB.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetFraction, overrunDegrees, reduceMotion])

  const trackPath = describeArc(center, center, radius, GAUGE_START_ANGLE, GAUGE_SWEEP_DEGREES)
  const progressPath = useTransform(fraction, (f) =>
    describeArc(center, center, radius, GAUGE_START_ANGLE, GAUGE_SWEEP_DEGREES * f),
  )
  const overrunPath = useTransform(overrun, (deg) =>
    describeArc(center, center, radius, GAUGE_START_ANGLE + GAUGE_SWEEP_DEGREES, deg),
  )

  const color = METRIC_COLOR_VAR[metric]
  const remaining = hasValue ? target - value : null
  const isOver = remaining != null && remaining < 0

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label} ${hasValue ? `${formatNumber(value)} of ${formatNumber(target)} ${unit}` : `not recorded, target ${formatNumber(target)} ${unit}`}`}>
          <path
            d={trackPath}
            fill="none"
            stroke="color-mix(in srgb, var(--color-ink) 10%, transparent)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {hasValue ? (
            <>
              <motion.path d={progressPath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
              {overshootRatio > 0 ? (
                <motion.path
                  d={overrunPath}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={strokeWidth * 0.55}
                  strokeLinecap="round"
                />
              ) : null}
            </>
          ) : (
            <path
              d={describeArc(center, center, radius, GAUGE_START_ANGLE, 6)}
              fill="none"
              stroke="color-mix(in srgb, var(--color-ink) 30%, transparent)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray="2 6"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={variant === 'compact' ? 'text-lg font-semibold' : 'text-2xl font-semibold'}
            style={{ color: hasValue ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}
          >
            {hasValue ? formatNumber(value) : '—'}
          </span>
          <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
            / {formatNumber(target)} {unit}
          </span>
        </div>
      </div>

      {variant === 'default' ? (
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color }}>
            {label}
          </p>
          <p className="text-xs text-[var(--color-ink-muted)]">
            {!hasValue
              ? 'No data'
              : isOver
                ? `${formatNumber(Math.abs(remaining!))} ${unit} over target`
                : `${formatNumber(remaining!)} ${unit} remaining`}
          </p>
        </div>
      ) : null}
    </div>
  )
}
