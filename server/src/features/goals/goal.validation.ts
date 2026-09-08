import { z } from "zod";
import { GOAL_STATUSES } from "../../models/Goal.js";
import { calendarDateString } from "../../utils/validation.js";

export const createGoalSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  startDate: calendarDateString,
  targetDate: calendarDateString.optional(),
  startingWeightKg: z.number().positive().max(500),
  targetWeightKg: z.number().positive().max(500),
  targetCalories: z.number().positive().max(20000),
  targetMoveKj: z.number().nonnegative().max(50000),
});

// Status transitions go through POST /:id/complete, not a generic update.
export const updateGoalSchema = createGoalSchema.partial();

export const listGoalsQuerySchema = z.object({
  status: z.enum(GOAL_STATUSES).optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type ListGoalsQuery = z.infer<typeof listGoalsQuerySchema>;
