import { z } from "zod";
import { calendarDateString, dateFilterQuerySchema } from "../../utils/validation.js";

export const upsertDailyLogSchema = z.object({
  moveKj: z.number().nonnegative().max(50000).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const dailyLogDateParamSchema = z.object({
  date: calendarDateString,
});

export const listDailyLogsQuerySchema = dateFilterQuerySchema;

export type UpsertDailyLogInput = z.infer<typeof upsertDailyLogSchema>;
