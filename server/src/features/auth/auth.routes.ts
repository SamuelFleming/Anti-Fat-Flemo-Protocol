import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { login, logout, me, register } from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

export default router;
