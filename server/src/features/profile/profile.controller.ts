import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { getOrCreateProfile, updateProfile } from "./profile.service.js";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized("Authentication required");

  const profile = await getOrCreateProfile(req.user.id);
  res.status(200).json(profile.toJSON());
});

export const putProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized("Authentication required");

  const profile = await updateProfile(req.user.id, req.body);
  res.status(200).json(profile.toJSON());
});
