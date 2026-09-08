import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import type { GoalStatus } from "../../models/Goal.js";
import { completeGoal, createGoal, getActiveGoal, getGoal, listGoals, updateGoal } from "./goal.service.js";

function requireUserId(req: Request): string {
  if (!req.user) throw AppError.unauthorized("Authentication required");
  return req.user.id;
}

export const listGoalsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const status = req.query.status as GoalStatus | undefined;

  const goals = await listGoals(userId, status);
  res.status(200).json({ items: goals.map((goal) => goal.toJSON()) });
});

export const getActiveGoalController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const goal = await getActiveGoal(userId);
  res.status(200).json(goal ? goal.toJSON() : null);
});

export const createGoalController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const goal = await createGoal(userId, req.body);
  res.status(201).json(goal.toJSON());
});

export const getGoalController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const goal = await getGoal(userId, req.params.id as string);
  res.status(200).json(goal.toJSON());
});

export const updateGoalController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const goal = await updateGoal(userId, req.params.id as string, req.body);
  res.status(200).json(goal.toJSON());
});

export const completeGoalController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const goal = await completeGoal(userId, req.params.id as string);
  res.status(200).json(goal.toJSON());
});
