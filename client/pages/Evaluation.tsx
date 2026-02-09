import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Download,
  Share2,
  Lightbulb,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function EvaluationPage() {
  const overallScore = 8.2;
  const scores = {
    communication: 8.5,
    technical: 7.8,
    confidence: 9.2,
  };

  const strengths = [
    "Excellent articulation and clarity in explanations",
    "Strong confidence and composed demeanor",
    "Good problem-solving approach",
    "Relevant examples and experiences shared",
  ];

  const weakAreas = [
    "Could provide more depth in technical explanations",
    "Some hesitation when answering follow-up questions",
    "Could structure answers more systematically",
  ];

  const suggestions = [
    {
      title: "Practice Technical Depth",
      description:
        "Focus on explaining technical concepts in more detail. Practice explaining system architecture and design decisions.",
    },
    {
      title: "Improve Structural Answers",
      description:
        "Use frameworks like STAR method for better answer structuring. This helps in presenting information logically.",
    },
    {
      title: "Enhance Follow-up Readiness",
      description:
        "Anticipate potential follow-up questions and prepare detailed responses. Practice handling difficult questions.",
    },
  ];

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
        <div className="max-w-5xl mx-auto space-y-12">
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
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
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
                        strokeDasharray={`${(overallScore / 10) * 339.3} 339.3`}
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
                        {overallScore}
                      </span>
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                  </div>
                  <p className="text-center text-sm font-semibold text-foreground">
                    Excellent Performance
                  </p>
                </div>

                {/* Score Details */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">
                        Communication
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {scores.communication}/10
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
                      <span className="text-sm font-bold text-secondary">
                        {scores.technical}/10
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
                      <span className="text-sm font-bold text-accent">
                        {scores.confidence}/10
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
            <Card className="p-6 sm:p-8 border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold">Your Strengths</h2>
              </div>
              <div className="space-y-3">
                {strengths.map((strength, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <p className="text-foreground/80">{strength}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weak Areas */}
            <Card className="p-6 sm:p-8 border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-bold">Areas for Improvement</h2>
              </div>
              <div className="space-y-3">
                {weakAreas.map((area, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <p className="text-foreground/80">{area}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Improvement Suggestions */}
          <Card className="p-6 sm:p-8 border-border/40 space-y-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold">Personalized Suggestions</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {suggestions.map((suggestion, idx) => (
                <Card
                  key={idx}
                  className="p-5 border-border/40 bg-muted/30 space-y-3"
                >
                  <h3 className="font-bold text-foreground">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-foreground/80">
                    {suggestion.description}
                  </p>
                </Card>
              ))}
            </div>
          </Card>

          {/* Detailed Feedback */}
          <Card className="p-6 sm:p-8 border-border/40 space-y-6">
            <h2 className="text-2xl font-bold">Detailed Feedback</h2>

            <div className="space-y-6">
              {[
                {
                  question: "Tell me about a challenging project you've worked on",
                  yourAnswer:
                    "I worked on a large-scale e-commerce platform migration where we needed to ensure zero downtime...",
                  feedback:
                    "Good introduction and context setting. Consider providing more metrics and specific technical details about the challenges faced.",
                  score: 8,
                },
                {
                  question: "What was the biggest challenge you faced?",
                  yourAnswer:
                    "The main challenge was handling database migration with 50 million records...",
                  feedback:
                    "Excellent breakdown of the problem. You could expand on your role and specific technical contributions.",
                  score: 8.5,
                },
                {
                  question: "How would you approach this differently?",
                  yourAnswer:
                    "I would use a more systematic approach with better planning...",
                  feedback:
                    "While your answer was reasonable, try to be more specific with technical solutions and trade-offs.",
                  score: 7.5,
                },
              ].map((item, idx) => (
                <div key={idx} className="border-t border-border/40 pt-6 first:border-t-0 first:pt-0 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-lg text-foreground flex-1">
                      Q{idx + 1}: {item.question}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {item.score}
                      </span>
                      <span className="text-xs text-muted-foreground">/10</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Your Response:
                      </p>
                      <p className="text-sm text-foreground/80">
                        {item.yourAnswer}
                      </p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded p-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        AI Feedback:
                      </p>
                      <p className="text-sm text-foreground/80">
                        {item.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
