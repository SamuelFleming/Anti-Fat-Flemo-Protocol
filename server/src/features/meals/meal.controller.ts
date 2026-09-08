import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import type { DateFilterQuery } from "../../utils/validation.js";
import { createMeal, deleteMeal, listMeals, updateMeal } from "./meal.service.js";

function requireUserId(req: Request): string {
  if (!req.user) throw AppError.unauthorized("Authentication required");
  return req.user.id;
}

export const listMealsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const meals = await listMeals(userId, req.query as unknown as DateFilterQuery);
  res.status(200).json({ items: meals.map((meal) => meal.toJSON()) });
});

export const createMealController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const meal = await createMeal(userId, req.body);
  res.status(201).json(meal.toJSON());
});

export const updateMealController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const meal = await updateMeal(userId, req.params.id as string, req.body);
  res.status(200).json(meal.toJSON());
});

export const deleteMealController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  await deleteMeal(userId, req.params.id as string);
  res.status(204).send();
});
