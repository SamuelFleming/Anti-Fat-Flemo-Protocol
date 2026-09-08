import { apiRequest } from './apiClient'

export type GoalStatus = 'active' | 'completed' | 'archived'

export type Goal = {
  id: string
  userId: string
  name: string
  startDate: string
  targetDate?: string
  startingWeightKg: number
  targetWeightKg: number
  targetCalories: number
  targetMoveKj: number
  status: GoalStatus
  createdAt: string
  updatedAt: string
}

export type GoalInput = {
  name: string
  startDate: string
  targetDate?: string
  startingWeightKg: number
  targetWeightKg: number
  targetCalories: number
  targetMoveKj: number
}

export function listGoals(token: string, status?: GoalStatus) {
  const query = status ? `?status=${status}` : ''
  return apiRequest<{ items: Goal[] }>(`/goals${query}`, { method: 'GET', token })
}

export function fetchActiveGoal(token: string) {
  return apiRequest<Goal | null>('/goals/active', { method: 'GET', token })
}

export function createGoal(token: string, input: GoalInput) {
  return apiRequest<Goal>('/goals', { method: 'POST', token, body: input })
}

export function updateGoal(token: string, id: string, input: Partial<GoalInput>) {
  return apiRequest<Goal>(`/goals/${id}`, { method: 'PUT', token, body: input })
}

export function completeGoal(token: string, id: string) {
  return apiRequest<Goal>(`/goals/${id}/complete`, { method: 'POST', token })
}
