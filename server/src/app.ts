import express, { type Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { openApiDocument } from "./openapi/openapi.js";
import authRouter from "./features/auth/auth.routes.js";
import profileRouter from "./features/profile/profile.routes.js";
import goalRouter from "./features/goals/goal.routes.js";
import mealRouter from "./features/meals/meal.routes.js";
import dailyLogRouter from "./features/dailyLogs/dailyLog.routes.js";
import weightRouter from "./features/weights/weight.routes.js";

/**
 * Builds the Express application without starting a listener or connecting
 * to MongoDB, so tests can exercise it in isolation and control the
 * database lifecycle themselves.
 */
export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.CLIENT_ORIGIN }));
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({ name: "Anti-Fat-Flemo API", status: "ok" });
  });

  app.get("/api/health", (_req, res) => {
    const mongoConnected = mongoose.connection.readyState === 1;
    res.json({ status: "ok", mongo: mongoConnected ? "connected" : "disconnected" });
  });

  app.get("/api/openapi.json", (_req, res) => {
    res.json(openApiDocument);
  });

  app.use("/api/auth", authRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/goals", goalRouter);
  app.use("/api/meals", mealRouter);
  app.use("/api/daily-logs", dailyLogRouter);
  app.use("/api/weights", weightRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
