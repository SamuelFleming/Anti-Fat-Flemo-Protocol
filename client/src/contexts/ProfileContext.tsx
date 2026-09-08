import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import {
  fetchProfile,
  isProfileSetupComplete,
  updateProfile as updateProfileRequest,
  type Profile,
  type UpdateProfileInput,
} from '../services/profileService'

type ProfileContextValue = {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  isSetupComplete: boolean
  refresh: () => Promise<void>
  saveProfile: (input: UpdateProfileInput) => Promise<Profile>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { status, token } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token) {
      setProfile(null)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchProfile(token)
      setProfile(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load profile')
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (status === 'authenticated') {
      void load()
    } else if (status === 'anonymous') {
      setProfile(null)
      setIsLoading(false)
    }
  }, [status, load])

  const saveProfile = useCallback(
    async (input: UpdateProfileInput) => {
      if (!token) throw new Error('Not authenticated')
      const result = await updateProfileRequest(token, input)
      setProfile(result)
      return result
    },
    [token],
  )

  const value = useMemo(
    () => ({
      profile,
      isLoading,
      error,
      isSetupComplete: isProfileSetupComplete(profile),
      refresh: load,
      saveProfile,
    }),
    [profile, isLoading, error, load, saveProfile],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider')
  }
  return context
}
