import { apiRequest } from './apiClient'

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthResponse = {
  user: AuthUser
  token: string
}

export type CurrentUserResponse = {
  user: AuthUser
  profile: unknown
}

export function register(input: { name: string; email: string; password: string }) {
  return apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: input })
}

export function login(input: { email: string; password: string }) {
  return apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: input })
}

export function fetchCurrentUser(token: string) {
  return apiRequest<CurrentUserResponse>('/auth/me', { method: 'GET', token })
}

export function logout(token: string) {
  return apiRequest<{ ok: boolean }>('/auth/logout', { method: 'POST', token })
}
