import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

const BEARER_PREFIX = "Bearer ";

/**
 * Derives the authenticated identity from a validated JWT only — never from
 * a request body/query field — and attaches it as `req.user`.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith(BEARER_PREFIX)) {
    next(AppError.unauthorized("Authentication required"));
    return;
  }

  const token = header.slice(BEARER_PREFIX.length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    next(AppError.unauthorized("Invalid or expired token"));
  }
}
