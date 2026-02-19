// Interview Types
export type Language = "english" | "hindi" | "bengali";

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

export interface FinishInterviewResponse extends EvaluationScore {
  weakAreas: WeakArea[];
  improvementPlan?: ImprovementPlan;
  detailedFeedback?: string;
  strengths?: string[];
  practiceQuestions?: PracticeQuestion[];
  interviewType?: string;
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
