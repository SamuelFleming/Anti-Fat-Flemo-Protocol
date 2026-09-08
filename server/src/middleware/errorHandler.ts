import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import { isDuplicateKeyError } from "../utils/mongoErrors.js";

/**
 * Central error handler. Every response follows the same envelope:
 * `{ "error": { "message": string, "details"?: unknown } }`.
 * Unexpected errors are logged but never leak internals to the client.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: "Validation failed",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    });
    return;
  }

  if (isDuplicateKeyError(error)) {
    res.status(409).json({
      error: { message: "A record with these unique fields already exists" },
    });
    return;
  }

  if (env.NODE_ENV !== "test") {
    console.error("Unexpected error:", error);
  }

  res.status(500).json({
    error: { message: "Internal server error" },
  });
}
