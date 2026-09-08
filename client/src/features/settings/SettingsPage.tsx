import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../../components/ui/PageContainer'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'

export function SettingsPage() {
  const { user } = useAuth()
  const { profile, isLoading, error, isSetupComplete, saveProfile } = useProfile()
  const navigate = useNavigate()

  const [heightCm, setHeightCm] = useState('')
  const [estimatedBaselineTdee, setEstimatedBaselineTdee] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setHeightCm(profile.heightCm != null ? String(profile.heightCm) : '')
      setEstimatedBaselineTdee(
        profile.estimatedBaselineTdee != null ? String(profile.estimatedBaselineTdee) : '',
      )
    }
  }, [profile])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)
    setSavedMessage(null)

    const wasComplete = isSetupComplete
    const parsedHeight = heightCm.trim() === '' ? undefined : Number(heightCm)
    const parsedTdee =
      estimatedBaselineTdee.trim() === '' ? undefined : Number(estimatedBaselineTdee)

    if (parsedHeight != null && (Number.isNaN(parsedHeight) || parsedHeight <= 0)) {
      setFormError('Height must be a positive number.')
      return
    }
    if (parsedTdee != null && (Number.isNaN(parsedTdee) || parsedTdee <= 0)) {
      setFormError('Estimated baseline expenditure must be a positive number.')
      return
    }

    setSubmitting(true)
    try {
      await saveProfile({ heightCm: parsedHeight, estimatedBaselineTdee: parsedTdee })
      const nowComplete = parsedHeight != null && parsedTdee != null
      if (!wasComplete && nowComplete) {
        navigate('/', { replace: true })
        return
      }
      setSavedMessage('Profile saved.')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save profile')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageContainer
      title={isSetupComplete ? 'Settings' : 'Set up your profile'}
      description={
        isSetupComplete
          ? 'Update the assumptions behind your calculations. Goal targets are managed from Goals.'
          : "A couple of details help us estimate your energy balance. You'll set your weight goal separately, next."
      }
    >
      {isLoading ? (
        <p className="text-sm text-[var(--color-ink-muted)]">Loading profile…</p>
      ) : (
        <div className="max-w-md">
          <section className="mb-6 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-moss)_16%,transparent)] bg-white/60 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Account
            </h2>
            <p className="mt-1 text-sm text-[var(--color-ink)]">{user?.name}</p>
            <p className="text-sm text-[var(--color-ink-muted)]">{user?.email}</p>
          </section>

          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <Input
              label="Height (cm)"
              name="heightCm"
              type="number"
              min={0}
              step="0.1"
              inputMode="decimal"
              value={heightCm}
              onChange={(event) => setHeightCm(event.target.value)}
            />
            <Input
              label="Estimated baseline expenditure (kcal/day)"
              name="estimatedBaselineTdee"
              type="number"
              min={0}
              step="1"
              inputMode="decimal"
              value={estimatedBaselineTdee}
              onChange={(event) => setEstimatedBaselineTdee(event.target.value)}
            />

            <div className="rounded-[var(--radius-sm)] bg-[var(--color-moss-soft)] px-3 py-2 text-xs text-[var(--color-ink-muted)]">
              Weight is tracked in kilograms and Move energy in kilojoules for this release.
            </div>

            {formError || error ? (
              <p role="alert" className="text-sm text-[var(--color-coral)]">
                {formError ?? error}
              </p>
            ) : null}
            {savedMessage ? (
              <p role="status" className="text-sm text-[var(--color-moss)]">
                {savedMessage}
              </p>
            ) : null}

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save profile'}
            </Button>
          </form>

          <p className="mt-6 text-xs text-[var(--color-ink-muted)]">
            Calorie expenditure, deficit and projected progress values are estimates and may differ
            from actual physiological outcomes.
          </p>
        </div>
      )}
    </PageContainer>
  )
}
