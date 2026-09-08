import { motion, useReducedMotion } from 'motion/react'

type JourneyEntryMotifProps = {
  active?: boolean
}

/** Restrained progress-path motif for auth screens — not real goal progress. */
export function JourneyEntryMotif({ active = false }: JourneyEntryMotifProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden className="relative h-16 w-full max-w-sm">
      <svg viewBox="0 0 320 64" className="h-full w-full" role="presentation">
        <path
          d="M12 40 C 70 12, 120 56, 168 34 S 260 8, 308 28"
          fill="none"
          stroke="var(--color-moss)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M12 40 C 70 12, 120 56, 168 34"
          fill="none"
          stroke="var(--color-moss)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <motion.circle
          cx={active ? 168 : 48}
          cy={active ? 34 : 30}
          r="7"
          fill="var(--color-lime)"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          animate={
            reduceMotion
              ? { cx: active ? 168 : 48, cy: active ? 34 : 30 }
              : { cx: active ? 168 : 48, cy: active ? 34 : 30 }
          }
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
        />
      </svg>
    </div>
  )
}
