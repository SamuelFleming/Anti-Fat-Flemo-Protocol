import { z } from "zod";
import { calendarDateString, dateFilterQuerySchema } from "../../utils/validation.js";

export const createWeightSchema = z.object({
  date: calendarDateString,
  weightKg: z.number().positive().max(500),
});

export const updateWeightSchema = createWeightSchema.partial();

export const listWeightsQuerySchema = dateFilterQuerySchema;

export type CreateWeightInput = z.infer<typeof createWeightSchema>;
export type UpdateWeightInput = z.infer<typeof updateWeightSchema>;
