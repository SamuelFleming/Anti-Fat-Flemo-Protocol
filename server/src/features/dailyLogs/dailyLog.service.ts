import { DailyLog, type DailyLogDocument } from "../../models/DailyLog.js";
import { listOwned } from "../../utils/ownership.js";
import { buildDateRangeFilter } from "../../utils/dateFilter.js";
import { toCalendarDate } from "../../utils/date.js";
import type { DateFilterQuery } from "../../utils/validation.js";
import type { UpsertDailyLogInput } from "./dailyLog.validation.js";

export async function listDailyLogs(
  userId: string,
  query: DateFilterQuery,
): Promise<DailyLogDocument[]> {
  return listOwned(DailyLog, userId, buildDateRangeFilter(query)).sort({ date: 1 });
}

/**
 * Creates or updates the single daily log for `userId`+`date`, keyed by the
 * calendar date rather than a document id (there is at most one log per day).
 */
export async function upsertDailyLog(
  userId: string,
  dateStr: string,
  input: UpsertDailyLogInput,
): Promise<DailyLogDocument> {
  const date = toCalendarDate(dateStr);

  const log = await DailyLog.findOneAndUpdate(
    { userId, date },
    { $set: input },
    { upsert: true, returnDocument: "after", runValidators: true },
  );

  return log!;
}
