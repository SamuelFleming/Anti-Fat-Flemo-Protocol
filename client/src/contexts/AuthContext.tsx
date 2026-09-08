import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ApiError } from '../services/apiClient'
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type AuthUser,
} from '../services/authService'

const TOKEN_KEY = 'aff.auth.token'

type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))

  useEffect(() => {
    let cancelled = false

    async function restore() {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (!stored) {
        if (!cancelled) {
          setToken(null)
          setUser(null)
          setStatus('anonymous')
        }
        return
      }

      try {
        const result = await fetchCurrentUser(stored)
        if (cancelled) return
        setToken(stored)
        setUser(result.user)
        setStatus('authenticated')
      } catch (error) {
        if (cancelled) return
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
        setStatus('anonymous')
        if (!(error instanceof ApiError && error.status === 401)) {
          console.error('Failed to restore session', error)
        }
      }
    }

    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const persistSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUser(nextUser)
    setStatus('authenticated')
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginRequest({ email, password })
      persistSession(result.token, result.user)
    },
    [persistSession],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await registerRequest({ name, email, password })
      persistSession(result.token, result.user)
    },
    [persistSession],
  )

  const logout = useCallback(async () => {
    const current = token
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setStatus('anonymous')
    if (current) {
      try {
        await logoutRequest(current)
      } catch {
        // Stateless JWT logout is best-effort; local clear already completed.
      }
    }
  }, [token])

  const value = useMemo(
    () => ({ status, user, token, login, register, logout }),
    [status, user, token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
