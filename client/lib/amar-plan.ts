// ─────────────────────────────────────────────────────────────────────────────
// Amar Plan — Smart daily study plan manager (API-backed)
// All plan logic runs on the server; client caches plan in localStorage
// ─────────────────────────────────────────────────────────────────────────────

import type {
  StudyExamType,
  AmarPlanTask,
  AmarPlanData,
  AmarSubjectProgress,
  AmarAutoAdjustResult,
  AmarPlanStats,
  CreateAmarPlanRequest,
  CreateAmarPlanResponse,
  AutoAdjustResponse,
  RescheduleResponse,
  CompleteTaskResponse,
  SubjectProgressResponse,
  PlanStatsResponse,
  ShareCardDataResponse,
} from "@shared/study-types";

// Re-export shared types so page components can import from here
export type { AmarPlanTask, AmarPlanData, AmarSubjectProgress, AmarAutoAdjustResult, AmarPlanStats };

// Alias for backwards compatibility with existing components
export type SubjectProgress = AmarSubjectProgress;

export interface AutoAdjustResult {
  adjusted: boolean;
  missedDays: number;
  tasksRescheduled: number;
  needsFullReschedule: boolean;
}

// ── Storage keys ──────────────────────────────────────────────────────────────
const PLAN_KEY = "amar_plan_data";

// ── Load / Save (localStorage cache) ──────────────────────────────────────────

export function getAmarPlan(): AmarPlanData | null {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAmarPlan(plan: AmarPlanData): void {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
}

export function deleteAmarPlan(): void {
  localStorage.removeItem(PLAN_KEY);
}

// ── API helper ────────────────────────────────────────────────────────────────

async function postApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

// ── Plan Generation (API) ─────────────────────────────────────────────────────

export async function generateAmarPlan(opts: {
  examId: StudyExamType;
  examDate: string;
  hoursPerDay: number;
  weakSubjects: string[];
  notificationTime?: string;
}): Promise<AmarPlanData> {
  const payload: CreateAmarPlanRequest = {
    examId: opts.examId,
    examDate: opts.examDate,
    hoursPerDay: opts.hoursPerDay,
    weakSubjects: opts.weakSubjects,
    notificationTime: opts.notificationTime,
  };
  const data = await postApi<CreateAmarPlanResponse>("/api/amar-plan/create", payload);
  saveAmarPlan(data.plan);
  return data.plan;
}

// ── Feature 1: Smart Plan Auto-Adjust (API) ──────────────────────────────────

export async function checkAndAutoAdjust(): Promise<AutoAdjustResult> {
  const plan = getAmarPlan();
  const noChange: AutoAdjustResult = { adjusted: false, missedDays: 0, tasksRescheduled: 0, needsFullReschedule: false };
  if (!plan) return noChange;

  const data = await postApi<AutoAdjustResponse>("/api/amar-plan/auto-adjust", { plan });
  const r = data.result;

  if (r.plan) saveAmarPlan(r.plan);

  return {
    adjusted: r.adjusted,
    missedDays: r.missedDays,
    tasksRescheduled: r.tasksRescheduled,
    needsFullReschedule: r.needsFullReschedule,
  };
}

// ── Full Reschedule (API) ─────────────────────────────────────────────────────

export async function rescheduleFromToday(): Promise<AmarPlanData | null> {
  const plan = getAmarPlan();
  if (!plan) return null;

  const data = await postApi<RescheduleResponse>("/api/amar-plan/reschedule", { plan });
  saveAmarPlan(data.plan);
  return data.plan;
}

// ── Task Completion (API) ─────────────────────────────────────────────────────

export async function completeAmarTask(taskId: string, mockScore?: number): Promise<AmarPlanData | null> {
  const plan = getAmarPlan();
  if (!plan) return null;

  const data = await postApi<CompleteTaskResponse>("/api/amar-plan/complete-task", {
    plan,
    taskId,
    ...(mockScore !== undefined && { mockScore }),
  });
  saveAmarPlan(data.plan);
  return data.plan;
}

// ── Feature 2: Subject Progress (API) ─────────────────────────────────────────

export async function getSubjectProgress(plan?: AmarPlanData | null): Promise<AmarSubjectProgress[]> {
  const p = plan || getAmarPlan();
  if (!p) return [];

  const data = await postApi<SubjectProgressResponse>("/api/amar-plan/subject-progress", { plan: p });
  return data.subjects;
}

// ── Plan Stats (API) ──────────────────────────────────────────────────────────

export async function getPlanStats(plan?: AmarPlanData | null): Promise<AmarPlanStats | null> {
  const p = plan || getAmarPlan();
  if (!p) return null;

  const data = await postApi<PlanStatsResponse>("/api/amar-plan/stats", { plan: p });
  return data.stats;
}

// ── Today's Tasks (local — read from cached plan) ─────────────────────────────

export function getTodayTasks(): AmarPlanTask[] {
  const plan = getAmarPlan();
  if (!plan) return [];
  const today = new Date().toISOString().split("T")[0];
  return plan.tasks.filter((t) => t.date === today);
}

export function getPendingTopicForToday(): string | null {
  const tasks = getTodayTasks();
  const pending = tasks.find((t) => !t.completed);
  return pending ? pending.topicBn : null;
}

// ── Share Card Data (API) ─────────────────────────────────────────────────────

export async function getShareCardData(): Promise<ShareCardDataResponse | null> {
  const plan = getAmarPlan();
  if (!plan) return null;

  return postApi<ShareCardDataResponse>("/api/amar-plan/share-card", { plan });
}

// ── Notification helpers (local) ──────────────────────────────────────────────

export function getNotificationTime(): string | null {
  const plan = getAmarPlan();
  return plan?.notificationTime ?? null;
}

export function setNotificationTime(time: string): void {
  const plan = getAmarPlan();
  if (plan) {
    plan.notificationTime = time;
    saveAmarPlan(plan);
  }
}
