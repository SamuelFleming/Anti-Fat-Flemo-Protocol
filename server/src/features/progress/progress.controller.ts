import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { getProgress } from "./progress.service.js";
import type { ProgressQuery } from "./progress.validation.js";

function requireUserId(req: Request): string {
  if (!req.user) throw AppError.unauthorized("Authentication required");
  return req.user.id;
}

export const getProgressController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const query = req.query as unknown as ProgressQuery;
  const progress = await getProgress(userId, query);
  res.status(200).json(progress);
});
