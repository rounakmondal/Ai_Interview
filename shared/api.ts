// ─────────────────────────────────────────────
// Career Mentor Types
// ─────────────────────────────────────────────

export type CareerIntent =
  | "no_job"
  | "layoff_fear"
  | "ai_impact"
  | "career_gap"
  | "low_salary"
  | "tech_confusion"
  | "non_it_switch"
  | "skill_roadmap"
  | "general";

export interface RoadmapWeek {
  week: string;
  tasks: string[];
}

export interface RoadmapData {
  title: string;
  weeks: RoadmapWeek[];
}

export interface CareerMentorRequest {
  message: string;
  context?: string; // Optional: extra user context (years of experience, skills, target role)
}

export interface CareerMentorResponse {
  intent: CareerIntent;
  summary: string;
  advice: string[];
  roadmap: RoadmapData | null;
  salaryExpectation: string | null;
  resources: string[];
}

// ─────────────────────────────────────────────
// Interview Types
export type Language = "english" | "hindi" | "bengali";

// Demo
export interface DemoResponse {
  message: string;
}

// API Request/Response Types
export interface StartInterviewRequest {
  interviewType: string; // Free-text interview type (e.g., "Software Engineer", "Marketing Manager")
  language: Language;
  cvText?: string;
  jobDescription?: string; // Optional job description to tailor questions
}

export interface StartInterviewResponse {
  sessionId: string;
  message: string;
  success?: boolean;
  cvUploaded?: boolean;
  interviewType?: string;
  language?: string;
}

export interface NextQuestionRequest {
  sessionId: string;
  userAnswer: string;
}

export interface NextQuestionResponse {
  message: string;
  isFollowUp: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

export interface FinishInterviewRequest {
  sessionId: string;
}

export interface EvaluationScore {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
}

// Weak area with detailed info from the API
export interface WeakArea {
  area: string;
  issue: string;
  howToImprove: string;
}

// Improvement plan from the API
export interface ImprovementPlan {
  immediateActions: string[];
  resourcesToStudy: string[];
  practiceStrategy: string;
}

// Practice question with suggested answer for Areas of Improvement
export interface PracticeQuestion {
  question: string;
  suggestedAnswer?: string;
  category: string; // e.g., "Technical", "Behavioral", "Situational"
  difficulty: "easy" | "medium" | "hard" | "Easy" | "Medium" | "Hard";
  topic?: string;
}

export interface YoutubeVideoSuggestion {
  title: string;
  url: string;
  reason?: string;
}

export interface FinishInterviewResponse extends EvaluationScore {
  weakAreas: WeakArea[];
  improvementPlan?: ImprovementPlan;
  detailedFeedback?: string;
  strengths?: string[];
  practiceQuestions?: PracticeQuestion[];
  interviewType?: string;
  youtubeVideos?: YoutubeVideoSuggestion[];
}

// Raw API response shape (snake_case from backend)
export interface RawFinishInterviewResponse {
  success?: boolean;
  sessionId?: string;
  evaluation: {
    overall_score: number;
    communication_score: number;
    technical_score: number;
    confidence_score: number;
    weak_areas: Array<{
      area: string;
      issue: string;
      how_to_improve: string;
    }>;
    improvement_plan?: {
      immediate_actions: string[];
      resources_to_study: string[];
      practice_strategy: string;
    };
    detailed_feedback?: string;
    practice_questions?: Array<{
      category: string;
      question: string;
      difficulty: string;
      topic: string;
    }>;
    youtube_videos?: Array<{
      video_id: string;
      title: string;
      channel_title?: string;
      description?: string;
      thumbnail_url?: string;
    }>;
  };
}

// Interview Session State
export interface InterviewSession {
  sessionId: string;
  interviewType: string;
  language: Language;
  currentQuestion: string;
  questionNumber: number;
  totalQuestions: number;
  isFollowUp: boolean;
  isCompleted: boolean;
}

export interface InterviewEvaluation extends FinishInterviewResponse {
  sessionId: string;
  completedAt: string;
}
