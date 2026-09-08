import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { updateProfileSchema } from "./profile.validation.js";
import { getProfile, putProfile } from "./profile.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", getProfile);
router.put("/", validate(updateProfileSchema), putProfile);

export default router;
