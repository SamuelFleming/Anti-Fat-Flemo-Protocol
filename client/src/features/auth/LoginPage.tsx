import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../contexts/AuthContext'
import { ApiError } from '../../services/apiClient'
import { JourneyEntryMotif } from './JourneyEntryMotif'

export function LoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successPulse, setSuccessPulse] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to={from} replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      setSuccessPulse(true)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-moss)]">
        Anti-Fat-Flemo
      </p>
      <h1
        className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Continue your journey
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        Sign in to pick up tracking where you left off.
      </p>

      <div className="mt-8">
        <JourneyEntryMotif active={successPulse} />
      </div>

      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? (
          <p role="alert" className="text-sm text-[var(--color-coral)]">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={submitting || status === 'loading'}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
        New here?{' '}
        <Link className="font-medium text-[var(--color-moss)] underline-offset-2 hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  )
}
