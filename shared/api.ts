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

/** One turn: what the interviewer asked (as shown) and the candidate's answer. */
export interface InterviewTranscriptTurn {
  questionText: string;
  userAnswer: string;
}

/** Per-question coaching: stronger model answer aligned with the same question. */
export interface InterviewQuestionReview {
  questionText: string;
  userAnswer: string;
  idealAnswer: string;
  shortFeedback?: string;
}

export interface FinishInterviewRequest {
  sessionId: string;
  /** Client-collected Q&A; backend should return `questionReviews` for each turn. */
  transcriptTurns?: InterviewTranscriptTurn[];
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
  /** Echo of submitted turns (optional; useful for PDF/export). */
  transcriptTurns?: InterviewTranscriptTurn[];
  /** One entry per transcript turn: ideal answer + brief feedback (from AI on backend). */
  questionReviews?: InterviewQuestionReview[];
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
    transcript_turns?: Array<{
      question_text: string;
      user_answer: string;
    }>;
    question_reviews?: Array<{
      question_text: string;
      user_answer: string;
      ideal_answer: string;
      short_feedback?: string;
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

// ─────────────────────────────────────────────
// Government Exam Practice Types
// ─────────────────────────────────────────────

export type ExamType = "WBCS" | "SSC" | "Railway" | "Banking" | "Police";
export type Subject = "History" | "Geography" | "Polity" | "Reasoning" | "Math" | "Current Affairs";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface GovtQuestion {
  id: number;
  exam: ExamType;
  subject: Subject;
  difficulty: Difficulty;
  year?: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  explanationBn?: string;
}

export interface NewsItem {
  id: number;
  date: string;
  headline: string;
  summary: string;
  tags: string[];
  importance: "high" | "medium" | "low";
}

export interface WeeklyQuizItem {
  id: number;
  week: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface MonthlyTopic {
  title: string;
  description: string;
  keyPoints: string[];
  relevantExams: ExamType[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  district: string;
  state: string;
  avatar: string;
  weeklyScore: number;
  monthlyScore: number;
  totalTests: number;
  badge: "gold" | "silver" | "bronze" | "standard";
}

export interface DashboardStats {
  totalTests: number;
  averageScore: number;
  weeklyTests: number;
  strongSubjects: Subject[];
  weakSubjects: Subject[];
  recentTests: { date: string; exam: string; score: number; total: number }[];
  subjectScores: { subject: Subject; score: number; tests: number }[];
  progressData: { week: string; score: number }[];
}

export interface CurrentAffairsResponse {
  news: NewsItem[];
  weeklyQuiz: WeeklyQuizItem[];
  monthlyTopics: MonthlyTopic[];
}
