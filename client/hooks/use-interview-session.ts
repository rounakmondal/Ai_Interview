import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import type {
  StartInterviewRequest,
  NextQuestionRequest,
  FinishInterviewRequest,
  InterviewSession,
  FinishInterviewResponse,
  NextQuestionResponse,
} from "@shared/api";

interface UseInterviewSessionState extends InterviewSession {
  isInitializing: boolean;
  isLoadingQuestion: boolean;
  isFinishing: boolean;
  error: string | null;
}

const initialState: UseInterviewSessionState = {
  sessionId: "",
  interviewType: "it",
  language: "english",
  currentQuestion: "",
  questionNumber: 1,
  totalQuestions: 8,
  isFollowUp: false,
  isCompleted: false,
  isInitializing: false,
  isLoadingQuestion: false,
  isFinishing: false,
  error: null,
};

export const useInterviewSession = () => {
  const [state, setState] = useState<UseInterviewSessionState>(initialState);

  const startInterview = useCallback(
    async (config: StartInterviewRequest) => {
      setState((prev) => ({ ...prev, isInitializing: true, error: null }));

      try {
        const response = await apiClient.startInterview(config);

        setState((prev) => ({
          ...prev,
          sessionId: response.sessionId,
          currentQuestion: response.firstQuestion,
          interviewType: config.interviewType,
          language: config.language,
          questionNumber: 1,
          totalQuestions: 8,
          isInitializing: false,
        }));

        return response;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to start interview";
        setState((prev) => ({
          ...prev,
          isInitializing: false,
          error,
        }));
        throw err;
      }
    },
    []
  );

  const submitAnswer = useCallback(
    async (userAnswer: string) => {
      if (!state.sessionId) {
        const error = "No active session";
        setState((prev) => ({ ...prev, error }));
        throw new Error(error);
      }

      setState((prev) => ({ ...prev, isLoadingQuestion: true, error: null }));

      try {
        const response: NextQuestionResponse =
          await apiClient.getNextQuestion({
            sessionId: state.sessionId,
            userAnswer,
          });

        setState((prev) => ({
          ...prev,
          currentQuestion: response.questionText,
          isFollowUp: response.isFollowUp || false,
          questionNumber: response.questionNumber || prev.questionNumber + 1,
          totalQuestions: response.totalQuestions || prev.totalQuestions,
          isLoadingQuestion: false,
        }));

        return response;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to submit answer";
        setState((prev) => ({
          ...prev,
          isLoadingQuestion: false,
          error,
        }));
        throw err;
      }
    },
    [state.sessionId]
  );

  const finishInterview = useCallback(async () => {
    if (!state.sessionId) {
      const error = "No active session";
      setState((prev) => ({ ...prev, error }));
      throw new Error(error);
    }

    setState((prev) => ({ ...prev, isFinishing: true, error: null }));

    try {
      const response: FinishInterviewResponse =
        await apiClient.finishInterview({
          sessionId: state.sessionId,
        });

      setState((prev) => ({
        ...prev,
        isCompleted: true,
        isFinishing: false,
      }));

      return response;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to finish interview";
      setState((prev) => ({
        ...prev,
        isFinishing: false,
        error,
      }));
      throw err;
    }
  }, [state.sessionId]);

  const resetError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    startInterview,
    submitAnswer,
    finishInterview,
    resetError,
    reset,
  };
};
