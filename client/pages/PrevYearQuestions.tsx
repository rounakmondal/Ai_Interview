import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageSEO } from "@/lib/page-seo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  ExamType,
  Subject,
  GovtQuestion,
  EXAM_LABELS,
  SUBJECT_LABELS,
  AVAILABLE_YEARS,
  fetchPrevYearQuestions,
} from "@/lib/govt-practice-data";

const EXAM_OPTIONS: (ExamType | "all")[] = ["all", "WBCS", "SSC", "Railway", "Banking", "Police"];
const SUBJECT_OPTIONS: (Subject | "all")[] = ["all", "History", "Geography", "Polity", "Reasoning", "Math", "Current Affairs"];

export default function PrevYearQuestions() {
  usePageSEO("/prev-year-questions");
  const [exam, setExam] = useState<ExamType | "all">("all");
  const [year, setYear] = useState<number | "all">("all");
  const [subject, setSubject] = useState<Subject | "all">("all");
  const [language, setLanguage] = useState<"english" | "bengali">("english");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [questions, setQuestions] = useState<GovtQuestion[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingQ(true);
    fetchPrevYearQuestions(
      exam !== "all" ? exam : undefined,
      year !== "all" ? year : undefined,
      subject !== "all" ? subject : undefined
    ).then((data) => {
      if (!cancelled) { setQuestions(data); setLoadingQ(false); }
    });
    return () => { cancelled = true; };
  }, [exam, year, subject]);

  const toggleReveal = (id: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const revealAll = () => setRevealed(new Set(questions.map((q) => q.id)));
  const hideAll = () => setRevealed(new Set());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link
            to="/govt-practice"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Previous Year Questions</span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(l => l === "english" ? "bengali" : "english")}
            >
              {language === "english" ? "🇮🇳 বাংলা" : "🇬🇧 English"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" />
            Previous Year Questions
          </h1>
          <p className="text-muted-foreground text-sm">
            Filter by exam, year, and subject to practise real questions from past papers.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-5 border-border/40">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Exam */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Exam</label>
              <Select value={exam} onValueChange={(v) => setExam(v as ExamType | "all")}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {(["WBCS", "SSC", "Railway", "Banking", "Police"] as ExamType[]).map(e => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Year</label>
              <Select value={String(year)} onValueChange={(v) => setYear(v === "all" ? "all" : Number(v))}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {AVAILABLE_YEARS.map(y => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Subject</label>
              <Select value={subject} onValueChange={(v) => setSubject(v as Subject | "all")}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {(["History", "Geography", "Polity", "Reasoning", "Math", "Current Affairs"] as Subject[]).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{questions.length}</span> questions found
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={revealAll} className="gap-1.5 text-xs">
              <Eye className="w-3.5 h-3.5" />
              Reveal All
            </Button>
            <Button variant="outline" size="sm" onClick={hideAll} className="gap-1.5 text-xs">
              <EyeOff className="w-3.5 h-3.5" />
              Hide All
            </Button>
          </div>
        </div>

        {/* Question list */}
        {questions.length === 0 ? (
          <Card className="p-12 text-center border-border/40">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No questions match your filters.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => { setExam("all"); setYear("all"); setSubject("all"); }}
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const isRevealed = revealed.has(q.id);
              return (
                <Card key={q.id} className="p-5 sm:p-6 border-border/40 space-y-4">
                  {/* Meta */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-muted-foreground">Q{idx + 1}</span>
                    <Badge variant="secondary" className="text-xs">{q.exam}</Badge>
                    <Badge variant="outline" className="text-xs">{q.subject}</Badge>
                    {q.year && <Badge variant="outline" className="text-xs">{q.year}</Badge>}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        q.difficulty === "Easy"
                          ? "text-green-600 border-green-300"
                          : q.difficulty === "Medium"
                          ? "text-yellow-600 border-yellow-300"
                          : "text-red-600 border-red-300"
                      }`}
                    >
                      {q.difficulty}
                    </Badge>
                  </div>

                  {/* Question */}
                  <p className="text-sm sm:text-base font-medium leading-relaxed">{q.question}</p>

                  {/* Options */}
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`px-3 py-2.5 rounded-lg text-sm border flex items-center gap-2 transition-colors ${
                          isRevealed && oi === q.correctIndex
                            ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 font-medium"
                            : "bg-muted/30 border-border/40 text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs">{String.fromCharCode(65 + oi)}.</span>
                        <span>{opt}</span>
                        {isRevealed && oi === q.correctIndex && (
                          <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-green-600 dark:text-green-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Reveal / Explanation */}
                  {isRevealed ? (
                    <div className="space-y-3">
                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 space-y-1.5">
                        <p className="text-xs font-semibold text-primary">
                          💡 Explanation {language === "bengali" && q.explanationBn ? "(বাংলায়)" : ""}
                        </p>
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          {language === "bengali" && q.explanationBn
                            ? q.explanationBn
                            : q.explanation}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReveal(q.id)}
                        className="text-xs text-muted-foreground gap-1.5"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        Hide Answer
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReveal(q.id)}
                      className="gap-1.5 text-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Reveal Answer & Explanation
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
