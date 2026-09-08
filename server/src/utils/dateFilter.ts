import { toCalendarDate } from "./date.js";
import type { DateFilterQuery } from "./validation.js";

/**
 * Converts a validated `{ date }` or `{ startDate, endDate }` query into a
 * deterministic Mongo filter on a `date` field. Absent input yields `{}`
 * (no date restriction), never a fabricated default range.
 */
export function buildDateRangeFilter(query: DateFilterQuery): Record<string, unknown> {
  if (query.date) {
    return { date: toCalendarDate(query.date) };
  }

  if (query.startDate && query.endDate) {
    return {
      date: {
        $gte: toCalendarDate(query.startDate),
        $lte: toCalendarDate(query.endDate),
      },
    };
  }

  return {};
}
