import { z } from "zod";

/** Shared `YYYY-MM-DD` calendar-date string schema for request bodies/queries/params. */
export const calendarDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date format YYYY-MM-DD");

/** `date` XOR `startDate`+`endDate` (both-or-neither) for list/date-filtered endpoints. */
export const dateFilterQuerySchema = z
  .object({
    date: calendarDateString.optional(),
    startDate: calendarDateString.optional(),
    endDate: calendarDateString.optional(),
  })
  .refine((data) => Boolean(data.startDate) === Boolean(data.endDate), {
    message: "startDate and endDate must be provided together",
  });

export type DateFilterQuery = z.infer<typeof dateFilterQuerySchema>;
