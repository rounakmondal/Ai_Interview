import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, BarChart3, ChevronRight, Loader2,
  Zap, Target, Award, BookOpen, Heart, Volume2, Maximize2,
  Play, Check, X
} from "lucide-react";
import ProfileButton from "@/components/ProfileButton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────
type Language = "english" | "hindi" | "bengali";
type QuestionStatus = "not-attempted" | "attempted" | "correct" | "wrong" | "marked";

interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  subject?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  audioUrl?: string;
  imageUrl?: string;
}

interface QuestionAttempt {
  questionId: string;
  userAnswer: string | number | null;
  status: QuestionStatus;
  timeTaken: number;
  isMarkedForReview: boolean;
}

interface VirtualExamState {
  questions: Question[];
  attempts: QuestionAttempt[];
  currentQuestionIndex: number;
  timeElapsed: number;
  isTestStarted: boolean;
  isTestCompleted: boolean;
  totalTime: number;
}

// ─── Main Component ────────────────────────────────────────────────
export default function VirtualExamRoom() {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const { toast } = useToast();

  // State Management
  const [examSelected, setExamSelected] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [language, setLanguage] = useState<Language>("english");
  const [testState, setTestState] = useState<VirtualExamState>({
    questions: [],
    attempts: [],
    currentQuestionIndex: 0,
    timeElapsed: 0,
    isTestStarted: false,
    isTestCompleted: false,
    totalTime: 120 * 60, // 2 hours in seconds
  });

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allQuestionsLoaded, setAllQuestionsLoaded] = useState(false);
  const questionsRef = useRef<HTMLDivElement>(null);
  const timerInterval = useRef<NodeJS.Timeout>();

  // ─── Exam Selection ────────────────────────────────────────────────
  const startExam = async (exam: string, subject: string, lang: Language) => {
    setLoading(true);
    try {
      // Fetch initial batch of questions from your API
      const response = await fetch(`/api/virtual-exam/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          subject,
          language: lang,
          limit: 50,
          offset: 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();

      setTestState((prev) => ({
        ...prev,
        questions: data.questions || [],
        attempts: (data.questions || []).map((q: Question) => ({
          questionId: q.id,
          userAnswer: null,
          status: "not-attempted" as QuestionStatus,
          timeTaken: 0,
          isMarkedForReview: false,
        })),
        isTestStarted: true,
        totalTime: data.totalTime || 120 * 60,
      }));

      setSelectedExam(exam);
      setSelectedSubject(subject);
      setExamSelected(true);

      toast({
        title: "Exam Started",
        description: "Good luck! Attempt all questions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Load More Questions (Infinite Scroll) ────────────────────────
  const loadMoreQuestions = useCallback(async () => {
    if (loadingMore || allQuestionsLoaded) return;

    setLoadingMore(true);
    try {
      const response = await fetch(`/api/virtual-exam/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam: selectedExam,
          subject: selectedSubject,
          language,
          limit: 50,
          offset: testState.questions.length,
        }),
      });

      if (!response.ok) throw new Error("Failed to load more questions");
      const data = await response.json();

      if (data.questions && data.questions.length > 0) {
        const newQuestions = data.questions;
        setTestState((prev) => ({
          ...prev,
          questions: [...prev.questions, ...newQuestions],
          attempts: [
            ...prev.attempts,
            ...newQuestions.map((q: Question) => ({
              questionId: q.id,
              userAnswer: null,
              status: "not-attempted" as QuestionStatus,
              timeTaken: 0,
              isMarkedForReview: false,
            })),
          ],
        }));
      } else {
        setAllQuestionsLoaded(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more questions.",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  }, [selectedExam, selectedSubject, language, testState.questions.length, loadingMore, allQuestionsLoaded, toast]);

  // ─── Timer Effect ──────────────────────────────────────────────────
  useEffect(() => {
    if (!testState.isTestStarted || testState.isTestCompleted) {
      if (timerInterval.current) clearInterval(timerInterval.current);
      return;
    }

    timerInterval.current = setInterval(() => {
      setTestState((prev) => {
        const newElapsed = prev.timeElapsed + 1;
        if (newElapsed >= prev.totalTime) {
          // Auto-submit test
          if (timerInterval.current) clearInterval(timerInterval.current);
          submitTest();
          return { ...prev, isTestCompleted: true };
        }
        return { ...prev, timeElapsed: newElapsed };
      });
    }, 1000);

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [testState.isTestStarted, testState.isTestCompleted]);

  // ─── Handle Answer Selection ────────────────────────────────────────
  const handleAnswerSelect = (answer: string | number) => {
    setTestState((prev) => {
      const newAttempts = [...prev.attempts];
      const currentQuestion = prev.questions[prev.currentQuestionIndex];

      newAttempts[prev.currentQuestionIndex] = {
        ...newAttempts[prev.currentQuestionIndex],
        userAnswer: answer,
        status:
          answer === currentQuestion.correctAnswer
            ? ("correct" as QuestionStatus)
            : ("wrong" as QuestionStatus),
        timeTaken: testState.timeElapsed,
      };

      return { ...prev, attempts: newAttempts };
    });
  };

  // ─── Mark for Review ────────────────────────────────────────────────
  const toggleMarkForReview = (index: number) => {
    setTestState((prev) => {
      const newAttempts = [...prev.attempts];
      newAttempts[index] = {
        ...newAttempts[index],
        isMarkedForReview: !newAttempts[index].isMarkedForReview,
      };
      return { ...prev, attempts: newAttempts };
    });
  };

  // ─── Submit Test ────────────────────────────────────────────────────
  const submitTest = async () => {
    try {
      const response = await fetch(`/api/virtual-exam/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam: selectedExam,
          subject: selectedSubject,
          language,
          attempts: testState.attempts,
          totalTime: testState.timeElapsed,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit test");
      const result = await response.json();

      navigate("/virtual-exam/result", {
        state: {
          exam: selectedExam,
          subject: selectedSubject,
          language,
          attempts: testState.attempts,
          questions: testState.questions,
          result,
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ─── Format Time ────────────────────────────────────────────────────
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ─── Stats Calculation ──────────────────────────────────────────────
  const stats = {
    attempted: testState.attempts.filter((a) => a.userAnswer !== null).length,
    correct: testState.attempts.filter((a) => a.status === "correct").length,
    wrong: testState.attempts.filter((a) => a.status === "wrong").length,
    markedForReview: testState.attempts.filter(
      (a) => a.isMarkedForReview
    ).length,
    notAttempted: testState.attempts.filter(
      (a) => a.status === "not-attempted"
    ).length,
  };

  // ─── Render: Exam Selection Screen ──────────────────────────────────
  if (!examSelected) {
    return <ExamSelectionScreen onSelect={startExam} loading={loading} />;
  }

  // ─── Render: Test Screen ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-white">{selectedExam} - {selectedSubject}</h1>
              <p className="text-xs text-slate-400">Virtual Exam Room</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <motion.div className="flex items-center gap-2 text-orange-400 font-bold">
              <Clock className="w-4 h-4" />
              {formatTime(testState.totalTime - testState.timeElapsed)}
            </motion.div>

            <div className="flex gap-3 text-xs">
              <div>
                <p className="text-slate-400">Attempted</p>
                <p className="font-bold text-white">{stats.attempted}/{testState.attempts.length}</p>
              </div>
              <div>
                <p className="text-slate-400">Correct</p>
                <p className="font-bold text-emerald-400">{stats.correct}</p>
              </div>
            </div>

            <ProfileButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
        {/* Main Content */}
        <div className="lg:col-span-9">
          {/* Question Detail View */}
          {testState.questions.length > 0 && (
            <motion.div
              key={testState.questions[testState.currentQuestionIndex]?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6"
            >
              <QuestionCard
                question={testState.questions[testState.currentQuestionIndex]}
                questionNumber={testState.currentQuestionIndex + 1}
                totalQuestions={testState.questions.length}
                attempt={testState.attempts[testState.currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
                onMarkForReview={() => toggleMarkForReview(testState.currentQuestionIndex)}
                language={language}
              />
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => setTestState((prev) => ({
                ...prev,
                currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
              }))}
              disabled={testState.currentQuestionIndex === 0}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition"
            >
              Previous
            </button>

            <button
              onClick={() => setTestState((prev) => ({
                ...prev,
                currentQuestionIndex: Math.min(
                  prev.questions.length - 1,
                  prev.currentQuestionIndex + 1
                ),
              }))}
              disabled={testState.currentQuestionIndex === testState.questions.length - 1}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={submitTest}
              className="ml-auto px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Sidebar: Question Navigator */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Questions ({testState.questions.length})
            </h3>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {testState.questions.map((q, idx) => {
                const attempt = testState.attempts[idx];
                const bgClass = {
                  "not-attempted": "bg-slate-700 hover:bg-slate-600",
                  attempted: "bg-yellow-500/30 hover:bg-yellow-500/40",
                  correct: "bg-emerald-500/30 hover:bg-emerald-500/40",
                  wrong: "bg-red-500/30 hover:bg-red-500/40",
                  marked: "bg-blue-500/30 hover:bg-blue-500/40",
                }[attempt?.status || "not-attempted"];

                return (
                  <button
                    key={q.id}
                    onClick={() => setTestState((prev) => ({
                      ...prev,
                      currentQuestionIndex: idx,
                    }))}
                    className={cn(
                      "aspect-square rounded flex items-center justify-center text-sm font-semibold transition",
                      bgClass,
                      testState.currentQuestionIndex === idx && "ring-2 ring-orange-500"
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="space-y-2 text-xs">
              <StatItem icon={<Check className="w-3 h-3" />} label="Correct" value={stats.correct} color="text-emerald-400" />
              <StatItem icon={<X className="w-3 h-3" />} label="Wrong" value={stats.wrong} color="text-red-400" />
              <StatItem icon={<Heart className="w-3 h-3" />} label="Marked" value={stats.markedForReview} color="text-blue-400" />
              <StatItem icon={<Zap className="w-3 h-3" />} label="Not Attempted" value={stats.notAttempted} color="text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Question Card Component ────────────────────────────────────────
function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  attempt,
  onAnswerSelect,
  onMarkForReview,
  language,
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  attempt: QuestionAttempt;
  onAnswerSelect: (answer: string | number) => void;
  onMarkForReview: () => void;
  language: Language;
}) {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-slate-400">Question {questionNumber}/{totalQuestions}</p>
          <h2 className="text-xl font-bold text-white mt-2">{question.text}</h2>
        </div>
        <div className="flex gap-2">
          {question.audioUrl && (
            <button className="p-2 hover:bg-slate-700 rounded-lg transition">
              <Volume2 className="w-5 h-5 text-slate-400" />
            </button>
          )}
          {question.imageUrl && (
            <button className="p-2 hover:bg-slate-700 rounded-lg transition">
              <Maximize2 className="w-5 h-5 text-slate-400" />
            </button>
          )}
          <button
            onClick={onMarkForReview}
            className={cn(
              "p-2 rounded-lg transition",
              attempt.isMarkedForReview
                ? "bg-blue-500/30 text-blue-400"
                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
            )}
          >
            <Heart className={cn("w-5 h-5", attempt.isMarkedForReview && "fill-current")} />
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswerSelect(idx)}
            className={cn(
              "w-full p-4 rounded-lg border-2 text-left transition",
              attempt.userAnswer === idx
                ? "border-orange-500 bg-orange-500/20"
                : "border-slate-600 hover:border-slate-500 bg-slate-700/50"
            )}
          >
            <p className="font-semibold">
              {String.fromCharCode(65 + idx)}) {option}
            </p>
          </button>
        ))}
      </div>

      {/* Difficulty & Subject Tags */}
      <div className="flex gap-2 mt-6">
        {question.difficulty && (
          <span className="text-xs px-3 py-1 bg-slate-700 rounded-full text-slate-300">
            {question.difficulty}
          </span>
        )}
        {question.subject && (
          <span className="text-xs px-3 py-1 bg-blue-500/20 rounded-full text-blue-300">
            {question.subject}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Exam Selection Screen ──────────────────────────────────────────
function ExamSelectionScreen({
  onSelect,
  loading,
}: {
  onSelect: (exam: string, subject: string, language: Language) => void;
  loading: boolean;
}) {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [language, setLanguage] = useState<Language>("english");

  const exams = ["WBCS", "SSC", "Railway", "Banking", "Police", "UPSC", "JTET", "IBPS"];
  const subjects = ["History", "Geography", "Polity", "Reasoning", "Math", "Current Affairs"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
      <header className="border-b border-slate-700 bg-slate-900/95 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-2xl text-white">Virtual Exam Room</h1>
          <ProfileButton />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Select Your Exam</h2>

          {/* Exam Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Exam</label>
            <div className="grid grid-cols-4 gap-3">
              {exams.map((exam) => (
                <button
                  key={exam}
                  onClick={() => setSelectedExam(exam)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition font-semibold",
                    selectedExam === exam
                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                      : "border-slate-600 bg-slate-700 hover:border-orange-500 text-slate-300"
                  )}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Subject</label>
            <div className="grid grid-cols-3 gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition font-semibold",
                    selectedSubject === subject
                      ? "border-blue-500 bg-blue-500/20 text-blue-300"
                      : "border-slate-600 bg-slate-700 hover:border-blue-500 text-slate-300"
                  )}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Language</label>
            <div className="grid grid-cols-3 gap-3">
              {(["english", "hindi", "bengali"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition font-semibold capitalize",
                    language === lang
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-slate-600 bg-slate-700 hover:border-emerald-500 text-slate-300"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => {
              if (selectedExam && selectedSubject) {
                onSelect(selectedExam, selectedSubject, language);
              }
            }}
            disabled={!selectedExam || !selectedSubject || loading}
            className="w-full mt-8 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading Exam...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Exam
              </>
            )}
          </button>
        </motion.div>
      </main>
    </div>
  );
}

// ─── Stat Item Component ────────────────────────────────────────────
function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-slate-400">{label}</span>
      </div>
      <span className={cn("font-bold", color)}>{value}</span>
    </div>
  );
}
