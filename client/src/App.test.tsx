import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.stubGlobal(
  'fetch',
  vi.fn(async () =>
    Promise.resolve({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Unauthorized' } }),
    }),
  ),
)

describe('App', () => {
  it('renders the login journey entry when unauthenticated', async () => {
    render(<App />)
    expect(await screen.findByText('Continue your journey')).toBeInTheDocument()
  })
})
