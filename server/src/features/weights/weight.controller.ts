import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import type { DateFilterQuery } from "../../utils/validation.js";
import { createWeight, deleteWeight, listWeights, updateWeight } from "./weight.service.js";

function requireUserId(req: Request): string {
  if (!req.user) throw AppError.unauthorized("Authentication required");
  return req.user.id;
}

export const listWeightsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const weights = await listWeights(userId, req.query as unknown as DateFilterQuery);
  res.status(200).json({ items: weights.map((weight) => weight.toJSON()) });
});

export const createWeightController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const weight = await createWeight(userId, req.body);
  res.status(201).json(weight.toJSON());
});

export const updateWeightController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const weight = await updateWeight(userId, req.params.id as string, req.body);
  res.status(200).json(weight.toJSON());
});

export const deleteWeightController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  await deleteWeight(userId, req.params.id as string);
  res.status(204).send();
});
