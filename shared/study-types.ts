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
