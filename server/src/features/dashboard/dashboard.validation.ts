import { z } from "zod";
import { calendarDateString } from "../../utils/validation.js";

export const dashboardQuerySchema = z.object({
  date: calendarDateString.optional(),
});

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
