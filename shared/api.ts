// Interview Types
export type InterviewType = "government" | "private" | "it" | "non-it";
export type Language = "english" | "hindi" | "bengali";

// API Request/Response Types
export interface StartInterviewRequest {
  interviewType: InterviewType;
  language: Language;
  cvText?: string;
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

export interface FinishInterviewResponse extends EvaluationScore {
  weakAreas: string[];
  improvementSuggestions: string[];
  strengths?: string[];
}

// Interview Session State
export interface InterviewSession {
  sessionId: string;
  interviewType: InterviewType;
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
