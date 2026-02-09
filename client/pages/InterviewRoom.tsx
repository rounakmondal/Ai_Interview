import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";

interface LocationState {
  interviewType: string;
  language: string;
  cvUploaded: boolean;
}

export default function InterviewRoom() {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const [isMuted, setIsMuted] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isThinking, setIsThinking] = useState(false);

  const totalQuestions = 8;

  const handleSubmitAnswer = () => {
    setIsThinking(true);
    setUserAnswer("");
    // Simulate AI thinking
    setTimeout(() => {
      setIsThinking(false);
      setCurrentQuestion(currentQuestion + 1);
    }, 2000);
  };

  const handleEndInterview = () => {
    // Navigate to evaluation page
    window.location.href = "/evaluation";
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Interview Setup Required</h1>
          <p className="text-muted-foreground">
            Please start from the setup page to begin an interview.
          </p>
          <Link to="/setup">
            <Button className="w-full gradient-primary">Go to Setup</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              AI
            </div>
            <div>
              <h1 className="font-bold text-foreground hidden sm:block">
                Interview Room
              </h1>
              <p className="text-xs text-muted-foreground">
                {state.interviewType.charAt(0).toUpperCase() +
                  state.interviewType.slice(1)}{" "}
                • {state.language}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Interview Room */}
      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Avatar and Video */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/40 overflow-hidden">
              {/* Avatar Container */}
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                {/* Animated avatar placeholder */}
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-primary animate-pulse-subtle flex items-center justify-center text-white text-center">
                    <svg
                      className="w-24 h-24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  {/* Speaking indicator */}
                  {!isThinking && (
                    <div className="absolute bottom-4 right-4 flex gap-1">
                      <div className="w-2 h-6 bg-primary/60 rounded-full animate-pulse" />
                      <div className="w-2 h-6 bg-secondary/60 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-6 bg-accent/60 rounded-full animate-pulse delay-200" />
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                  Live
                </div>
              </div>

              {/* Avatar Info */}
              <div className="p-6 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    AI Interviewer
                  </p>
                  <p className="font-bold text-lg">Priya Sharma</p>
                  <p className="text-sm text-muted-foreground">
                    Senior Interview Coach
                  </p>
                </div>

                {/* Status Text */}
                <div className="pt-3 border-t border-border/40">
                  {isThinking ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Thinking...
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Listening to your response...
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Question and Answer Area */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Progress */}
            <Card className="p-4 border-border/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Interview Progress</h3>
                <span className="text-sm font-semibold text-primary">
                  Question {Math.min(currentQuestion, totalQuestions)} of{" "}
                  {totalQuestions}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${(Math.min(currentQuestion, totalQuestions) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </Card>

            {/* Current Question */}
            <Card className="p-6 border-border/40 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Current Question
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-lg font-semibold text-foreground leading-relaxed">
                    {isThinking
                      ? "Processing your answer..."
                      : currentQuestion <= totalQuestions
                        ? "Tell me about a challenging project you've worked on and how you overcame the obstacles."
                        : "Thank you for completing the interview!"}
                  </p>
                </div>
              </div>

              {/* Subtitles */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Subtitles</p>
                <p className="text-sm text-foreground">
                  {isThinking
                    ? "AI is analyzing your response and preparing the next question..."
                    : currentQuestion <= totalQuestions
                      ? "Tell me about a challenging project you've worked on and how you overcame the obstacles."
                      : "All questions have been completed. Moving to evaluation..."}
                </p>
              </div>
            </Card>

            {/* Answer Input */}
            {currentQuestion <= totalQuestions && !isThinking && (
              <Card className="p-6 border-border/40 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your Response
                  </p>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here... (or click the microphone icon to speak)"
                    className="w-full p-4 rounded-lg border border-border/40 bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                    rows={6}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="border-border/40 text-base flex-1 sm:flex-none"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Microphone Off
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Microphone On
                      </>
                    )}
                  </Button>

                  <div className="flex gap-3 flex-1 sm:flex-none">
                    <Button
                      variant="outline"
                      className="border-border/40 text-base flex-1"
                      onClick={handleEndInterview}
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      End Interview
                    </Button>
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim()}
                      className="gradient-primary text-base flex-1"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Submit Answer
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Thinking State */}
            {isThinking && (
              <Card className="p-6 border-border/40 text-center space-y-4">
                <div className="flex justify-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-100" />
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-200" />
                </div>
                <p className="text-muted-foreground">
                  Processing your response and generating the next question...
                </p>
              </Card>
            )}

            {/* Interview Complete */}
            {currentQuestion > totalQuestions && (
              <Card className="p-6 border-border/40 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Interview Complete!</h3>
                <p className="text-muted-foreground">
                  Great job! Your interview has been recorded and will be evaluated
                  shortly.
                </p>
                <Button
                  onClick={handleEndInterview}
                  className="gradient-primary text-base w-full"
                >
                  View Your Evaluation
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
