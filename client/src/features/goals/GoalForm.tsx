import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ApiError } from '../../services/apiClient'
import type { Goal, GoalInput } from '../../services/goalService'
import { todayDateString } from '../../utils/format'

export type GoalFormProps = {
  initial?: Goal
  onSubmit: (input: GoalInput) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export function GoalForm({ initial, onSubmit, onCancel, submitLabel = 'Save goal' }: GoalFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayDateString())
  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? '')
  const [startingWeightKg, setStartingWeightKg] = useState(
    initial?.startingWeightKg != null ? String(initial.startingWeightKg) : '',
  )
  const [targetWeightKg, setTargetWeightKg] = useState(
    initial?.targetWeightKg != null ? String(initial.targetWeightKg) : '',
  )
  const [targetCalories, setTargetCalories] = useState(
    initial?.targetCalories != null ? String(initial.targetCalories) : '',
  )
  const [targetMoveKj, setTargetMoveKj] = useState(
    initial?.targetMoveKj != null ? String(initial.targetMoveKj) : '',
  )
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const parsed = {
      name: name.trim(),
      startDate,
      targetDate: targetDate.trim() === '' ? undefined : targetDate,
      startingWeightKg: Number(startingWeightKg),
      targetWeightKg: Number(targetWeightKg),
      targetCalories: Number(targetCalories),
      targetMoveKj: Number(targetMoveKj),
    }

    if (!parsed.name) {
      setError('Name is required.')
      return
    }
    if ([parsed.startingWeightKg, parsed.targetWeightKg, parsed.targetCalories, parsed.targetMoveKj].some(
      (value) => Number.isNaN(value) || value < 0,
    )) {
      setError('Weight, calorie and Move targets must be valid non-negative numbers.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(parsed)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to save goal')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <Input label="Goal name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Start date"
          name="startDate"
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label="Target date (optional)"
          name="targetDate"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Starting weight (kg)"
          name="startingWeightKg"
          type="number"
          min={0}
          step="0.1"
          required
          value={startingWeightKg}
          onChange={(e) => setStartingWeightKg(e.target.value)}
        />
        <Input
          label="Target weight (kg)"
          name="targetWeightKg"
          type="number"
          min={0}
          step="0.1"
          required
          value={targetWeightKg}
          onChange={(e) => setTargetWeightKg(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Daily calorie target (kcal)"
          name="targetCalories"
          type="number"
          min={0}
          step="1"
          required
          value={targetCalories}
          onChange={(e) => setTargetCalories(e.target.value)}
        />
        <Input
          label="Daily Move target (kJ)"
          name="targetMoveKj"
          type="number"
          min={0}
          step="1"
          required
          value={targetMoveKj}
          onChange={(e) => setTargetMoveKj(e.target.value)}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-[var(--color-coral)]">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
