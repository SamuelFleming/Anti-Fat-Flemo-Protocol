import { describe, expect, it } from "vitest";
import { formatCalendarDate, toCalendarDate } from "../../src/utils/date.js";

describe("toCalendarDate / formatCalendarDate", () => {
  it("parses a YYYY-MM-DD string to UTC midnight", () => {
    const date = toCalendarDate("2026-09-08");
    expect(date.toISOString()).toBe("2026-09-08T00:00:00.000Z");
  });

  it("strips time-of-day from a Date input, using its UTC calendar day", () => {
    const date = toCalendarDate(new Date("2026-09-08T15:42:00Z"));
    expect(date.toISOString()).toBe("2026-09-08T00:00:00.000Z");
  });

  it("round-trips through formatCalendarDate", () => {
    expect(formatCalendarDate(toCalendarDate("2026-01-31"))).toBe("2026-01-31");
  });

  it("rejects malformed date strings", () => {
    expect(() => toCalendarDate("08-09-2026")).toThrow();
    expect(() => toCalendarDate("2026-13-40")).toThrow();
    expect(() => toCalendarDate("not-a-date")).toThrow();
  });
});
