import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173"
};

if (!env.databaseUrl) throw new Error("DATABASE_URL is required");
if (!env.jwtSecret) throw new Error("JWT_SECRET is required");
