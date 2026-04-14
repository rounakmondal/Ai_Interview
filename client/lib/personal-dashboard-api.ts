// ─────────────────────────────────────────────────────────────────────────────
// Personalized Dashboard API — frontend client
// ─────────────────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_URL || "/api";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token");
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

// ── Types ────────────────────────────────────────────────────────────────────

export type PerformanceLevel = "Weak" | "Average" | "Strong" | "No Data";

export interface SubjectPerformance {
  topic: string;
  subTopic: string;
  totalQuestions: number;
  correctAnswers: number;
  attempts: number;
  accuracy: number | null; // null = never attempted
  level: PerformanceLevel;
  lastAttempt: string | null;
}

export interface WeakArea {
  subTopic: string;
  accuracy: number;
  level: PerformanceLevel;
}

export interface AiDailyTarget {
  total: number;
  completed: number;
  remaining: number;
  status: "Pending" | "Completed";
}

export interface AiAnalysis {
  weakAreas: WeakArea[];
  recommendedAction: string;
  dailyTarget: AiDailyTarget;
  message: string;
}

export interface DashboardAnalysis {
  success: boolean;
  performance: SubjectPerformance[];
  todayProgress: { attempted: number; target: number };
  aiAnalysis: AiAnalysis | null;
}

export interface WeakAreaTestQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  exam: string;
  difficulty: string;
}

export interface WeakAreaTestResponse {
  success: boolean;
  questions: WeakAreaTestQuestion[];
  subject: string;
  difficulty: string;
  count: number;
}

// ── API functions ────────────────────────────────────────────────────────────

/** Fetch personalized weak-area analysis */
export async function fetchPersonalizedAnalysis(): Promise<DashboardAnalysis | null> {
  try {
    const res = await fetch(`${API}/personal-dashboard/analysis`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Generate a targeted test for a specific weak subject */
export async function generateWeakAreaTest(
  subject: string,
  difficulty: "Easy" | "Medium" | "Hard" = "Easy",
  count: number = 10,
  exam: string = "WBCS",
  language: "en" | "bn" = "en",
): Promise<WeakAreaTestResponse | null> {
  try {
    const res = await fetch(`${API}/personal-dashboard/weak-area-test`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ subject, difficulty, count, exam, language }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Email personalized performance report to the user */
export async function sendWeakAreaEmail(
  weakAreas: WeakArea[],
  recommendedAction: string,
  message: string,
): Promise<{ success: boolean; message: string } | null> {
  try {
    const res = await fetch(`${API}/personal-dashboard/send-test-email`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ weakAreas, recommendedAction, message }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Get today's daily target */
export async function getDailyTarget(): Promise<{ attempted: number; target: number } | null> {
  try {
    const res = await fetch(`${API}/personal-dashboard/daily-target`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Save daily target count */
export async function saveDailyTarget(target: number): Promise<boolean> {
  try {
    const res = await fetch(`${API}/personal-dashboard/daily-target`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ target }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Increment today's attempted count after completing questions */
export async function incrementDailyTarget(by = 1): Promise<{ attempted: number; target: number } | null> {
  try {
    const res = await fetch(`${API}/personal-dashboard/daily-target/increment`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ by }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Utility: subject color helpers ──────────────────────────────────────────

export const LEVEL_COLORS: Record<PerformanceLevel, string> = {
  Weak:      "text-red-500 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900",
  Average:   "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900",
  Strong:    "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900",
  "No Data": "text-gray-400 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800",
};

export const LEVEL_BAR_COLORS: Record<PerformanceLevel, string> = {
  Weak:      "bg-red-500",
  Average:   "bg-amber-500",
  Strong:    "bg-emerald-500",
  "No Data": "bg-gray-300",
};

export const SUBJECT_ICONS: Record<string, string> = {
  History:         "📜",
  Geography:       "🗺️",
  Polity:          "⚖️",
  Reasoning:       "🧠",
  Math:            "🔢",
  "Current Affairs": "📰",
};
