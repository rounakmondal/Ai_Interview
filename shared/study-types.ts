// ─────────────────────────────────────────────────────────────────────────────
// Syllabus & Study Plan — shared types for exam preparation system
// ─────────────────────────────────────────────────────────────────────────────

// ── Exam types (extended from govt-practice-data) ─────────────────────────────
export type StudyExamType = "WBCS" | "WBPSC" | "Police_SI" | "SSC_CGL" | "Banking";

export const STUDY_EXAM_LABELS: Record<StudyExamType, string> = {
  WBCS: "WBCS",
  WBPSC: "WBPSC",
  Police_SI: "Police SI",
  SSC_CGL: "SSC CGL",
  Banking: "Banking IBPS/SBI",
};

// ── Chapter / Subject models ──────────────────────────────────────────────────
export type ChapterStatus = "not_started" | "in_progress" | "done";

export interface Chapter {
  id: string;
  name: string;
  nameBn: string;
  status: ChapterStatus;
  progress: number;           // 0-100 based on test scores
  questionCount: number;      // questions available for this chapter
}

export interface SyllabusSubject {
  id: string;
  name: string;
  nameBn: string;
  icon: string;               // emoji
  chapters: Chapter[];
}

export interface ExamSyllabus {
  examId: StudyExamType;
  subjects: SyllabusSubject[];
}

// ── Study Plan types ──────────────────────────────────────────────────────────
export interface WeekPlan {
  week: number;
  title: string;
  subjects: string[];
  chapters: string[];
  hoursPerDay: number;
  tips: string;
}

export interface AIStudyPlan {
  examId: StudyExamType;
  examDate: string;
  hoursPerDay: number;
  totalWeeks: number;
  weeks: WeekPlan[];
  createdAt: string;
}

export interface TemplatePhaseTopic {
  subject: string;
  chapters: string[];
}

export interface TemplatePhase {
  phase: number;
  title: string;
  duration: string;
  description: string;
  topics: TemplatePhaseTopic[];
}

export interface StudyPlanTemplate {
  examId: StudyExamType;
  phases: TemplatePhase[];
}

// ── Chapter Test types ────────────────────────────────────────────────────────
export interface ChapterQuestion {
  id: number;
  question: string;
  questionBn?: string;
  options: [string, string, string, string];
  optionsBn?: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  explanationBn?: string;
}

export interface ChapterTestResult {
  chapterId: string;
  score: number;
  total: number;
  accuracy: number;
  passed: boolean;
  answers: { questionId: number; selected: number | null; correct: number }[];
}

// ── API request/response types ────────────────────────────────────────────────
export interface ExamPreferenceRequest {
  examId: StudyExamType;
}

export interface GenerateAIPlanRequest {
  examId: StudyExamType;
  examDate: string;
  hoursPerDay: number;
}

export interface ChapterTestSubmitRequest {
  chapterId: string;
  answers: { questionId: number; selected: number }[];
}

export interface AIChapterGuideRequest {
  chapterId: string;
  chapterName: string;
  userQuery: string;
}

export interface AIChapterGuideResponse {
  answer: string;
  chapterId: number;
}

// ── API Response types ────────────────────────────────────────────────────────
export interface SyllabusResponse {
  examId: StudyExamType;
  subjects: SyllabusSubject[];
  totalChapters: number;
  estimatedHoursPerChapter: number;  // avg hours to complete one chapter
}

export interface StudyTemplateResponse {
  examId: StudyExamType;
  phases: TemplatePhase[];
  totalHours: number;
  examDate?: string;
}

export interface SyllabusProgressResponse {
  examId: StudyExamType;
  completionPercentage: number;        // overall completion %
  chaptersCompleted: number;
  totalChapters: number;
  subjectProgress: {
    subjectId: string;
    subjectName: string;
    completionPercentage: number;
    chaptersCompleted: number;
    totalChapters: number;
  }[];
  lastUpdated: string;
}

// ── Amar Plan types ───────────────────────────────────────────────────────────

export interface AmarPlanTask {
  id: string;
  day: number;
  date: string;                   // YYYY-MM-DD
  subject: string;
  subjectBn: string;
  topic: string;
  topicBn: string;
  type: "study" | "revision" | "mock_test";
  completed: boolean;
  completedAt?: string;
  mockScore?: number;
  isWeak?: boolean;
}

export interface AmarPlanData {
  examId: StudyExamType;
  examDate: string;
  createdAt: string;
  lastAccessDate: string;
  hoursPerDay: number;
  notificationTime?: string;      // HH:mm
  weakSubjects: string[];
  tasks: AmarPlanTask[];
  streak: number;
  mockScores: AmarMockScore[];
  autoAdjustLog: AmarAdjustLog[];
}

export interface AmarMockScore {
  date: string;
  taskId: string;
  score: number;
  exam: string;
}

export interface AmarAdjustLog {
  date: string;
  missedDays: number;
  tasksRescheduled: number;
}

export interface AmarSubjectProgress {
  subject: string;
  subjectBn: string;
  total: number;
  completed: number;
  percentage: number;
  isWeak: boolean;
}

export interface AmarAutoAdjustResult {
  adjusted: boolean;
  missedDays: number;
  tasksRescheduled: number;
  needsFullReschedule: boolean;
  plan?: AmarPlanData;
}

export interface AmarPlanStats {
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  daysRemaining: number;
  examPassed: boolean;
  streak: number;
  examId: StudyExamType;
  examDate: string;
  mockScores: AmarMockScore[];
}

// ── Amar Plan API request/response types ──────────────────────────────────────

export interface CreateAmarPlanRequest {
  examId: StudyExamType;
  examDate: string;
  hoursPerDay: number;
  weakSubjects: string[];
  notificationTime?: string;
}

export interface CreateAmarPlanResponse {
  success: boolean;
  plan: AmarPlanData;
}

export interface AutoAdjustRequest {
  plan: AmarPlanData;
}

export interface AutoAdjustResponse {
  success: boolean;
  result: AmarAutoAdjustResult;
}

export interface RescheduleRequest {
  plan: AmarPlanData;
}

export interface RescheduleResponse {
  success: boolean;
  plan: AmarPlanData;
}

export interface CompleteTaskRequest {
  plan: AmarPlanData;
  taskId: string;
  mockScore?: number;
}

export interface CompleteTaskResponse {
  success: boolean;
  plan: AmarPlanData;
}

export interface SubjectProgressRequest {
  plan: AmarPlanData;
}

export interface SubjectProgressResponse {
  subjects: AmarSubjectProgress[];
}

export interface PlanStatsRequest {
  plan: AmarPlanData;
}

export interface PlanStatsResponse {
  stats: AmarPlanStats;
}

export interface ShareCardDataRequest {
  plan: AmarPlanData;
}

export interface ShareCardDataResponse {
  examLabel: string;
  daysRemaining: number;
  streak: number;
  percentage: number;
  examPassed: boolean;
  motivationalText: string;
}
