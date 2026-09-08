import { apiRequest } from './apiClient'

export type Profile = {
  id: string
  userId: string
  heightCm?: number
  preferredWeightUnit: 'kg'
  preferredEnergyUnit: 'kJ'
  estimatedBaselineTdee?: number
  createdAt: string
  updatedAt: string
}

export type UpdateProfileInput = {
  heightCm?: number
  estimatedBaselineTdee?: number
}

export function fetchProfile(token: string) {
  return apiRequest<Profile>('/profile', { method: 'GET', token })
}

export function updateProfile(token: string, input: UpdateProfileInput) {
  return apiRequest<Profile>('/profile', { method: 'PUT', token, body: input })
}

/** A profile is "set up" once the values needed for goal/target calculations exist. */
export function isProfileSetupComplete(profile: Profile | null): boolean {
  if (!profile) return false
  return profile.heightCm != null && profile.estimatedBaselineTdee != null
}
