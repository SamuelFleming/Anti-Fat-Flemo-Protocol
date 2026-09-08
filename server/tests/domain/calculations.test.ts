import { describe, expect, it } from "vitest";
import {
  averageDailyCalories,
  averageMoveKj,
  caloriesRemaining,
  calculateDailyStatus,
  calculateDaysRemaining,
  calculateWeeklyStatus,
  estimatedDailyDeficit,
  estimatedDailyExpenditure,
  goalProgressPercent,
  moveKjToKcal,
  remainingWeightKg,
  resolveCurrentWeightKg,
  sumDailyCalories,
  sumEstimatedWeeklyDeficit,
  sumWeeklyCalories,
  sumWeeklyMoveKj,
  weightChangeKg,
} from "../../src/domain/index.js";

describe("sumDailyCalories", () => {
  it("sums meal calories for the day", () => {
    expect(sumDailyCalories([{ calories: 400 }, { calories: 120 }])).toBe(520);
  });

  it("is zero for no meals, not missing data", () => {
    expect(sumDailyCalories([])).toBe(0);
  });
});

describe("caloriesRemaining", () => {
  it("is positive when under target", () => {
    expect(caloriesRemaining(1800, 1420)).toBe(380);
  });

  it("is negative when over target (caller displays Math.abs as 'over')", () => {
    expect(caloriesRemaining(1800, 1950)).toBe(-150);
  });
});

describe("moveKjToKcal", () => {
  it("converts kJ to kcal using the documented factor", () => {
    expect(moveKjToKcal(1800)).toBeCloseTo(430.17, 1);
  });
});

describe("estimatedDailyExpenditure / estimatedDailyDeficit", () => {
  it("matches the documented worked example", () => {
    const expenditure = estimatedDailyExpenditure(2150, 1800);
    expect(expenditure).toBeCloseTo(2580.17, 1);
    expect(estimatedDailyDeficit(2150, 1800, 1800)).toBeCloseTo(780.17, 1);
  });

  it("returns null when baseline TDEE is missing (not zero)", () => {
    expect(estimatedDailyExpenditure(null, 1800)).toBeNull();
    expect(estimatedDailyDeficit(null, 1800, 1800)).toBeNull();
  });

  it("returns null when Move has not been recorded (not zero)", () => {
    expect(estimatedDailyExpenditure(2150, null)).toBeNull();
    expect(estimatedDailyDeficit(2150, null, 1800)).toBeNull();
  });
});

describe("weekly calorie/move aggregates", () => {
  it("sums and averages over logged days only", () => {
    const weekly = sumWeeklyCalories([1700, 1800, 1650]);
    expect(weekly).toBe(5150);
    expect(averageDailyCalories(weekly, 3)).toBeCloseTo(1716.67, 1);
  });

  it("returns null averages when no days are logged", () => {
    expect(averageDailyCalories(0, 0)).toBeNull();
    expect(averageMoveKj(0, 0)).toBeNull();
  });

  it("sums move kJ and averages over days with Move data", () => {
    const weekly = sumWeeklyMoveKj([1800, 1700]);
    expect(weekly).toBe(3500);
    expect(averageMoveKj(weekly, 2)).toBe(1750);
  });
});

describe("sumEstimatedWeeklyDeficit", () => {
  it("only includes dates with a computable estimate", () => {
    expect(sumEstimatedWeeklyDeficit([500, null, 300, null])).toBe(800);
  });

  it("returns null when no date has sufficient data", () => {
    expect(sumEstimatedWeeklyDeficit([null, null])).toBeNull();
  });
});

describe("weight/goal calculations", () => {
  it("falls back to starting weight when no entry exists", () => {
    expect(resolveCurrentWeightKg(null, 82)).toBe(82);
    expect(resolveCurrentWeightKg(80.7, 82)).toBe(80.7);
  });

  it("computes weight change as positive for loss", () => {
    expect(weightChangeKg(82, 80.7)).toBeCloseTo(1.3, 5);
  });

  it("never returns a negative remaining weight", () => {
    expect(remainingWeightKg(81.4, 76)).toBeCloseTo(5.4, 5);
    expect(remainingWeightKg(75, 76)).toBe(0);
  });

  it("matches the documented loss-goal progress example", () => {
    // Required loss 6kg, achieved 1.3kg => ~21.67%
    expect(goalProgressPercent(82, 80.7, 76)).toBeCloseTo(21.67, 1);
  });

  it("clamps progress between 0 and 100 for regression/overshoot", () => {
    expect(goalProgressPercent(82, 83, 76)).toBe(0); // regressed beyond start
    expect(goalProgressPercent(82, 74, 76)).toBe(100); // beyond goal
  });
});

describe("calculateDaysRemaining", () => {
  it("counts whole days remaining", () => {
    const result = calculateDaysRemaining(new Date("2026-09-15T00:00:00Z"), new Date("2026-09-08T00:00:00Z"));
    expect(result).toEqual({ status: "remaining", days: 7 });
  });

  it("reports 'passed' rather than a negative value", () => {
    const result = calculateDaysRemaining(new Date("2026-09-01T00:00:00Z"), new Date("2026-09-08T00:00:00Z"));
    expect(result).toEqual({ status: "passed" });
  });

  it("reports no-target-date when the goal has none", () => {
    expect(calculateDaysRemaining(null, new Date())).toEqual({ status: "no-target-date" });
  });
});

describe("calculateDailyStatus", () => {
  const base = { targetCalories: 1800, targetMoveKj: 1800 };

  it("is on-track within both boundaries", () => {
    expect(
      calculateDailyStatus({ ...base, caloriesConsumed: 1850, moveKj: 1650 }),
    ).toBe("on-track");
  });

  it("is off-track when calories exceed target + 300", () => {
    expect(
      calculateDailyStatus({ ...base, caloriesConsumed: 2150, moveKj: 1800 }),
    ).toBe("off-track");
  });

  it("is off-track when Move is under 60% of target", () => {
    expect(
      calculateDailyStatus({ ...base, caloriesConsumed: 1700, moveKj: 900 }),
    ).toBe("off-track");
  });

  it("is partial between the on-track and off-track bounds", () => {
    expect(
      calculateDailyStatus({ ...base, caloriesConsumed: 2000, moveKj: 1800 }),
    ).toBe("partial");
  });

  it("is awaiting-data when Move is unrecorded and calories alone are inconclusive", () => {
    expect(
      calculateDailyStatus({ ...base, caloriesConsumed: 1700, moveKj: null }),
    ).toBe("awaiting-data");
  });

  it("is still off-track when Move is unrecorded but calories conclusively breach", () => {
    expect(
      calculateDailyStatus({ ...base, caloriesConsumed: 2200, moveKj: null }),
    ).toBe("off-track");
  });
});

describe("calculateWeeklyStatus", () => {
  const base = { targetCalories: 1800, targetMoveKj: 1800 };

  it("is on-track when a majority of days are on-track and averages are near target", () => {
    expect(
      calculateWeeklyStatus({
        ...base,
        dailyStatuses: ["on-track", "on-track", "partial"],
        averageCalories: 1780,
        averageMoveKj: 1750,
      }),
    ).toBe("on-track");
  });

  it("is off-track when a majority of days are off-track", () => {
    expect(
      calculateWeeklyStatus({
        ...base,
        dailyStatuses: ["off-track", "off-track", "on-track"],
        averageCalories: 2100,
        averageMoveKj: 1200,
      }),
    ).toBe("off-track");
  });

  it("is mixed when performance varies without a clear majority", () => {
    expect(
      calculateWeeklyStatus({
        ...base,
        dailyStatuses: ["on-track", "off-track", "partial"],
        averageCalories: 1850,
        averageMoveKj: 1600,
      }),
    ).toBe("mixed");
  });

  it("is awaiting-data when no day in the range has been logged", () => {
    expect(
      calculateWeeklyStatus({
        ...base,
        dailyStatuses: ["awaiting-data", "awaiting-data"],
        averageCalories: null,
        averageMoveKj: null,
      }),
    ).toBe("awaiting-data");
  });
});
