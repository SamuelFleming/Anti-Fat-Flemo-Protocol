import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  dailyLogDateParamSchema,
  listDailyLogsQuerySchema,
  upsertDailyLogSchema,
} from "./dailyLog.validation.js";
import { listDailyLogsController, upsertDailyLogController } from "./dailyLog.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listDailyLogsQuerySchema, "query"), listDailyLogsController);
router.put(
  "/:date",
  validate(dailyLogDateParamSchema, "params"),
  validate(upsertDailyLogSchema),
  upsertDailyLogController,
);

export default router;
