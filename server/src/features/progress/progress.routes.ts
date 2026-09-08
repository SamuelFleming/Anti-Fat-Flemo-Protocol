import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { progressQuerySchema } from "./progress.validation.js";
import { getProgressController } from "./progress.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", validate(progressQuerySchema, "query"), getProgressController);

export default router;
