// ─────────────────────────────────────────────────────────────────────────────
// Daily Tasks — state manager for daily challenges, points & streaks
// ─────────────────────────────────────────────────────────────────────────────

import {
  ExamType,
  Subject,
  GovtQuestion,
  fetchQuestions,
} from "./govt-practice-data";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DailyTask {
  id: string;
  type: "daily_mock_test" | "subject_quiz";
  subject?: Subject;
  label: string;
  description: string;
  points: number;
  questionCount: number;
  completed: boolean;
  score?: number; // accuracy %
}

export interface DailyTasksState {
  date: string; // YYYY-MM-DD
  exam: ExamType;
  tasks: DailyTask[];
  totalPointsEarned: number;
}

export interface DailyHistoryEntry {
  date: string;
  points: number;
  tasksCompleted: number;
  totalTasks: number;
}

// ── Exam → Subject mapping ────────────────────────────────────────────────────
// Not all exams test all subjects equally
const EXAM_SUBJECTS: Record<ExamType, Subject[]> = {
  WBCS: ["History", "Geography", "Polity", "Reasoning", "Math", "Current Affairs"],
  SSC: ["History", "Geography", "Polity", "Reasoning", "Math", "Current Affairs"],
  Railway: ["Reasoning", "Math", "Current Affairs", "Geography"],
  Banking: ["Reasoning", "Math", "Current Affairs", "Polity"],
  Police: ["Reasoning", "Math", "Current Affairs", "History", "Geography"],
};

export function getExamSubjects(exam: ExamType): Subject[] {
  return EXAM_SUBJECTS[exam] ?? EXAM_SUBJECTS.WBCS;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function storageKey(date: string): string {
  return `daily_tasks_${date}`;
}

const HISTORY_KEY = "daily_points_history";

function getUpcomingExam(): { exam: ExamType; date: string } | null {
  try {
    const raw = localStorage.getItem("upcoming_exam");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Build daily tasks for a given exam ────────────────────────────────────────

function buildDailyTasks(exam: ExamType): DailyTask[] {
  const subjects = getExamSubjects(exam);
  const tasks: DailyTask[] = [];

  // 1) Full daily mock test (60 questions, 50 pts)
  tasks.push({
    id: "daily_mock_test",
    type: "daily_mock_test",
    label: "Daily Mock Test",
    description: `60 mixed-subject questions for ${exam}`,
    points: 50,
    questionCount: 60,
    completed: false,
  });

  // 2) Subject quizzes (10 questions each, 10 pts)
  for (const subject of subjects) {
    tasks.push({
      id: `quiz_${subject}`,
      type: "subject_quiz",
      subject,
      label: `${subject} Quiz`,
      description: `10 quick MCQs — ${subject}`,
      points: 10,
      questionCount: 10,
      completed: false,
    });
  }

  return tasks;
}

// ── Get / create today's tasks ────────────────────────────────────────────────

export function getDailyTasks(): DailyTasksState | null {
  const examInfo = getUpcomingExam();
  if (!examInfo) return null;

  const today = todayKey();
  const key = storageKey(today);

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const state: DailyTasksState = JSON.parse(raw);
      // Verify it's for today and the same exam
      if (state.date === today && state.exam === examInfo.exam) {
        return state;
      }
    }
  } catch {
    // corrupted — regenerate
  }

  // Generate fresh tasks for today
  const state: DailyTasksState = {
    date: today,
    exam: examInfo.exam,
    tasks: buildDailyTasks(examInfo.exam),
    totalPointsEarned: 0,
  };
  localStorage.setItem(key, JSON.stringify(state));
  return state;
}

// ── Mark a task complete ──────────────────────────────────────────────────────

export function completeTask(taskId: string, score: number): DailyTasksState | null {
  const state = getDailyTasks();
  if (!state) return null;

  const task = state.tasks.find((t) => t.id === taskId);
  if (!task || task.completed) return state;

  task.completed = true;
  task.score = score;
  state.totalPointsEarned += task.points;

  const key = storageKey(state.date);
  localStorage.setItem(key, JSON.stringify(state));

  // Update history
  updateHistory(state);

  return state;
}

// ── History management ────────────────────────────────────────────────────────

function getHistory(): DailyHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function updateHistory(state: DailyTasksState) {
  const history = getHistory();
  const existing = history.findIndex((h) => h.date === state.date);
  const entry: DailyHistoryEntry = {
    date: state.date,
    points: state.totalPointsEarned,
    tasksCompleted: state.tasks.filter((t) => t.completed).length,
    totalTasks: state.tasks.length,
  };
  if (existing >= 0) {
    history[existing] = entry;
  } else {
    history.push(entry);
  }
  // Keep last 90 days
  const sorted = history.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 90);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(sorted));
}

// ── Points & streak queries ───────────────────────────────────────────────────

export function getTotalPoints(): number {
  return getHistory().reduce((sum, h) => sum + h.points, 0);
}

export function getDailyPoints(date?: string): number {
  const d = date ?? todayKey();
  const entry = getHistory().find((h) => h.date === d);
  return entry?.points ?? 0;
}

export function getCurrentStreak(): number {
  const history = getHistory(); // sorted desc
  if (history.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const key = checkDate.toISOString().split("T")[0];
    const entry = history.find((h) => h.date === key);
    if (entry && entry.tasksCompleted > 0) {
      streak++;
    } else if (i === 0) {
      // Today can be 0 tasks — don't break streak yet
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export function getWeeklyProgress(): DailyHistoryEntry[] {
  const history = getHistory();
  const result: DailyHistoryEntry[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const entry = history.find((h) => h.date === key);
    result.push(
      entry ?? { date: key, points: 0, tasksCompleted: 0, totalTasks: 0 }
    );
  }
  return result;
}

// ── Max points per day ────────────────────────────────────────────────────────

export function getMaxDailyPoints(exam?: ExamType): number {
  const e = exam ?? getUpcomingExam()?.exam ?? "WBCS";
  const subjects = getExamSubjects(e);
  return 50 + subjects.length * 10; // mock test + quizzes
}

// ── Exam crack probability calculator ─────────────────────────────────────────
// Weighted formula based on multiple factors

export interface ExamReadiness {
  probability: number; // 0-100
  scoreFactor: number;
  consistencyFactor: number;
  coverageFactor: number;
  improvementFactor: number;
  weakestSubject: string | null;
  insight: string;
}

export function calculateExamReadiness(
  avgScore: number,
  subjectScores: { subject: string; score: number; tests: number }[],
  totalTests: number,
  progressData: { week: string; score: number }[]
): ExamReadiness {
  // 1. Score factor (0-100): How well user scores on average
  const scoreFactor = Math.min(100, avgScore);

  // 2. Consistency factor (0-100): Based on streak + regular practice
  const streak = getCurrentStreak();
  const history = getWeeklyProgress();
  const activeDays = history.filter((h) => h.tasksCompleted > 0).length;
  const consistencyFactor = Math.min(100, (streak * 8) + (activeDays / 7) * 40 + Math.min(totalTests, 50) * 0.6);

  // 3. Coverage factor (0-100): How many subjects the user has practiced
  const examInfo = getUpcomingExam();
  const examSubjects = examInfo ? getExamSubjects(examInfo.exam) : [];
  const practicedSubjects = subjectScores.filter(
    (s) => s.tests > 0 && examSubjects.includes(s.subject as Subject)
  ).length;
  const coverageFactor = examSubjects.length > 0
    ? Math.round((practicedSubjects / examSubjects.length) * 100)
    : 0;

  // 4. Improvement factor (0-100): Trend direction
  let improvementFactor = 50; // neutral
  if (progressData.length >= 3) {
    const recent = progressData.slice(-3).map((d) => d.score);
    const earlier = progressData.slice(0, Math.min(3, progressData.length)).map((d) => d.score);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    const diff = recentAvg - earlierAvg;
    improvementFactor = Math.min(100, Math.max(0, 50 + diff * 2));
  }

  // Weighted probability
  const probability = Math.round(
    scoreFactor * 0.4 +
    consistencyFactor * 0.25 +
    coverageFactor * 0.2 +
    improvementFactor * 0.15
  );

  // Find weakest subject
  const weakest = subjectScores.length > 0
    ? subjectScores.reduce((min, s) => (s.score < min.score ? s : min), subjectScores[0])
    : null;

  const insight = weakest
    ? `Focus on ${weakest.subject} (${weakest.score}%) to boost your overall readiness`
    : "Start practicing to build your exam readiness profile";

  return {
    probability: Math.min(99, Math.max(5, probability)),
    scoreFactor: Math.round(scoreFactor),
    consistencyFactor: Math.round(consistencyFactor),
    coverageFactor: Math.round(coverageFactor),
    improvementFactor: Math.round(improvementFactor),
    weakestSubject: weakest?.subject ?? null,
    insight,
  };
}

// ── Fetch daily recommended questions via DailyrecomendQuestion API ───────────

export async function fetchDailyRecommendedQuestions(
  exam: ExamType
): Promise<GovtQuestion[]> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("/api/govt/daily-recommend", {
      method: "POST",
      headers,
      body: JSON.stringify({ exam }),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // fall through to fallback
  }

  // Fallback: use existing fetchQuestions with mixed subjects
  return fetchQuestions({
    exam,
    subject: "History", // will be overridden by backend's loose matching
    difficulty: "Medium",
    count: 50,
  });
}
