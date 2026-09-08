import { z } from "zod";
import { calendarDateString } from "../../utils/validation.js";

export const PROGRESS_RANGES = ["7d", "30d", "goal", "all"] as const;

export const progressQuerySchema = z
  .object({
    range: z.enum(PROGRESS_RANGES).optional(),
    goalId: z.string().optional(),
    startDate: calendarDateString.optional(),
    endDate: calendarDateString.optional(),
  })
  .refine((data) => Boolean(data.startDate) === Boolean(data.endDate), {
    message: "startDate and endDate must be provided together",
  });

export type ProgressQuery = z.infer<typeof progressQuerySchema>;
