/**
 * Client-side PDF question extraction utilities
 * Calls server endpoints to extract and parse PDF questions
 */

import { QUESTIONS_API_BASE } from "./api-client";

interface ExtractedQuestion {
  id: number;
  question: string;
  options: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
  correct_index?: number;
  explanation?: string;
}

interface PDFTestData {
  title: string;
  totalQuestions: number;
  duration_minutes: number;
  questions: ExtractedQuestion[];
}

interface PDFMetadata {
  fileName: string;
  pages: number;
  estimatedQuestions: number;
  estimatedDuration: number;
}

/**
 * Extract questions from a PDF or JSON file
 * @param pdfPath - Full path relative to public folder 
 *   For Police: "Police/SI/WBP-SI-Police-2019.json"
 *   For WBPSC: "WBPSC/Wbpsc clerkship 2024 questions.json"
 */
export async function extractPDFQuestions(pdfPath: string): Promise<PDFTestData> {
  try {
    const isJson = pdfPath.toLowerCase().endsWith(".json");
    
    if (isJson) {
      // Fetch JSON files directly as static assets from the public folder.
      // This works reliably on Netlify (dist/spa served as static CDN) and in
      // dev (Vite serves public/ at root). No serverless function involved.
      // Each path segment is decode-then-re-encode so partially-encoded segments
      // coming from the API file-listing (downloadHref) are handled correctly.
      const encodedPath = pdfPath
        .split("/")
        .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
        .join("/");
      const url = `/${encodedPath}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("text/html")) {
        throw new Error(`Question file not found: ${url}. The server returned an HTML page instead of JSON.`);
      }

      const jsonData = await response.json();

      // Flatten nested question structures:
      // Some JSONs have a flat `questions` array, a root-level array, or nest inside `sections`/`parts`
      let rawQuestions: any[] = [];
      if (Array.isArray(jsonData)) {
        // Root-level array format: [...] (e.g. SSC CGL files)
        rawQuestions = jsonData;
      } else if (Array.isArray(jsonData.questions) && jsonData.questions.length > 0) {
        // Flat format: { questions: [...] }
        rawQuestions = jsonData.questions;
      } else if (Array.isArray(jsonData.sections)) {
        // Nested format: { sections: [{ subject, questions: [...] }, ...] }
        for (const section of jsonData.sections) {
          if (Array.isArray(section.questions)) {
            for (const q of section.questions) {
              rawQuestions.push({ ...q, subject: q.subject || section.subject });
            }
          }
        }
      } else if (Array.isArray(jsonData.parts)) {
        // Nested format: { parts: [{ subject, questions: [...] }, ...] }
        for (const part of jsonData.parts) {
          if (Array.isArray(part.questions)) {
            for (const q of part.questions) {
              rawQuestions.push({ ...q, subject: q.subject || part.subject });
            }
          }
        }
      }

      // Parse JSON format - questions array should have question, options, answer fields
      const questions: ExtractedQuestion[] = rawQuestions.map((q: any, idx: number) => {
        // Handle different answer formats (a/b/c/d or A/B/C/D or 0-based correctIndex)
        let correctIdx = 0;

        // Prefer explicit 0-based correctIndex (used in SSC CGL files)
        if (typeof q.correctIndex === "number") {
          correctIdx = q.correctIndex;
        } else {
          const ans = q.answer ?? "";
          if (typeof ans === "number") {
            correctIdx = ans;
          } else if (typeof ans === "string") {
            const trimmed = ans.trim();
            const letterMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
            if (letterMap[trimmed.toLowerCase()] !== undefined) {
              correctIdx = letterMap[trimmed.toLowerCase()];
            } else if (Array.isArray(q.options)) {
              // Answer is the actual value — find its index in options
              const idx = q.options.findIndex(
                (o: any) => String(o).replace(/^[A-D]\.\s*/i, "").trim() === trimmed
              );
              correctIdx = idx >= 0 ? idx : 0;
            }
          }
        }

        // Handle options as either object {a,b,c,d} / {A,B,C,D} or array [opt1, opt2, ...]
        let options: string[];
        // Handle options: strip "A. ", "B. " label prefixes if present
        if (Array.isArray(q.options)) {
          options = q.options.map((o: any) =>
            String(o).replace(/^[A-D]\.\s+/i, "").trim()
          );
        } else if (q.options) {
          // Normalize keys: support both uppercase (A,B,C,D) and lowercase (a,b,c,d)
          const opts = q.options;
          options = [
            opts.a || opts.A || "",
            opts.b || opts.B || "",
            opts.c || opts.C || "",
            opts.d || opts.D || "",
          ];
        } else {
          options = ["", "", "", ""];
        }

        // Resolve question text: prefer `question`, fall back to bilingual `question_en`
        const questionText: string =
          q.question || q.question_en || q.question_hi || "";

        // Resolve explanation: prefer `explanation`, fall back to `explanation_en`
        const explanationText: string =
          q.explanation || q.explanation_en || q.explanationEn || "";

        return {
          id: idx,
          question: questionText,
          options,
          difficulty: "Medium" as const,
          subject: q.subject || q.section || (Array.isArray(jsonData) ? "General Knowledge" : jsonData.subject) || "General Knowledge",
          correct_index: correctIdx,
          explanation: explanationText,
        };
      });

      return {
        title: (Array.isArray(jsonData) ? "SSC CGL" : jsonData.exam) || "Exam",
        totalQuestions: questions.length,
        duration_minutes: Math.round(questions.length * 1.2),
        questions,
      };
    } else {
      // Original PDF extraction logic
      const response = await fetch(
        `${QUESTIONS_API_BASE}/extract-pdf-questions?pdfPath=${encodeURIComponent(pdfPath)}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to extract PDF: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "PDF extraction failed");
      }

      return {
        title: data.title,
        totalQuestions: data.totalQuestions,
        duration_minutes: data.duration_minutes,
        questions: data.questions || [],
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Question extraction error:", message);
    throw new Error(`Unable to extract questions: ${message}`);
  }
}

/**
 * Get PDF metadata without extracting questions
 */
export async function getPDFMetadata(pdfPath: string): Promise<PDFMetadata> {
  try {
    const response = await fetch(
      `/api/pdf-metadata?pdfPath=${encodeURIComponent(pdfPath)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to get metadata: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error getting PDF metadata:", err);
    throw err;
  }
}

/**
 * Convert PDF questions to MockQuestion format for the mock test
 */
export function convertToMockAnswers(questions: ExtractedQuestion[]) {
  return questions.reduce((acc, q) => {
    acc[q.id] = null; // Initialize with null (unanswered)
    return acc;
  }, {} as Record<number, number | null>);
}

/**
 * Calculate score based on answers
 */
export function calculateScore(
  questions: ExtractedQuestion[],
  answers: Record<number, number | null>
): {
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
  percentage: number;
} {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  questions.forEach((q) => {
    const answerIndex = answers[q.id];
    if (answerIndex === null || answerIndex === undefined) {
      unanswered++;
    } else if (q.options[answerIndex]?.toLowerCase() === q.options[0]?.toLowerCase()) {
      // This is a simplified check - you'd need the correct answer index
      correct++;
    } else {
      incorrect++;
    }
  });

  const score = correct;
  const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;

  return {
    correct,
    incorrect,
    unanswered,
    score,
    percentage: Math.round(percentage),
  };
}
