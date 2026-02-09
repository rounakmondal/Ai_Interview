import {
  StartInterviewRequest,
  StartInterviewResponse,
  NextQuestionRequest,
  NextQuestionResponse,
  FinishInterviewRequest,
  FinishInterviewResponse,
} from "@shared/api";
import { mockApi } from "./mock-api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

class ApiClient {
  private baseUrl: string;
  private useMock: boolean;
  private mockAvailable = false;

  constructor(baseUrl: string = API_BASE_URL, useMock: boolean = USE_MOCK_API) {
    this.baseUrl = baseUrl;
    this.useMock = useMock;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
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
        error
      );
      // Fall back to mock API
      this.mockAvailable = true;
      return this.requestMock<T>(endpoint, options);
    }
  }

  private async requestMock<T>(
    endpoint: string,
    options: RequestInit = {}
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
