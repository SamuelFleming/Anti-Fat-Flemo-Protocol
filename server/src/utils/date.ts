const CALENDAR_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Normalises any date input to UTC midnight of its calendar day, so stored
 * "date" fields always represent a calendar day rather than a timestamp and
 * are never shifted by server/client timezone differences.
 */
export function toCalendarDate(input: string | Date): Date {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      throw new Error(`Invalid calendar date: ${String(input)}`);
    }
    return new Date(
      Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()),
    );
  }

  const match = CALENDAR_DATE_PATTERN.exec(input);
  if (!match) {
    throw new Error(`Invalid calendar date: ${input}. Expected format YYYY-MM-DD.`);
  }

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new Error(`Invalid calendar date: ${input}.`);
  }

  return date;
}

/** Formats a stored calendar-date `Date` back to `YYYY-MM-DD`. */
export function formatCalendarDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** The current calendar day at UTC midnight (see `05-Data-Model.md` #11). */
export function todayCalendarDate(): Date {
  return toCalendarDate(new Date());
}

/** Monday (UTC) of the calendar week containing `date`. */
export function getWeekStart(date: Date): Date {
  const day = date.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setUTCDate(date.getUTCDate() + diffToMonday);
  return start;
}

/** Sunday (UTC) of the calendar week containing `date`. */
export function getWeekEnd(date: Date): Date {
  const end = getWeekStart(date);
  end.setUTCDate(end.getUTCDate() + 6);
  return end;
}

/** Every calendar date from `start` to `end` inclusive. */
export function enumerateCalendarDates(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}
