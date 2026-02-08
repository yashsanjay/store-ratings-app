import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { listStores, upsertMyRating } from "../controllers/storeController.js";

const router = Router();

router.get("/", async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      const { verifyToken } = await import("../utils/jwt.js");
      req.user = verifyToken(token);
    } catch {}
  }
  return listStores(req, res, next);
});

router.post("/:storeId/rating", auth, requireRole("NORMAL_USER"), upsertMyRating);

export default router;
