import { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import { PDFParse } from "pdf-parse";

type ParsedQuestion = {
  id: number;
  question: string;
  options: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
};

const PUBLIC_DIR = path.join(process.cwd(), "public");

function resolvePdfPath(encodedPdfPath: string): string {
  const decoded = decodeURIComponent(encodedPdfPath).replace(/\\/g, "/");
  const candidate = path.normalize(path.join(PUBLIC_DIR, decoded));

  if (!candidate.startsWith(PUBLIC_DIR)) {
    throw new Error("Invalid PDF path");
  }

  return candidate;
}

function parseQuestionsFromText(text: string): ParsedQuestion[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const questions: ParsedQuestion[] = [];
  let currentQuestion = "";
  let currentOptions: string[] = [];
  let id = 1;

  const questionRegex = /^(\d+[\).\-\s]+|q(?:uestion)?\s*\d+[:\-\s]+)(.+)$/i;
  const optionRegex = /^([a-dA-D][\).\-\s]+|[ivxIVX]+[\).\-\s]+)(.+)$/;

  const flush = () => {
    if (!currentQuestion) return;
    questions.push({
      id,
      question: currentQuestion,
      options:
        currentOptions.length >= 2
          ? currentOptions.slice(0, 4)
          : ["Option A", "Option B", "Option C", "Option D"],
      difficulty: "Medium",
      subject: "General",
    });
    id += 1;
    currentQuestion = "";
    currentOptions = [];
  };

  for (const line of lines) {
    const questionMatch = line.match(questionRegex);
    if (questionMatch) {
      flush();
      currentQuestion = questionMatch[2].trim();
      continue;
    }

    const optionMatch = line.match(optionRegex);
    if (optionMatch && currentQuestion) {
      currentOptions.push(optionMatch[2].trim());
      continue;
    }

    if (currentQuestion && currentOptions.length === 0) {
      currentQuestion = `${currentQuestion} ${line}`.trim();
    }
  }

  flush();
  return questions;
}

export const extractPDFQuestions: RequestHandler = async (req, res) => {
  try {
    const rawPath = String(req.query.pdfPath ?? "");
    if (!rawPath) {
      res.status(400).json({ success: false, error: "Missing pdfPath query param" });
      return;
    }

    const filePath = resolvePdfPath(rawPath);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ success: false, error: "PDF file not found" });
      return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: fileBuffer });
    const parsed = await parser.getText();
    const text = parsed.text?.trim() ?? "";

    const questions = parseQuestionsFromText(text);
    const totalQuestions = questions.length;

    res.json({
      success: true,
      title: path.basename(filePath, path.extname(filePath)),
      totalQuestions,
      duration_minutes: Math.max(15, Math.ceil(totalQuestions * 1.2)),
      questions,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("extractPDFQuestions error:", message);
    res.status(500).json({ success: false, error: `Failed to extract questions: ${message}` });
  }
};

export const getPDFMetadata: RequestHandler = async (req, res) => {
  try {
    const rawPath = String(req.query.pdfPath ?? "");
    if (!rawPath) {
      res.status(400).json({ error: "Missing pdfPath query param" });
      return;
    }

    const filePath = resolvePdfPath(rawPath);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "PDF file not found" });
      return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: fileBuffer });
    const info = await parser.getInfo({ parsePageInfo: true });
    const pages = info.total ?? 0;

    const estimatedQuestions = Math.max(1, pages * 5);
    const estimatedDuration = Math.max(15, estimatedQuestions);

    res.json({
      fileName: path.basename(filePath),
      pages,
      estimatedQuestions,
      estimatedDuration,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("getPDFMetadata error:", message);
    res.status(500).json({ error: `Failed to read PDF metadata: ${message}` });
  }
};
