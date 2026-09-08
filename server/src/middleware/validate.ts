import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type ValidationSource = "body" | "query" | "params";

/**
 * Validates and replaces the given request part with the parsed value so
 * downstream handlers can trust the shape/types defined by `schema`.
 * Parse failures are forwarded to the central error handler as a ZodError.
 */
export function validate(schema: ZodType, source: ValidationSource = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      next(result.error);
      return;
    }

    // Express 5 exposes `req.query` as a getter-only accessor, so a plain
    // assignment throws in strict mode (all ESM modules). Redefine it as a
    // writable data property instead; `body`/`params` accept direct assignment.
    if (source === "query") {
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else {
      req[source] = result.data;
    }

    next();
  };
}
