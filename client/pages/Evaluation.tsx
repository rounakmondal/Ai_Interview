import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import type { FinishInterviewResponse, PracticeQuestion, WeakArea, ImprovementPlan } from "@shared/api";

interface EvaluationLocationState {
  sessionId: string;
  evaluation: FinishInterviewResponse;
  completedAt: string;
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
  const location = useLocation();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<FinishInterviewResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = location.state as EvaluationLocationState | null;

    if (!state?.evaluation) {
      navigate("/", { replace: true });
      return;
    }

    setEvaluation(state.evaluation);
    setIsLoading(false);
  }, [location, navigate]);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-base">
              AI
            </div>
            <span className="font-bold text-base sm:text-lg text-foreground hidden sm:inline">
              InterviewAI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
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
