/** Formats a number with thousands separators, e.g. `1420` -> `1,420`. */
export function formatNumber(value: number, fractionDigits = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

export function formatKcal(value: number): string {
  return `${formatNumber(Math.round(value))} kcal`
}

export function formatKj(value: number): string {
  return `${formatNumber(Math.round(value))} kJ`
}

export function formatKg(value: number, fractionDigits = 1): string {
  return `${formatNumber(value, fractionDigits)} kg`
}

/** Formats a `YYYY-MM-DD` string for compact display, e.g. `Tue 8 Sep`. */
export function formatShortDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

/** Formats a `YYYY-MM-DD` string for full display, e.g. `Tuesday 8 September`. */
export function formatLongDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}

/** `YYYY-MM-DD` for today's UTC calendar date, matching backend calendar-day semantics. */
export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysToDateString(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}
