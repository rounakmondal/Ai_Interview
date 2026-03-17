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
  ArrowLeft,
  GanttChart,
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Zap,
  Target,
  CheckCircle2,
} from "lucide-react";
import {
  getStudyExamPreference,
  STUDY_TEMPLATES,
  getSavedAIPlan,
  saveAIPlan,
} from "@/lib/exam-syllabus-data";
import { STUDY_EXAM_LABELS } from "@shared/study-types";
import type { StudyExamType, AIStudyPlan, TemplatePhase } from "@shared/study-types";

export default function StudyPlan() {
  const navigate = useNavigate();
  const studyExam = getStudyExamPreference();

  const [tab, setTab] = useState<"ai" | "template">("ai");
  const [aiPlan, setAiPlan] = useState<AIStudyPlan | null>(getSavedAIPlan());
  const [generating, setGenerating] = useState(false);
  const [examDate, setExamDate] = useState(aiPlan?.examDate ?? "");
  const [hoursPerDay, setHoursPerDay] = useState(aiPlan?.hoursPerDay ?? 3);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({ 1: true });

  useEffect(() => {
    if (!studyExam) navigate("/profile", { replace: true });
  }, [studyExam, navigate]);

  if (!studyExam) return null;

  const template = STUDY_TEMPLATES[studyExam];

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
        // Fallback: generate locally
        const now = new Date();
        const target = new Date(examDate);
        const totalWeeks = Math.max(4, Math.ceil((target.getTime() - now.getTime()) / (7 * 86400000)));
        const subjects = template.phases.flatMap((p) => p.topics.map((t) => t.subject));
        const unique = [...new Set(subjects)];

        const plan: AIStudyPlan = {
          examId: studyExam,
          examDate,
          hoursPerDay,
          totalWeeks,
          createdAt: new Date().toISOString(),
          weeks: Array.from({ length: totalWeeks }, (_, i) => {
            const phase = i < totalWeeks * 0.4 ? "Foundation" : i < totalWeeks * 0.75 ? "Practice" : "Revision";
            const subs = [unique[i % unique.length], unique[(i + 1) % unique.length]];
            return {
              week: i + 1,
              title: `Week ${i + 1} — ${phase}`,
              subjects: subs,
              chapters: subs.map((s) => `${s} chapters`),
              hoursPerDay,
              tips: phase === "Foundation" ? "Focus on NCERT and building concepts."
                : phase === "Practice" ? "Solve previous year papers and take topic tests."
                : "Full-length mocks daily. Revise weak areas.",
            };
          }),
        };
        saveAIPlan(plan);
        setAiPlan(plan);
      }
    } catch {
      // Silent fail — plan stays null
    } finally {
      setGenerating(false);
    }
  };

  const togglePhase = (phase: number) => {
    setExpandedPhases((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Study Plan</span>
          <div className="ml-auto">
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto space-y-6">
        {/* Heading */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GanttChart className="w-6 h-6 text-primary" />
              Study Plan
            </h1>
            <p className="text-sm text-muted-foreground">
              {STUDY_EXAM_LABELS[studyExam]} — plan your preparation
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            {STUDY_EXAM_LABELS[studyExam]}
          </Badge>
        </div>

        {/* Tab Switch */}
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab("ai")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "ai"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
            AI Plan
          </button>
          <button
            onClick={() => setTab("template")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "template"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
            Fixed Template
          </button>
        </div>

        {/* ─── AI PLAN TAB ────────────────────────────────────────────── */}
        {tab === "ai" && (
          <div className="space-y-6">
            {/* Config inputs */}
            {!aiPlan && (
              <Card className="p-6 border-border/40 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <h2 className="font-semibold">Generate Your AI Study Plan</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tell us your exam date and how many hours you can study per day. Our AI will create a personalized week-by-week plan.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Exam Date</Label>
                    <Input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Hours per Day</Label>
                    <div className="flex gap-2">
                      {[2, 3, 4, 5, 6, 8].map((h) => (
                        <button
                          key={h}
                          onClick={() => setHoursPerDay(h)}
                          className={`flex-1 h-10 rounded-lg text-sm font-medium border transition-all ${
                            hoursPerDay === h
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleGeneratePlan}
                  disabled={!examDate || generating}
                  className="gap-2"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate AI Plan
                    </>
                  )}
                </Button>
              </Card>
            )}

            {/* Existing AI Plan */}
            {aiPlan && (
              <div className="space-y-4">
                {/* Plan summary */}
                <Card className="p-5 border-border/40">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-violet-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Your AI Study Plan</p>
                        <p className="text-xs text-muted-foreground">
                          {aiPlan.totalWeeks} weeks · {aiPlan.hoursPerDay}h/day · Target: {new Date(aiPlan.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setAiPlan(null); localStorage.removeItem("ai_study_plan"); }}
                      className="text-xs"
                    >
                      Regenerate
                    </Button>
                  </div>
                </Card>

                {/* Week cards */}
                <div className="grid gap-3">
                  {aiPlan.weeks.map((week) => {
                    const isFoundation = week.title.includes("Foundation");
                    const isRevision = week.title.includes("Revision");
                    const color = isFoundation ? "border-l-blue-500" : isRevision ? "border-l-green-500" : "border-l-violet-500";
                    return (
                      <Card key={week.week} className={`p-4 border-border/40 border-l-4 ${color}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5">
                            <p className="font-semibold text-sm">{week.title}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {week.subjects.map((s) => (
                                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{week.tips}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            {week.hoursPerDay}h/day
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── FIXED TEMPLATE TAB ─────────────────────────────────────── */}
        {tab === "template" && template && (
          <div className="space-y-4">
            {template.phases.map((phase) => (
              <Card key={phase.phase} className="border-border/40 overflow-hidden">
                <button
                  onClick={() => togglePhase(phase.phase)}
                  className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                      phase.phase === 1 ? "bg-blue-500" : phase.phase === 2 ? "bg-violet-500" : "bg-green-500"
                    }`}>
                      {phase.phase}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{phase.title}</p>
                      <p className="text-xs text-muted-foreground">{phase.duration} · {phase.description}</p>
                    </div>
                  </div>
                  {expandedPhases[phase.phase] ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {expandedPhases[phase.phase] && (
                  <div className="px-5 pb-5 space-y-3">
                    {phase.topics.map((topic, i) => (
                      <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/30">
                        <p className="font-medium text-sm mb-2 flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          {topic.subject}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {topic.chapters.map((ch) => (
                            <span key={ch} className="text-xs bg-background border border-border/40 rounded-lg px-2.5 py-1">
                              {ch}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
