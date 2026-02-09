import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Download,
  Share2,
  Lightbulb,
  AlertCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import type { FinishInterviewResponse } from "@shared/api";

interface EvaluationLocationState {
  sessionId: string;
  evaluation: FinishInterviewResponse;
  completedAt: string;
}

export default function EvaluationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<FinishInterviewResponse | null>(
    null
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
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              AI
            </div>
            <span className="font-bold text-foreground hidden sm:inline">
              InterviewAI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold">
              Interview Evaluation
            </h1>
            <p className="text-lg text-muted-foreground">
              Your comprehensive interview analysis and feedback
            </p>
          </div>

          {/* Overall Score Card */}
          <Card className="overflow-hidden border-border/40">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 sm:p-12">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Score Circle */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-32 h-32">
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
                      <span className="text-4xl font-bold text-primary">
                        {scores.overall.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-center text-sm font-semibold text-foreground">
                      {getScoreLabel(scores.overall)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Performance
                    </p>
                  </div>
                </div>

                {/* Score Details */}
                <div className="md:col-span-2 space-y-6">
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

            {/* Weak Areas */}
            {evaluation.weakAreas && evaluation.weakAreas.length > 0 && (
              <Card className="p-6 sm:p-8 border-border/40 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold">Areas for Improvement</h2>
                </div>
                <div className="space-y-3">
                  {evaluation.weakAreas.map((area, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <p className="text-foreground/80">{area}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Improvement Suggestions */}
          {evaluation.improvementSuggestions &&
            evaluation.improvementSuggestions.length > 0 && (
              <Card className="p-6 sm:p-8 border-border/40 space-y-6">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold">
                    Personalized Suggestions
                  </h2>
                </div>

                <div className="grid md:grid-cols-1 gap-4">
                  {evaluation.improvementSuggestions.map((suggestion, idx) => (
                    <Card
                      key={idx}
                      className="p-5 border-border/40 bg-muted/30 space-y-2"
                    >
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-foreground/80">{suggestion}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

          {/* Score Summary */}
          <Card className="p-6 sm:p-8 border-border/40 bg-gradient-to-r from-primary/5 to-secondary/5 space-y-4">
            <h2 className="text-xl font-bold">Score Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">Overall</p>
                <p className={`text-2xl font-bold ${getScoreColor(scores.overall)}`}>
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
