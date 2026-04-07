import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ProfileButton from "@/components/ProfileButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Zap,
  Trophy,
  Target,
  Calendar,
  ArrowRight,
  AlertCircle,
  Flame,
  GanttChart,
  BookMarked,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDashboard, MOCK_DASHBOARD, DashboardStats, SUBJECT_LABELS, Subject } from "@/lib/govt-practice-data";
import {
  getStudyExamPreference,
  getExamSyllabusWithProgress,
  getSavedAIPlan,
} from "@/lib/exam-syllabus-data";
import { STUDY_EXAM_LABELS } from "@shared/study-types";
import type { StudyExamType } from "@shared/study-types";

const subjectColor: Record<Subject, string> = {
  History: "bg-amber-500",
  Geography: "bg-green-500",
  Polity: "bg-blue-500",
  Reasoning: "bg-purple-500",
  Math: "bg-red-500",
  "Current Affairs": "bg-cyan-500",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(MOCK_DASHBOARD);
  const studyExam = getStudyExamPreference();
  const aiPlan = getSavedAIPlan();

  // Calculate syllabus completion %
  const syllabusCompletion = (() => {
    if (!studyExam) return 0;
    const syllabus = getExamSyllabusWithProgress(studyExam);
    let total = 0, done = 0;
    for (const s of syllabus.subjects) {
      for (const c of s.chapters) {
        total++;
        if (c.status === "done") done++;
      }
    }
    return total > 0 ? Math.round((done / total) * 100) : 0;
  })();

  // Days until exam
  const daysToExam = (() => {
    try {
      const raw = localStorage.getItem("upcoming_exam");
      if (!raw) return null;
      const { date } = JSON.parse(raw);
      const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : null;
    } catch { return null; }
  })();

  useEffect(() => {
    fetchDashboard().then((data) => setStats(data));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">My Dashboard</span>
          <div className="ml-auto flex items-center gap-2">
            <ProfileButton />
            <Link to="/daily-tasks">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Daily Tasks
              </Button>
            </Link>
            <Link to="/govt-practice">
            <Button size="sm" className="gradient-primary gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Take a Test
            </Button>
          </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-5xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground text-sm">Track your preparation progress across all government exams.</p>
        </div>

        {/* Exam Info Strip */}
        {studyExam && (
          <Card className="p-4 sm:p-5 border-border/40">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{STUDY_EXAM_LABELS[studyExam]}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {daysToExam && <span>{daysToExam} days to exam</span>}
                    <span>Syllabus: {syllabusCompletion}% complete</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/study-plan">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <GanttChart className="w-3.5 h-3.5" />
                    Study Plan
                  </Button>
                </Link>
                <Link to="/syllabus">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <BookMarked className="w-3.5 h-3.5" />
                    Syllabus
                  </Button>
                </Link>
              </div>
            </div>
            {syllabusCompletion > 0 && (
              <div className="mt-3">
                <Progress value={syllabusCompletion} className="h-2" />
              </div>
            )}
          </Card>
        )}

        {/* Study Plan & Syllabus Quick Cards */}
        {studyExam && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/study-plan">
              <Card className="p-5 border-border/40 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <GanttChart className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Study Plan</h3>
                    <p className="text-xs text-muted-foreground">
                      {aiPlan ? `AI plan: ${aiPlan.totalWeeks} weeks` : "Generate your AI study plan"}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                {aiPlan ? (
                  <Badge variant="secondary" className="text-xs">
                    {aiPlan.hoursPerDay}h/day · {aiPlan.totalWeeks} weeks
                  </Badge>
                ) : (
                  <Button size="sm" variant="outline" className="text-xs gap-1">
                    <Zap className="w-3 h-3" /> Generate Plan
                  </Button>
                )}
              </Card>
            </Link>
            <Link to="/syllabus">
              <Card className="p-5 border-border/40 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <BookMarked className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Syllabus Tracker</h3>
                    <p className="text-xs text-muted-foreground">
                      {syllabusCompletion}% complete
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <Progress value={syllabusCompletion} className="h-2" />
              </Card>
            </Link>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Tests", value: stats.totalTests, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
            { label: "Avg Score", value: `${stats.averageScore}%`, icon: Target, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
            { label: "This Week", value: stats.weeklyTests, icon: Calendar, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
            { label: "Strong Areas", value: stats.strongSubjects.length, icon: Trophy, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
          ].map((item) => (
            <Card key={item.label} className="p-5 border-border/40 space-y-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Progress Chart (bar chart representation) */}
            <Card className="p-5 sm:p-6 border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="font-bold">Score Progress</h2>
                <Badge variant="secondary" className="ml-auto text-xs">Last 9 weeks</Badge>
              </div>
              <div className="flex items-end gap-1.5 h-32">
                {stats.progressData.map((d, i) => {
                  const isLast = i === stats.progressData.length - 1;
                  const barH = Math.round((d.score / 100) * 128);
                  return (
                    <div key={d.week} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-bold">{d.score}%</span>
                      <div
                        className={`w-full rounded-t-md transition-all ${isLast ? "bg-primary" : "bg-primary/30 group-hover:bg-primary/60"}`}
                        style={{ height: barH }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-0.5">
                <span>{stats.progressData[0].week}</span>
                <span>{stats.progressData[stats.progressData.length - 1].week}</span>
              </div>
            </Card>

            {/* Subject Scores */}
            <Card className="p-5 sm:p-6 border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-bold">Subject Performance</h2>
              </div>
              <div className="space-y-4">
                {stats.subjectScores.map((s) => (
                  <div key={s.subject} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${subjectColor[s.subject]}`} />
                        <span className="font-medium">{s.subject}</span>
                        <span className="text-xs text-muted-foreground">({s.tests} tests)</span>
                      </div>
                      <span className={`font-bold text-sm ${s.score >= 75 ? "text-green-600 dark:text-green-400" : s.score >= 60 ? "text-amber-600" : "text-red-600 dark:text-red-400"}`}>
                        {s.score}%
                      </span>
                    </div>
                    <Progress value={s.score} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Strong Subjects */}
            <Card className="p-5 border-border/40 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <h3 className="font-bold text-sm">Strong Subjects</h3>
              </div>
              <div className="space-y-2">
                {stats.strongSubjects.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="font-medium">{s}</span>
                    <Badge variant="secondary" className="ml-auto text-xs text-green-700 dark:text-green-400">
                      {stats.subjectScores.find((sc) => sc.subject === s)?.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weak Subjects */}
            <Card className="p-5 border-border/40 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <h3 className="font-bold text-sm">Areas to Improve</h3>
              </div>
              <div className="space-y-2">
                {stats.weakSubjects.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="font-medium">{s}</span>
                    <Badge variant="outline" className="ml-auto text-xs text-red-600 dark:text-red-400">
                      {stats.subjectScores.find((sc) => sc.subject === s)?.score}%
                    </Badge>
                  </div>
                ))}
              </div>
              <Link to="/govt-practice">
                <Button size="sm" variant="outline" className="w-full mt-2 gap-1.5 text-xs">
                  Practice Weak Areas
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </Card>

            {/* Recent Tests */}
            <Card className="p-5 border-border/40 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm">Recent Tests</h3>
              </div>
              <div className="space-y-3">
                {stats.recentTests.map((t, i) => {
                  const pct = Math.round((t.score / t.total) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${pct >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                        {pct}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{t.exam}</p>
                        <p className="text-xs text-muted-foreground">{t.score}/{t.total} · {formatDate(t.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
