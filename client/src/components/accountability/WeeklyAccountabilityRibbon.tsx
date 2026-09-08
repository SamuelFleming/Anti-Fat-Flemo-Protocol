import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { formatKcal, formatKg, formatKj, formatShortDate } from '../../utils/format'

export type RibbonDayStatus = 'on-track' | 'partial' | 'off-track' | 'awaiting-data'

export type RibbonDay = {
  date: string
  status: RibbonDayStatus | null
  isFuture: boolean
  isToday: boolean
  caloriesConsumed: number
  moveKj: number | null
}

export type WeeklyAccountabilityRibbonProps = {
  days: RibbonDay[]
  selectedDate: string
  onSelectDate: (date: string) => void
  averageCalories: number | null
  averageMoveKj: number | null
  weightChangeKg: number | null
  className?: string
}

const STATUS_LABEL: Record<RibbonDayStatus, string> = {
  'on-track': 'On track',
  partial: 'Partial',
  'off-track': 'Off track',
  'awaiting-data': 'No data yet',
}

function DayGlyph({ status, isFuture }: { status: RibbonDayStatus | null; isFuture: boolean }) {
  if (isFuture) {
    return (
      <span
        aria-hidden
        className="block h-4 w-4 rounded-full border border-dashed border-[color-mix(in_srgb,var(--color-ink)_25%,transparent)] opacity-50"
      />
    )
  }

  if (status === 'on-track') {
    return <span aria-hidden className="block h-4 w-4 rounded-full bg-[var(--color-moss)]" />
  }

  if (status === 'off-track') {
    return (
      <span
        aria-hidden
        className="block h-3.5 w-3.5 rotate-45 bg-[var(--color-coral)]"
        style={{ borderRadius: 2 }}
      />
    )
  }

  if (status === 'partial') {
    return (
      <span
        aria-hidden
        className="block h-4 w-4 rounded-full border-2 border-[var(--color-coral)]"
        style={{
          background:
            'conic-gradient(var(--color-coral) 0deg 180deg, transparent 180deg 360deg)',
        }}
      />
    )
  }

  return (
    <span
      aria-hidden
      className="block h-4 w-4 rounded-full border border-dashed border-[color-mix(in_srgb,var(--color-ink)_40%,transparent)]"
    />
  )
}

export function WeeklyAccountabilityRibbon({
  days,
  selectedDate,
  onSelectDate,
  averageCalories,
  averageMoveKj,
  weightChangeKg,
  className = '',
}: WeeklyAccountabilityRibbonProps) {
  const reduceMotion = useReducedMotion()
  const [trendOpen, setTrendOpen] = useState(false)
  const [trendMetric, setTrendMetric] = useState<'calories' | 'move'>('calories')

  const counts = useMemo(() => {
    const loggedDays = days.filter((day) => !day.isFuture && day.status)
    return {
      onTrack: loggedDays.filter((day) => day.status === 'on-track').length,
      partial: loggedDays.filter((day) => day.status === 'partial').length,
      offTrack: loggedDays.filter((day) => day.status === 'off-track').length,
    }
  }, [days])

  return (
    <section
      className={`rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-5 ${className}`}
      aria-label="This week's accountability"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            This week
          </h3>
          <p className="text-sm text-[var(--color-ink-muted)]">Consistency over perfection.</p>
        </div>
        <p className="text-xs font-medium text-[var(--color-ink-muted)]">
          {counts.onTrack} on track · {counts.partial} partial · {counts.offTrack} off track
        </p>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-1">
        <div className="absolute left-4 right-4 top-[calc(50%-1px)] h-px bg-[color-mix(in_srgb,var(--color-moss)_25%,transparent)]" />
        {days.map((day) => {
          const isSelected = day.date === selectedDate
          const label = day.isFuture
            ? 'Upcoming'
            : day.status
              ? STATUS_LABEL[day.status]
              : 'No data yet'

          return (
            <button
              key={day.date}
              type="button"
              disabled={day.isFuture}
              onClick={() => onSelectDate(day.date)}
              aria-pressed={isSelected}
              aria-current={day.isToday ? 'date' : undefined}
              className="relative z-10 flex flex-col items-center gap-1.5 rounded-[var(--radius-sm)] px-1.5 py-1 text-center focus-visible:outline-none disabled:cursor-default"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                {formatShortDate(day.date).slice(0, 3)}
              </span>

              <span className="relative flex h-6 w-6 items-center justify-center">
                {isSelected ? (
                  <motion.span
                    layoutId="ribbon-selection"
                    className="absolute inset-0 rounded-full bg-[var(--color-lime)] opacity-60"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 26 }}
                  />
                ) : null}
                {day.isToday ? (
                  <span className="absolute inset-[-3px] rounded-full border border-[var(--color-ink)]" />
                ) : null}
                <DayGlyph status={day.status} isFuture={day.isFuture} />
              </span>

              <span className="sr-only">
                {formatShortDate(day.date)}: {label}
                {day.isToday ? ' (today)' : ''}
              </span>
            </button>
          )
        })}
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-[color-mix(in_srgb,var(--color-moss)_14%,transparent)] pt-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
            Average calories
          </dt>
          <dd className="font-semibold text-[var(--color-ink)]">
            {averageCalories != null ? formatKcal(averageCalories) : 'No data'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Average Move</dt>
          <dd className="font-semibold text-[var(--color-ink)]">
            {averageMoveKj != null ? formatKj(averageMoveKj) : 'No data'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Weight change</dt>
          <dd className="font-semibold text-[var(--color-ink)]">
            {weightChangeKg != null
              ? `${weightChangeKg > 0 ? '−' : weightChangeKg < 0 ? '+' : ''}${formatKg(Math.abs(weightChangeKg))}`
              : 'No data'}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setTrendOpen((open) => !open)}
          aria-expanded={trendOpen}
          className="text-xs font-medium text-[var(--color-moss)] underline-offset-2 hover:underline focus-visible:underline"
        >
          {trendOpen ? 'Hide daily trend' : 'Show daily trend'}
        </button>

        {trendOpen ? (
          <div className="mt-3">
            <div className="mb-2 flex gap-2">
              {(['calories', 'move'] as const).map((metric) => (
                <button
                  key={metric}
                  type="button"
                  onClick={() => setTrendMetric(metric)}
                  aria-pressed={trendMetric === metric}
                  className={`rounded-[var(--radius-sm)] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.06em] ${
                    trendMetric === metric
                      ? 'bg-[var(--color-moss)] text-[var(--color-canvas)]'
                      : 'bg-[var(--color-moss-soft)] text-[var(--color-moss)]'
                  }`}
                >
                  {metric === 'calories' ? 'Calories' : 'Move'}
                </button>
              ))}
            </div>
            <DailyTrendChart days={days} metric={trendMetric} reduceMotion={Boolean(reduceMotion)} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function DailyTrendChart({
  days,
  metric,
  reduceMotion,
}: {
  days: RibbonDay[]
  metric: 'calories' | 'move'
  reduceMotion: boolean
}) {
  const values = days.map((day) => (metric === 'calories' ? day.caloriesConsumed : (day.moveKj ?? 0)))
  const max = Math.max(1, ...values)
  const width = 320
  const height = 96
  const barWidth = width / days.length - 8

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full" role="img" aria-label={`Daily ${metric} this week`}>
      {days.map((day, index) => {
        const value = metric === 'calories' ? day.caloriesConsumed : day.moveKj
        const barHeight = value ? (Math.max(0, value) / max) * (height - 20) : 0
        const x = index * (width / days.length) + 4
        const y = height - 16 - barHeight

        return (
          <g key={day.date}>
            <motion.rect
              x={x}
              width={barWidth}
              rx={3}
              fill={value == null ? 'color-mix(in srgb, var(--color-ink) 15%, transparent)' : metric === 'calories' ? 'var(--color-coral)' : 'var(--color-lavender)'}
              initial={reduceMotion ? false : { height: 0, y: height - 16 }}
              animate={{ height: value != null ? barHeight : 4, y: value != null ? y : height - 20 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.4, delay: index * 0.03 }}
            />
            <text x={x + barWidth / 2} y={height - 4} fontSize={8} textAnchor="middle" fill="var(--color-ink-muted)">
              {formatShortDate(day.date).slice(0, 2)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
