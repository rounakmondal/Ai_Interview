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
      // For JSON files: extract the path components and construct the API URL
      const parts = pdfPath.split("/");
      let rawFolderKey = parts[0].toLowerCase(); // "police", "wbpsc", or "wb primary tet question"
      
      // Map public folder names to API route keys
      const FOLDER_KEY_MAP: Record<string, string> = {
        "wb primary tet question": "wb-primary-tet",
        "rrb ntpc": "rrb-ntpc",
      };
      const folderKey = FOLDER_KEY_MAP[rawFolderKey] || rawFolderKey;
      
      // Everything after the folder name is the file path
      const filePath = parts.slice(1).join("/");
      
      // Build URL with proper encoding: encode each path segment separately to preserve slashes
      // For "SI/WBP-SI-Police-2019.json" → "SI/WBP-SI-Police-2019.json" (no spaces, so no encoding)
      // For "Wbpsc clerkship 2024 questions.json" → "Wbpsc%20clerkship%202024%20questions.json"
      const segments = filePath.split("/");
      const encodedSegments = segments.map(seg => encodeURIComponent(seg));
      const encodedFilePath = encodedSegments.join("/");
      const url = `${QUESTIONS_API_BASE}/questions/${folderKey}/${encodedFilePath}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
      }

      const jsonData = await response.json();

      // Flatten nested question structures:
      // Some JSONs have a flat `questions` array, others nest them inside `sections` or `parts`
      let rawQuestions: any[] = [];
      if (Array.isArray(jsonData.questions) && jsonData.questions.length > 0) {
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
        // Handle different answer formats (a/b/c/d or A/B/C/D or 0/1/2/3)
        let correctIdx = 0;
        const ans = q.answer || "";
        
        if (typeof ans === "number") {
          correctIdx = ans;
        } else if (typeof ans === "string") {
          const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
          correctIdx = map[ans.toLowerCase()] ?? 0;
        }

        // Handle options as either object {a,b,c,d} / {A,B,C,D} or array [opt1, opt2, ...]
        let options: string[];
        if (Array.isArray(q.options)) {
          options = q.options.map((o: any) => String(o));
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
        
        return {
          id: idx,
          question: q.question || "",
          options,
          difficulty: "Medium" as const,
          subject: q.subject || jsonData.subject || "General Knowledge",
          correct_index: correctIdx,
          explanation: q.explanation || "",
        };
      });

      return {
        title: jsonData.exam || "Exam",
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
