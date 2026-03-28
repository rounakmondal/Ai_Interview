import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Download,
  Share2,
  Lightbulb,
  AlertCircle,
  TrendingUp,
  Loader2,
  BookOpen,
  ChevronDown,
  Target,
  Rocket,
  GraduationCap,
  MessageSquareText,
  Copy,
  Check,
} from "lucide-react";
import type {
  FinishInterviewResponse,
  PracticeQuestion,
  WeakArea,
  ImprovementPlan,
  InterviewQuestionReview,
  InterviewTranscriptTurn,
} from "@shared/api";

interface EvaluationLocationState {
  sessionId: string;
  evaluation: FinishInterviewResponse;
  completedAt: string;
  transcriptTurns?: InterviewTranscriptTurn[];
}

// Practice Questions Component with filtering and expandable answers
function PracticeQuestionsSection({
  questions,
  interviewType,
}: {
  questions: PracticeQuestion[];
  interviewType?: string;
}) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);

  // Get unique categories
  const categories = ["all", ...new Set(questions.map((q) => q.category))];

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchCategory = filterCategory === "all" || q.category === filterCategory;
    const matchDifficulty = filterDifficulty === "all" || q.difficulty === filterDifficulty;
    return matchCategory && matchDifficulty;
  });

  const displayedQuestions = showAll ? filteredQuestions : filteredQuestions.slice(0, 10);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "behavioral":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "technical":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "situational":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "leadership":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="p-6 sm:p-8 border-border/40 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Practice Questions</h2>
            <p className="text-sm text-muted-foreground">
              {questions.length} questions tailored for {interviewType || "your role"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-md border border-border bg-background"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-md border border-border bg-background"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions Accordion */}
      <Accordion type="single" collapsible className="space-y-3">
        {displayedQuestions.map((q, idx) => (
          <AccordionItem
            key={idx}
            value={`question-${idx}`}
            className="border border-border/50 rounded-lg px-4 data-[state=open]:bg-muted/30"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left w-full pr-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {idx + 1}
                </span>
                <span className="flex-1 font-medium text-sm sm:text-base">
                  {q.question}
                </span>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  {q.topic && (
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {q.topic}
                    </Badge>
                  )}
                  <Badge variant="secondary" className={`text-xs ${getCategoryColor(q.category)}`}>
                    {q.category}
                  </Badge>
                  <Badge variant="secondary" className={`text-xs capitalize ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="pl-9 pr-4">
                {q.suggestedAnswer ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <Lightbulb className="w-4 h-4" />
                      Suggested Answer
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {q.suggestedAnswer}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      Tip: Personalize this answer with your own experiences and specific examples.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <Lightbulb className="w-4 h-4" />
                      How to Prepare
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        Research this topic thoroughly and prepare a structured answer. Focus on <strong>{q.topic || q.category}</strong> concepts and be ready to explain with real-world examples from your experience.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Show More/Less */}
      {filteredQuestions.length > 10 && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll ? (
              <>Show Less</>
            ) : (
              <>
                Show All {filteredQuestions.length} Questions
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {questions.filter((q) => q.difficulty === "easy").length}
          </p>
          <p className="text-xs text-muted-foreground">Easy</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {questions.filter((q) => q.difficulty === "medium").length}
          </p>
          <p className="text-xs text-muted-foreground">Medium</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {questions.filter((q) => q.difficulty === "hard").length}
          </p>
          <p className="text-xs text-muted-foreground">Hard</p>
        </div>
      </div>
    </Card>
  );
}

export default function EvaluationPage() {

  // All hooks must be called unconditionally
  const location = useLocation();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<FinishInterviewResponse | null>(null);
  const [transcriptFallback, setTranscriptFallback] = useState<InterviewTranscriptTurn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // LinkedIn login state and handlers (single declaration)
  const [isLinkedInLoggedIn, setIsLinkedInLoggedIn] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const state = location.state as EvaluationLocationState | null;
    if (!state?.evaluation) {
      navigate("/", { replace: true });
      return;
    }
    setEvaluation(state.evaluation);
    setTranscriptFallback(state.transcriptTurns ?? []);
    setIsLoading(false);
  }, [location, navigate]);
  const handleLinkedInLogin = () => {
    setIsLinkedInLoggedIn(true);
  };
  const handleLinkedInShare = () => {
    alert("LinkedIn sharing coming soon!\n\nThis will post your interview evaluation, scores, strengths, improvement plan, and recommended YouTube videos.");
  };

  if (isLoading || !evaluation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
          <p className="text-muted-foreground">Loading evaluation...</p>
        </div>
      </div>
    );
  }

  const scores = {
    overall: evaluation.overallScore,
    communication: evaluation.communicationScore,
    technical: evaluation.technicalScore,
    confidence: evaluation.confidenceScore,
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 9) return "Excellent";
    if (score >= 8) return "Very Good";
    if (score >= 7) return "Good";
    if (score >= 6) return "Satisfactory";
    if (score >= 5) return "Needs Improvement";
    return "Poor";
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const M = 15;
    const CW = pageW - M * 2;
    let y = 20;

    const checkPage = (needed = 10) => {
      if (y + needed > pageH - 15) {
        doc.addPage();
        y = 20;
      }
    };

    const addLine = (
      text: string,
      fontSize: number,
      bold = false,
      r = 30, g = 30, b = 30,
      xOffset = 0
    ) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(r, g, b);
      const lines = doc.splitTextToSize(text, CW - xOffset);
      checkPage(lines.length * fontSize * 0.45 + 4);
      doc.text(lines, M + xOffset, y);
      y += lines.length * fontSize * 0.45 + 3;
    };

    const hr = () => {
      doc.setDrawColor(210, 210, 210);
      doc.line(M, y, pageW - M, y);
      y += 5;
    };

    // Header band
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageW, 38, "F");
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("InterviewSathi", M, 16);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("AI Mock Interview Report", M, 27);
    const dateStr = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
    doc.setFontSize(9);
    doc.text(dateStr, pageW - M, 16, { align: "right" });
    if (evaluation.interviewType) {
      doc.text(evaluation.interviewType, pageW - M, 25, { align: "right" });
    }
    y = 52;

    // Scores
    addLine("Performance Scores", 15, true, 79, 70, 229);
    hr();
    const scoreItems = [
      { label: "Overall Score", value: scores.overall },
      { label: "Communication", value: scores.communication },
      { label: "Technical / Subject Knowledge", value: scores.technical },
      { label: "Confidence", value: scores.confidence },
    ];
    scoreItems.forEach(item => {
      checkPage(18);
      const vr = item.value >= 8 ? 22 : item.value >= 6 ? 202 : 220;
      const vg = item.value >= 8 ? 163 : item.value >= 6 ? 138 : 38;
      const vb = item.value >= 8 ? 74 : item.value >= 6 ? 4 : 38;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(`${item.label}:`, M, y);
      doc.setTextColor(vr, vg, vb);
      doc.text(`${item.value.toFixed(1)} / 10  (${getScoreLabel(item.value)})`, pageW - M, y, { align: "right" });
      y += 7;
      doc.setFillColor(230, 230, 230);
      doc.rect(M, y, CW, 2.5, "F");
      doc.setFillColor(vr, vg, vb);
      doc.rect(M, y, (item.value / 10) * CW, 2.5, "F");
      y += 9;
    });
    y += 4;

    // Strengths
    if (evaluation.strengths && evaluation.strengths.length > 0) {
      addLine("Strengths", 14, true, 22, 163, 74);
      hr();
      evaluation.strengths.forEach(s => addLine(`• ${s}`, 10, false, 40, 40, 40));
      y += 4;
    }

    // Weak Areas
    if (evaluation.weakAreas && evaluation.weakAreas.length > 0) {
      addLine("Areas for Improvement", 14, true, 202, 138, 4);
      hr();
      evaluation.weakAreas.forEach(w => {
        addLine(w.area, 11, true, 30, 30, 30);
        addLine(`Issue: ${w.issue}`, 10, false, 80, 80, 80);
        if (w.howToImprove) addLine(`Tip: ${w.howToImprove}`, 10, false, 79, 70, 229);
        y += 3;
      });
      y += 4;
    }

    // Detailed Feedback
    if (evaluation.detailedFeedback) {
      addLine("Detailed Feedback", 14, true, 79, 70, 229);
      hr();
      addLine(evaluation.detailedFeedback, 10, false, 40, 40, 40);
      y += 4;
    }

    // Improvement Plan
    if (evaluation.improvementPlan) {
      addLine("Your Improvement Plan", 14, true, 79, 70, 229);
      hr();
      if (evaluation.improvementPlan.immediateActions.length > 0) {
        addLine("Do Now:", 11, true, 220, 38, 38);
        evaluation.improvementPlan.immediateActions.forEach((a, i) => addLine(`${i + 1}. ${a}`, 10, false, 40, 40, 40, 4));
        y += 3;
      }
      if (evaluation.improvementPlan.resourcesToStudy.length > 0) {
        addLine("Study Resources:", 11, true, 37, 99, 235);
        evaluation.improvementPlan.resourcesToStudy.forEach((r, i) => addLine(`${i + 1}. ${r}`, 10, false, 40, 40, 40, 4));
        y += 3;
      }
      if (evaluation.improvementPlan.practiceStrategy) {
        addLine("Practice Strategy:", 11, true, 22, 163, 74);
        addLine(evaluation.improvementPlan.practiceStrategy, 10, false, 40, 40, 40);
      }
      y += 5;
    }

    // Practice Questions (first 15)
    if (evaluation.practiceQuestions && evaluation.practiceQuestions.length > 0) {
      addLine("Practice Questions", 14, true, 79, 70, 229);
      hr();
      evaluation.practiceQuestions.slice(0, 15).forEach((q, i) => {
        addLine(`Q${i + 1}. ${q.question}`, 10, true, 30, 30, 30);
        if (q.suggestedAnswer) addLine(`    A: ${q.suggestedAnswer}`, 9, false, 80, 80, 80, 4);
        y += 2;
      });
    }

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated by InterviewSathi.online  |  Page ${i} of ${pageCount}`,
        pageW / 2,
        pageH - 8,
        { align: "center" }
      );
    }

    doc.save(`interview-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // ...existing code...

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="InterviewSathi" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
            <span className="font-bold text-base sm:text-lg text-foreground hidden sm:inline">
              InterviewSathi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={downloadPDF}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 animate-fade-in">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Interview Evaluation
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Your comprehensive interview analysis and feedback
            </p>
          </div>

          {/* Overall Score Card */}
          <Card className="overflow-hidden border-border/40">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
                {/* Score Circle */}
                <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 120 120"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="2"
                        strokeDasharray={`${(scores.overall / 10) * 339.3} 339.3`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient
                          id="scoreGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="rgb(79, 70, 229)" />
                          <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-primary">
                        {scores.overall.toFixed(1)}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">/10</span>
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-center text-xs sm:text-sm font-semibold text-foreground">
                      {getScoreLabel(scores.overall)}
                    </p>
                    <p className="text-xs text-muted-foreground">Performance</p>
                  </div>
                </div>

                {/* Score Details */}
                <div className="md:col-span-2 space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">
                        Communication
                      </span>
                      <span
                        className={`text-sm font-bold ${getScoreColor(scores.communication)}`}
                      >
                        {scores.communication.toFixed(1)}/10
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${scores.communication * 10}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">
                        Technical / Subject Knowledge
                      </span>
                      <span
                        className={`text-sm font-bold ${getScoreColor(scores.technical)}`}
                      >
                        {scores.technical.toFixed(1)}/10
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-1000"
                        style={{ width: `${scores.technical * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">
                        Confidence
                      </span>
                      <span
                        className={`text-sm font-bold ${getScoreColor(scores.confidence)}`}
                      >
                        {scores.confidence.toFixed(1)}/10
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-1000"
                        style={{ width: `${scores.confidence * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Interview Q&A + stronger answers */}
          {questionRecap.length > 0 && (
            <Card className="p-6 sm:p-8 border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquareText className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold">Interview recap</h2>
                  <p className="text-sm text-muted-foreground">
                    Each question you were asked, your answer, and a stronger example response (from AI when your backend returns{" "}
                    <code className="text-xs bg-muted px-1 rounded">question_reviews</code>).
                  </p>
                </div>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {questionRecap.map((row, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`recap-${idx}`}
                    className="border border-border/50 rounded-lg px-4 data-[state=open]:bg-muted/30"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 text-left">
                      <div className="flex items-start gap-3 w-full pr-2">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {idx + 1}
                        </span>
                        <span className="flex-1 text-sm sm:text-base font-medium line-clamp-2">
                          {row.questionText}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                          Your answer
                        </p>
                        <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                          <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                            {row.userAnswer || "—"}
                          </p>
                        </div>
                      </div>
                      {row.shortFeedback && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5" /> Quick feedback
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{row.shortFeedback}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" /> Stronger answer (model example)
                        </p>
                        <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
                          {row.idealAnswer ? (
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{row.idealAnswer}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              Your backend can attach ideal answers per question using the prompts in{" "}
                              <code className="text-xs bg-background px-1 rounded">shared/interview-prompts.ts</code>.
                            </p>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          )}

          {/* Two Column Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <Card className="p-6 sm:p-8 border-border/40 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <h2 className="text-2xl font-bold">Your Strengths</h2>
                </div>
                <div className="space-y-3">
                  {evaluation.strengths.map((strength, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <p className="text-foreground/80">{strength}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Weak Areas — now rich objects */}
            {evaluation.weakAreas && evaluation.weakAreas.length > 0 && (
              <Card className="p-6 sm:p-8 border-border/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold">Areas for Improvement</h2>
                </div>
                <div className="space-y-4">
                  {evaluation.weakAreas.map((weakArea, idx) => (
                    <div key={idx} className="rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">{weakArea.area}</p>
                          <p className="text-sm text-muted-foreground">{weakArea.issue}</p>
                        </div>
                      </div>
                      {weakArea.howToImprove && (
                        <div className="flex items-start gap-2 ml-6 pt-1">
                          <Lightbulb className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-primary/90">{weakArea.howToImprove}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Detailed Feedback */}
          {evaluation.detailedFeedback && (
            <Card className="p-6 sm:p-8 border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquareText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Detailed Feedback</h2>
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">
                  {evaluation.detailedFeedback}
                </p>
              </div>
            </Card>
          )}

          {/* Improvement Plan */}
          {evaluation.improvementPlan && (
            <Card className="p-6 sm:p-8 border-border/40 space-y-6">
              <div className="flex items-center gap-2">
                <Rocket className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Your Improvement Plan</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {/* Immediate Actions */}
                {evaluation.improvementPlan.immediateActions.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="font-semibold">Do Now</h3>
                    </div>
                    <div className="space-y-2">
                      {evaluation.improvementPlan.immediateActions.map((action, idx) => (
                        <div key={idx} className="flex gap-2 text-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xs font-bold text-red-600 dark:text-red-400 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-foreground/80">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources to Study */}
                {evaluation.improvementPlan.resourcesToStudy.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold">Study Resources</h3>
                    </div>
                    <div className="space-y-2">
                      {evaluation.improvementPlan.resourcesToStudy.map((resource, idx) => (
                        <div key={idx} className="flex gap-2 text-sm">
                          <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-foreground/80">{resource}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practice Strategy */}
                {evaluation.improvementPlan.practiceStrategy && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold">Practice Strategy</h3>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {evaluation.improvementPlan.practiceStrategy}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}


          {/* YouTube Video Suggestions */}
          {evaluation.youtubeVideos && evaluation.youtubeVideos.length > 0 && (
            <Card className="p-6 sm:p-8 border-border/40 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="https://www.gstatic.com/youtube/img/favicon_144.png"
                  alt="YouTube logo"
                  className="w-12 h-12 rounded bg-white border border-border object-contain shadow"
                  style={{ minWidth: 48, minHeight: 48 }}
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg'; }}
                />
                <h2 className="text-2xl font-bold">Recommended YouTube Videos</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {evaluation.youtubeVideos.map((video, idx) => {
                  // Extract videoId from url (supports youtu.be and youtube.com)
                  let videoId = "";
                  try {
                    const urlObj = new URL(video.url);
                    if (urlObj.hostname.includes("youtu.be")) {
                      videoId = urlObj.pathname.replace("/", "");
                    } else if (urlObj.hostname.includes("youtube.com")) {
                      videoId = urlObj.searchParams.get("v") || "";
                    }
                  } catch {}
                  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
                  return (
                    <a
                      key={video.url}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl border border-border bg-muted/30 hover:bg-primary/10 transition overflow-hidden shadow-sm"
                    >
                      <div className="relative aspect-video w-full bg-black/10">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No thumbnail</div>
                        )}
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">YouTube</span>
                      </div>
                      <div className="p-3 space-y-1">
                        <div className="font-semibold text-base line-clamp-2 text-foreground group-hover:text-primary transition-colors">{video.title}</div>
                        {video.reason && (
                          <div className="text-xs text-muted-foreground italic">{video.reason}</div>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Practice Questions Section */}
          {evaluation.practiceQuestions && evaluation.practiceQuestions.length > 0 && (
            <PracticeQuestionsSection
              questions={evaluation.practiceQuestions}
              interviewType={evaluation.interviewType}
            />
          )}

          {/* Score Summary */}
          <Card className="p-6 sm:p-8 border-border/40 bg-gradient-to-r from-primary/5 to-secondary/5 space-y-4">
            <h2 className="text-xl font-bold">Score Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">Overall</p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(scores.overall)}`}
                >
                  {scores.overall.toFixed(1)}
                </p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">Communication</p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(scores.communication)}`}
                >
                  {scores.communication.toFixed(1)}
                </p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">Technical</p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(scores.technical)}`}
                >
                  {scores.technical.toFixed(1)}
                </p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(scores.confidence)}`}
                >
                  {scores.confidence.toFixed(1)}
                </p>
              </div>
            </div>
          </Card>

          {/* Share Your Results */}
          <Card className="p-6 sm:p-8 border-border/40 space-y-5">
            <div className="flex items-center gap-3">
              <Share2 className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Share Your Results</h2>
                <p className="text-sm text-muted-foreground">Let the world know how you performed!</p>
              </div>
            </div>

            {/* Score preview card */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-xl p-5 space-y-3">
              <p className="font-semibold text-sm text-foreground">🎯 AI Mock Interview Results — InterviewSathi</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Overall", value: scores.overall, color: "text-primary" },
                  { label: "Communication", value: scores.communication, color: "text-blue-600 dark:text-blue-400" },
                  { label: "Technical", value: scores.technical, color: "text-purple-600 dark:text-purple-400" },
                  { label: "Confidence", value: scores.confidence, color: "text-green-600 dark:text-green-400" },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 bg-background/70 rounded-lg border border-border/40">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* LinkedIn */}
              <button
                onClick={() => {
                  const text = `🎯 Just completed my AI Mock Interview on InterviewSathi!\n\n📊 Overall: ${scores.overall.toFixed(1)}/10\n✅ Communication: ${scores.communication.toFixed(1)}/10\n💻 Technical: ${scores.technical.toFixed(1)}/10\n💪 Confidence: ${scores.confidence.toFixed(1)}/10\n\nPractice your interview skills → https://interviewsathi.online\n#InterviewPrep #CareerGrowth #InterviewSathi`;
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://interviewsathi.online")}&summary=${encodeURIComponent(text)}`, "_blank");
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 bg-[#0A66C2]/5 hover:bg-[#0A66C2]/15 transition"
              >
                <svg className="w-7 h-7 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-xs font-semibold text-[#0A66C2]">LinkedIn</span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={() => {
                  const text = `🎯 Just completed my AI Mock Interview on InterviewSathi!\n\n📊 Overall: ${scores.overall.toFixed(1)}/10 | 💻 Technical: ${scores.technical.toFixed(1)}/10 | 💪 Confidence: ${scores.confidence.toFixed(1)}/10\n\nhttps://interviewsathi.online\n#InterviewPrep #CareerGrowth`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition"
              >
                <svg className="w-7 h-7 dark:fill-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-xs font-semibold">X (Twitter)</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => {
                  const text = `🎯 AI Mock Interview Results — InterviewSathi\n\nOverall: ${scores.overall.toFixed(1)}/10\nCommunication: ${scores.communication.toFixed(1)}/10\nTechnical: ${scores.technical.toFixed(1)}/10\nConfidence: ${scores.confidence.toFixed(1)}/10\n\nTry it free: https://interviewsathi.online`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 bg-[#25D366]/5 hover:bg-[#25D366]/15 transition"
              >
                <svg className="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                <span className="text-xs font-semibold text-[#25D366]">WhatsApp</span>
              </button>

              {/* Copy */}
              <button
                onClick={() => {
                  const text = `🎯 AI Mock Interview Results — InterviewSathi\n\nOverall: ${scores.overall.toFixed(1)}/10\nCommunication: ${scores.communication.toFixed(1)}/10\nTechnical: ${scores.technical.toFixed(1)}/10\nConfidence: ${scores.confidence.toFixed(1)}/10\n\nhttps://interviewsathi.online`;
                  navigator.clipboard.writeText(text).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  });
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 bg-muted/50 hover:bg-muted transition"
              >
                {copied ? (
                  <Check className="w-7 h-7 text-green-600" />
                ) : (
                  <Copy className="w-7 h-7 text-muted-foreground" />
                )}
                <span className={`text-xs font-semibold ${copied ? "text-green-600" : "text-muted-foreground"}`}>
                  {copied ? "Copied!" : "Copy Text"}
                </span>
              </button>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" size="lg" className="w-full text-base">
                Back to Home
              </Button>
            </Link>
            <Link to="/setup" className="flex-1">
              <Button size="lg" className="w-full gradient-primary text-base">
                Try Another Interview
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
