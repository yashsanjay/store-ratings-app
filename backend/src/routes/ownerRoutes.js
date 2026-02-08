import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { ownerDashboard } from "../controllers/ownerController.js";

const router = Router();

router.get("/dashboard", auth, requireRole("STORE_OWNER"), ownerDashboard);

export default router;
