import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { createGoalSchema, listGoalsQuerySchema, updateGoalSchema } from "./goal.validation.js";
import {
  completeGoalController,
  createGoalController,
  getActiveGoalController,
  getGoalController,
  listGoalsController,
  updateGoalController,
} from "./goal.controller.js";

const router = Router();

router.use(requireAuth);

// Specific routes before "/:id" so "active" is never captured as an id.
router.get("/active", getActiveGoalController);
router.get("/", validate(listGoalsQuerySchema, "query"), listGoalsController);
router.post("/", validate(createGoalSchema), createGoalController);
router.get("/:id", getGoalController);
router.put("/:id", validate(updateGoalSchema), updateGoalController);
router.post("/:id/complete", completeGoalController);

export default router;
