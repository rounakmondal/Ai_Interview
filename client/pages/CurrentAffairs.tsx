import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Zap,
  Calendar,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  Newspaper,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { fetchCurrentAffairs, NewsItem, WeeklyQuizItem, MonthlyTopic, ExamType } from "@/lib/govt-practice-data";

const importanceColor = {
  high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  low: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CurrentAffairs() {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [weeklyQuiz, setWeeklyQuiz] = useState<WeeklyQuizItem[]>([]);
  const [monthlyTopics, setMonthlyTopics] = useState<MonthlyTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentAffairs().then((data) => {
      setNews(data.news);
      setWeeklyQuiz(data.weeklyQuiz);
      setMonthlyTopics(data.monthlyTopics);
      setLoading(false);
    });
  }, []);

  const handleQuizSelect = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const quizScore = weeklyQuiz.filter(
    (q) => quizAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/govt-practice" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Current Affairs</span>
          <Badge variant="secondary" className="ml-1 text-xs">Updated Daily</Badge>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Zap className="w-7 h-7 text-amber-500" />
            Current Affairs Hub
          </h1>
          <p className="text-muted-foreground text-sm">
            Daily news, weekly quiz, and monthly important topics for WBCS, SSC, Banking & Railway aspirants.
          </p>
        </div>

        <Tabs defaultValue="daily">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="daily" className="gap-1.5 text-xs sm:text-sm">
              <Newspaper className="w-3.5 h-3.5" />
              Daily News
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-1.5 text-xs sm:text-sm">
              <ClipboardList className="w-3.5 h-3.5" />
              Weekly Quiz
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-1.5 text-xs sm:text-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              Monthly Topics
            </TabsTrigger>
          </TabsList>

          {/* ─── Daily News ───────────────────────────────────────────────────── */}
          <TabsContent value="daily" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Showing latest {news.length} stories
              </p>
            </div>
            {news.map((item) => (
              <Card key={item.id} className="p-5 border-border/40 space-y-3 hover:border-primary/30 transition-colors">
                <div className="flex flex-wrap items-start gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${importanceColor[item.importance]}`}>
                    {item.importance === "high" ? "🔴 High Priority" : item.importance === "medium" ? "🟡 Medium" : "🟢 Low"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">{formatDate(item.date)}</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold leading-snug">{item.headline}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* ─── Weekly Quiz ──────────────────────────────────────────────────── */}
          <TabsContent value="quiz" className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">Weekly Quiz</h2>
                <p className="text-xs text-muted-foreground">{weeklyQuiz[0]?.week}</p>
              </div>
              {quizSubmitted && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{quizScore}/{weeklyQuiz.length}</p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              )}
            </div>

            {weeklyQuiz.map((q, idx) => {
              const userAns = quizAnswers[q.id] ?? null;
              const isCorrect = userAns === q.correctIndex;
              return (
                <Card key={q.id} className={`p-5 border ${quizSubmitted ? isCorrect ? "border-green-500/30 bg-green-500/5" : "border-red-500/20" : "border-border/40"}`}>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Q{idx + 1}</p>
                  <p className="text-sm sm:text-base font-medium mb-4">{q.question}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => {
                      const selected = userAns === oi;
                      const isAnswer = q.correctIndex === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() => handleQuizSelect(q.id, oi)}
                          disabled={quizSubmitted}
                          className={`px-3 py-2.5 rounded-lg text-sm border flex items-center gap-2 text-left transition-all ${
                            quizSubmitted
                              ? isAnswer
                                ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 font-medium"
                                : selected && !isAnswer
                                ? "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                                : "bg-muted/30 border-border/40 text-muted-foreground"
                              : selected
                              ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20"
                              : "border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          <span className="font-bold text-xs flex-shrink-0">{String.fromCharCode(65 + oi)}.</span>
                          {opt}
                          {quizSubmitted && isAnswer && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-green-600 flex-shrink-0" />}
                          {quizSubmitted && selected && !isAnswer && <XCircle className="w-3.5 h-3.5 ml-auto text-red-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className="mt-3 bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <p className="text-xs font-semibold text-primary mb-1">💡 Explanation</p>
                      <p className="text-xs text-foreground/80">{q.explanation}</p>
                    </div>
                  )}
                </Card>
              );
            })}

            {!quizSubmitted ? (
              <Button
                onClick={() => setQuizSubmitted(true)}
                className="w-full gradient-primary"
                disabled={Object.keys(quizAnswers).length === 0}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                className="w-full"
              >
                Retake Quiz
              </Button>
            )}
          </TabsContent>

          {/* ─── Monthly Topics ───────────────────────────────────────────────── */}
          <TabsContent value="monthly" className="mt-6 space-y-5">
            <p className="text-sm text-muted-foreground">
              Important topics for <strong className="text-foreground">March 2026</strong> — highly expected in upcoming exams.
            </p>
            {monthlyTopics.map((topic, idx) => (
              <Card key={idx} className="p-5 sm:p-6 border-border/40 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <h3 className="font-bold text-sm sm:text-base">{topic.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{topic.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topic.relevantExams.map((e) => (
                    <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  {topic.keyPoints.map((point, pi) => (
                    <div key={pi} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{point}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
