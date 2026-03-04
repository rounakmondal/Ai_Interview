import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleCareerMentor } from "./routes/careerMentor";
import { 
  handleStartInterview, 
  handleNextQuestion, 
  handleFinishInterview 
} from "./routes/interview";

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

  // ── Interview API ─────────────────────────────────────────────────────
  // POST /api/interview/start
  // Body: { userId: string, jobRole: string, experienceLevel: string, cvText: string }
  // Returns: { sessionId: string, firstQuestion: string, totalQuestions: number }
  // 
  // POST /api/interview/next-question
  // Body: { sessionId: string, previousAnswer?: string }
  // Returns: { question: string, questionNumber: number, totalQuestions: number, isLastQuestion: boolean }
  // 
  // POST /api/interview/finish
  // Body: { sessionId: string, lastAnswer?: string }
  // Returns: { overallScore, communicationScore, technicalScore, confidenceScore, feedback, suggestions, duration }
  // ─────────────────────────────────────────────────────────────────────
  app.post("/api/interview/start", handleStartInterview);
  app.post("/api/interview/next-question", handleNextQuestion);
  app.post("/api/interview/finish", handleFinishInterview);

  return app;
}
