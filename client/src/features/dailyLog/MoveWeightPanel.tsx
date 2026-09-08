import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { ApiError } from '../../services/apiClient'
import { fetchDailyLog, upsertDailyLog, type DailyLog } from '../../services/dailyLogService'
import { createWeight, deleteWeight, listWeights, updateWeight, type WeightEntry } from '../../services/weightService'
import { formatKg, formatKj } from '../../utils/format'

export type MoveWeightPanelProps = {
  token: string
  date: string
  onMoveChange: (moveKj: number | null) => void
}

export function MoveWeightPanel({ token, date, onMoveChange }: MoveWeightPanelProps) {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null)
  const [weightEntry, setWeightEntry] = useState<WeightEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [moveInput, setMoveInput] = useState('')
  const [moveSaving, setMoveSaving] = useState(false)
  const [moveError, setMoveError] = useState<string | null>(null)

  const [weightInput, setWeightInput] = useState('')
  const [weightSaving, setWeightSaving] = useState(false)
  const [weightError, setWeightError] = useState<string | null>(null)
  const [confirmingDeleteWeight, setConfirmingDeleteWeight] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([fetchDailyLog(token, date), listWeights(token, { date })])
      .then(([logRes, weightRes]) => {
        if (cancelled) return
        const log = logRes.items[0] ?? null
        const entry = weightRes.items[0] ?? null
        setDailyLog(log)
        setWeightEntry(entry)
        setMoveInput(log?.moveKj != null ? String(log.moveKj) : '')
        setWeightInput(entry != null ? String(entry.weightKg) : '')
        onMoveChange(log?.moveKj ?? null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Unable to load Move and weight data')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, date])

  async function handleMoveSubmit(event: FormEvent) {
    event.preventDefault()
    setMoveError(null)
    const moveKj = Number(moveInput)
    if (moveInput.trim() !== '' && (Number.isNaN(moveKj) || moveKj < 0)) {
      setMoveError('Move must be a valid non-negative number of kJ.')
      return
    }
    setMoveSaving(true)
    try {
      const updated = await upsertDailyLog(token, date, {
        moveKj: moveInput.trim() === '' ? undefined : moveKj,
      })
      setDailyLog(updated)
      onMoveChange(updated.moveKj ?? null)
    } catch (err) {
      setMoveError(err instanceof ApiError ? err.message : 'Unable to save Move')
    } finally {
      setMoveSaving(false)
    }
  }

  async function handleWeightSubmit(event: FormEvent) {
    event.preventDefault()
    setWeightError(null)
    const weightKg = Number(weightInput)
    if (Number.isNaN(weightKg) || weightKg <= 0) {
      setWeightError('Weight must be a valid positive number.')
      return
    }
    setWeightSaving(true)
    try {
      const saved = weightEntry
        ? await updateWeight(token, weightEntry.id, { weightKg })
        : await createWeight(token, { date, weightKg })
      setWeightEntry(saved)
    } catch (err) {
      setWeightError(err instanceof ApiError ? err.message : 'Unable to save weight')
    } finally {
      setWeightSaving(false)
    }
  }

  async function handleWeightDelete() {
    if (!weightEntry) return
    try {
      await deleteWeight(token, weightEntry.id)
      setWeightEntry(null)
      setWeightInput('')
    } catch (err) {
      setWeightError(err instanceof ApiError ? err.message : 'Unable to delete weight entry')
    } finally {
      setConfirmingDeleteWeight(false)
    }
  }

  if (loading) {
    return (
      <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-5">
        <p className="text-sm text-[var(--color-ink-muted)]">Loading Move and weight…</p>
      </section>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">Move</h2>
        {error ? (
          <p role="alert" className="mb-2 text-sm text-[var(--color-coral)]">
            {error}
          </p>
        ) : null}
        <p className="mb-3 text-2xl font-semibold text-[var(--color-ink)]">
          {dailyLog?.moveKj != null ? formatKj(dailyLog.moveKj) : '—'}
        </p>
        <form className="flex flex-wrap items-end gap-3" onSubmit={handleMoveSubmit} noValidate>
          <Input
            label="Move (kJ)"
            name="moveKj"
            type="number"
            min={0}
            step="1"
            value={moveInput}
            onChange={(e) => setMoveInput(e.target.value)}
            className="w-32"
          />
          <Button type="submit" disabled={moveSaving}>
            {moveSaving ? 'Saving…' : 'Save Move'}
          </Button>
        </form>
        {moveError ? (
          <p role="alert" className="mt-2 text-sm text-[var(--color-coral)]">
            {moveError}
          </p>
        ) : null}
      </section>

      <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">Weight</h2>
        <p className="mb-3 text-2xl font-semibold text-[var(--color-ink)]">
          {weightEntry ? formatKg(weightEntry.weightKg) : '—'}
        </p>
        <form className="flex flex-wrap items-end gap-3" onSubmit={handleWeightSubmit} noValidate>
          <Input
            label="Weight (kg)"
            name="weightKg"
            type="number"
            min={0}
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="w-32"
          />
          <Button type="submit" disabled={weightSaving}>
            {weightSaving ? 'Saving…' : weightEntry ? 'Update' : 'Add weight'}
          </Button>
          {weightEntry ? (
            <Button
              type="button"
              variant="ghost"
              className="text-[var(--color-coral)]"
              onClick={() => setConfirmingDeleteWeight(true)}
              disabled={weightSaving}
            >
              Delete
            </Button>
          ) : null}
        </form>
        {weightError ? (
          <p role="alert" className="mt-2 text-sm text-[var(--color-coral)]">
            {weightError}
          </p>
        ) : null}
      </section>

      <ConfirmDialog
        open={confirmingDeleteWeight}
        title="Delete this weight entry?"
        description="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => void handleWeightDelete()}
        onCancel={() => setConfirmingDeleteWeight(false)}
      />
    </div>
  )
}
