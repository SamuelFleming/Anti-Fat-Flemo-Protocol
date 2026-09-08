import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { ApiError } from '../../services/apiClient'
import {
  createMeal,
  deleteMeal,
  listMeals,
  updateMeal,
  type Meal,
  type MealInput,
  type MealType,
} from '../../services/mealService'
import { formatKcal } from '../../utils/format'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack', 'other']

type MealFormState = {
  name: string
  mealType: MealType
  calories: string
  proteinGrams: string
}

const EMPTY_FORM: MealFormState = { name: '', mealType: 'breakfast', calories: '', proteinGrams: '' }

export type MealsPanelProps = {
  token: string
  date: string
  onTotalCaloriesChange: (total: number) => void
}

export function MealsPanel({ token, date, onTotalCaloriesChange }: MealsPanelProps) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<MealFormState>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setEditingId(null)
    listMeals(token, date)
      .then((res) => {
        if (cancelled) return
        setMeals(res.items)
        onTotalCaloriesChange(res.items.reduce((sum, meal) => sum + meal.calories, 0))
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Unable to load meals')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, date])

  function applyMeals(next: Meal[]) {
    setMeals(next)
    onTotalCaloriesChange(next.reduce((sum, meal) => sum + meal.calories, 0))
  }

  function startAdd() {
    setForm(EMPTY_FORM)
    setFormError(null)
    setEditingId('new')
  }

  function startEdit(meal: Meal) {
    setForm({
      name: meal.name,
      mealType: meal.mealType,
      calories: String(meal.calories),
      proteinGrams: meal.proteinGrams != null ? String(meal.proteinGrams) : '',
    })
    setFormError(null)
    setEditingId(meal.id)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)

    const calories = Number(form.calories)
    if (!form.name.trim()) {
      setFormError('Meal name is required.')
      return
    }
    if (Number.isNaN(calories) || calories < 0) {
      setFormError('Calories must be a valid non-negative number.')
      return
    }
    const proteinGrams = form.proteinGrams.trim() === '' ? undefined : Number(form.proteinGrams)
    if (proteinGrams != null && (Number.isNaN(proteinGrams) || proteinGrams < 0)) {
      setFormError('Protein must be a valid non-negative number.')
      return
    }

    const input: MealInput = {
      date,
      name: form.name.trim(),
      mealType: form.mealType,
      calories,
      proteinGrams,
    }

    setSubmitting(true)
    try {
      if (editingId === 'new') {
        const created = await createMeal(token, input)
        applyMeals([...meals, created])
      } else if (editingId) {
        const updated = await updateMeal(token, editingId, input)
        applyMeals(meals.map((meal) => (meal.id === editingId ? updated : meal)))
      }
      setEditingId(null)
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Unable to save meal')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteMeal(token, deletingId)
      applyMeals(meals.filter((meal) => meal.id !== deletingId))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to delete meal')
    } finally {
      setDeletingId(null)
    }
  }

  const total = meals.reduce((sum, meal) => sum + meal.calories, 0)

  return (
    <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_18%,transparent)] bg-white/70 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">Meals</h2>
        <p className="text-sm font-medium text-[var(--color-ink)]">{formatKcal(total)} total</p>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-ink-muted)]">Loading meals…</p>
      ) : error ? (
        <p role="alert" className="text-sm text-[var(--color-coral)]">
          {error}
        </p>
      ) : (
        <>
          {meals.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-muted)]">No meals logged for this day yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {meals.map((meal) => (
                <li
                  key={meal.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-moss)_14%,transparent)] bg-white/60 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-[var(--color-ink)]">{meal.name}</p>
                    <p className="text-xs capitalize text-[var(--color-ink-muted)]">
                      {meal.mealType}
                      {meal.proteinGrams != null ? ` · ${meal.proteinGrams}g protein` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-[var(--color-ink)]">{formatKcal(meal.calories)}</span>
                    <button
                      type="button"
                      onClick={() => startEdit(meal)}
                      className="text-xs font-medium text-[var(--color-moss)] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(meal.id)}
                      className="text-xs font-medium text-[var(--color-coral)] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {editingId ? (
        <form className="mt-4 flex flex-col gap-3 border-t border-[color-mix(in_srgb,var(--color-moss)_14%,transparent)] pt-4" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Meal name"
              name="mealName"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor="mealType">
              <span className="font-medium text-[var(--color-ink)]">Type</span>
              <select
                id="mealType"
                className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-moss)_35%,transparent)] bg-white/70 px-3 py-2 text-[var(--color-ink)]"
                value={form.mealType}
                onChange={(e) => setForm({ ...form, mealType: e.target.value as MealType })}
              >
                {MEAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type[0].toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Calories (kcal)"
              name="calories"
              type="number"
              min={0}
              step="1"
              required
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
            />
            <Input
              label="Protein (g, optional)"
              name="proteinGrams"
              type="number"
              min={0}
              step="1"
              value={form.proteinGrams}
              onChange={(e) => setForm({ ...form, proteinGrams: e.target.value })}
            />
          </div>
          {formError ? (
            <p role="alert" className="text-sm text-[var(--color-coral)]">
              {formError}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : editingId === 'new' ? 'Add meal' : 'Save changes'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEditingId(null)} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="secondary" className="mt-4" onClick={startAdd}>
          Add meal
        </Button>
      )}

      <ConfirmDialog
        open={deletingId != null}
        title="Delete this meal?"
        description="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  )
}
