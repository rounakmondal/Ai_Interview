import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleCareerMentor } from "./routes/careerMentor";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Core routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ── AI Career Mentor ──────────────────────────────────────────────────
  // POST /api/career-mentor
  // Body: { message: string, context?: string }
  // Returns: structured advice, roadmap, salary info, resources
  // ─────────────────────────────────────────────────────────────────────
  app.post("/api/career-mentor", handleCareerMentor);

  return app;
}
