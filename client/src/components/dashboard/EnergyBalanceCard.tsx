import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { formatKcal } from '../../utils/format'

export type EnergyBalanceCardProps = {
  baselineTdee: number | null
  moveKcal: number | null
  foodKcal: number
  estimatedDeficit: number | null
  className?: string
}

export function EnergyBalanceCard({
  baselineTdee,
  moveKcal,
  foodKcal,
  estimatedDeficit,
  className = '',
}: EnergyBalanceCardProps) {
  const reduceMotion = useReducedMotion()
  const [expanded, setExpanded] = useState(false)
  const hasBreakdown = baselineTdee != null && moveKcal != null

  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-4 ${className}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            Estimated energy balance
          </p>
          <p className="text-lg font-semibold text-[var(--color-ink)]">
            {estimatedDeficit != null
              ? `${estimatedDeficit >= 0 ? '~' : '~'}${formatKcal(Math.abs(estimatedDeficit))} ${
                  estimatedDeficit >= 0 ? 'deficit' : 'surplus'
                }`
              : 'Not enough data yet'}
          </p>
        </div>
        <span className="text-xs font-medium text-[var(--color-moss)]">{expanded ? 'Hide' : 'Details'}</span>
      </button>

      {expanded ? (
        <motion.dl
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
          className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-[color-mix(in_srgb,var(--color-moss)_14%,transparent)] pt-3 text-sm"
        >
          <dt className="text-[var(--color-ink-muted)]">Baseline</dt>
          <dd className="text-right font-medium text-[var(--color-ink)]">
            {baselineTdee != null ? formatKcal(baselineTdee) : '—'}
          </dd>
          <dt className="text-[var(--color-ink-muted)]">Move</dt>
          <dd className="text-right font-medium text-[var(--color-ink)]">
            {moveKcal != null ? `+${formatKcal(moveKcal)}` : '—'}
          </dd>
          <dt className="text-[var(--color-ink-muted)]">Food</dt>
          <dd className="text-right font-medium text-[var(--color-ink)]">{`-${formatKcal(foodKcal)}`}</dd>
          <dt className="font-semibold text-[var(--color-ink)]">Estimated</dt>
          <dd className="text-right font-semibold text-[var(--color-ink)]">
            {estimatedDeficit != null
              ? `${formatKcal(Math.abs(estimatedDeficit))} ${estimatedDeficit >= 0 ? 'deficit' : 'surplus'}`
              : '—'}
          </dd>
          {!hasBreakdown ? (
            <p className="col-span-2 mt-1 text-xs text-[var(--color-ink-muted)]">
              Set your estimated baseline TDEE in Settings and log Move to see a full breakdown.
            </p>
          ) : null}
        </motion.dl>
      ) : null}

      <p className="mt-2 text-[10px] text-[var(--color-ink-muted)]">Estimate only — not a medical measurement.</p>
    </div>
  )
}
