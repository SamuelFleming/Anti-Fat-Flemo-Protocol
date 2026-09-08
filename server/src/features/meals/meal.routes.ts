import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { createMealSchema, listMealsQuerySchema, updateMealSchema } from "./meal.validation.js";
import {
  createMealController,
  deleteMealController,
  listMealsController,
  updateMealController,
} from "./meal.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listMealsQuerySchema, "query"), listMealsController);
router.post("/", validate(createMealSchema), createMealController);
router.put("/:id", validate(updateMealSchema), updateMealController);
router.delete("/:id", deleteMealController);

export default router;
