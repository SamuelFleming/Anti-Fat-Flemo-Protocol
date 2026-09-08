import { apiRequest } from './apiClient'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other'

export type Meal = {
  id: string
  userId: string
  date: string
  name: string
  mealType: MealType
  calories: number
  proteinGrams?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export type MealInput = {
  date: string
  name: string
  mealType: MealType
  calories: number
  proteinGrams?: number
  notes?: string
}

export function listMeals(token: string, date: string) {
  return apiRequest<{ items: Meal[] }>(`/meals?date=${date}`, { method: 'GET', token })
}

export function createMeal(token: string, input: MealInput) {
  return apiRequest<Meal>('/meals', { method: 'POST', token, body: input })
}

export function updateMeal(token: string, id: string, input: Partial<MealInput>) {
  return apiRequest<Meal>(`/meals/${id}`, { method: 'PUT', token, body: input })
}

export function deleteMeal(token: string, id: string) {
  return apiRequest<void>(`/meals/${id}`, { method: 'DELETE', token })
}
