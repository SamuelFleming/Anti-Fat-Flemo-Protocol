import { Goal, type GoalDocument } from "../../models/Goal.js";
import { MealEntry } from "../../models/MealEntry.js";
import { DailyLog } from "../../models/DailyLog.js";
import { WeightEntry } from "../../models/WeightEntry.js";
import { Profile } from "../../models/Profile.js";
import { AppError } from "../../utils/AppError.js";
import { findOwnedById } from "../../utils/ownership.js";
import {
  enumerateCalendarDates,
  formatCalendarDate,
  toCalendarDate,
  todayCalendarDate,
} from "../../utils/date.js";
import {
  averageDailyCalories,
  averageMoveKj,
  calculateDailyStatus,
  estimatedDailyDeficit,
  sumDailyCalories,
  sumEstimatedWeeklyDeficit,
  sumWeeklyCalories,
  sumWeeklyMoveKj,
  weightChangeKg,
  type DailyStatus,
} from "../../domain/index.js";
import { PROGRESS_RANGES, type ProgressQuery } from "./progress.validation.js";

type ProgressRange = (typeof PROGRESS_RANGES)[number];

export interface HistoryRow {
  date: string;
  caloriesConsumed: number;
  targetCalories: number | null;
  moveKj: number | null;
  targetMoveKj: number | null;
  estimatedDeficit: number | null;
  status: DailyStatus | null;
  weightKg: number | null;
  goalId: string | null;
}

export interface ProgressResult {
  range: {
    type: ProgressRange | "custom";
    startDate: string;
    endDate: string;
    goalId: string | null;
  };
  goals: ReturnType<GoalDocument["toJSON"]>[];
  history: HistoryRow[];
  weightEntries: { date: string; weightKg: number }[];
  summary: {
    loggedDayCount: number;
    totalDayCount: number;
    averageCalories: number | null;
    averageMoveKj: number | null;
    totalEstimatedDeficit: number | null;
    startWeightKg: number | null;
    endWeightKg: number | null;
    weightChangeKg: number | null;
  };
}

function resolveGoalForDate(goals: GoalDocument[], date: Date): GoalDocument | null {
  let match: GoalDocument | null = null;
  for (const goal of goals) {
    if (goal.startDate.getTime() <= date.getTime()) {
      if (!match || goal.startDate.getTime() > match.startDate.getTime()) {
        match = goal;
      }
    }
  }
  return match;
}

async function resolveRange(
  userId: string,
  query: ProgressQuery,
): Promise<{ start: Date; end: Date; type: ProgressResult["range"]["type"]; goalId: string | null }> {
  const today = todayCalendarDate();

  if (query.startDate && query.endDate) {
    return {
      start: toCalendarDate(query.startDate),
      end: toCalendarDate(query.endDate),
      type: "custom",
      goalId: null,
    };
  }

  if (query.goalId) {
    const goal = await findOwnedById(Goal, query.goalId, userId, "Goal not found");
    const end =
      goal.targetDate ?? (goal.status === "active" ? today : toCalendarDate(goal.updatedAt));
    return { start: goal.startDate, end, type: "goal", goalId: goal.id };
  }

  if (query.range === "goal") {
    const activeGoal = await Goal.findOne({ userId, status: "active" });
    if (!activeGoal) {
      throw AppError.badRequest("No active goal to show progress for.");
    }
    const end = activeGoal.targetDate ?? today;
    return { start: activeGoal.startDate, end, type: "goal", goalId: activeGoal.id };
  }

  if (query.range === "7d") {
    const start = new Date(today);
    start.setUTCDate(start.getUTCDate() - 6);
    return { start, end: today, type: "7d", goalId: null };
  }

  if (query.range === "all") {
    const [firstGoal, firstMeal, firstLog, firstWeight] = await Promise.all([
      Goal.findOne({ userId }).sort({ startDate: 1 }),
      MealEntry.findOne({ userId }).sort({ date: 1 }),
      DailyLog.findOne({ userId }).sort({ date: 1 }),
      WeightEntry.findOne({ userId }).sort({ date: 1 }),
    ]);

    const candidates = [firstGoal?.startDate, firstMeal?.date, firstLog?.date, firstWeight?.date].filter(
      (date): date is Date => date != null,
    );
    const start = candidates.length > 0
      ? new Date(Math.min(...candidates.map((date) => date.getTime())))
      : today;

    return { start, end: today, type: "all", goalId: null };
  }

  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 29);
  return { start, end: today, type: "30d", goalId: null };
}

export async function getProgress(userId: string, query: ProgressQuery): Promise<ProgressResult> {
  const { start, end, type, goalId } = await resolveRange(userId, query);
  const today = todayCalendarDate();
  const rangeDates = enumerateCalendarDates(start, end);

  const [allGoals, profile, meals, logs, weightEntries] = await Promise.all([
    Goal.find({ userId }).sort({ startDate: 1 }),
    Profile.findOne({ userId }),
    MealEntry.find({ userId, date: { $gte: start, $lte: end } }),
    DailyLog.find({ userId, date: { $gte: start, $lte: end } }),
    WeightEntry.find({ userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
  ]);

  const baselineTdee = profile?.estimatedBaselineTdee ?? null;

  const mealsByDate = new Map<string, typeof meals>();
  for (const meal of meals) {
    const key = formatCalendarDate(meal.date);
    const bucket = mealsByDate.get(key) ?? [];
    bucket.push(meal);
    mealsByDate.set(key, bucket);
  }

  const moveByDate = new Map<string, number | null>();
  for (const log of logs) {
    moveByDate.set(formatCalendarDate(log.date), log.moveKj ?? null);
  }

  const weightByDate = new Map<string, number>();
  for (const entry of weightEntries) {
    weightByDate.set(formatCalendarDate(entry.date), entry.weightKg);
  }

  const history: HistoryRow[] = rangeDates.map((date) => {
    const dateStr = formatCalendarDate(date);
    const goalForDate = resolveGoalForDate(allGoals, date);
    const caloriesConsumed = sumDailyCalories(mealsByDate.get(dateStr) ?? []);
    const moveKj = moveByDate.get(dateStr) ?? null;
    const targetCalories = goalForDate?.targetCalories ?? null;
    const targetMoveKj = goalForDate?.targetMoveKj ?? null;
    const isFuture = date.getTime() > today.getTime();

    const status =
      !isFuture && targetCalories != null && targetMoveKj != null
        ? calculateDailyStatus({ caloriesConsumed, targetCalories, moveKj, targetMoveKj })
        : null;

    return {
      date: dateStr,
      caloriesConsumed,
      targetCalories,
      moveKj,
      targetMoveKj,
      estimatedDeficit: estimatedDailyDeficit(baselineTdee, moveKj, caloriesConsumed),
      status,
      weightKg: weightByDate.get(dateStr) ?? null,
      goalId: goalForDate?.id ?? null,
    };
  });

  const loggedRows = history.filter((row) => row.caloriesConsumed > 0 || row.moveKj != null);
  const loggedCalorieDayCount = history.filter((row) => row.caloriesConsumed > 0).length;
  const loggedMoveRows = history.filter((row) => row.moveKj != null);

  const totalCalories = sumWeeklyCalories(history.map((row) => row.caloriesConsumed));
  const totalMoveKj = sumWeeklyMoveKj(loggedMoveRows.map((row) => row.moveKj as number));
  const averageCalories = averageDailyCalories(totalCalories, loggedCalorieDayCount);
  const avgMoveKj = averageMoveKj(totalMoveKj, loggedMoveRows.length);
  const totalEstimatedDeficit = sumEstimatedWeeklyDeficit(history.map((row) => row.estimatedDeficit));

  const startWeightKg = weightEntries[0]?.weightKg ?? null;
  const endWeightKg = weightEntries.at(-1)?.weightKg ?? null;

  const goalsInRange = allGoals.filter(
    (goal) =>
      goal.startDate.getTime() <= end.getTime() &&
      (goal.targetDate == null || goal.targetDate.getTime() >= start.getTime()),
  );

  return {
    range: {
      type,
      startDate: formatCalendarDate(start),
      endDate: formatCalendarDate(end),
      goalId,
    },
    goals: goalsInRange.map((goal) => goal.toJSON()),
    history,
    weightEntries: weightEntries.map((entry) => ({
      date: formatCalendarDate(entry.date),
      weightKg: entry.weightKg,
    })),
    summary: {
      loggedDayCount: loggedRows.length,
      totalDayCount: history.length,
      averageCalories,
      averageMoveKj: avgMoveKj,
      totalEstimatedDeficit,
      startWeightKg,
      endWeightKg,
      weightChangeKg:
        startWeightKg != null && endWeightKg != null
          ? weightChangeKg(startWeightKg, endWeightKg)
          : null,
    },
  };
}
