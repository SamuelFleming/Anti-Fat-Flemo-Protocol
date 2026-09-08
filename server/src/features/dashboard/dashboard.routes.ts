import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { dashboardQuerySchema } from "./dashboard.validation.js";
import { getDashboardController } from "./dashboard.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", validate(dashboardQuerySchema, "query"), getDashboardController);

export default router;
