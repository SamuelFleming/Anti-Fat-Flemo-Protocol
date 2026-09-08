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
