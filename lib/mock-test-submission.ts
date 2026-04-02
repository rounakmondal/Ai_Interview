/**
 * Mock Test Submission Tracking
 * Use these functions to mark when a user submits a mock test
 */

export interface MockTestSubmission {
  examType: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
}

const SUBMISSION_STORAGE_KEY = "mock_test_submissions";

/**
 * Record a mock test submission
 * Call this after the user completes and submits a mock test
 */
export function recordMockTestSubmission(
  examType: string,
  score: number,
  totalQuestions: number
): void {
  try {
    const submissions: MockTestSubmission[] = JSON.parse(
      localStorage.getItem(SUBMISSION_STORAGE_KEY) || "[]"
    );

    submissions.push({
      examType,
      submittedAt: new Date().toISOString(),
      score,
      totalQuestions,
    });

    localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(submissions));
    console.log(`[MockTest] Submission recorded for ${examType}`);
  } catch (error) {
    console.error("Error recording mock test submission:", error);
  }
}

/**
 * Get all mock test submissions
 */
export function getMockTestSubmissions(): MockTestSubmission[] {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSION_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Check if exam type was submitted today
 */
export function wasSubmittedToday(examType: string): boolean {
  try {
    const submissions = getMockTestSubmissions();
    const today = new Date().toISOString().split("T")[0];

    return submissions.some((sub) => {
      const subDate = sub.submittedAt.split("T")[0];
      return sub.examType === examType && subDate === today;
    });
  } catch {
    return false;
  }
}

/**
 * Get latest submission for an exam type
 */
export function getLatestSubmission(examType: string): MockTestSubmission | null {
  try {
    const submissions = getMockTestSubmissions().filter((sub) => sub.examType === examType);
    return submissions[submissions.length - 1] || null;
  } catch {
    return null;
  }
}

/**
 * Clear old submissions (older than 30 days)
 */
export function clearOldSubmissions(): void {
  try {
    const submissions = getMockTestSubmissions();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filtered = submissions.filter((sub) => {
      const subDate = new Date(sub.submittedAt);
      return subDate > thirtyDaysAgo;
    });

    localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error clearing old submissions:", error);
  }
}
