import { z } from "zod";
import { MEAL_TYPES } from "../../models/MealEntry.js";
import { calendarDateString, dateFilterQuerySchema } from "../../utils/validation.js";

export const createMealSchema = z.object({
  date: calendarDateString,
  name: z.string().trim().min(1, "Name is required").max(160),
  mealType: z.enum(MEAL_TYPES),
  calories: z.number().nonnegative().max(20000),
  proteinGrams: z.number().nonnegative().max(1000).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const updateMealSchema = createMealSchema.partial();

export const listMealsQuerySchema = dateFilterQuerySchema;

export type CreateMealInput = z.infer<typeof createMealSchema>;
export type UpdateMealInput = z.infer<typeof updateMealSchema>;
