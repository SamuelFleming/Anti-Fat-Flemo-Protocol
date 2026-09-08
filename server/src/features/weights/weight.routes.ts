import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createWeightSchema,
  listWeightsQuerySchema,
  updateWeightSchema,
} from "./weight.validation.js";
import {
  createWeightController,
  deleteWeightController,
  listWeightsController,
  updateWeightController,
} from "./weight.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listWeightsQuerySchema, "query"), listWeightsController);
router.post("/", validate(createWeightSchema), createWeightController);
router.put("/:id", validate(updateWeightSchema), updateWeightController);
router.delete("/:id", deleteWeightController);

export default router;
