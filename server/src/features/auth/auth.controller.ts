import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { signAccessToken } from "../../utils/jwt.js";
import { authenticateUser, getCurrentUserContext, registerUser } from "./auth.service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  const token = signAccessToken({ sub: user.id });

  res.status(201).json({ user: user.toJSON(), token });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await authenticateUser(req.body);
  const token = signAccessToken({ sub: user.id });

  res.status(200).json({ user: user.toJSON(), token });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized("Authentication required");
  }

  const { user, profile } = await getCurrentUserContext(req.user.id);

  res.status(200).json({
    user: user.toJSON(),
    profile: profile ? profile.toJSON() : null,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Stateless JWT: there is no server-side session to invalidate. The
  // endpoint exists so the client has a single, documented sign-out call.
  res.status(200).json({ message: "Logged out" });
});
