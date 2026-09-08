import { Goal, type GoalDocument, type GoalStatus } from "../../models/Goal.js";
import { AppError } from "../../utils/AppError.js";
import { findOwnedById, listOwned, updateOwnedById } from "../../utils/ownership.js";
import type { CreateGoalInput, UpdateGoalInput } from "./goal.validation.js";

const NOT_FOUND_MESSAGE = "Goal not found";

export async function listGoals(userId: string, status?: GoalStatus): Promise<GoalDocument[]> {
  return listOwned(Goal, userId, status ? { status } : {}).sort({ startDate: -1 });
}

export async function getActiveGoal(userId: string): Promise<GoalDocument | null> {
  return Goal.findOne({ userId, status: "active" });
}

export async function createGoal(userId: string, input: CreateGoalInput): Promise<GoalDocument> {
  const existingActive = await getActiveGoal(userId);
  if (existingActive) {
    throw AppError.conflict(
      "An active goal already exists. Complete or archive it before starting a new one.",
    );
  }

  return Goal.create({ ...input, userId, status: "active" });
}

export async function getGoal(userId: string, id: string): Promise<GoalDocument> {
  return findOwnedById(Goal, id, userId, NOT_FOUND_MESSAGE);
}

export async function updateGoal(
  userId: string,
  id: string,
  input: UpdateGoalInput,
): Promise<GoalDocument> {
  return updateOwnedById(Goal, id, userId, input, NOT_FOUND_MESSAGE);
}

export async function completeGoal(userId: string, id: string): Promise<GoalDocument> {
  const goal = await findOwnedById(Goal, id, userId, NOT_FOUND_MESSAGE);

  if (goal.status !== "active") {
    throw AppError.conflict("Only an active goal can be completed");
  }

  goal.status = "completed";
  await goal.save();
  return goal;
}
