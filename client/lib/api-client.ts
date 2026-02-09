import {
  StartInterviewRequest,
  StartInterviewResponse,
  NextQuestionRequest,
  NextQuestionResponse,
  FinishInterviewRequest,
  FinishInterviewResponse,
} from "@shared/api";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}`,
        }));
        throw new Error(error.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Start a new interview session
  async startInterview(
    data: StartInterviewRequest
  ): Promise<StartInterviewResponse> {
    return this.request<StartInterviewResponse>("/interview/start", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Get next question based on user answer
  async getNextQuestion(
    data: NextQuestionRequest
  ): Promise<NextQuestionResponse> {
    return this.request<NextQuestionResponse>("/interview/next-question", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Finish interview and get evaluation
  async finishInterview(
    data: FinishInterviewRequest
  ): Promise<FinishInterviewResponse> {
    return this.request<FinishInterviewResponse>("/interview/finish", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
