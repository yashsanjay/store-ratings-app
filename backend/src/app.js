import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));

  app.use(
    cors({
      origin: env.corsOrigin.split(",").map((s) => s.trim()),
      credentials: true
    })
  );

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 120
    })
  );

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/auth", authRoutes);
  app.use("/admin", adminRoutes);
  app.use("/stores", storeRoutes);
  app.use("/owner", ownerRoutes);
  app.use("/user", userRoutes);

  app.use(errorHandler);
  return app;
}
