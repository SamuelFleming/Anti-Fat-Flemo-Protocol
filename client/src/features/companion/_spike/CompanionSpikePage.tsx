import React, { Suspense, lazy, useEffect, useState } from 'react'

export type SpikePoseId = 'mannequin' | 'high-exertion'

const SpikeCanvas = lazy(() => import('./SpikeCanvas'))

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/**
 * Throwaway R3F spike (ticket 3007). Not for Dashboard production use.
 * Visit `/dev/companion-spike` locally to verify pose swap + fallbacks.
 */
export function CompanionSpikePage() {
  const [pose, setPose] = useState<SpikePoseId>('mannequin')
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [chunkFailed, setChunkFailed] = useState(false)

  useEffect(() => {
    setWebgl(detectWebGL())
  }, [])

  const showFallback = webgl === false || chunkFailed

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col gap-4 bg-[var(--color-canvas)] p-6 text-[var(--color-ink)]">
      <header className="space-y-1">
        <p className="text-xs tracking-wide text-[var(--color-ink-muted)] uppercase">Dev spike · 3007</p>
        <h1 className="font-display text-2xl">GoalStateCompanion R3F</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Throwaway primitive seed character. Swap poses to prove R3F in this Vite client. Not wired
          into the Dashboard.
        </p>
      </header>

      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-md bg-[var(--color-moss)] px-3 py-2 text-sm text-white disabled:opacity-50"
          disabled={pose === 'mannequin'}
          onClick={() => setPose('mannequin')}
        >
          Pose: mannequin
        </button>
        <button
          type="button"
          className="rounded-md bg-[var(--color-lavender)] px-3 py-2 text-sm text-white disabled:opacity-50"
          disabled={pose === 'high-exertion'}
          onClick={() => setPose('high-exertion')}
        >
          Pose: high-exertion
        </button>
      </div>

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[color-mix(in_srgb,var(--color-canvas)_70%,white)]">
        {webgl === null ? (
          <p className="absolute inset-0 grid place-items-center text-sm text-[var(--color-ink-muted)]">
            Checking WebGL…
          </p>
        ) : showFallback ? (
          <FallbackPanel pose={pose} reason={webgl === false ? 'no-webgl' : 'chunk-failed'} />
        ) : (
          <Suspense
            fallback={
              <p className="absolute inset-0 grid place-items-center text-sm text-[var(--color-ink-muted)]">
                Loading 3D chunk…
              </p>
            }
          >
            <SpikeErrorBoundary onError={() => setChunkFailed(true)}>
              <SpikeCanvas pose={pose} />
            </SpikeErrorBoundary>
          </Suspense>
        )}
      </div>

      <p className="text-xs text-[var(--color-ink-muted)]">
        Current pose: <strong>{pose}</strong>
        {showFallback ? ' · fallback active' : ' · WebGL canvas'}
      </p>
    </main>
  )
}

function FallbackPanel({
  pose,
  reason,
}: {
  pose: SpikePoseId
  reason: 'no-webgl' | 'chunk-failed'
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div
        className={`h-40 w-16 rounded-full ${
          pose === 'mannequin'
            ? 'bg-[color-mix(in_srgb,var(--color-moss)_45%,white)]'
            : 'scale-x-110 bg-[var(--color-moss)]'
        }`}
        aria-hidden
      />
      <p className="text-sm font-medium">Static fallback · {pose}</p>
      <p className="text-xs text-[var(--color-ink-muted)]">
        {reason === 'no-webgl'
          ? 'WebGL is unavailable in this browser.'
          : 'The 3D chunk failed to load.'}
      </p>
    </div>
  )
}

type BoundaryProps = {
  children: React.ReactNode
  onError: () => void
}

type BoundaryState = { hasError: boolean }

class SpikeErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
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
