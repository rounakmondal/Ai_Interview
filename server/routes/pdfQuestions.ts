import { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import { PDFParse } from "pdf-parse";

// Resolve public directory for both dev and prod
function resolvePublicDir(): string {
  const candidates = [
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "dist", "spa"),
    path.resolve(__dirname, "..", "spa"),
    path.resolve(__dirname, "..", "..", "public"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "Police")) || fs.existsSync(path.join(dir, "WBCS"))) {
      return dir;
    }
  }
  return candidates[0];
}

const PUBLIC_DIR = resolvePublicDir();
console.log(`📂 PDFQuestions API: PUBLIC_DIR resolved to ${PUBLIC_DIR}`);
type ParsedQuestion = {
  id: number;
  question: string;
  options: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
};



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

    // ── Check for corresponding JSON data first (User Request) ────────────────
    const fileName = path.basename(filePath);
    const folderPath = path.dirname(filePath);
    const folderName = path.basename(folderPath); // e.g. "Police" or "WBCS"

    let jsonQuestions: any[] | null = null;
    let title = path.basename(filePath, path.extname(filePath));

    const jsonSubFolder = folderName === "Police" ? "police-json-data" : folderName === "WBCS" ? "wbcs_json_data" : null;
    if (jsonSubFolder) {
      const jsonDataDir = path.join(folderPath, jsonSubFolder);
      if (fs.existsSync(jsonDataDir)) {
        const yearMatch = fileName.match(/(19|20)\d{2}/);
        const year = yearMatch ? yearMatch[0] : null;

        if (year) {
          const jsonFiles = fs.readdirSync(jsonDataDir);
          const matchingFile = jsonFiles.find(f => f.includes(year) && f.endsWith(".json"));

          if (matchingFile) {
            try {
              const jsonContent = JSON.parse(fs.readFileSync(path.join(jsonDataDir, matchingFile), "utf-8"));
              const rawQuestions = jsonContent.questions || [];
              
              if (Array.isArray(rawQuestions) && rawQuestions.length > 0) {
                console.log(`🧩 Using JSON source for ${fileName}: ${matchingFile}`);
                title = jsonContent.exam_title || title;
                
                jsonQuestions = rawQuestions.map((q: any, idx: number) => {
                  // Normalize options: could be {a,b,c,d} or [s1,s2,s3,s4]
                  let opts: string[] = [];
                  if (Array.isArray(q.options)) {
                    opts = q.options;
                  } else if (typeof q.options === "object") {
                    opts = [q.options.a || q.options.A, q.options.b || q.options.B, q.options.c || q.options.C, q.options.d || q.options.D].filter(Boolean);
                  }

                  // Normalize correct answer
                  let correctIdx = 0;
                  if (typeof q.answer === "string") {
                    const char = q.answer.toLowerCase().trim();
                    correctIdx = char === "a" ? 0 : char === "b" ? 1 : char === "c" ? 2 : char === "d" ? 3 : 0;
                  } else if (typeof q.correctIndex === "number") {
                    correctIdx = q.correctIndex;
                  }

                  return {
                    id: idx + 1,
                    question: q.question,
                    options: opts.length >= 2 ? opts : ["Option A", "Option B", "Option C", "Option D"],
                    difficulty: q.difficulty || "Medium",
                    subject: q.subject || folderName,
                    correct_index: correctIdx,
                    explanation: q.explanation || q.answerDescription || `The correct answer is ${opts[correctIdx] || "the selected option"}.`
                  };
                });
              }
            } catch (err) {
              console.warn(`⚠️ Failed to parse JSON for ${fileName}:`, err);
            }
          }
        }
      }
    }

    if (jsonQuestions) {
      res.json({
        success: true,
        title,
        totalQuestions: jsonQuestions.length,
        duration_minutes: Math.max(15, Math.ceil(jsonQuestions.length * 1.2)),
        questions: jsonQuestions,
      });
      return;
    }

    // ── Fallback to PDF Parsing ──────────────────────────────────────────────
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
