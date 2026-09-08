/**
 * Operational error carrying an intended HTTP status code.
 * Thrown deliberately by services/controllers for expected failure cases
 * (validation, not found, conflict, unauthorized, etc.).
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;
  readonly isOperational = true;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static notFound(message = "Not found"): AppError {
    return new AppError(message, 404);
  }

  static unauthorized(message = "Unauthorized"): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message = "Forbidden"): AppError {
    return new AppError(message, 403);
  }

  static conflict(message = "Conflict"): AppError {
    return new AppError(message, 409);
  }

  static badRequest(message = "Bad request", details?: unknown): AppError {
    return new AppError(message, 400, details);
  }
}
