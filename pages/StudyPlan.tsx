import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import ProfileButton from "@/components/ProfileButton";
import {
  GanttChart, Sparkles, Clock, BookOpen,
  ChevronDown, ChevronRight, Zap, Target,
  CheckCircle2, Home, BookMarked, BarChart3,
  Flame, Trophy, Brain, Shield, Star, ArrowRight,
  Calendar, TrendingUp, Award, Lightbulb, RefreshCw,
  Users, Play,
} from "lucide-react";
import {
  getStudyExamPreference,
  STUDY_TEMPLATES,
  getSavedAIPlan,
  saveAIPlan,
  getExamSyllabusWithProgress,
} from "@/lib/exam-syllabus-data";
import { STUDY_EXAM_LABELS } from "@shared/study-types";
import type { StudyExamType, AIStudyPlan, TemplatePhase } from "@shared/study-types";

const STUDY_TIPS = [
  { tip: "Study in 25-minute Pomodoro blocks with 5-min breaks", icon: "🍅" },
  { tip: "Review previous day's notes every morning for 10 minutes", icon: "📝" },
  { tip: "Solve at least 20 MCQs daily — consistency beats cramming", icon: "✏️" },
  { tip: "Focus on high-weightage topics and standard textbooks first", icon: "🎯" },
  { tip: "Create mind maps for complex topics — visual memory is powerful", icon: "🧠" },
  { tip: "Read one editorial and one current affairs article daily", icon: "📰" },
];

const PHASE_COLORS = [
  { border: "border-l-blue-500", badge: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  { border: "border-l-violet-500", badge: "bg-violet-500", text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
  { border: "border-l-green-500", badge: "bg-green-500", text: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
  { border: "border-l-orange-500", badge: "bg-orange-500", text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" },
];

export default function StudyPlan() {
  const navigate = useNavigate();
  const studyExam = getStudyExamPreference();

  const [tab, setTab] = useState<"ai" | "template">("ai");
  const [aiPlan, setAiPlan] = useState<AIStudyPlan | null>(getSavedAIPlan());
  const [generating, setGenerating] = useState(false);
  const [examDate, setExamDate] = useState(aiPlan?.examDate ?? "");
  const [hoursPerDay, setHoursPerDay] = useState(aiPlan?.hoursPerDay ?? 3);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({ 1: true });
  const [randomTipIdx] = useState(() => Math.floor(Math.random() * STUDY_TIPS.length));

  useEffect(() => {
    if (!studyExam) navigate("/profile", { replace: true });
  }, [studyExam, navigate]);

  if (!studyExam) return null;

  const template = STUDY_TEMPLATES[studyExam];

  // Compute syllabus completion from saved progress
  const syllabus = getExamSyllabusWithProgress(studyExam);
  let doneChapters = 0;
  let totalChapters = 0;
  for (const subject of syllabus.subjects) {
    totalChapters += subject.chapters.length;
    doneChapters += subject.chapters.filter((c) => c.status === "done").length;
  }
  const syllabusCompletion = totalChapters > 0 ? Math.round((doneChapters / totalChapters) * 100) : 0;

  // Days to exam
  const daysToExam = aiPlan?.examDate
    ? Math.max(0, Math.ceil((new Date(aiPlan.examDate).getTime() - Date.now()) / 86400000))
    : null;

  const generateFallbackPlan = () => {
    const now = new Date();
    const target = new Date(examDate);
    const totalWeeks = Math.max(4, Math.ceil((target.getTime() - now.getTime()) / (7 * 86400000)));
    const subjects = template?.phases.flatMap((p) => p.topics.map((t) => t.subject)) ?? [];
    const unique = [...new Set(subjects)];
    const plan: AIStudyPlan = {
      examId: studyExam,
      examDate,
      hoursPerDay,
      totalWeeks,
      createdAt: new Date().toISOString(),
      weeks: Array.from({ length: totalWeeks }, (_, i) => {
        const phase = i < totalWeeks * 0.4 ? "Foundation" : i < totalWeeks * 0.75 ? "Practice" : "Revision";
        const subs = unique.length > 0 ? [unique[i % unique.length], unique[(i + 1) % unique.length]] : ["General Studies"];
        return {
          week: i + 1,
          title: `Week ${i + 1} — ${phase}`,
          subjects: subs,
          chapters: subs.map((s) => `${s} core chapters`),
          hoursPerDay,
          tips: phase === "Foundation"
            ? "Build strong conceptual foundation from NCERT and standard books."
            : phase === "Practice"
            ? "Solve previous year papers and sectional tests daily."
            : "Full-length mocks daily. Identify and revise weak areas.",
        };
      }),
    };
    saveAIPlan(plan);
    setAiPlan(plan);
  };

  const handleGeneratePlan = async () => {
    if (!examDate) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/studyplan/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: studyExam, examDate, hoursPerDay }),
      });
      if (res.ok) {
        const plan: AIStudyPlan = await res.json();
        saveAIPlan(plan);
        setAiPlan(plan);
      } else {
        generateFallbackPlan();
      }
    } catch {
      generateFallbackPlan();
    } finally {
      setGenerating(false);
    }
  };

  const togglePhase = (phase: number) => {
    setExpandedPhases((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─── NAVBAR ─────────────────────────────────────────────────── */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 mr-1">
            <img src="/logo.png" alt="InterviewSathi" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-bold text-sm hidden sm:block">InterviewSathi</span>
          </Link>
          <span className="text-border/60 hidden sm:block">|</span>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link to="/dashboard" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />Dashboard
            </Link>
            <Link to="/study-plan" className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium flex items-center gap-1.5">
              <GanttChart className="w-3.5 h-3.5" />Study Plan
            </Link>
            <Link to="/syllabus" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5" />Syllabus
            </Link>
            <Link to="/daily-quiz" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />Practice
            </Link>
          </nav>
          <Badge variant="secondary" className="text-xs font-medium hidden sm:flex">
            {STUDY_EXAM_LABELS[studyExam]}
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            {daysToExam !== null && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">
                <Flame className="w-3.5 h-3.5" />
                {daysToExam}d left
              </div>
            )}
            <ProfileButton />
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary/8 via-violet-500/5 to-background border-b border-border/40">
        <div className="container px-4 py-8 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  <GanttChart className="w-3 h-3 mr-1" />Study Plan
                </Badge>
                <Badge variant="secondary" className="text-xs">{STUDY_EXAM_LABELS[studyExam]}</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Your Personalized Study Plan</h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                AI-crafted week-by-week schedule tailored to{" "}
                <span className="font-semibold text-foreground">{STUDY_EXAM_LABELS[studyExam]}</span>.
                Track progress, set your exam date, and never miss a topic.
              </p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto md:min-w-[280px]">
              <div className="text-center p-3 rounded-xl bg-background/80 border border-border/40">
                <p className="text-2xl font-bold text-primary">{syllabusCompletion}%</p>
                <p className="text-xs text-muted-foreground">Syllabus</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-background/80 border border-border/40">
                <p className="text-2xl font-bold text-violet-500">{doneChapters}</p>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-background/80 border border-border/40">
                <p className="text-2xl font-bold text-green-500">{aiPlan ? aiPlan.totalWeeks : "–"}</p>
                <p className="text-xs text-muted-foreground">Weeks</p>
              </div>
            </div>
          </div>
          {syllabusCompletion > 0 && (
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Overall Syllabus Progress</span>
                <span className="font-medium">{doneChapters}/{totalChapters} chapters</span>
              </div>
              <Progress value={syllabusCompletion} className="h-2" />
            </div>
          )}
        </div>
      </section>

      {/* ─── TRUST STRIP ────────────────────────────────────────────── */}
      <div className="border-b border-border/40 bg-green-500/5">
        <div className="container px-4 py-2.5 flex items-center justify-center gap-6 flex-wrap">
          {[
            { icon: <Shield className="w-3.5 h-3.5" />, label: "Exam-Verified Content" },
            { icon: <Brain className="w-3.5 h-3.5" />, label: "AI-Powered Planning" },
            { icon: <Users className="w-3.5 h-3.5" />, label: "1L+ Aspirants" },
            { icon: <Star className="w-3.5 h-3.5" />, label: "4.9★ Rated" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
              {item.icon}{item.label}
            </div>
          ))}
        </div>
      </div>

      <main className="container px-4 py-8 max-w-5xl mx-auto space-y-6">
        {/* ─── TAB SWITCHER ──────────────────────────────────────────── */}
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab("ai")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              tab === "ai" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />AI Plan
          </button>
          <button
            onClick={() => setTab("template")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              tab === "template" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />Fixed Template
          </button>
        </div>

        {/* ─── AI PLAN TAB ───────────────────────────────────────────── */}
        {tab === "ai" && (
          <div className="space-y-6">
            {!aiPlan && (
              <Card className="overflow-hidden border-border/40">
                <div className="bg-gradient-to-r from-violet-500/10 to-primary/5 px-6 py-5 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h2 className="font-bold">Generate Your AI Study Plan</h2>
                      <p className="text-sm text-muted-foreground">Personalized week-by-week schedule crafted by AI</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        <Calendar className="w-4 h-4 inline mr-1.5 text-primary" />Exam Date
                      </Label>
                      <Input
                        type="date"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="h-11 border-border/60"
                      />
                      {examDate && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000))} days remaining
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        <Clock className="w-4 h-4 inline mr-1.5 text-primary" />Daily Study Hours
                      </Label>
                      <div className="grid grid-cols-6 gap-1.5">
                        {[2, 3, 4, 5, 6, 8].map((h) => (
                          <button
                            key={h}
                            onClick={() => setHoursPerDay(h)}
                            className={`h-11 rounded-lg text-sm font-bold border transition-all ${
                              hoursPerDay === h
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            {h}h
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {hoursPerDay <= 3 ? "Good for part-time prep" : hoursPerDay <= 5 ? "Dedicated student pace" : "Intensive full-time prep"}
                      </p>
                    </div>
                  </div>

                  {/* What you'll get */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/30 border border-border/30">
                    {[
                      { icon: <BookMarked className="w-4 h-4 text-blue-500" />, text: "Subject-wise breakdown" },
                      { icon: <Target className="w-4 h-4 text-orange-500" />, text: "Priority-based ordering" },
                      { icon: <TrendingUp className="w-4 h-4 text-green-500" />, text: "Progress milestones" },
                      { icon: <Lightbulb className="w-4 h-4 text-yellow-500" />, text: "Expert study tips" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium">
                        {item.icon}{item.text}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleGeneratePlan}
                    disabled={!examDate || generating}
                    size="lg"
                    className="w-full sm:w-auto gap-2 bg-gradient-to-r from-violet-600 to-primary"
                  >
                    {generating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Building your plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate My Study Plan
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {/* Existing AI Plan */}
            {aiPlan && (
              <div className="space-y-5">
                {/* Plan summary */}
                <Card className="overflow-hidden border-border/40">
                  <div className="bg-gradient-to-r from-violet-500/10 to-primary/5 p-5 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-violet-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Your Personalized AI Plan</p>
                        <p className="text-xs text-muted-foreground">
                          {aiPlan.totalWeeks} weeks · {aiPlan.hoursPerDay}h/day · {aiPlan.totalWeeks * aiPlan.hoursPerDay * 7}h total
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(aiPlan.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setAiPlan(null); localStorage.removeItem("ai_study_plan"); }}
                        className="text-xs gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />Regenerate
                      </Button>
                    </div>
                  </div>
                  <div className="px-5 py-3 flex items-center gap-4 flex-wrap border-t border-border/30 bg-muted/20">
                    {[
                      { color: "bg-blue-500", label: "Foundation" },
                      { color: "bg-violet-500", label: "Practice" },
                      { color: "bg-green-500", label: "Revision" },
                    ].map((p) => (
                      <div key={p.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                        {p.label} Phase
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Week cards */}
                <div className="grid gap-3">
                  {aiPlan.weeks.map((week) => {
                    const isFoundation = week.title.includes("Foundation");
                    const isRevision = week.title.includes("Revision");
                    const c = PHASE_COLORS[isFoundation ? 0 : isRevision ? 2 : 1];
                    return (
                      <Card key={week.week} className={`p-4 border-border/40 border-l-4 ${c.border} hover:shadow-sm transition-shadow`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <span className={`text-xs font-bold ${c.text}`}>{week.week}</span>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <p className="font-semibold text-sm">{week.title}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {week.hoursPerDay}h/day · {week.hoursPerDay * 7}h total
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {week.subjects.map((s) => (
                                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2.5">
                              <Lightbulb className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                              {week.tips}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Daily schedule */}
                <Card className="p-5 border-border/40">
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />Recommended Daily Schedule
                  </h3>
                  <div className="space-y-2">
                    {[
                      { time: "6:00–6:30 AM", activity: "Current Affairs Review", type: "reading" },
                      { time: "7:00–9:00 AM", activity: "Core Subject Study (2 hrs)", type: "study" },
                      { time: "11:00–12:00 PM", activity: "Previous Year Questions (1 hr)", type: "practice" },
                      { time: "4:00–5:00 PM", activity: "Revision + Notes Making", type: "revision" },
                      { time: "8:00–8:30 PM", activity: "Daily MCQ Practice (20 questions)", type: "quiz" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="w-24 text-xs text-muted-foreground font-mono flex-shrink-0">{item.time}</div>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          item.type === "study" ? "bg-blue-500" : item.type === "practice" ? "bg-violet-500" : item.type === "revision" ? "bg-green-500" : "bg-orange-500"
                        }`} />
                        <p className="text-sm">{item.activity}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* ─── FIXED TEMPLATE TAB ───────────────────────────────────── */}
        {tab === "template" && template && (
          <div className="space-y-4">
            <Card className="p-5 border-border/40 bg-blue-500/5 flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Proven Study Template for {STUDY_EXAM_LABELS[studyExam]}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Crafted by top educators and successful aspirants. Follow the phase-wise approach for best results.
                </p>
              </div>
            </Card>

            {template.phases.map((phase, phaseIdx) => {
              const c = PHASE_COLORS[phaseIdx % PHASE_COLORS.length];
              return (
                <Card key={phase.phase} className={`border-border/40 overflow-hidden border-l-4 ${c.border}`}>
                  <button
                    onClick={() => togglePhase(phase.phase)}
                    className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${c.badge}`}>
                        {phase.phase}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{phase.title}</p>
                        <p className="text-xs text-muted-foreground">{phase.duration} · {phase.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground hidden sm:block">{phase.topics.length} subjects</span>
                      {expandedPhases[phase.phase] ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  {expandedPhases[phase.phase] && (
                    <div className="px-5 pb-5 space-y-3 border-t border-border/30 pt-4">
                      {phase.topics.map((topic, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-muted/30 border border-border/30">
                          <div className="flex items-center gap-2 mb-2.5">
                            <BookOpen className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <p className="font-medium text-sm">{topic.subject}</p>
                            <Badge variant="secondary" className="text-xs ml-auto">{topic.chapters.length} chapters</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {topic.chapters.map((ch) => (
                              <span key={ch} className="text-xs bg-background border border-border/40 rounded-lg px-2.5 py-1 hover:border-primary/30 transition-colors cursor-default">
                                {ch}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ─── EXPERT TIPS ──────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <Brain className="w-5 h-5 text-violet-500" />,
              title: "Spaced Repetition",
              tip: "Review topics at intervals: day 1, day 3, day 7, day 21 for 90%+ long-term retention.",
            },
            {
              icon: <Target className="w-5 h-5 text-orange-500" />,
              title: "High-Value Topics First",
              tip: "GS-II (Polity, Governance) and Economics fetch the most marks. Prioritize these early.",
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-green-500" />,
              title: "Mock Test Strategy",
              tip: "Start full-length mocks 8 weeks before exam. Analyze each mock for 2 hours — more valuable than re-reading.",
            },
          ].map((item, i) => (
            <Card key={i} className="p-4 border-border/40 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.tip}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ─── DAILY TIP CARD ───────────────────────────────────────── */}
        <Card className="p-5 border-border/40 bg-gradient-to-r from-amber-500/5 to-orange-500/5 flex items-start gap-3">
          <span className="text-2xl">{STUDY_TIPS[randomTipIdx].icon}</span>
          <div>
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-0.5">Today's Study Tip</p>
            <p className="font-semibold text-sm">{STUDY_TIPS[randomTipIdx].tip}</p>
          </div>
        </Card>

        {/* ─── CTA LINKS ────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-4 pb-6">
          <Card className="p-5 border-border/40 flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookMarked className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Track Syllabus</p>
              <p className="text-xs text-muted-foreground">{syllabusCompletion}% done · {totalChapters - doneChapters} chapters left</p>
            </div>
            <Link to="/syllabus">
              <Button size="sm" variant="outline" className="gap-1 text-xs">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
          <Card className="p-5 border-border/40 flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-violet-500" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Daily Practice Quiz</p>
              <p className="text-xs text-muted-foreground">10 questions · 10 minutes</p>
            </div>
            <Link to="/daily-quiz">
              <Button size="sm" className="gap-1 text-xs bg-violet-600 hover:bg-violet-700">
                Start <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
