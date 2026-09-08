import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { formatKg } from '../../utils/format'

export type WeighInPoint = {
  date: string
  weightKg: number
}

export type GoalJourneyTrackProps = {
  startWeightKg: number
  currentWeightKg: number | null
  targetWeightKg: number
  /** Optional weigh-in history for the expanded view; ignored when absent. */
  history?: WeighInPoint[]
  currentLabel?: string
  className?: string
}

const MAX_VISUAL_OVERFLOW_PERCENT = 16

/**
 * Maps `currentWeightKg` onto 0-100 across [start, target], allowing values
 * outside that range to produce a signed "beyond" fraction rather than
 * clamping, so overshoot/regression can still be represented spatially.
 */
function computeProgress(start: number, current: number, target: number) {
  const span = target - start
  if (span === 0) {
    return { t: current === target ? 100 : 0, beyond: 0 }
  }
  const t = ((current - start) / span) * 100
  const clamped = Math.min(100, Math.max(0, t))
  const beyond = t - clamped
  return { t: clamped, beyond }
}

/** Compresses an unbounded "beyond" percentage into a short, bounded overflow region. */
function visualOverflow(beyond: number): number {
  if (beyond === 0) return 0
  const sign = Math.sign(beyond)
  const magnitude = Math.min(MAX_VISUAL_OVERFLOW_PERCENT, Math.sqrt(Math.abs(beyond)) * 3.2)
  return sign * magnitude
}

export function GoalJourneyTrack({
  startWeightKg,
  currentWeightKg,
  targetWeightKg,
  history,
  currentLabel = 'TODAY',
  className = '',
}: GoalJourneyTrackProps) {
  const reduceMotion = useReducedMotion()
  const [expanded, setExpanded] = useState(false)
  const historyId = useId()

  const hasCurrent = currentWeightKg != null
  const { t, beyond } = hasCurrent
    ? computeProgress(startWeightKg, currentWeightKg, targetWeightKg)
    : { t: 0, beyond: 0 }
  const overflow = visualOverflow(beyond)
  const markerLeft = t + overflow
  const isRegression = beyond < 0
  const isBeyondGoal = beyond > 0
  const isLossGoal = targetWeightKg <= startWeightKg

  const travelledWidth = Math.max(0, Math.min(100, t))

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-end justify-between text-xs font-medium text-[var(--color-ink-muted)]">
        <div className="text-left">
          <p className="text-base font-semibold text-[var(--color-ink)]">{formatKg(startWeightKg)}</p>
          <p className="uppercase tracking-[0.12em]">Start</p>
        </div>
        {hasCurrent ? (
          <div className="text-center">
            <p className="text-base font-semibold text-[var(--color-ink)]">{formatKg(currentWeightKg)}</p>
            <p className="uppercase tracking-[0.12em]">{currentLabel}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-base font-semibold text-[var(--color-ink-muted)]">—</p>
            <p className="uppercase tracking-[0.12em]">No weight yet</p>
          </div>
        )}
        <div className="text-right">
          <p className="text-base font-semibold text-[var(--color-ink)]">{formatKg(targetWeightKg)}</p>
          <p className="uppercase tracking-[0.12em]">Goal</p>
        </div>
      </div>

      <div className="relative mt-6 h-10" style={{ marginInline: `${MAX_VISUAL_OVERFLOW_PERCENT}%` }}>
        {/* Future path (quiet) */}
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--color-moss)_18%,var(--color-canvas))]" />

        {/* Travelled path (brighter) */}
        <motion.div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[var(--color-moss)]"
          initial={reduceMotion ? false : { width: '0%' }}
          animate={{ width: `${travelledWidth}%` }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 20 }}
        />

        {/* Start marker */}
        <span
          aria-hidden
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-moss)] bg-[var(--color-canvas)]"
          style={{ left: '0%' }}
        />
        {/* Goal marker */}
        <span
          aria-hidden
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-moss)] bg-[var(--color-canvas)]"
          style={{ left: '100%' }}
        />

        {/* Current marker */}
        {hasCurrent ? (
          <motion.div
            className="absolute top-1/2 z-10 flex -translate-y-1/2 flex-col items-center"
            initial={reduceMotion ? false : { left: '0%' }}
            animate={{ left: `${markerLeft}%` }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 16 }}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <span
              className="block h-4 w-4 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-lime)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-lime)_35%,transparent)]"
              role="img"
              aria-label={`Current weight ${formatKg(currentWeightKg)}, ${
                isRegression ? 'behind starting weight' : isBeyondGoal ? 'beyond goal weight' : 'on the way to goal'
              }`}
            />
          </motion.div>
        ) : null}
      </div>

      {(isRegression || isBeyondGoal) && hasCurrent ? (
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          {isRegression
            ? `${formatKg(Math.abs(currentWeightKg! - startWeightKg))} beyond the starting point — normal fluctuation happens.`
            : `${formatKg(Math.abs(currentWeightKg! - targetWeightKg))} past the goal ${isLossGoal ? 'weight' : 'target'}.`}
        </p>
      ) : null}

      {history && history.length > 1 ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={historyId}
            className="text-xs font-medium text-[var(--color-moss)] underline-offset-2 hover:underline focus-visible:underline"
          >
            {expanded ? 'Hide weight history' : 'Show weight history'}
          </button>

          {expanded ? (
            <div id={historyId}>
              <GoalJourneyHistoryChart
                history={history}
                startWeightKg={startWeightKg}
                targetWeightKg={targetWeightKg}
                reduceMotion={Boolean(reduceMotion)}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

type GoalJourneyHistoryChartProps = {
  history: WeighInPoint[]
  startWeightKg: number
  targetWeightKg: number
  reduceMotion: boolean
}

function GoalJourneyHistoryChart({
  history,
  startWeightKg,
  targetWeightKg,
  reduceMotion,
}: GoalJourneyHistoryChartProps) {
  const width = 480
  const height = 160
  const padding = 24

  const values = history.map((point) => point.weightKg).concat([startWeightKg, targetWeightKg])
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const xFor = (index: number) =>
    padding + (index / Math.max(1, history.length - 1)) * (width - padding * 2)
  const yFor = (weight: number) => height - padding - ((weight - min) / range) * (height - padding * 2)

  const linePath = history
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(point.weightKg)}`)
    .join(' ')

  return (
    <div className="mt-3 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_20%,transparent)] bg-white/60 p-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Weight over time from start to target"
        className="h-40 w-full"
      >
        <line
          x1={padding}
          x2={width - padding}
          y1={yFor(targetWeightKg)}
          y2={yFor(targetWeightKg)}
          stroke="var(--color-coral)"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
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
        {history.map((point, index) => (
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
              {point.date}: {formatKg(point.weightKg)}
            </title>
          </circle>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        <span>{history[0]?.date}</span>
        <span>{history.at(-1)?.date}</span>
      </div>
    </div>
  )
}
