import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Trophy,
  Clock,
  RotateCcw,
  Home,
  BookOpen,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  GovtQuestion,
  TestConfig,
  TestAnswer,
  computeScore,
  EXAM_LABELS,
} from "@/lib/govt-practice-data";

interface LocationState {
  config: TestConfig;
  questions: GovtQuestion[];
  answers: TestAnswer[];
  timeTakenSeconds: number;
  completedAt: string;
  language: "english" | "bengali";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

const PASS_THRESHOLD = 60;

export default function GovtResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state?.questions?.length) {
      navigate("/govt-practice", { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  const { config, questions, answers, timeTakenSeconds, language } = state;
  const score = computeScore(questions, answers);
  const passed = score.accuracy >= PASS_THRESHOLD;

  const { correct, wrong, unanswered, total, accuracy } = score;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/govt-practice" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            ← Back
          </Link>
          <span className="text-sm font-medium">Test Results</span>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline">{config.exam}</Badge>
            <Badge variant="outline">{config.subject}</Badge>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto space-y-8">
        {/* Result Hero */}
        <Card className={`p-8 border-2 text-center space-y-4 ${passed ? "border-green-500/30 bg-green-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
          <div className="flex justify-center">
            {passed ? (
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Target className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              </div>
            )}
          </div>
          <div>
            <p className={`text-4xl font-bold ${passed ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
              {accuracy}%
            </p>
            <p className="text-muted-foreground text-sm mt-1">Accuracy Score</p>
            <p className={`text-lg font-semibold mt-2 ${passed ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
              {passed ? "🎉 Passed!" : "Keep Practicing!"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {EXAM_LABELS[config.exam]} — {config.subject} — {config.difficulty}
            </p>
          </div>
        </Card>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Score", value: `${correct}/${total}`, icon: Trophy, color: "text-primary" },
            { label: "Correct", value: correct, icon: CheckCircle2, color: "text-green-600 dark:text-green-400" },
            { label: "Wrong", value: wrong, icon: XCircle, color: "text-red-600 dark:text-red-400" },
            { label: "Unanswered", value: unanswered, icon: MinusCircle, color: "text-muted-foreground" },
          ].map((item) => (
            <Card key={item.label} className="p-4 text-center border-border/40 space-y-2">
              <item.icon className={`w-5 h-5 mx-auto ${item.color}`} />
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </Card>
          ))}
        </div>

        {/* Time and additional stats */}
        <Card className="p-5 border-border/40">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time taken:</span>
              <span className="font-semibold">{formatTime(timeTakenSeconds)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Avg per question:</span>
              <span className="font-semibold">{Math.round(timeTakenSeconds / total)}s</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Difficulty:</span>
              <Badge variant="secondary">{config.difficulty}</Badge>
            </div>
          </div>
        </Card>

        {/* Question Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Detailed Question Review
          </h2>

          {questions.map((q, idx) => {
            const ans = answers.find((a) => a.questionId === q.id);
            const userIdx = ans?.selectedIndex ?? null;
            const isCorrect = userIdx === q.correctIndex;
            const isUnanswered = userIdx === null;

            return (
              <Card
                key={q.id}
                className={`p-5 sm:p-6 border ${
                  isUnanswered
                    ? "border-border/40"
                    : isCorrect
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                {/* Question */}
                <div className="flex items-start gap-3 mb-4">
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isUnanswered
                      ? "bg-muted text-muted-foreground"
                      : isCorrect
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <p className="text-sm sm:text-base font-medium leading-relaxed">{q.question}</p>
                </div>

                {/* Options */}
                <div className="grid sm:grid-cols-2 gap-2 mb-4 ml-10">
                  {q.options.map((opt, oi) => {
                    const isUserChoice = userIdx === oi;
                    const isAnswer = q.correctIndex === oi;
                    return (
                      <div
                        key={oi}
                        className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 border ${
                          isAnswer
                            ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 font-medium"
                            : isUserChoice && !isCorrect
                            ? "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                            : "bg-muted/30 border-border/40 text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs flex-shrink-0">{String.fromCharCode(65 + oi)}.</span>
                        <span>{opt}</span>
                        {isAnswer && <CheckCircle2 className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-green-600 dark:text-green-400" />}
                        {isUserChoice && !isAnswer && <XCircle className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-red-600 dark:text-red-400" />}
                      </div>
                    );
                  })}
                </div>

                {/* Status + Explanation */}
                <div className="ml-10 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    {isUnanswered ? (
                      <><MinusCircle className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-muted-foreground">Unanswered</span></>
                    ) : isCorrect ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /><span className="text-green-600 dark:text-green-400 font-semibold">Correct!</span></>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /><span className="text-red-600 dark:text-red-400 font-semibold">Wrong — Correct answer: {String.fromCharCode(65 + q.correctIndex)}</span></>
                    )}
                  </div>

                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                    <p className="text-xs font-semibold text-primary mb-1">
                      💡 Explanation {language === "bengali" && q.explanationBn ? "(বাংলায়)" : ""}
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {language === "bengali" && q.explanationBn
                        ? q.explanationBn
                        : q.explanation}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link to="/govt-practice" className="flex-1">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <RotateCcw className="w-4 h-4" />
              New Test
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button size="lg" className="w-full gradient-primary gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
