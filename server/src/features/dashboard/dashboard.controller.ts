import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { getDashboard } from "./dashboard.service.js";
import type { DashboardQuery } from "./dashboard.validation.js";

function requireUserId(req: Request): string {
  if (!req.user) throw AppError.unauthorized("Authentication required");
  return req.user.id;
}

export const getDashboardController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const query = req.query as unknown as DashboardQuery;
  const dashboard = await getDashboard(userId, query);
  res.status(200).json(dashboard);
});
