/**
 * Client-side PDF question extraction utilities
 * Calls server endpoints to extract and parse PDF questions
 */

interface ExtractedQuestion {
  id: number;
  question: string;
  options: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
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
 * Extract questions from a PDF file
 * @param pdfPath - Encoded path relative to public folder (e.g., "WBP%20Constable...pdf")
 */
export async function extractPDFQuestions(pdfPath: string): Promise<PDFTestData> {
  try {
    const response = await fetch(
      `/api/extract-pdf-questions?pdfPath=${encodeURIComponent(pdfPath)}`
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("PDF extraction error:", message);
    throw new Error(`Unable to extract PDF questions: ${message}`);
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
