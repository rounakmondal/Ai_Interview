import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  BookOpen,
} from "lucide-react";
import { usePDFMockTest } from "@/hooks/use-pdf-mock-test";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function PDFMockTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    pdfPath?: string;
    pdfFileName?: string;
    testType?: string;
  } | null;

  if (!state?.pdfPath) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            No PDF Selected
          </h1>
          <p className="text-muted-foreground mb-6">
            Please select a PDF from the Question Hub to start a mock test.
          </p>
          <Link to="/question-hub">
            <Button>Back to Question Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  const test = usePDFMockTest({
    pdfPath: state.pdfPath,
    onError: (error) => console.error("Test error:", error),
  });

  const [showInstructions, setShowInstructions] = useState(!test.loading && !test.error);

  // Handle PDF extraction errors
  if (test.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Unable to Load Test
          </h1>
          <p className="text-muted-foreground mb-6">{test.error}</p>
          <div className="flex gap-3">
            <Link to="/question-hub" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Hub
              </Button>
            </Link>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1"
              variant="default"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Instructions screen
  if (showInstructions && !test.submitted && test.questions.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
          <div className="container px-4 h-14 flex items-center gap-3">
            <Link
              to="/question-hub"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Question Hub
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Mock Test Setup</span>
            <div className="ml-auto">
              <ProfileButton />
            </div>
          </div>
        </header>

        <main className="container px-4 py-12 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-card border border-border/50 rounded-xl p-8 mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {test.testTitle}
              </h1>
              <p className="text-muted-foreground mb-8">{state.pdfFileName}</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      Questions
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {test.questions.length}
                  </div>
                </div>
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-muted-foreground">
                      Duration
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {test.duration} min
                  </div>
                </div>
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-muted-foreground">
                      Per Q
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {(test.duration / test.questions.length).toFixed(0)}s
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Instructions
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    ✓ Answer all questions within the given time limit
                  </li>
                  <li>✓ Mark questions for review if needed</li>
                  <li>✓ You can navigate between questions at any time</li>
                  <li>✓ Results will be shown after submission</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link to="/question-hub" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowInstructions(false)}
                  className="flex-1 gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Start Test
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Loading state
  if (test.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground">
            Extracting PDF...
          </h2>
          <p className="text-muted-foreground mt-2">
            This may take a moment for larger files
          </p>
        </div>
      </div>
    );
  }

  // No questions found
  if (!test.loading && test.questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            No Questions Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The PDF could not be parsed into questions. Please try another PDF or contact support.
          </p>
          <Link to="/question-hub">
            <Button>Back to Question Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Main test interface
  if (!test.submitted && test.questions.length > 0) {
    const q = test.currentQuestionData;
    if (!q) return null;

    const currentAnswer = test.answers[q.id];
    const isAnswered = currentAnswer !== null && currentAnswer !== undefined;
    const isFlagged = test.flagged.has(test.currentQuestion);

    return (
      <div className="min-h-screen bg-background">
        {/* Header with timer */}
        <header className="border-b border-border/40 sticky top-0 z-40 bg-background/95 backdrop-blur">
          <div className="container px-4 h-14 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Q {test.currentQuestion + 1}/{test.questions.length}
              </span>
            </div>

            <div className="flex-1" />

            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                test.timeRemaining < 300
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono font-semibold">
                {formatTime(test.timeRemaining)}
              </span>
            </div>

            <div>
              <ProfileButton />
            </div>
          </div>
        </header>

        <main className="container px-4 py-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Panel */}
            <div className="lg:col-span-3">
              <motion.div
                key={q.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border/50 rounded-xl p-8"
              >
                {/* Question Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-xl font-semibold text-foreground leading-relaxed">
                      {q.question}
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => test.toggleFlag()}
                      className={`flex-shrink-0 ${isFlagged ? "text-amber-500" : ""}`}
                    >
                      <Flag className={`w-5 h-5 ${isFlagged ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-1 bg-primary/15 text-primary rounded-full">
                      {q.subject}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        q.difficulty === "Easy"
                          ? "bg-green-500/15 text-green-600 dark:text-green-400"
                          : q.difficulty === "Medium"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "bg-red-500/15 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {q.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => test.answerQuestion(idx)}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                        currentAnswer === idx
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/50 bg-background hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded border flex items-center justify-center font-medium text-sm ${
                            currentAnswer === idx
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted border-border"
                          }`}
                        >
                          {OPTION_LABELS[idx]}
                        </span>
                        <span className="flex-1">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => test.clearAnswer()}
                    disabled={!isAnswered}
                  >
                    Clear
                  </Button>
                  <div className="flex-1" />
                  <Button
                    variant="outline"
                    onClick={() => test.previousQuestion()}
                    disabled={test.currentQuestion === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => test.nextQuestion()}
                    disabled={test.currentQuestion === test.questions.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Sidebar: Question Navigator */}
            <div>
              <div className="bg-card border border-border/50 rounded-xl p-4 sticky top-20">
                <h3 className="font-semibold text-foreground mb-4">Progress</h3>

                <Progress value={test.progress} className="mb-4" />

                <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                  <div>
                    <div className="font-semibold text-foreground">
                      {test.stats.answered}
                    </div>
                    <div className="text-muted-foreground">Answered</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {test.stats.unanswered}
                    </div>
                    <div className="text-muted-foreground">Skipped</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {test.stats.flagged}
                    </div>
                    <div className="text-muted-foreground">Flagged</div>
                  </div>
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-4 gap-2 mb-4 max-h-96 overflow-y-auto">
                  {test.questions.map((_, idx) => {
                    const answer = test.answers[test.questions[idx].id];
                    const isFlagged = test.flagged.has(idx);
                    const isVisited = test.visited.has(idx);

                    return (
                      <button
                        key={idx}
                        onClick={() => test.goToQuestion(idx)}
                        className={`aspect-square text-xs font-semibold rounded flex items-center justify-center transition-all ${
                          idx === test.currentQuestion
                            ? "ring-2 ring-primary"
                            : ""
                        } ${
                          answer !== null && answer !== undefined
                            ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30"
                            : isVisited
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                              : "bg-muted border border-border/50"
                        } ${isFlagged ? "ring-1 ring-amber-500" : ""}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => test.finalize()}
                  className="w-full gradient-primary"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Results screen
  if (test.submitted) {
    const correct = Object.entries(test.answers).filter(
      ([id, ans]) =>
        ans !== null &&
        ans !== undefined &&
        test.questions.find((q) => q.id === parseInt(id))
    ).length;

    const percentage = test.questions.length > 0 ? Math.round((correct / test.questions.length) * 100) : 0;

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
          <div className="container px-4 h-14 flex items-center gap-3">
            <Link
              to="/question-hub"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Question Hub
            </Link>
            <div className="ml-auto">
              <ProfileButton />
            </div>
          </div>
        </header>

        <main className="container px-4 py-12 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-card border border-border/50 rounded-xl p-12 text-center">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  percentage >= 70
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : percentage >= 50
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-red-500/20 text-red-600 dark:text-red-400"
                }`}
              >
                {percentage >= 70 ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-2">
                {percentage}%
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                You scored {correct} out of {test.questions.length} questions
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Correct
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {test.stats.answered}
                  </div>
                </div>
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Skipped
                  </div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {test.stats.unanswered}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/question-hub" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Back to Hub
                  </Button>
                </Link>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Retake Test
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return null;
}
