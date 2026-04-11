import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccessGate } from "@/hooks/use-access-gate";
import PaywallModal from "@/components/PaywallModal";
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
  Download,
  Loader2,
} from "lucide-react";
import {
  GovtQuestion,
  TestConfig,
  TestAnswer,
  computeScore,
  EXAM_LABELS,
  submitScore,
} from "@/lib/govt-practice-data";
import { isLoggedIn, getSession } from "@/lib/auth-api";
import { completeTask } from "@/lib/daily-tasks";

interface LocationState {
  config: TestConfig;
  questions: GovtQuestion[];
  answers: TestAnswer[];
  timeTakenSeconds: number;
  completedAt: string;
  language: "english" | "bengali";
  dailyTaskId?: string;
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

  // Submit score to leaderboard (only if logged in)
  useEffect(() => {
    if (!state?.questions?.length) return;
    if (!isLoggedIn()) return;
    const { config, questions, answers, timeTakenSeconds } = state;
    const s = computeScore(questions, answers);
    submitScore({
      exam: config.exam,
      subject: config.subject,
      difficulty: config.difficulty,
      totalQuestions: s.total,
      correct: s.correct,
      wrong: s.wrong,
      unanswered: s.unanswered,
      accuracy: s.accuracy,
      timeTakenSeconds,
    });
  }, [state]);

  // Complete daily task if this was launched from daily tasks
  useEffect(() => {
    if (!state?.dailyTaskId || !state?.questions?.length) return;
    const s = computeScore(state.questions, state.answers);
    completeTask(state.dailyTaskId, s.accuracy);
  }, [state]);

  // Send test result email if logged in
  useEffect(() => {
    if (!state?.questions?.length) return;
    if (!isLoggedIn()) return;

    const sendResultEmail = async () => {
      try {
        const { config, questions, answers, timeTakenSeconds } = state;
        const s = computeScore(questions, answers);
        
        // Calculate weak areas  
        const subjectPerformance: Record<string, { correct: number; total: number }> = {};
        questions.forEach((q) => {
          const ans = answers.find((a) => a.questionId === q.id);
          const userIdx = ans?.selectedIndex ?? null;
          const isCorrect = userIdx === q.correctIndex;
          const subject = q.subject || "General";
          
          if (!subjectPerformance[subject]) {
            subjectPerformance[subject] = { correct: 0, total: 0 };
          }
          subjectPerformance[subject].total += 1;
          if (isCorrect) subjectPerformance[subject].correct += 1;
        });

        const weakAreas = Object.entries(subjectPerformance)
          .map(([subject, { correct, total }]) => ({
            name: subject,
            accuracy: Math.round((correct / total) * 100),
          }))
          .filter((a) => a.accuracy < 70)
          .sort((a, b) => a.accuracy - b.accuracy);

        // Get user email from session
        const session = getSession();
        if (!session?.user?.email) return;

        // Format time taken
        const mins = Math.floor(timeTakenSeconds / 60);
        const secs = timeTakenSeconds % 60;
        const timeTaken = `${mins}m ${secs}s`;

        // Send email
        await fetch("/api/test-result-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.name || "Student",
            exam: config.exam,
            subject: config.subject || "Mixed",
            accuracy: s.accuracy,
            correct: s.correct,
            total: s.total,
            weakAreas,
            timeTaken,
          }),
        });
      } catch (err) {
        console.error("Failed to send result email:", err);
      }
    };

    sendResultEmail();
  }, [state]);

  const isDailyTask = !!state?.dailyTaskId;

  const [pdfLoading, setPdfLoading] = useState(false);

  const {
    showPaywall, setShowPaywall, paywallContext, activeExamType,
    requestPdfAccess, refreshPremium,
  } = useAccessGate();

  if (!state) return null;

  const { config, questions, answers, timeTakenSeconds, language } = state;
  const score = computeScore(questions, answers);
  const passed = score.accuracy >= PASS_THRESHOLD;

  const { correct, wrong, unanswered, total, accuracy } = score;

  const handleDownloadPdf = async () => {
    if (!requestPdfAccess()) return; // blocked — shows paywall
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const marginL = 15;
      const marginR = 15;
      const contentW = pageW - marginL - marginR;
      let y = 15;

      const checkPage = (needed: number) => {
        if (y + needed > pageH - 15) {
          doc.addPage();
          y = 15;
        }
      };

      // ── Header ─────────────────────────────────────
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageW, 32, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("MedhaHub — Test Result", marginL, 14);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${config.exam} | ${config.fullPaper ? "Full Paper" : config.subject || "Mixed"} | ${config.difficulty}`,
        marginL, 22
      );
      doc.text(`Date: ${new Date(state.completedAt).toLocaleDateString("en-IN")}`, marginL, 28);
      y = 40;

      // ── Score Summary ──────────────────────────────
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Score Summary", marginL, y);
      y += 8;

      doc.setFillColor(passed ? 220 : 254, passed ? 252 : 243, passed ? 231 : 199);
      doc.roundedRect(marginL, y, contentW, 28, 3, 3, "F");

      doc.setFontSize(28);
      doc.setTextColor(passed ? 22 : 180, passed ? 163 : 83, passed ? 74 : 9);
      doc.text(`${accuracy}%`, marginL + 8, y + 18);

      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const stats = [
        `Correct: ${correct}/${total}`,
        `Wrong: ${wrong}`,
        `Unanswered: ${unanswered}`,
        `Time: ${formatTime(timeTakenSeconds)}`,
      ];
      stats.forEach((s, i) => {
        doc.text(s, marginL + 55 + i * 35, y + 12);
      });

      doc.setFontSize(11);
      doc.setTextColor(passed ? 22 : 180, passed ? 163 : 83, passed ? 74 : 9);
      doc.setFont("helvetica", "bold");
      doc.text(passed ? "PASSED" : "NEEDS IMPROVEMENT", marginL + 55, y + 22);
      doc.setFont("helvetica", "normal");

      y += 36;

      // ── Questions ──────────────────────────────────
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Question Review", marginL, y);
      y += 8;

      questions.forEach((q, idx) => {
        const ans = answers.find((a) => a.questionId === q.id);
        const userIdx = ans?.selectedIndex ?? null;
        const isCorrect = userIdx === q.correctIndex;
        const isUnanswered = userIdx === null;

        // Estimate height needed
        const qLines = doc.splitTextToSize(q.question, contentW - 12);
        const explText = language === "bengali" && q.explanationBn ? q.explanationBn : q.explanation;
        const explLines = doc.splitTextToSize(`Explanation: ${explText}`, contentW - 12);
        const needed = 14 + qLines.length * 5 + q.options.length * 6 + 6 + explLines.length * 4.5 + 8;
        checkPage(needed);

        // Question box
        if (isUnanswered) {
          doc.setFillColor(245, 245, 245);
        } else if (isCorrect) {
          doc.setFillColor(220, 252, 231);
        } else {
          doc.setFillColor(254, 226, 226);
        }

        const boxH = needed - 4;
        doc.roundedRect(marginL, y, contentW, boxH, 2, 2, "F");
        doc.setDrawColor(200, 200, 200);
        doc.roundedRect(marginL, y, contentW, boxH, 2, 2, "S");

        y += 6;
        // Q number + status
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        const status = isUnanswered ? "Unanswered" : isCorrect ? "Correct" : `Wrong (Ans: ${String.fromCharCode(65 + q.correctIndex)})`;
        doc.text(`Q${idx + 1}. [${status}]`, marginL + 4, y);
        y += 5;

        // Question text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(40, 40, 40);
        qLines.forEach((line: string) => {
          doc.text(line, marginL + 4, y);
          y += 4.5;
        });
        y += 2;

        // Options
        doc.setFontSize(9);
        q.options.forEach((opt, oi) => {
          const letter = String.fromCharCode(65 + oi);
          const isAnswer = oi === q.correctIndex;
          const isUser = oi === userIdx;

          if (isAnswer) {
            doc.setTextColor(22, 163, 74);
            doc.setFont("helvetica", "bold");
          } else if (isUser) {
            doc.setTextColor(220, 38, 38);
            doc.setFont("helvetica", "bold");
          } else {
            doc.setTextColor(80, 80, 80);
            doc.setFont("helvetica", "normal");
          }

          const marker = isAnswer ? " ✓" : isUser ? " ✗" : "";
          doc.text(`  ${letter}. ${opt}${marker}`, marginL + 4, y);
          y += 5;
        });

        // Explanation
        y += 1;
        doc.setFontSize(8.5);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "italic");
        explLines.forEach((line: string) => {
          doc.text(line, marginL + 4, y);
          y += 4;
        });
        doc.setFont("helvetica", "normal");

        y += 6;
      });

      // ── Footer ─────────────────────────────────────
      checkPage(12);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Generated by MedhaHub — medhahub.in", marginL, y + 4);

      const filename = `MedhaHub_${config.exam}_${config.subject || "FullPaper"}_${accuracy}pct.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* PDF Paywall */}
      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        examType={activeExamType}
        context={paywallContext}
        onSuccess={() => { refreshPremium(); setShowPaywall(false); }}
      />

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

        {/* Weak Areas Analysis */}
        {(() => {
          // Calculate weak areas by subject
          const subjectPerformance: Record<string, { correct: number; total: number }> = {};
          questions.forEach((q, idx) => {
            const ans = answers.find((a) => a.questionId === q.id);
            const userIdx = ans?.selectedIndex ?? null;
            const isCorrect = userIdx === q.correctIndex;
            const subject = q.subject || "General";
            
            if (!subjectPerformance[subject]) {
              subjectPerformance[subject] = { correct: 0, total: 0 };
            }
            subjectPerformance[subject].total += 1;
            if (isCorrect) subjectPerformance[subject].correct += 1;
          });

          const weakAreas = Object.entries(subjectPerformance)
            .map(([subject, { correct, total }]) => ({
              subject,
              correct,
              total,
              accuracy: Math.round((correct / total) * 100),
            }))
            .filter((a) => a.accuracy < 70) // Show subjects with < 70% accuracy
            .sort((a, b) => a.accuracy - b.accuracy);

          if (weakAreas.length > 0) {
            return (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-500" />
                  Areas to Improve
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {weakAreas.map((area) => (
                    <Card key={area.subject} className="p-4 border-amber-500/30 bg-amber-500/5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-foreground">{area.subject}</p>
                        <Badge variant="outline" className="text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-500/25">
                          {area.accuracy}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Correct: {area.correct}/{area.total}</span>
                          <span className="text-muted-foreground">Accuracy: {area.accuracy}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 transition-all"
                            style={{ width: `${area.accuracy}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          💡 Focus on this subject to improve your overall score
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}

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
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:flex-1 gap-2"
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
          >
            {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {pdfLoading ? "Generating…" : "Download PDF"}
          </Button>
          {isDailyTask ? (
            <Link to="/daily-tasks" className="flex-1">
              <Button size="lg" className="w-full gradient-primary gap-2">
                <ArrowRight className="w-4 h-4" />
                Back to Daily Tasks
              </Button>
            </Link>
          ) : (
            <Link to="/govt-practice" className="flex-1">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <RotateCcw className="w-4 h-4" />
                New Test
              </Button>
            </Link>
          )}
          <Link to="/leaderboard" className="flex-1">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Button>
          </Link>
          {!isDailyTask && (
            <Link to="/" className="flex-1">
              <Button size="lg" className="w-full gradient-primary gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
