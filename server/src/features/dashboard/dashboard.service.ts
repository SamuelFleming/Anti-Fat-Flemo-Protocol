import { Goal, type GoalDocument } from "../../models/Goal.js";
import { MealEntry } from "../../models/MealEntry.js";
import { DailyLog } from "../../models/DailyLog.js";
import { WeightEntry } from "../../models/WeightEntry.js";
import { Profile } from "../../models/Profile.js";
import {
  enumerateCalendarDates,
  formatCalendarDate,
  getWeekEnd,
  getWeekStart,
  toCalendarDate,
  todayCalendarDate,
} from "../../utils/date.js";
import {
  averageDailyCalories,
  averageMoveKj,
  caloriesRemaining,
  calculateDailyStatus,
  calculateDaysRemaining,
  calculateWeeklyStatus,
  estimatedDailyDeficit,
  goalProgressPercent,
  moveKjToKcal,
  remainingWeightKg,
  resolveCurrentWeightKg,
  sumDailyCalories,
  sumEstimatedWeeklyDeficit,
  sumWeeklyCalories,
  sumWeeklyMoveKj,
  weightChangeKg,
  type DailyStatus,
  type DaysRemaining,
  type WeeklyStatus,
} from "../../domain/index.js";
import type { DashboardQuery } from "./dashboard.validation.js";

interface DayAggregate {
  date: Date;
  caloriesConsumed: number;
  moveKj: number | null;
}

interface DayResult {
  date: string;
  isToday: boolean;
  isFuture: boolean;
  isSelected: boolean;
  caloriesConsumed: number;
  moveKj: number | null;
  status: DailyStatus | null;
}

export interface DashboardResult {
  date: string;
  activeGoal: ReturnType<GoalDocument["toJSON"]> | null;
  today: {
    date: string;
    caloriesConsumed: number;
    targetCalories: number | null;
    caloriesRemaining: number | null;
    moveKj: number | null;
    targetMoveKj: number | null;
    moveRemainingKj: number | null;
    baselineTdee: number | null;
    moveKcal: number | null;
    estimatedDeficit: number | null;
    status: DailyStatus | null;
    meals: unknown[];
  };
  weight: {
    currentWeightKg: number | null;
    startingWeightKg: number | null;
    targetWeightKg: number | null;
    weightLostKg: number | null;
    remainingKg: number | null;
    progressPercent: number | null;
    daysRemaining: DaysRemaining | null;
  };
  week: {
    startDate: string;
    endDate: string;
    totalCalories: number;
    averageCalories: number | null;
    totalMoveKj: number;
    averageMoveKj: number | null;
    estimatedDeficit: number | null;
    weightChangeKg: number | null;
    status: WeeklyStatus | null;
    days: DayResult[];
  };
}

export async function getDashboard(
  userId: string,
  query: DashboardQuery,
): Promise<DashboardResult> {
  const selectedDate = query.date ? toCalendarDate(query.date) : todayCalendarDate();
  const today = todayCalendarDate();
  const weekStart = getWeekStart(selectedDate);
  const weekEnd = getWeekEnd(selectedDate);
  const weekDates = enumerateCalendarDates(weekStart, weekEnd);

  const [activeGoal, profile, weekMeals, weekLogs, latestWeight] = await Promise.all([
    Goal.findOne({ userId, status: "active" }),
    Profile.findOne({ userId }),
    MealEntry.find({ userId, date: { $gte: weekStart, $lte: weekEnd } }),
    DailyLog.find({ userId, date: { $gte: weekStart, $lte: weekEnd } }),
    WeightEntry.findOne({ userId }).sort({ date: -1 }),
  ]);
  const baselineTdee = profile?.estimatedBaselineTdee ?? null;

  const mealsByDate = new Map<string, typeof weekMeals>();
  for (const meal of weekMeals) {
    const key = formatCalendarDate(meal.date);
    const bucket = mealsByDate.get(key) ?? [];
    bucket.push(meal);
    mealsByDate.set(key, bucket);
  }

  const moveByDate = new Map<string, number | null>();
  for (const log of weekLogs) {
    moveByDate.set(formatCalendarDate(log.date), log.moveKj ?? null);
  }

  const dayAggregates: DayAggregate[] = weekDates.map((date) => {
    const key = formatCalendarDate(date);
    return {
      date,
      caloriesConsumed: sumDailyCalories(mealsByDate.get(key) ?? []),
      moveKj: moveByDate.get(key) ?? null,
    };
  });

  const targetCalories = activeGoal?.targetCalories ?? null;
  const targetMoveKj = activeGoal?.targetMoveKj ?? null;

  const days: DayResult[] = dayAggregates.map((aggregate) => {
    const dateStr = formatCalendarDate(aggregate.date);
    const isFuture = aggregate.date.getTime() > today.getTime();
    const isToday = aggregate.date.getTime() === today.getTime();
    const isSelected = aggregate.date.getTime() === selectedDate.getTime();

    const status =
      !isFuture && targetCalories != null && targetMoveKj != null
        ? calculateDailyStatus({
            caloriesConsumed: aggregate.caloriesConsumed,
            targetCalories,
            moveKj: aggregate.moveKj,
            targetMoveKj,
          })
        : null;

    return {
      date: dateStr,
      isToday,
      isFuture,
      isSelected,
      caloriesConsumed: aggregate.caloriesConsumed,
      moveKj: aggregate.moveKj,
      status,
    };
  });

  const selectedDay = days.find((day) => day.isSelected) ?? days[0]!;
  const selectedDayMeals = mealsByDate.get(selectedDay.date) ?? [];

  const selectedDayCaloriesRemaining =
    targetCalories != null ? caloriesRemaining(targetCalories, selectedDay.caloriesConsumed) : null;
  const selectedDayMoveRemaining =
    targetMoveKj != null && selectedDay.moveKj != null ? targetMoveKj - selectedDay.moveKj : null;
  const selectedDayDeficit = estimatedDailyDeficit(
    baselineTdee,
    selectedDay.moveKj,
    selectedDay.caloriesConsumed,
  );

  const loggedDays = dayAggregates.filter((day) => day.date.getTime() <= today.getTime());
  const loggedCalorieDays = loggedDays.filter((day) => day.caloriesConsumed > 0).length;
  const loggedMoveDays = loggedDays.filter((day) => day.moveKj != null);

  const totalCalories = sumWeeklyCalories(loggedDays.map((day) => day.caloriesConsumed));
  const totalMoveKj = sumWeeklyMoveKj(loggedMoveDays.map((day) => day.moveKj as number));
  const averageCalories = averageDailyCalories(totalCalories, loggedCalorieDays);
  const avgMoveKj = averageMoveKj(totalMoveKj, loggedMoveDays.length);

  const weeklyDeficits = loggedDays.map((day) =>
    estimatedDailyDeficit(baselineTdee, day.moveKj, day.caloriesConsumed),
  );
  const weeklyEstimatedDeficit = sumEstimatedWeeklyDeficit(weeklyDeficits);

  const loggedStatuses = days
    .filter((day) => !day.isFuture)
    .map((day) => day.status ?? ("awaiting-data" as DailyStatus));

  const weeklyStatus =
    targetCalories != null && targetMoveKj != null
      ? calculateWeeklyStatus({
          dailyStatuses: loggedStatuses,
          averageCalories,
          targetCalories,
          averageMoveKj: avgMoveKj,
          targetMoveKj,
        })
      : null;

  const weekWeightEntries = await WeightEntry.find({
    userId,
    date: { $lte: weekEnd },
  }).sort({ date: 1 });
  const priorToWeek = weekWeightEntries.filter((entry) => entry.date.getTime() < weekStart.getTime());
  const withinWeek = weekWeightEntries.filter((entry) => entry.date.getTime() >= weekStart.getTime());
  const weekStartWeight = withinWeek[0]?.weightKg ?? priorToWeek.at(-1)?.weightKg ?? null;
  const weekEndWeight = withinWeek.at(-1)?.weightKg ?? priorToWeek.at(-1)?.weightKg ?? null;
  const weeklyWeightChange =
    weekStartWeight != null && weekEndWeight != null
      ? weightChangeKg(weekStartWeight, weekEndWeight)
      : null;

  const currentWeightKg = activeGoal
    ? resolveCurrentWeightKg(latestWeight?.weightKg, activeGoal.startingWeightKg)
    : (latestWeight?.weightKg ?? null);

  const weight = {
    currentWeightKg,
    startingWeightKg: activeGoal?.startingWeightKg ?? null,
    targetWeightKg: activeGoal?.targetWeightKg ?? null,
    weightLostKg:
      activeGoal && currentWeightKg != null
        ? weightChangeKg(activeGoal.startingWeightKg, currentWeightKg)
        : null,
    remainingKg:
      activeGoal && currentWeightKg != null
        ? remainingWeightKg(currentWeightKg, activeGoal.targetWeightKg)
        : null,
    progressPercent:
      activeGoal && currentWeightKg != null
        ? goalProgressPercent(activeGoal.startingWeightKg, currentWeightKg, activeGoal.targetWeightKg)
        : null,
    daysRemaining: activeGoal
      ? calculateDaysRemaining(activeGoal.targetDate ?? null, today)
      : null,
  };

  return {
    date: formatCalendarDate(selectedDate),
    activeGoal: activeGoal ? activeGoal.toJSON() : null,
    today: {
      date: selectedDay.date,
      caloriesConsumed: selectedDay.caloriesConsumed,
      targetCalories,
      caloriesRemaining: selectedDayCaloriesRemaining,
      moveKj: selectedDay.moveKj,
      targetMoveKj,
      moveRemainingKj: selectedDayMoveRemaining,
      baselineTdee,
      moveKcal: selectedDay.moveKj != null ? moveKjToKcal(selectedDay.moveKj) : null,
      estimatedDeficit: selectedDayDeficit,
      status: selectedDay.status,
      meals: selectedDayMeals.map((meal) => meal.toJSON()),
    },
    weight,
    week: {
      startDate: formatCalendarDate(weekStart),
      endDate: formatCalendarDate(weekEnd),
      totalCalories,
      averageCalories,
      totalMoveKj,
      averageMoveKj: avgMoveKj,
      estimatedDeficit: weeklyEstimatedDeficit,
      weightChangeKg: weeklyWeightChange,
      status: weeklyStatus,
      days,
    },
  };
}
