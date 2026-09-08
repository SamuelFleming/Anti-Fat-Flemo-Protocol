import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import type { DateFilterQuery } from "../../utils/validation.js";
import { listDailyLogs, upsertDailyLog } from "./dailyLog.service.js";

function requireUserId(req: Request): string {
  if (!req.user) throw AppError.unauthorized("Authentication required");
  return req.user.id;
}

export const listDailyLogsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const logs = await listDailyLogs(userId, req.query as unknown as DateFilterQuery);
  res.status(200).json({ items: logs.map((log) => log.toJSON()) });
});

export const upsertDailyLogController = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const log = await upsertDailyLog(userId, req.params.date as string, req.body);
  res.status(200).json(log.toJSON());
});
