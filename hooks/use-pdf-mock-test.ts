import { useState, useEffect, useCallback, useRef } from "react";
import { extractPDFQuestions } from "@/lib/pdf-questions";

interface ExtractedQuestion {
  id: number;
  question: string;
  options: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
  correct_index?: number;
  explanation?: string;
}

interface UsePDFMockTestOptions {
  pdfPath: string;
  onError?: (error: string) => void;
}

export function usePDFMockTest(options: UsePDFMockTestOptions) {
  const { pdfPath, onError } = options;

  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testTitle, setTestTitle] = useState("PDF Mock Test");
  const [duration, setDuration] = useState(60); // minutes

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const loadedRef = useRef(false);

  // Load PDF and extract questions – run only once
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await extractPDFQuestions(pdfPath);

        setQuestions(data.questions);
        setTestTitle(data.title);
        setDuration(data.duration_minutes);
        setTimeRemaining(data.duration_minutes * 60);

        // Initialize answers
        const initialAnswers: Record<number, number | null> = {};
        data.questions.forEach((q: ExtractedQuestion) => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);

        setLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load PDF";
        setError(message);
        onError?.(message);
        setLoading(false);
      }
    };

    if (pdfPath) {
      loadPDF();
    }
  }, [pdfPath]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer effect – use ref-based approach to avoid re-creating interval every second
  const submittedRef = useRef(submitted);
  submittedRef.current = submitted;
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  useEffect(() => {
    if (submittedRef.current || loadingRef.current) return;
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setSubmitted(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submitted]); // only re-run when loading/submitted change, NOT on every tick

  // Answer question
  const answerQuestion = useCallback((optionIndex: number) => {
    if (questions[currentQuestion]) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion].id]: optionIndex,
      }));
      setVisited((prev) => new Set([...prev, currentQuestion]));
    }
  }, [currentQuestion, questions]);

  // Navigate to specific question
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestion(index);
      setVisited((prev) => new Set([...prev, index]));
    }
  }, [questions.length]);

  // Next question
  const nextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      goToQuestion(currentQuestion + 1);
    }
  }, [currentQuestion, questions.length, goToQuestion]);

  // Previous question
  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      goToQuestion(currentQuestion - 1);
    }
  }, [currentQuestion, goToQuestion]);

  // Clear answer
  const clearAnswer = useCallback(() => {
    if (questions[currentQuestion]) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion].id]: null,
      }));
    }
  }, [currentQuestion, questions]);

  // Mark for review
  const toggleFlag = useCallback(() => {
    if (questions[currentQuestion]) {
      setFlagged((prev) => {
        const newFlagged = new Set(prev);
        if (newFlagged.has(currentQuestion)) {
          newFlagged.delete(currentQuestion);
        } else {
          newFlagged.add(currentQuestion);
        }
        return newFlagged;
      });
    }
  }, [currentQuestion, questions]);

  // Calculate stats
  const stats = {
    answered: Object.values(answers).filter((a) => a !== null).length,
    unanswered: questions.length - Object.values(answers).filter((a) => a !== null).length,
    flagged: flagged.size,
    visited: visited.size,
  };

  return {
    // State
    questions,
    loading,
    error,
    testTitle,
    duration,
    submitted,
    timeRemaining,
    currentQuestion,
    currentQuestionData: questions[currentQuestion],
    answers,
    visited,
    flagged,

    // Stats
    stats,
    progress: questions.length > 0 ? (Object.values(answers).filter((a) => a !== null).length / questions.length) * 100 : 0,

    // Actions
    answerQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    clearAnswer,
    toggleFlag,
    finalize: () => setSubmitted(true),
    setDuration: (mins: number) => { setDuration(mins); setTimeRemaining(mins * 60); },
    setTimeRemaining,
  };
}
