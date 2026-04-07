// ─────────────────────────────────────────────────────────────────────────────
// Amar Plan — personalized daily study plan dashboard
// Features: auto-adjust, subject progress rings, mock test integration,
//           share card, exam countdown banner, daily reminders
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import ProfileButton from "@/components/ProfileButton";
import ExamCountdownBanner from "@/components/ExamCountdownBanner";
import SubjectProgressRings from "@/components/SubjectProgressRings";
import PlanShareCard from "@/components/PlanShareCard";
import {
  GanttChart, Sparkles, Clock, BookOpen, CheckCircle2, Home,
  Flame, Trophy, AlertTriangle, Calendar, RefreshCw,
  ChevronDown, ChevronUp, Play, Share2, ArrowRight, Zap,
  Target, BookMarked,
} from "lucide-react";
import { STUDY_EXAM_LABELS } from "@shared/study-types";
import type { StudyExamType, AmarPlanStats, AmarSubjectProgress } from "@shared/study-types";
import {
  getAmarPlan,
  saveAmarPlan,
  generateAmarPlan,
  checkAndAutoAdjust,
  rescheduleFromToday,
  completeAmarTask,
  getSubjectProgress,
  getPlanStats,
  getTodayTasks,
  type AmarPlanData,
  type AmarPlanTask,
  type AutoAdjustResult,
} from "@/lib/amar-plan";
import { scheduleAmarPlanReminder } from "@/lib/notification-service";
import { useToast } from "@/hooks/use-toast";

// ── Onboarding Wizard (inline for Amar Plan creation) ────────────────────────

function AmarPlanOnboarding({ onCreated }: { onCreated: (plan: AmarPlanData) => void }) {
  const [step, setStep] = useState(1);
  const [examId, setExamId] = useState<StudyExamType>("WBCS");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [notificationTime, setNotificationTime] = useState("08:00");

  const WEAK_OPTIONS: Record<StudyExamType, string[]> = {
    WBCS: ["History", "Geography", "Polity", "Reasoning", "Mathematics", "English"],
    WBPSC: ["General Knowledge", "Reasoning", "Arithmetic", "English", "Bengali"],
    Police_SI: ["General Knowledge", "Reasoning", "Mathematics", "English"],
    SSC_CGL: ["Reasoning", "Quantitative Aptitude", "English", "General Awareness"],
    Banking: ["Reasoning", "Quantitative Aptitude", "English", "General Awareness"],
  };

  const toggleWeak = (s: string) => {
    setWeakSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const handleCreate = async () => {
    if (!examDate) return;
    const plan = await generateAmarPlan({
      examId,
      examDate,
      hoursPerDay,
      weakSubjects,
      notificationTime,
    });
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    scheduleAmarPlanReminder();
    onCreated(plan);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-primary mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">আমার পরিকল্পনা</h2>
        <p className="text-muted-foreground text-sm">
          তোমার পরীক্ষার জন্য একটি ব্যক্তিগত পড়ার পরিকল্পনা তৈরি করো
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-10 bg-primary" : s < step ? "w-6 bg-primary/40" : "w-6 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Exam + Date + Hours */}
      {step === 1 && (
        <Card className="p-6 space-y-5 border-border/40">
          <div className="space-y-2">
            <Label className="text-sm font-medium">পরীক্ষা নির্বাচন করো</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STUDY_EXAM_LABELS) as StudyExamType[]).map((ex) => (
                <button
                  key={ex}
                  onClick={() => setExamId(ex)}
                  className={`p-3 rounded-xl text-sm border transition-all ${
                    examId === ex
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border/60 hover:border-primary/40"
                  }`}
                >
                  {STUDY_EXAM_LABELS[ex]}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              <Calendar className="w-4 h-4 inline mr-1.5" />পরীক্ষার তারিখ
            </Label>
            <Input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              <Clock className="w-4 h-4 inline mr-1.5" />প্রতিদিন কত ঘণ্টা পড়বে?
            </Label>
            <div className="grid grid-cols-6 gap-1.5">
              {[2, 3, 4, 5, 6, 8].map((h) => (
                <button
                  key={h}
                  onClick={() => setHoursPerDay(h)}
                  className={`h-11 rounded-lg text-sm font-bold border transition-all ${
                    hoursPerDay === h
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/60 hover:border-primary/40"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Weak Subjects */}
      {step === 2 && (
        <Card className="p-6 space-y-4 border-border/40">
          <div>
            <h3 className="font-semibold text-sm mb-1">দুর্বল বিষয় চিহ্নিত করো</h3>
            <p className="text-xs text-muted-foreground">
              এই বিষয়গুলো বেশি চর্চা করানো হবে। Skip করতে পারো।
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(WEAK_OPTIONS[examId] || []).map((s) => (
              <button
                key={s}
                onClick={() => toggleWeak(s)}
                className={`p-3 rounded-xl text-sm text-left border transition-all ${
                  weakSubjects.includes(s)
                    ? "border-red-400 bg-red-500/10 text-red-600 dark:text-red-400 font-medium"
                    : "border-border/60 hover:border-primary/40"
                }`}
              >
                {weakSubjects.includes(s) ? "⚠️ " : "📘 "}
                {s}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Step 3: Notification Time */}
      {step === 3 && (
        <Card className="p-6 space-y-4 border-border/40">
          <div>
            <h3 className="font-semibold text-sm mb-1">📢 দৈনিক Reminder</h3>
            <p className="text-xs text-muted-foreground">
              প্রতিদিন কটার সময় রিমাইন্ডার পাঠাবো?
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Reminder Time</Label>
            <Input
              type="time"
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
              className="h-11 w-40"
            />
          </div>
          <p className="text-xs text-muted-foreground italic">
            "আজকের কাজ বাকি আছে — [topic name] শেষ করো!" — এমন মেসেজ পাঠাব।
          </p>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
            ← পিছনে
          </Button>
        )}
        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !examDate}
            className="flex-1 gap-1.5"
          >
            পরবর্তী →
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={!examDate}
            className="flex-1 gap-1.5 bg-gradient-to-r from-violet-600 to-primary"
          >
            <Sparkles className="w-4 h-4" />
            পরিকল্পনা তৈরি করো
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Main Amar Plan Dashboard ──────────────────────────────────────────────────

export default function AmarPlan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [plan, setPlan] = useState<AmarPlanData | null>(getAmarPlan);
  const [stats, setStats] = useState<AmarPlanStats | null>(null);
  const [subjects, setSubjects] = useState<AmarSubjectProgress[]>([]);
  const [todayTasks, setTodayTasks] = useState<AmarPlanTask[]>(getTodayTasks);
  const [autoAdjustResult, setAutoAdjustResult] = useState<AutoAdjustResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showUpdateDate, setShowUpdateDate] = useState(false);
  const [newExamDate, setNewExamDate] = useState("");
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Load stats & subject progress whenever plan changes
  useEffect(() => {
    if (!plan) return;
    let cancelled = false;
    (async () => {
      const [s, sp] = await Promise.all([getPlanStats(plan), getSubjectProgress(plan)]);
      if (cancelled) return;
      setStats(s);
      setSubjects(sp);
      setTodayTasks(getTodayTasks());
    })();
    return () => { cancelled = true; };
  }, [plan]);

  // Auto-adjust on load
  useEffect(() => {
    if (!plan) return;
    let cancelled = false;
    (async () => {
      const result = await checkAndAutoAdjust();
      if (cancelled) return;
      setAutoAdjustResult(result);

      if (result.adjusted) {
        const updated = getAmarPlan();
        if (updated) setPlan({ ...updated });
        toast({
          title: "📋 Plan updated",
          description: `${result.missedDays} দিনের ${result.tasksRescheduled}টি কাজ পুনর্বিন্যাস করা হয়েছে।`,
        });
      }

      // Schedule daily reminders
      scheduleAmarPlanReminder();
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle mock test return
  useEffect(() => {
    const mockTaskId = searchParams.get("completedMockTask");
    const mockScore = searchParams.get("mockScore");
    if (mockTaskId && plan) {
      (async () => {
        const updated = await completeAmarTask(mockTaskId, mockScore ? Number(mockScore) : undefined);
        if (updated) {
          setPlan({ ...updated });
          toast({
            title: "✅ Mock Test সম্পূর্ণ!",
            description: mockScore ? `স্কোর: ${mockScore}%` : "চিহ্নিত করা হয়েছে।",
          });
        }
      })();
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReschedule = useCallback(async () => {
    setLoading(true);
    const updated = await rescheduleFromToday();
    setLoading(false);
    if (updated) {
      setPlan({ ...updated });
      setAutoAdjustResult(null);
      toast({
        title: "🔄 Plan Rescheduled",
        description: "আজ থেকে নতুন করে পরিকল্পনা সাজানো হয়েছে।",
      });
    }
  }, [toast]);

  const handleComplete = useCallback(
    async (taskId: string) => {
      const updated = await completeAmarTask(taskId);
      if (updated) {
        setPlan({ ...updated });
        toast({ title: "✅ সম্পূর্ণ!", description: "পরবর্তী কাজে এগিয়ে যাও!" });
      }
    },
    [toast]
  );

  const handleUpdateExamDate = async () => {
    if (!plan || !newExamDate) return;
    plan.examDate = newExamDate;
    saveAmarPlan(plan);
    const updated = await rescheduleFromToday();
    if (updated) {
      setPlan({ ...updated });
      setShowUpdateDate(false);
      toast({ title: "📅 পরীক্ষার তারিখ আপডেট হয়েছে" });
    }
  };

  // ── No plan yet → show onboarding ──────────────────────────────────────────
  if (!plan) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
          <div className="container px-4 h-14 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="MedhaHub" className="w-7 h-7 rounded-lg object-cover" />
              <span className="font-bold text-sm hidden sm:block">MedhaHub</span>
            </Link>
            <div className="ml-auto"><ProfileButton /></div>
          </div>
        </header>
        <main className="container px-4 py-8">
          <AmarPlanOnboarding onCreated={(p) => setPlan(p)} />
        </main>
      </div>
    );
  }

  // ── Plan loaded — use state-based stats ─────────────────────────────────────
  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  // Group upcoming days' tasks (today + next 6 days)
  const upcomingDays: { date: string; tasks: AmarPlanTask[] }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayTasks = plan.tasks.filter((t) => t.date === dateStr);
    if (dayTasks.length > 0) {
      upcomingDays.push({ date: dateStr, tasks: dayTasks });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ─── NAVBAR ──────────────────────────────────────────────────── */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 mr-1">
            <img src="/logo.png" alt="MedhaHub" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-bold text-sm hidden sm:block">MedhaHub</span>
          </Link>
          <span className="text-border/60 hidden sm:block">|</span>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link to="/dashboard" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />Dashboard
            </Link>
            <Link to="/amar-plan" className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium flex items-center gap-1.5">
              <GanttChart className="w-3.5 h-3.5" />আমার Plan
            </Link>
            <Link to="/study-plan" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5" />Study Plan
            </Link>
          </nav>
          <Badge variant="secondary" className="text-xs font-medium hidden sm:flex">
            {STUDY_EXAM_LABELS[plan.examId]}
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">
              <Flame className="w-3.5 h-3.5" />
              {stats.streak}🔥
            </div>
            <ProfileButton />
          </div>
        </div>
      </header>

      {/* ─── Feature 6: Exam Countdown Banner ────────────────────────── */}
      <ExamCountdownBanner
        examId={plan.examId}
        examDate={plan.examDate}
        onUpdateDate={() => setShowUpdateDate(true)}
      />

      {/* ─── Feature 1: Auto-adjust warning ──────────────────────────── */}
      {autoAdjustResult?.needsFullReschedule && (
        <div className="border-b border-amber-500/30 bg-amber-500/10">
          <div className="container px-4 py-3 flex items-center gap-3 flex-wrap">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                তোমার পরিকল্পনা পিছিয়ে গেছে — আজ থেকে ধরো
              </p>
              <p className="text-xs text-muted-foreground">
                {autoAdjustResult.missedDays} দিন মিস হয়েছে। বাকি কাজগুলো নতুন করে সাজাও।
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleReschedule}
              className="gap-1.5 bg-amber-600 hover:bg-amber-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reschedule Plan
            </Button>
          </div>
        </div>
      )}

      {/* ─── Update exam date dialog (inline) ────────────────────────── */}
      {showUpdateDate && (
        <div className="border-b border-border/40 bg-muted/30">
          <div className="container px-4 py-3 flex items-center gap-3 flex-wrap">
            <Calendar className="w-5 h-5 text-primary" />
            <Input
              type="date"
              value={newExamDate}
              onChange={(e) => setNewExamDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-9 w-44"
            />
            <Button size="sm" onClick={handleUpdateExamDate} disabled={!newExamDate}>
              আপডেট করো
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowUpdateDate(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <main className="container px-4 py-6 max-w-5xl mx-auto space-y-6">
        {/* ─── HERO STATS ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />আমার পরিকল্পনা
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {STUDY_EXAM_LABELS[plan.examId]} — আমার Plan
            </h1>
            <p className="text-muted-foreground text-sm">
              {stats.completedTasks}/{stats.totalTasks} কাজ সম্পূর্ণ · {stats.daysRemaining} দিন বাকি
            </p>
          </div>
          <div className="grid grid-cols-4 gap-3 w-full md:w-auto md:min-w-[340px]">
            <div className="text-center p-3 rounded-xl bg-background/80 border border-border/40">
              <p className="text-2xl font-bold text-primary">{stats.percentage}%</p>
              <p className="text-xs text-muted-foreground">সম্পূর্ণ</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-background/80 border border-border/40">
              <p className="text-2xl font-bold text-orange-500">{stats.completedTasks}</p>
              <p className="text-xs text-muted-foreground">Done</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-background/80 border border-border/40">
              <p className="text-2xl font-bold text-orange-500">{stats.streak}🔥</p>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-background/80 border border-border/40">
              <p className="text-2xl font-bold text-green-500">{stats.daysRemaining}</p>
              <p className="text-xs text-muted-foreground">দিন বাকি</p>
            </div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>সামগ্রিক অগ্রগতি</span>
            <span className="font-medium">{stats.percentage}%</span>
          </div>
          <Progress value={stats.percentage} className="h-2.5" />
        </div>

        {/* ─── Feature 2: Subject Progress Rings ─────────────────────── */}
        <SubjectProgressRings subjects={subjects} tasks={plan.tasks} />

        {/* ─── TODAY'S TASKS ─────────────────────────────────────────── */}
        <Card className="overflow-hidden border-border/40">
          <div className="bg-gradient-to-r from-primary/10 to-red-500/5 p-5 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-sm">আজকের কাজ</h2>
                <p className="text-xs text-muted-foreground">
                  {todayTasks.filter((t) => t.completed).length}/{todayTasks.length} সম্পূর্ণ
                </p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-border/30">
            {todayTasks.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                আজকের জন্য কোনো কাজ নেই — বিশ্রাম নাও! 😌
              </div>
            ) : (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 flex items-center gap-3 ${
                    task.completed ? "bg-green-500/5" : "hover:bg-muted/20"
                  } transition-colors`}
                >
                  <button
                    onClick={() => !task.completed && task.type !== "mock_test" && handleComplete(task.id)}
                    disabled={task.completed}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      task.completed
                        ? "border-green-500 bg-green-500"
                        : "border-muted-foreground/30 hover:border-primary"
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.topicBn || task.topic}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${
                          task.type === "mock_test"
                            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                            : task.type === "revision"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : ""
                        }`}
                      >
                        {task.type === "mock_test" ? "মক টেস্ট" : task.type === "revision" ? "পুনরায়" : task.subjectBn}
                      </Badge>
                      {task.isWeak && (
                        <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          দুর্বল
                        </span>
                      )}
                      {task.mockScore !== undefined && (
                        <Badge variant="outline" className="text-[10px]">
                          Score: {task.mockScore}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  {/* Feature 4: Mock Test button */}
                  {task.type === "mock_test" && !task.completed && (
                    <Link
                      to={`/mock-test?exam=${plan.examId.toLowerCase()}&source=amar-plan&taskId=${task.id}`}
                    >
                      <Button size="sm" className="gap-1.5 bg-orange-600 hover:bg-violet-700">
                        <Play className="w-3.5 h-3.5" />
                        Mock দাও
                      </Button>
                    </Link>
                  )}
                  {task.type !== "mock_test" && !task.completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleComplete(task.id)}
                      className="text-xs gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Done
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* ─── Feature 4: Mock Score History ─────────────────────────── */}
        {plan.mockScores.length > 0 && (
          <Card className="p-5 border-border/40">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Mock Test Score History
            </h3>
            <div className="flex flex-wrap gap-2">
              {plan.mockScores.map((ms, i) => (
                <div
                  key={i}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    ms.score >= 70
                      ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                      : ms.score >= 50
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                  }`}
                >
                  {new Date(ms.date).toLocaleDateString("bn-IN", { day: "numeric", month: "short" })} — {ms.score}%
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ─── UPCOMING DAYS ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            আগামী দিনের কাজ
          </h3>
          {upcomingDays.slice(1).map(({ date, tasks: dayTasks }) => {
            const isExpanded = expandedDay === date;
            const completed = dayTasks.filter((t) => t.completed).length;
            const dateObj = new Date(date);
            const dayLabel = dateObj.toLocaleDateString("bn-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });

            return (
              <Card key={date} className="border-border/40 overflow-hidden">
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : date)}
                  className="w-full p-3.5 flex items-center gap-3 hover:bg-muted/20 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-xs font-bold">
                    {dateObj.getDate()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{dayLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      {dayTasks.length} কাজ · {completed} done
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {dayTasks.some((t) => t.type === "mock_test") && (
                      <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px]">
                        Mock
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-border/30 divide-y divide-border/20">
                    {dayTasks.map((task) => (
                      <div key={task.id} className="px-4 py-2.5 flex items-center gap-2.5 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            task.completed
                              ? "bg-green-500"
                              : task.type === "mock_test"
                              ? "bg-orange-500"
                              : task.isWeak
                              ? "bg-red-400"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                        <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                          {task.topicBn || task.topic}
                        </span>
                        <Badge variant="secondary" className="text-[10px] ml-auto">
                          {task.subjectBn || task.subject}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* ─── Feature 5: Plan Share Card ─────────────────────────────── */}
        <Card className="p-5 border-border/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Share2 className="w-4 h-4 text-green-500" />
              শেয়ার করো
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowShareCard(!showShareCard)}
              className="text-xs gap-1"
            >
              {showShareCard ? "বন্ধ করো" : "আমার পরিকল্পনা শেয়ার করো"}
            </Button>
          </div>
          {showShareCard && (
            <PlanShareCard
              examId={plan.examId}
              daysRemaining={stats.daysRemaining}
              streak={stats.streak}
              percentage={stats.percentage}
              examPassed={stats.examPassed}
            />
          )}
        </Card>

        {/* ─── DELETE PLAN ────────────────────────────────────────────── */}
        <div className="text-center py-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-red-500"
            onClick={() => {
              if (window.confirm("তুমি কি নিশ্চিত? সম্পূর্ণ পরিকল্পনা মুছে যাবে।")) {
                localStorage.removeItem("amar_plan_data");
                setPlan(null);
              }
            }}
          >
            পরিকল্পনা মুছে ফেলো
          </Button>
        </div>
      </main>
    </div>
  );
}
