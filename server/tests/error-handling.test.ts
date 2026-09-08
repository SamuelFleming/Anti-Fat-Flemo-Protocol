import { describe, expect, it } from "vitest";
import express from "express";
import supertest from "supertest";
import { AppError } from "../src/utils/AppError.js";
import { asyncHandler } from "../src/utils/asyncHandler.js";
import { errorHandler } from "../src/middleware/errorHandler.js";
import { notFoundHandler } from "../src/middleware/notFound.js";
import { validate } from "../src/middleware/validate.js";
import { z } from "zod";

function buildTestApp() {
  const app = express();
  app.use(express.json());

  app.get(
    "/boom/app-error",
    asyncHandler(async () => {
      throw AppError.conflict("already exists");
    }),
  );

  app.get(
    "/boom/unexpected",
    asyncHandler(async () => {
      throw new Error("something broke");
    }),
  );

  app.post(
    "/validated",
    validate(z.object({ name: z.string().min(1) })),
    (req, res) => {
      res.json({ name: req.body.name });
    },
  );

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

describe("central error handling", () => {
  it("formats AppError with its status code and message", async () => {
    const response = await supertest(buildTestApp()).get("/boom/app-error");

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: { message: "already exists" } });
  });

  it("hides unexpected error internals behind a generic 500", async () => {
    const response = await supertest(buildTestApp()).get("/boom/unexpected");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: { message: "Internal server error" } });
  });

  it("returns 404 for unmatched routes", async () => {
    const response = await supertest(buildTestApp()).get("/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.error.message).toContain("/does-not-exist");
  });

  it("returns 400 with field details on failed validation", async () => {
    const response = await supertest(buildTestApp()).post("/validated").send({ name: "" });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("Validation failed");
    expect(response.body.error.details[0]).toMatchObject({ path: "name" });
  });

  it("passes through valid input", async () => {
    const response = await supertest(buildTestApp()).post("/validated").send({ name: "Sam" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: "Sam" });
  });
});
