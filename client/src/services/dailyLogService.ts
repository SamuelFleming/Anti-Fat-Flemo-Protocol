import { apiRequest } from './apiClient'

export type DailyLog = {
  id: string
  userId: string
  date: string
  moveKj?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export function fetchDailyLog(token: string, date: string) {
  return apiRequest<{ items: DailyLog[] }>(`/daily-logs?date=${date}`, { method: 'GET', token })
}

export function upsertDailyLog(token: string, date: string, input: { moveKj?: number; notes?: string }) {
  return apiRequest<DailyLog>(`/daily-logs/${date}`, { method: 'PUT', token, body: input })
}
