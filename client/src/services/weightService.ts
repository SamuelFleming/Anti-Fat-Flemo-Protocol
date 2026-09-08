import { apiRequest } from './apiClient'

export type WeightEntry = {
  id: string
  userId: string
  date: string
  weightKg: number
  createdAt: string
  updatedAt: string
}

export function listWeights(token: string, params: { startDate?: string; endDate?: string; date?: string } = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value != null) as [string, string][],
  ).toString()
  return apiRequest<{ items: WeightEntry[] }>(`/weights${query ? `?${query}` : ''}`, {
    method: 'GET',
    token,
  })
}

export function createWeight(token: string, input: { date: string; weightKg: number }) {
  return apiRequest<WeightEntry>('/weights', { method: 'POST', token, body: input })
}

export function updateWeight(token: string, id: string, input: { date?: string; weightKg?: number }) {
  return apiRequest<WeightEntry>(`/weights/${id}`, { method: 'PUT', token, body: input })
}

export function deleteWeight(token: string, id: string) {
  return apiRequest<void>(`/weights/${id}`, { method: 'DELETE', token })
}
