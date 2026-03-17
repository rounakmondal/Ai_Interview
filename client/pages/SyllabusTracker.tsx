import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProfileButton from "@/components/ProfileButton";
import {
  ArrowLeft,
  BookMarked,
  ChevronDown,
  ChevronRight,
  Target,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Filter,
  Languages,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  getStudyExamPreference,
  getExamSyllabusWithProgress,
} from "@/lib/exam-syllabus-data";
import { STUDY_EXAM_LABELS } from "@shared/study-types";
import type { StudyExamType, SyllabusSubject, Chapter, ChapterStatus } from "@shared/study-types";
import AIStudyGuide from "@/components/AIStudyGuide";

const STATUS_CONFIG: Record<ChapterStatus, { label: string; color: string; bg: string }> = {
  not_started: { label: "Not Started", color: "text-muted-foreground", bg: "bg-muted" },
  in_progress: { label: "In Progress", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  done: { label: "Done", color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
};

type FilterType = "all" | "not_started" | "in_progress" | "done";

export default function SyllabusTracker() {
  const navigate = useNavigate();
  const studyExam = getStudyExamPreference();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<FilterType>("all");
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [guideChapterId, setGuideChapterId] = useState<string | null>(null);

  useEffect(() => {
    if (!studyExam) navigate("/profile", { replace: true });
  }, [studyExam, navigate]);

  if (!studyExam) return null;

  const syllabus = getExamSyllabusWithProgress(studyExam);

  // Overall stats
  let totalChapters = 0, doneChapters = 0, inProgress = 0;
  for (const s of syllabus.subjects) {
    for (const c of s.chapters) {
      totalChapters++;
      if (c.status === "done") doneChapters++;
      else if (c.status === "in_progress") inProgress++;
    }
  }
  const overallPct = totalChapters > 0 ? Math.round((doneChapters / totalChapters) * 100) : 0;

  const toggleSubject = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSubjectProgress = (subject: SyllabusSubject) => {
    const total = subject.chapters.length;
    const done = subject.chapters.filter((c) => c.status === "done").length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const filterChapters = (chapters: Chapter[]): Chapter[] => {
    if (filter === "all") return chapters;
    return chapters.filter((c) => c.status === filter);
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
          <span className="text-sm font-medium">Syllabus Tracker</span>
          <div className="ml-auto">
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto space-y-6">
        {/* Hero */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-primary" />
              Syllabus Tracker
            </h1>
            <p className="text-sm text-muted-foreground">
              {STUDY_EXAM_LABELS[studyExam]} — track every chapter
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            {STUDY_EXAM_LABELS[studyExam]}
          </Badge>
        </div>

        {/* Overall Progress */}
        <Card className="p-5 border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Overall Progress</p>
              <p className="text-xs text-muted-foreground">
                {doneChapters}/{totalChapters} chapters done · {inProgress} in progress
              </p>
            </div>
            <span className={`text-2xl font-bold ${overallPct >= 70 ? "text-green-600" : overallPct >= 40 ? "text-amber-600" : "text-primary"}`}>
              {overallPct}%
            </span>
          </div>
          <Progress value={overallPct} className="h-3" />
        </Card>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter */}
          <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
            {(["all", "not_started", "in_progress", "done"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : f === "not_started" ? "Pending" : f === "in_progress" ? "In Progress" : "Done"}
              </button>
            ))}
          </div>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted/50 transition-colors"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === "en" ? "English" : "বাংলা"}
          </button>
        </div>

        {/* Subjects */}
        <div className="space-y-3">
          {syllabus.subjects.map((subject) => {
            const filtered = filterChapters(subject.chapters);
            if (filtered.length === 0 && filter !== "all") return null;
            const isExpanded = expanded[subject.id];
            const subPct = getSubjectProgress(subject);

            return (
              <Card key={subject.id} className="border-border/40 overflow-hidden">
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="w-full p-4 sm:p-5 flex items-center gap-3 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-xl flex-shrink-0">{subject.icon}</span>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">
                        {lang === "en" ? subject.name : subject.nameBn}
                      </p>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {subject.chapters.filter((c) => c.status === "done").length}/{subject.chapters.length}
                      </Badge>
                    </div>
                    <div className="mt-1.5">
                      <Progress value={subPct} className="h-1.5" />
                    </div>
                  </div>
                  <span className={`text-sm font-bold flex-shrink-0 ${subPct >= 70 ? "text-green-600" : subPct >= 40 ? "text-amber-600" : "text-muted-foreground"}`}>
                    {subPct}%
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-2">
                    {filtered.map((chapter) => {
                      const cfg = STATUS_CONFIG[chapter.status];
                      return (
                        <div
                          key={chapter.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors"
                        >
                          {/* Status icon */}
                          <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                            {chapter.status === "done" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            ) : chapter.status === "in_progress" ? (
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                          </div>

                          {/* Name + progress */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {lang === "en" ? chapter.name : chapter.nameBn}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={chapter.progress} className="h-1 flex-1" />
                              <span className="text-xs text-muted-foreground">{chapter.progress}%</span>
                            </div>
                          </div>

                          {/* Status pill */}
                          <Badge variant="outline" className={`text-xs ${cfg.color} flex-shrink-0`}>
                            {cfg.label}
                          </Badge>

                          {/* Actions */}
                          <div className="flex gap-1.5 flex-shrink-0">
                            {chapter.status !== "done" && (
                              <Link to={`/chapter-test/${chapter.id}`}>
                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1">
                                  <Play className="w-3 h-3" />
                                  Test
                                </Button>
                              </Link>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs gap-1"
                              onClick={() => setGuideChapterId(chapter.id)}
                            >
                              <Sparkles className="w-3 h-3" />
                              AI
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    {filtered.length === 0 && (
                      <p className="text-sm text-muted-foreground py-3 text-center">No chapters match this filter.</p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </main>

      {/* AI Study Guide Side Panel */}
      {guideChapterId && (
        <AIStudyGuide
          chapterId={guideChapterId}
          onClose={() => setGuideChapterId(null)}
        />
      )}
    </div>
  );
}
