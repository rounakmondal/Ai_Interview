import {
  StartInterviewRequest,
  StartInterviewResponse,
  NextQuestionRequest,
  NextQuestionResponse,
  FinishInterviewRequest,
  FinishInterviewResponse,
  RawFinishInterviewResponse,
} from "@shared/api";
import { mockApi } from "./mock-api";

// API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/** Base URL for question-bank endpoints (separate backend on port 8000) */
export const QUESTIONS_API_BASE = API_BASE_URL;
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

class ApiClient {
  private baseUrl: string;
  private useMock: boolean;
  private mockAvailable = false;

  constructor(baseUrl: string = API_BASE_URL, useMock: boolean = USE_MOCK_API) {
    this.baseUrl = baseUrl;
    this.useMock = useMock;

    // Log API configuration
    if (typeof window !== "undefined") {
      console.log(
        `%c MedhaHub API Client Initialized`,
        "color: #ea580c; font-weight: bold; font-size: 12px;",
      );
      console.log(
        `%c Mode: ${useMock ? "Mock API" : "Real API"}`,
        "color: #ea580c;",
      );
      if (!useMock) {
        console.log(`%c Endpoint: ${baseUrl}`, "color: #ea580c;");
        console.log(
          `%c Fallback: Using mock API if real API is unavailable`,
          "color: #ea580c; font-size: 11px;",
        );
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    // If using mock API or it's already been determined to be unavailable
    if (this.useMock || this.mockAvailable) {
      return this.requestMock<T>(endpoint, options);
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(
        `Real API unavailable (${endpoint}), falling back to mock API`,
        error,
      );
      // Fall back to mock API
      this.mockAvailable = true;
      return this.requestMock<T>(endpoint, options);
    }
  }

  private async requestMock<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      const body = options.body ? JSON.parse(options.body as string) : {};

      if (endpoint === "/interview/start") {
        return (await mockApi.startInterview(body)) as T;
      } else if (endpoint === "/interview/next-question") {
        return (await mockApi.getNextQuestion(body)) as T;
      } else if (endpoint === "/interview/finish") {
        return (await mockApi.finishInterview(body)) as T;
      }

      throw new Error(`Unknown endpoint: ${endpoint}`);
    } catch (error) {
      console.error(`Mock API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Start a new interview session
  async startInterview(
    data: StartInterviewRequest,
  ): Promise<StartInterviewResponse> {
    return this.request<StartInterviewResponse>("/interview/start", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Get next question based on user answer
  async getNextQuestion(
    data: NextQuestionRequest,
  ): Promise<NextQuestionResponse> {
    return this.request<NextQuestionResponse>("/interview/next-question", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Finish interview and get evaluation
  async finishInterview(
    data: FinishInterviewRequest,
  ): Promise<FinishInterviewResponse> {
    const raw = await this.request<RawFinishInterviewResponse>("/interview/finish", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return this.transformEvaluation(raw);
  }

  // Transform snake_case API response to camelCase frontend types
  private transformEvaluation(raw: RawFinishInterviewResponse): FinishInterviewResponse {
    const evalData = raw.evaluation ?? (raw as any);

    if (typeof evalData.overallScore === "number") {
      return evalData as FinishInterviewResponse;
    }

    const mapTranscript = (rows: any[] | undefined) =>
      Array.isArray(rows)
        ? rows.map((t: any) => ({
            questionText: t.question_text ?? t.questionText ?? "",
            userAnswer: t.user_answer ?? t.userAnswer ?? "",
          }))
        : undefined;

    const mapReviews = (rows: any[] | undefined) =>
      Array.isArray(rows)
        ? rows.map((r: any) => ({
            questionText: r.question_text ?? r.questionText ?? "",
            userAnswer: r.user_answer ?? r.userAnswer ?? "",
            idealAnswer: r.ideal_answer ?? r.idealAnswer ?? "",
            shortFeedback: r.short_feedback ?? r.shortFeedback ?? undefined,
          }))
        : undefined;

    return {
      overallScore: evalData.overall_score ?? 0,
      communicationScore: evalData.communication_score ?? 0,
      technicalScore: evalData.technical_score ?? 0,
      confidenceScore: evalData.confidence_score ?? 0,
      weakAreas: Array.isArray(evalData.weak_areas)
        ? evalData.weak_areas.map((w: any) => ({
            area: w.area ?? "",
            issue: w.issue ?? "",
            howToImprove: w.how_to_improve ?? "",
          }))
        : [],
      improvementPlan: evalData.improvement_plan
        ? {
            immediateActions: evalData.improvement_plan.immediate_actions ?? [],
            resourcesToStudy: evalData.improvement_plan.resources_to_study ?? [],
            practiceStrategy: evalData.improvement_plan.practice_strategy ?? "",
          }
        : undefined,
      detailedFeedback: evalData.detailed_feedback ?? undefined,
      practiceQuestions: Array.isArray(evalData.practice_questions)
        ? evalData.practice_questions.map((q: any) => ({
            question: q.question ?? "",
            category: q.category ?? "General",
            difficulty: (q.difficulty ?? "medium").toLowerCase(),
            topic: q.topic ?? "",
            suggestedAnswer: q.suggested_answer ?? q.suggestedAnswer ?? undefined,
          }))
        : undefined,
      youtubeVideos: Array.isArray(evalData.suggested_videos)
        ? evalData.suggested_videos.map((v: any) => ({
            title: v.title,
            url: v.url,
            reason: v.reason,
          }))
        : undefined,
      strengths: Array.isArray(evalData.strengths) ? evalData.strengths : undefined,
      interviewType: evalData.interview_type ?? evalData.interviewType,
      transcriptTurns: mapTranscript(evalData.transcript_turns),
      questionReviews: mapReviews(evalData.question_reviews),
    };
  }
}

// Export a client explicitly bound to the chosen base URL
export const apiClient = new ApiClient(API_BASE_URL);
