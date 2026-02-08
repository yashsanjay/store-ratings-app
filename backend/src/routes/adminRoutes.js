import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  dashboard,
  createUser,
  createStore,
  listUsers,
  listStores,
  userDetails
} from "../controllers/adminController.js";

const router = Router();

router.use(auth, requireRole("SYSTEM_ADMIN"));

router.get("/dashboard", dashboard);
router.post("/users", createUser);
router.post("/stores", createStore);

router.get("/users", listUsers);
router.get("/stores", listStores);
router.get("/users/:id", userDetails);

export default router;
