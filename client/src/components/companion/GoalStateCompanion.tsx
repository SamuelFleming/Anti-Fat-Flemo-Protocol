import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import {
  resolveCompanionState,
  type CompanionDayContext,
  type ResolvedBehaviour,
} from '../../features/companion/companionState'

/** Alias matching ticket wording — same shape as CompanionDayContext. */
export type CompanionContext = CompanionDayContext

export type GoalStateCompanionProps = {
  /** Parent-owned selected-day snapshot. Companion never fetches. */
  context: CompanionContext
}

const CompanionCanvas = lazy(() => import('./CompanionCanvas'))

/** Dev/harness only — not a public render prop. Lets `/dev/companion-prototype` simulate failure. */
let harnessForceFallback = false

export function setCompanionRendererForceFallback(value: boolean) {
  harnessForceFallback = value
}

function detectWebGL(): boolean {
  if (harnessForceFallback) return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/**
 * Signature GoalStateCompanion — MVP static render prototype (ticket 3009).
 * Driven only by companion context → 3008 contract. Animation system is 3010.
 */
export function GoalStateCompanion({ context }: GoalStateCompanionProps) {
  const { semantic, behaviour } = useMemo(() => resolveCompanionState(context), [context])
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [chunkFailed, setChunkFailed] = useState(false)

  useEffect(() => {
    setWebgl(detectWebGL())
  }, [])

  useEffect(() => {
    setChunkFailed(false)
  }, [behaviour.compositionId])

  const showFallback = webgl === false || chunkFailed
  const label = accessibleLabel(semantic.dataState, behaviour)

  return (
    <div
      className="relative h-full min-h-48 w-full"
      role="img"
      aria-label={label}
      data-composition={behaviour.compositionId}
      data-data-state={semantic.dataState}
    >
      {webgl === null ? (
        <NeutralPlaceholder behaviour={behaviour} quiet />
      ) : showFallback ? (
        <NeutralPlaceholder behaviour={behaviour} />
      ) : (
        <Suspense fallback={<NeutralPlaceholder behaviour={behaviour} quiet />}>
          <RenderErrorBoundary onError={() => setChunkFailed(true)}>
            <CompanionCanvas behaviour={behaviour} />
          </RenderErrorBoundary>
        </Suspense>
      )}
    </div>
  )
}

function accessibleLabel(dataState: string, behaviour: ResolvedBehaviour): string {
  if (dataState === 'no-data') return 'Goal state companion: no data'
  return `Goal state companion: ${behaviour.compositionId.replace(/-/g, ' ')}`
}

function NeutralPlaceholder({
  behaviour,
  quiet = false,
}: {
  behaviour: ResolvedBehaviour
  quiet?: boolean
}) {
  const muted = behaviour.compositionId === 'mannequin'
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
      <div
        className={`h-28 w-11 rounded-full ${
          muted
            ? 'bg-[color-mix(in_srgb,var(--color-moss)_40%,white)]'
            : behaviour.compositionId === 'mildly-full' || behaviour.compositionId === 'over-full'
              ? 'w-12 scale-y-95 bg-[var(--color-moss)]'
              : behaviour.compositionId === 'high-exertion' || behaviour.compositionId === 'exertion'
                ? 'scale-x-110 bg-[var(--color-moss)]'
                : 'bg-[var(--color-moss)]'
        }`}
        aria-hidden
      />
      {!quiet ? (
        <p className="text-center text-xs text-[var(--color-ink-muted)]">
          {behaviour.compositionId === 'mannequin' ? 'No data' : behaviour.compositionId}
        </p>
      ) : null}
    </div>
  )
}

type BoundaryProps = {
  children: React.ReactNode
  onError: () => void
}

type BoundaryState = { hasError: boolean }

class RenderErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
