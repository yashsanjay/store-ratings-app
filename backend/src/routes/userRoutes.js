import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { ok } from "../controllers/userController.js";

const router = Router();

router.get("/ping", auth, requireRole("NORMAL_USER", "STORE_OWNER", "SYSTEM_ADMIN"), ok);

export default router;
